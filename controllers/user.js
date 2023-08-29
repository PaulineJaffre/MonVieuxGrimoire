//Ce code définit deux contrôleurs pour gérer les opérations d'inscription (signup) et de connexion (login) des utilisateurs. 

//Importation du modèle User et des modules bcrypt (hashage de mots de passe) et jwt (JSON Web Tokens)
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Contrôleur pour l'inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    // Hashage du mot de passe fourni en utilisant bcrypt
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Création d'un nouvel utilisateur avec l'email et le mot de passe hashé
            const user = new User({
                email: req.body.email,
                password: hash
            });

            // Enregistrement de l'utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Contrôleur pour la connexion d'un utilisateur existant
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur dans la base de données en fonction de l'email fourni
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'utilisateur n'est pas trouvé
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }

            // Comparaison du mot de passe fourni avec le mot de passe hashé de l'utilisateur
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si le mot de passe est incorrect
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }

                    // Si le mot de passe est correct, génération d'un token JWT
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};