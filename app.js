//Ce code représente le backend d'une application utilisant Express.js pour créer un serveur et gérer les routes liées aux livres et aux utilisateurs. 

//Importation des modules nécessaires :
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

//Importation des routes définies dans d'autres fichiers :
const booksRoutes= require('./routes/books');
const userRoutes = require('./routes/user');

//Connexion à la base de données MongoDB :
mongoose.connect('mongodb+srv://Pauline:Password+2@cluster0.om01gzh.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//Ce bloc de code utilise Mongoose pour se connecter à une base de données MongoDB en utilisant l'URL fournie. Si la connexion réussit, il affiche un message de succès, sinon, il affiche un message d'échec.

//Initialisation de l'application Express :
const app = express();

//Configuration des en-têtes pour gérer les CORS (Cross-Origin Resource Sharing) : gérer les autorisations pour les requêtes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Utilisation de middlewares pour le traitement des données de requête : transformer les données de requête au format JSON en objets JavaScript exploitables.
app.use(express.json());
app.use(bodyParser.json());

//Utilisation des routes et gestion des fichiers statiques : quelles routes sont gérées par les routes définies dans les fichiers "books.js" et "user.js" & dossier image
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation de l'application :
module.exports = app;