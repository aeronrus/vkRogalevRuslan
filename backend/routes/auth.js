import express from 'express';
import { login, register, logout, activate, refresh } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/activate/:link', activate);
router.get('/refresh', refresh);

export default router;
