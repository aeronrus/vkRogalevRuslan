import express from 'express';
import { login, register, logout } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/activate/:link');
router.get('/refresh');

export default router;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTY5Njk2NTUzMywiZXhwIjoxNjk2OTY1ODMzfQ.F-86SATN7mZZYx8G86eny7g9w1jFTsgdRo-uZF6ER5g

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTY5Njk2NTUzMywiZXhwIjoxNjk2OTY1ODMzfQ.F-86SATN7mZZYx8G86eny7g9w1jFTsgdRo-uZF6ER5g
