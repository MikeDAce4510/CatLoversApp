🐱 Cat Lovers App - A Voting Platform for Cat Images
This project allows users to:

✅ Vote on cat images 🐾
✅ View their own voting history 📜
✅ See how other users voted 📊
✅ Sign up, log in, and authenticate with JWT 🔑

Frontend: https://catloversapp.netlify.app Backend: https://catloversapp.onrender.com

📌 Prerequisites
Before running the project, ensure you have:

Node.js (v18 or later) - Download
PostgreSQL (v12 or later) - Download
NPM or Yarn for package management
API key from https://thecatapi.com
📦 1️⃣ Backend Setup
📥 Clone the Repository
git clone https://github.com/your-username/cat-lovers-app.git
cd cat-lovers-app/backend

Install Dependencies

- npm install

Set Up PostgreSQL Database
Create Database & Tables
1. Open PostgreSQL terminal:
  psql -U postgres
2. Create a database:
  CREATE DATABASE cat_app;
3. Connect to the database:
  \\c cat_app;
4. Create tables:
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE images (
    id VARCHAR(255) PRIMARY KEY,
    url TEXT NOT NULL
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    image_id VARCHAR(255) REFERENCES images(id) ON DELETE CASCADE,
    value INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 Configure Environment Variables

in the .env files put your own of the following:
# PostgreSQL Database Credentials
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_NAME=cat_app
DB_PORT=5432

# JWT Secret Key
JWT_SECRET=your_secure_jwt_secret_key

# API Key for The Cat API
CAT_API_KEY=your_api_key_here

run the server with:
  npm start

should get:
🚀 Server running on http://localhost:5000


Frontend Setup:

install dependencies like in the backend:
npm install

Configure the .env file:
REACT_APP_CAT_API_KEY=your_api_key_here

Start the frontend:
  npm start

If successful, open http://localhost:3000 in your browser.
