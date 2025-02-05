import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { authToken, setAuthToken } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">MOLX</NavLink>
      </div>
      <div className="navbar-options">
        {authToken ? (
          <button
            className="logout-button"
            onClick={() => {
              setAuthToken(null);
              localStorage.removeItem('token');
              navigate('/login');
            }}
          >
            Logout
          </button>
        ) : (
          <button className="login-button" onClick={() => navigate('/login')}>
            Login
          </button>
        )}
        <button className="sell-button" onClick={() => navigate('/sell')}>
          <span className="plus-icon">+</span> SELL
        </button>
        <div>
          <button className="message-button" onClick={() => navigate('/messages')}>
            Messages
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;