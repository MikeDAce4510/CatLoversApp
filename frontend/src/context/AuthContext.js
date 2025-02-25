import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage

      if (!token) {
        setIsAuthenticated(false); // No token means user is not authenticated
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/users/verify-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the request header
          },
        });

        if (response.ok) {
          setIsAuthenticated(true); // Token is valid
        } else {
          setIsAuthenticated(false); // Token is invalid or expired
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

