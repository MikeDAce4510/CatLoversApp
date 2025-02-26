import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import BACKEND_URL from "../config";
const API_URL = 'https://api.thecatapi.com/v1/images/search';
const API_KEY = process.env.REACT_APP_CAT_API_KEY; 

function HomePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [message, setMessage] = useState('');
  const [catImage, setCatImage] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Fetch a random cat image
  useEffect(() => {
    const fetchRandomCat = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: { 'x-api-key': API_KEY }
        });
        const data = await response.json();
        if (data.length > 0) {
          setCatImage(data[0].url);
        }
      } catch (error) {
        console.error('❌ Error fetching cat image:', error);
      }
    };

    fetchRandomCat();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const endpoint = isLoginMode ? '/api/users/login' : '/api/users/signup';
    const url = `${BACKEND_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Login response:', data); // Debugging log

      if (response.ok) {
        if (isLoginMode) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('currentUser', JSON.stringify({ id: data.userId, username }));
          login(data.token);
          navigate('/vote');
        } else {
          setMessage('Signup successful! Please log in.');
          setIsLoginMode(true);
        }
      } else {
        setMessage(data.error || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error during login/signup:', error);
      setMessage('Failed to connect to the server.');
    }
  };

  return (
    <div>
      <h1 className="banner">🐱 Welcome to the Cat Lovers App! 🐱</h1>
      {catImage ? (
        <img src={catImage} alt="Random Cat" className="cat-image" />
      ) : (
        <p>Loading a cute cat... 🐾</p>
      )}

      {/* Login/Signup Form */}
      <h2>{isLoginMode ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          
        />
        <button type="submit">
          {isLoginMode ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <p>
        {isLoginMode ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button onClick={() => setIsLoginMode(!isLoginMode)}>
          {isLoginMode ? 'Sign Up' : 'Login'}
        </button>
      </p>

      {message && <p>{message}</p>}
    </div>
  );
}

export default HomePage;










