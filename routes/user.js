//Ce code définit un routeur Express pour gérer les routes liées aux fonctionnalités d'inscription (signup) et de connexion (login) des utilisateurs. 

//Le module express est importé et un objet router est créé pour définir les routes.
const express = require('express');
const router = express.Router();

//Importation du contrôleur utilisateur, supposé contenir les fonctions de contrôle pour les fonctionnalités d'inscription et de connexion des utilisateurs:
const userCtrl = require('../controllers/user');

//Définition des routes :
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//Exportation du routeur :
module.exports = router;