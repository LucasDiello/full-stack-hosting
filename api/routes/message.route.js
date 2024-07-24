import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { createMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.post("/:chatId", verifyToken, createMessage)

export default router; 