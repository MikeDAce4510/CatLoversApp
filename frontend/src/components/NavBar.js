import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import 'styles/NavBar.css'; 

function NavBar() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        {isAuthenticated && <Link to="/vote" className="nav-link">Vote</Link>}
        {isAuthenticated && <Link to="/user-votes" className="nav-link">User History</Link>}
        {isAuthenticated && <Link to="/all-user-votes" className="nav-link">All User Votes</Link>}
      </div>
      {isAuthenticated && (
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      )}
    </nav>
  );
}

export default NavBar;

