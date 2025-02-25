import express from 'express';
import { loginUser, registerUser, getUserProfile, logoutUser } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { verifyToken } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', registerUser);


router.use(authenticateToken);


router.get('/verify-token', verifyToken);
router.get('/profile', authenticateToken, getUserProfile);
router.post('/logout', authenticateToken, logoutUser);



export default router;
