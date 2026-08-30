import express from 'express'
import { register, login } from '../controllers/authController.js';

const router = express.Router()

//Post /register
router.post('/register', register);

//Post /login
router.post('/login', login);

export default router;