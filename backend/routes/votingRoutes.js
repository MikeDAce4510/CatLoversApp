import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { submitVote, getUserVotes, getAllUserVotes } from '../controllers/voteController.js';


const router = express.Router();

// Submit a vote (protected route)
router.post('/', authenticateToken, submitVote);


// Get votes submitted by the logged-in user (protected route)
router.get('/user-votes', authenticateToken, getUserVotes);


// Route for fetching ALL users' voting history
router.get('/all-votes', getAllUserVotes);

export default router;
