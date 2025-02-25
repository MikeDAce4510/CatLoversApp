import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // Redirect to the homepage if the user is not logged in
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;


