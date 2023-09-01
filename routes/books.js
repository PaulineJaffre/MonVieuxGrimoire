//Ce code définit un routeur Express pour gérer les routes liées aux fonctionnalités de gestion des livres. Il fait usage de middlewares pour gérer l'authentification des utilisateurs et le téléchargement de fichiers.

//Importation des modules nécessaires :
const express = require('express');
const router = express.Router();

//Importation des middlewares et du contrôleur de livres :
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const booksCtrl = require('../controllers/books');
//Les middlewares auth (pour l'authentification des utilisateurs) et multer (pour le téléchargement de fichiers) sont importés, ainsi que le contrôleur booksCtrl qui contient les fonctions de gestion des livres.


//Définition des routes :
router.post('/', auth, multer, booksCtrl.createBook); //création de livre
router.get('/', booksCtrl.getAllBooks); //liste de tous les livres
router.get('/bestrating', booksCtrl.getBestBooks); //liste des meilleurs livres par notation
router.get('/:id', booksCtrl.getOneBook); //obtention d'un livre par son ID
router.put('/:id', auth, multer, booksCtrl.modifyBook); //modification d'un livre par son ID
router.delete('/:id', auth, booksCtrl.deleteBook); //suppression d'un livre par son ID
router.post('/:id/rating', auth, booksCtrl.ratingBook); //notation d'un livre par son ID

//Exportation du routeur :
module.exports = router;

console.log("chargement route");