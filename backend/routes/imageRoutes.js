import express from 'express';
import { getRandomImage, getImageById } from '../controllers/imageController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get a random image (no authentication required)
router.get('/search', getRandomImage);

// Get an image by ID (protected route, if necessary)
router.get('/:imageId', authenticateToken, getImageById);

export default router;


