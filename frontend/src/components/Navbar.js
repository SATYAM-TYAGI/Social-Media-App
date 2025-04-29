import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="navbar-logo">InstaVote</div>
      <div className="navbar-links">
        <Link to="/explore">Explore</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      <NotificationBell />
    </nav>
  );
} 