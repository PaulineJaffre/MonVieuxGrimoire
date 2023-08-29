//Ce code définit des contrôleurs pour les opérations liées à la gestion des livres. Chaque contrôleur est associé à une route spécifique et interagit avec le modèle de données de livre. 

// Importation du modèle Book et des modules fs (gestion des fichiers) et sharp (traitement d'images)
const Book = require('../models/Book');
const fs = require('fs');
const sharp = require('sharp');

//Contrôleur pour l'ajout d'un livre
exports.createBook = (req, res, next) => {
    //// Extraction des informations du livre depuis req.body.book
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const imagePath = req.file.path;

    // Chemin de destination pour l'image redimensionnée
    const resizedImagePath = `${req.file.destination}/resized_${req.file.filename}`;

    // Redimensionner l'image avec Sharp
    sharp(imagePath)
        .resize(800, 600) // Définissez les dimensions souhaitées pour l'image redimensionnée
        .toFile(resizedImagePath)
        .then(() => {
        // Création d'un nouvel objet Book avec les informations du livre
        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}`,
            averageRating: bookObject.ratings[0].grade
        });
        // Enregistrement du livre dans la base de données
        book.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
};

//Contrôleur pour la modification d'un livre
exports.modifyBook = (req, res, next) => {
    // Si une nouvelle image est fournie, mettre à jour l'URL de l'image
    const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
} : { ...req.body };
// Supprimer l'identifiant de l'utilisateur du bookObject
delete bookObject._userId;

// Trouver le livre à partir de l'ID et vérifier l'autorisation
Book.findOne({_id: req.params.id})
    .then((book) => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        } else {
            // Mettre à jour le livre avec les nouvelles informations
            Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
}

//Contrôleur pour la suppression d'un livre
exports.deleteBook = (req, res, next) => {
    // Trouver le livre à partir de l'ID
    Book.findOne({ _id: req.params.id})
        .then(book => {
            // Vérifier l'autorisation de l'utilisateur
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                // Extraire le nom de fichier de l'URL de l'image
                const filename = book.imageUrl.split('/images/')[1];
                
                // Supprimer le fichier image
                fs.unlink(`images/${filename}`, () => {
                    // Supprimer le livre de la base de données
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
    });
}

//Contrôleur pour afficher un livre spécifique
exports.getOneBook = (req, res, next) => {
    // Trouver le livre à partir de l'ID et renvoyer le livre s'il est trouvé
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
}

// Contrôleur pour afficher tous les livres
exports.getAllBooks = (req, res, next) => {
    // Récupérer tous les livres de la base de données et les renvoyer
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
}

// Contrôleur pour noter un livre et afficher la moyenne des notes
exports.ratingBook = (req, res, next) => {
    // Extraire l'utilisateur et la note de req.body
    let userConnected = req.body.userId;
    let grade = req.body.rating;
    console.log(userConnected);
    console.log(grade);

    // Trouver le livre à partir de l'ID
    Book.findOne({ _id: req.params.id })
    .then((book) => {
        // Vérifier si l'utilisateur a déjà noté le livre
        const userRatingIndex = book.ratings.findIndex((rating) => rating.userId === userConnected);
        if (userRatingIndex !== -1) {
             // à tester si chaîne de caractères
            return res.status(400).json({ message: "Vous avez déjà noté ce livre" });
        }
        else {
            // Ajouter la nouvelle note à la liste des évaluations
            const newRating = {
                userId: userConnected,
                grade: grade,
            };
            const updatedRatings = [
                    ...book.ratings,
                    newRating
                    ];

            // Calculer la nouvelle note moyenne
            const gradesSum = updatedRatings.reduce((sum, rating) => sum + rating.grade, 0);
            const averageGrade = (gradesSum / updatedRatings.length).toFixed(2);

            // Mettre à jour le livre avec la nouvelle évaluation et note moyenne
            book.ratings = updatedRatings;
            book.averageRating = averageGrade;
            console.log(updatedRatings);
            console.log(averageGrade);

            return book.save();

            }
        })
        .then(book => {
            console.log('Book saved:', book);
            res.status(201).json(book);
            })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'évaluation du livre.' });
    });
};


//Contrôleur pour afficher les 3 livres les mieux notés
exports.getBestBooks = (req, res, next) => {
    // Récupérer les 3 livres ayant la note moyenne la plus élevée
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(401).json({ error }));
};