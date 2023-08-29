//Ce code définit un middleware pour vérifier et décoder un token JWT (JSON Web Token) dans une demande HTTP. Il permet d'authentifier les utilisateurs et d'ajouter l'identifiant d'utilisateur authentifié à la requête avant de la transmettre aux autres middlewares ou aux routes. 

//Importation du module nécessaire pour gérer la création, la vérification et le décodage des tokens JWT:
const jwt = require('jsonwebtoken');

//Exportation du middleware :
module.exports = (req, res, next) => {
    //Gestion de la vérification du token :
    try {
        const token = req.headers.authorization.split(' ')[1]; //Le token JWT est extrait des en-têtes de la demande en utilisant req.headers.authorization. Le token est généralement envoyé dans l'en-tête "Authorization" sous la forme "Bearer TOKEN".
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //Le token est ensuite décodé en utilisant la fonction jwt.verify(). Le deuxième argument est la clé secrète utilisée pour signer le token (ici 'RANDOM_TOKEN_SECRET'). Si la vérification réussit, decodedToken contiendra les informations du token.
        const userId = decodedToken.userId; //L'identifiant de l'utilisateur (userId) est extrait des informations décodées du token.
        req.auth = { //L'objet req.auth est créé pour stocker l'identifiant de l'utilisateur authentifié dans la requête. Cela permet aux routes ou aux middlewares ultérieurs d'accéder à cette information.
            userId: userId
        };
    next();
    } catch(error) { //Si la vérification échoue, une réponse avec le statut HTTP 401 (Non autorisé) est renvoyée, avec un objet JSON contenant un message d'erreur.
        res.status(401).json({ error });
    }
};