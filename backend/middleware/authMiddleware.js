import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  console.log("My token", token)
  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach decoded token payload to the request object
    console.log('Token successfully verified:', decoded);
    next();
  } catch (error) {
    console.error('Invalid token:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
  console.log('Decoded token:', req.user);
};



