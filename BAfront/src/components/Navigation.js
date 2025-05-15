import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navigation.css';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="logo">
          <Link to="/" className="logo-text">Beauty Advisor</Link>
        </div>
        
        <div className={`menu-button ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/upload" onClick={() => setMenuOpen(false)}>Upload Photo</Link></li>
          <li><Link to="/recommendations" onClick={() => setMenuOpen(false)}>Recommendations</Link></li>
          
          {currentUser ? (
            // Show these items when user is logged in
            <>
              <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
              <li>
                <button onClick={handleLogout} className="logout-nav-button">Logout</button>
              </li>
              <li className="user-greeting">
                <div className="nav-avatar">
                  {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="greeting-text">Hi, {currentUser.username}</span>
              </li>
            </>
          ) : (
            // Show these items when user is not logged in
            <>
              <li>
                <Link to="/login" className="login-button" onClick={() => setMenuOpen(false)}>Login</Link>
              </li>
              <li>
                <Link to="/register" className="register-button" onClick={() => setMenuOpen(false)}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;