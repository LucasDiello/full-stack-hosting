import express from 'express';
import { deleteUser, getAllUsers, getUserById, savePost, getAllSavedPosts, updateUser, profilePosts, getNotificationNumber } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', getAllUsers)
router.get('/profilePosts', verifyToken, profilePosts)
router.get("/notification", verifyToken, getNotificationNumber)
// router.get('/:id',verifyToken, getUserById) not ussing this route
// remember Don't forget to check
router.put('/:id',verifyToken, updateUser)
router.delete('/:id',verifyToken, deleteUser)
router.post('/save',verifyToken, savePost)
router.get('/saves',verifyToken, getAllSavedPosts)

export default router; 