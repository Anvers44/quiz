// server/routes/userRoutes.js
import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protection de toutes les routes
router.use(protect);

// Routes admin uniquement
router.route('/')
    .get(authorize('admin'), getUsers);

// Routes pour tous les utilisateurs authentifiés
router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(authorize('admin'), deleteUser);

export default router;