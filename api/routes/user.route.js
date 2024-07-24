import express from 'express';
import { deleteUser, getAllUsers, getUserById, savePost, updateUser, profilePosts } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', getAllUsers)
// router.get('/:id',verifyToken, getUserById) not ussing this route
router.put('/:id',verifyToken, updateUser)
router.delete('/:id',verifyToken, deleteUser)
router.post('/save',verifyToken, savePost)
router.get('/profilePosts', verifyToken, profilePosts)

export default router; 