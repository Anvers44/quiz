// server/controllers/authController.js
import User from '../models/userModel.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Inscription d'un utilisateur
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Vérifier si l'email existe déjà
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'Un utilisateur avec cet email existe déjà'
            });
        }

        // Créer l'utilisateur
        const user = await User.create({
            username,
            email,
            password
        });

        // Générer le token JWT
        const token = user.getSignedJwtToken();

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'email et le mot de passe sont fournis
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Veuillez fournir un email et un mot de passe'
            });
        }

        // Rechercher l'utilisateur avec ce mail et inclure le mot de passe
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Identifiants invalides'
            });
        }

        // Vérifier si le mot de passe correspond
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Identifiants invalides'
            });
        }

        // Générer le token JWT
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtenir l'utilisateur actuel
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Déconnexion / effacement du cookie
// @route   GET /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Déconnexion réussie'
    });
};

export { register, login, getMe, logout };