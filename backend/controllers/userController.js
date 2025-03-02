import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../models/db.js';

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  console.error('JWT_SECRET is not set in the environment variables.');
  process.exit(1); // Exit the server if the secret key is missing
}

// Login User
export async function loginUser(req, res) {
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


    
    // Generate a JWT
    const payload = { userId: user.id, username };
    console.log('JWT payload:', payload); // Log the payload
    console.log('JWT secret:', SECRET_KEY); // Log the secret key

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    console.log('Generated token:', token);
    
    return res.status(200).json({ message: 'Login successful', token: token, });
    
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Register User
export async function registerUser(req, res) {
  const { username, password } = req.body;

  // Password validation: At least 6 characters, one number, one uppercase letter
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: "Password must be at least 6 characters, include one number and one uppercase letter." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, hashedPassword]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
}


// Verify Token
export async function verifyToken(req, res) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Token verified successfully:', decoded);
    res.status(200).json({ message: 'Token valid', user: decoded });
  } catch (error) {
    console.error('Invalid token:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Get User Profile
export async function getUserProfile(req, res) {
  const userId = req.user?.userId || req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const result = await pool.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}

// Logout User
export async function logoutUser(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.clearCookie('connect.sid');
    console.log('Logout successful');
    res.status(200).json({ message: 'Logout successful' });
  });
}








