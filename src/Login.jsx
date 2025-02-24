import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Calendar, Heart, Settings } from 'lucide-react';
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
          <Brain className="logo-icon" />
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
            <Calendar className="icon neon-icon" />
            Smart Scheduling
          </div>
          <div className="feature">
            <Settings className="icon neon-icon" />
            Customizable
          </div>
          <div className="feature">
            <Heart className="icon neon-icon" />
            Wellness Monitor
          </div>
          <div className="feature">
            <Brain className="icon neon-icon" />
            Progress Tracking
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
