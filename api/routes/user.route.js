import express from 'express';
import { deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', getAllUsers)
router.get('/:id',verifyToken, getUserById)
router.put('/:id',verifyToken, updateUser)
router.delete('/:id',verifyToken, deleteUser)


export default router; 