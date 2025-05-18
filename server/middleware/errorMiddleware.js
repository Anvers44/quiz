// server/middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log pour le développeur
    console.error(err);

    // Erreur Mongoose - ID invalide
    if (err.name === 'CastError') {
        const message = 'Ressource non trouvée';
        error = { message, statusCode: 404 };
    }

    // Erreur Mongoose - Validation
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = { message, statusCode: 400 };
    }

    // Erreur Mongoose - Doublon
    if (err.code === 11000) {
        const message = 'Valeur en double entrée';
        error = { message, statusCode: 400 };
    }

    // Réponse d'erreur
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Erreur serveur'
    });
};

export default errorHandler;