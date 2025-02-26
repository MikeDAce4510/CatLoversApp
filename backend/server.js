import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import pool from './models/db.js';
import userRoutes from './routes/userRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import voteRoutes from './routes/votingRoutes.js';
import dotenv from 'dotenv';
import helmet from 'helmet';
import bcrypt from 'bcrypt';
import { authenticateToken } from './middleware/authMiddleware.js';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key'; // ✅ Define SECRET_KEY properly

const app = express();

// ✅ 1. Security Middleware (MUST BE FIRST)
app.use(helmet());
app.use(cors({
  origin: "https://catloversapp.netlify.app", 
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Authorization,Content-Type",
  credentials: true
}));
app.use(express.json());

// ✅ 2. Handle Preflight Requests
app.options('*', cors());
app.options('/api/users/verify-token', (req, res) => {
  res.set('Access-Control-Allow-Origin', 'https://catloversapp.netlify.app');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});

// ✅ 3. Authentication Routes (No Token Required)
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);

// ✅ 4. Protected Routes (Requires Token)
app.use('/api/votes', authenticateToken, voteRoutes);

// ✅ 5. Login Route (Fix Token Return)
app.post('/api/user/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, password FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, username }, SECRET_KEY, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ 6. Logout Route (Remove Session Code)
app.post('/api/users/logout', (req, res) => {
  console.log('Logout successful');
  res.status(200).json({ message: 'Logout successful' });
});

app.get('/api/votes/all-votes', async (req, res) => {
  try {
    console.log('🔍 Fetching voting history for ALL users');

    const result = await pool.query(
      `SELECT v.id, v.value, v.image_id, 
              i.url AS image_url, 
              u.username
       FROM votes v
       LEFT JOIN images i ON v.image_id = i.id
       JOIN users u ON v.user_id = u.id
       ORDER BY v.created_at DESC
       LIMIT 50`
    );

    console.log('✅ Retrieved all user votes:', result.rows.length, 'votes found');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching all user votes:', error);
    res.status(500).json({ error: 'Failed to fetch all user votes' });
  }
});

// ✅ 7. Graceful Shutdown Handling
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

