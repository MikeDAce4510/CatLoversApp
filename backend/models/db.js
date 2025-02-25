import dotenv from 'dotenv';

// Log before loading `.env`
console.log('🔍 Before dotenv:', process.env.DB_NAME);

// Load `.env`
dotenv.config();

// Log after loading `.env`
console.log('✅ After dotenv:', process.env.DB_NAME);

import pkg from 'pg';
const { Pool } = pkg;

console.log('🔍 Database Config:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? '******' : 'NOT SET',
  port: process.env.DB_PORT,
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default pool;
