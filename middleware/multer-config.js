//Ce code définit un middleware pour vérifier et décoder un token JWT (JSON Web Token) dans une demande HTTP. Il permet d'authentifier les utilisateurs et d'ajouter l'identifiant d'utilisateur authentifié à la requête avant de la transmettre aux autres middlewares ou aux routes. 

//Importation du module Multer pour gérer le téléchargement de fichiers:
const multer = require('multer');

//Définition des types MIME acceptés et leurs extensions correspondantes :
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//Configuration du stockage des fichiers avec Multer :
const storage = multer.diskStorage({ 
    destination: (req, file, callback) => {
        callback(null, 'images'); //stockage des fichiers dans le dossier 'images'.
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); //espaces changés en '_'
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);  // définition du nom du fichier téléchargé avec ajout date & extension
    }
});

//Exportation du middleware Multer configuré :
module.exports = multer({storage: storage}).single('image');