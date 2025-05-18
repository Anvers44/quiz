// server/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Veuillez fournir un nom d\'utilisateur'],
        unique: true,
        trim: true,
        minlength: [3, 'Le nom d\'utilisateur doit comporter au moins 3 caractères']
    },
    email: {
        type: String,
        required: [true, 'Veuillez fournir un email'],
        unique: true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            'Veuillez fournir un email valide'
        ]
    },
    password: {
        type: String,
        required: [true, 'Veuillez fournir un mot de passe'],
        minlength: [6, 'Le mot de passe doit comporter au moins 6 caractères'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profilePicture: {
        type: String,
        default: 'default-avatar.png'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash du mot de passe avant l'enregistrement
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Méthode pour vérifier le mot de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode pour générer un token JWT
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

const User = mongoose.model('User', userSchema);

export default User;