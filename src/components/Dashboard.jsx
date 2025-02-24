import React from 'react';
import { Link } from 'react-router-dom';
import '/src/Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">Life Balance AI</div>
        <div className="menu">
          <Link to="/dashboard" className="menu-item active">
            <span className="icon"></span>Dashboard
          </Link>
          <Link to="/schedule" className="menu-item">
            <span className="icon"></span>Schedule
          </Link>
          <Link to="/health" className="menu-item">
            <span className="icon"></span>Health
          </Link>
          <Link to="/assistant" className="menu-item">
            <span className="icon"></span>Assistant
          </Link>
          <Link to="/settings" className="menu-item">
            <span className="icon"></span>Settings
          </Link>
        </div>
        <div className="logout">
          <Link to="/" className="menu-item">
            <span className="icon"></span>Logout
          </Link>
        </div>
      </div>
      <div className="content">
        <div className="header">
          <h1>Welcome back, Alex!</h1>
          <p>Here's your life balance overview</p>
        </div>
        <div className="metrics">
          <div className="metric-card">
            <h3>Balance Score</h3>
            <p>85/100</p>
          </div>
          <div className="metric-card">
            <h3>Energy Level</h3>
            <p>High</p>
          </div>
          <div className="metric-card">
            <h3>Social Score</h3>
            <p>Good</p>
          </div>
          <div className="metric-card">
            <h3>Focus Time</h3>
            <p>6h 30m</p>
          </div>
        </div>
        <div className="charts">
          <div className="chart-card">
            <h3>Life Balance Distribution</h3>
            {/* Placeholder for chart */}
          </div>
          <div className="chart-card">
            <h3>Weekly Mood Tracker</h3>
            {/* Placeholder for chart */}
          </div>
        </div>
        <div className="schedule-recommendations">
          <div className="schedule">
            <h3>Today's Schedule</h3>
            <ul>
              <li>Team Meeting 10:00 AM - 11:00 AM</li>
              <li>Call with Sarah 2:00 PM - 2:30 PM</li>
              <li>Yoga Session 5:00 PM - 6:00 PM</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
