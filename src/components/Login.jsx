import React from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <span className="logo-icon">☯</span>
          Life Balance AI
        </div>
        <div className="tabs">
          <button className="tab active">→ Login</button>
          <button className="tab">Sign Up ✦</button>
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="your@email.com" />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="••••••••" />
        </div>
        <button className="login-button" onClick={handleLoginClick}>
          Login →
        </button>
        <div className="features">
          <div className="feature">
            <span className="icon"><span className="neon-icon">📅</span></span>
            Smart Scheduling
          </div>
          <div className="feature">
            <span className="icon"><span className="neon-icon">📊</span></span>
            Progress Tracking
          </div>
          <div className="feature">
            <span className="icon"><span className="neon-icon">❤️</span></span>
            Wellness Monitor
          </div>
          <div className="feature">
            <span className="icon"><span className="neon-icon">⚙️</span></span>
            Customizable
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
