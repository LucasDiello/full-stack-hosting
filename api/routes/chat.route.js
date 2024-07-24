import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { createChat, getAllChats, getChatById, readChat } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/', verifyToken, getAllChats)
router.get('/:id', verifyToken, getChatById)
router.post('/', verifyToken, createChat)
router.put('/read/:id', verifyToken, readChat)


export default router; 