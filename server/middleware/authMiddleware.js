// server/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
    let token;

    // Vérifier si le token est dans les headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
        // Vérifier si le token est dans les cookies
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Non autorisé à accéder à cette ressource'
        });
    }

    try {
        // Vérifier le token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // Vérifier si l'utilisateur existe toujours
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe plus'
            });
        }

        // Ajouter l'utilisateur à la requête
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Non autorisé à accéder à cette ressource'
        });
    }
};

// Middleware pour restreindre l'accès en fonction du rôle
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Vous n\'êtes pas autorisé à effectuer cette action'
            });
        }
        next();
    };
};

export { protect, authorize };