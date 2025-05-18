
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';

// Chargement des variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();
const server = createServer(app);

// Configuration de Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? 'https://votre-domaine.com'
            : 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middleware pour parser le JSON
app.use(express.json());

// Configuration CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://votre-domaine.com'
        : 'http://localhost:3000',
    credentials: true
}));

// Routes de base
app.get('/', (req, res) => {
    res.send('API du projet MERN 2025 opérationnelle');
});

// Routes de l'API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Middleware de gestion des erreurs
app.use(errorHandler);

// Configuration de Socket.io
io.on('connection', (socket) => {
    console.log(`Utilisateur connecté: ${socket.id}`);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`Utilisateur ${socket.id} a rejoint la salle ${roomId}`);
    });

    socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        console.log(`Utilisateur ${socket.id} a quitté la salle ${roomId}`);
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté', socket.id);
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});