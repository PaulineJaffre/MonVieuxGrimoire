//Ce code représente la configuration et le démarrage du serveur HTTP pour l'application backend. 

//Importation des modules nécessaires :
const http = require('http');
const app = require('./app');

//Définition d'une fonction pour normaliser le port :
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
//Cette fonction prend une valeur (probablement le numéro de port) en entrée, la convertit en un nombre entier, et effectue des vérifications pour s'assurer qu'elle est valide.

//Définition du port sur lequel le serveur écoutera :
const port = normalizePort(process.env.PORT ||'4000');
app.set('port', port);

//Gestionnaire d'erreurs en cas de problème de port ou d'adresse :
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
//Cette fonction agit comme un gestionnaire d'erreurs spécifique aux problèmes liés à l'écoute du port. Elle traite les erreurs courantes telles que l'accès refusé (EACCES) ou le port déjà utilisé (EADDRINUSE) et affiche un message d'erreur approprié.

//Création du serveur HTTP en utilisant l'application Express :
const server = http.createServer(app);

//Gestion des erreurs du serveur et mise en place de la gestion des écoutes :
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//Démarrage effectif du serveur en écoutant sur le port défini :
server.listen(port);