import express from 'express';
import { login, logout, register, googleLogin, verifyEmail, resendEmail, githubAuth } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register)
router.post('/google-login', googleLogin)
router.post('/login', login)
router.post('/logout', logout)
router.get('/verify-email', verifyEmail)
router.get('/resend-email', resendEmail)
router.post('/github/access-token', githubAuth)
export default router; 