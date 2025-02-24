import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Heart,
  Settings,
  Activity,
  ListChecks,
  Flame,
  Mood,
  User,
} from 'lucide-react';
import '/src/Dashboard.css';

function Dashboard() {
  // Placeholder data - replace with actual data fetching logic
  const balanceScore = 85;
  const energyLevel = "High";
  const socialScore = "Good";
  const focusTime = "6h 30m";

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <LayoutDashboard className="icon" />
          Life Balance AI
        </div>
        <nav className="menu">
          <Link to="/dashboard" className="menu-item active">
            <LayoutDashboard className="icon" />
            Dashboard
          </Link>
          <Link to="/schedule" className="menu-item">
            <Calendar className="icon" />
            Schedule
          </Link>
          <Link to="/health" className="menu-item">
            <Heart className="icon" />
            Health
          </Link>
          <Link to="/blood-oxygen" className="menu-item">
            <Activity className="icon" />
            Blood Oxygen
          </Link>
          <Link to="/heart-rate" className="menu-item">
            <Heart className="icon" />
            Heart Rate
          </Link>
          <Link to="/sleep" className="menu-item">
            <Mood className="icon" />
            Sleep
          </Link>
          <Link to="/workout-summary" className="menu-item">
            <ListChecks className="icon" />
            Workout Summary
          </Link>
          <Link to="/physical-effort" className="menu-item">
            <Flame className="icon" />
            Physical Effort
          </Link>
          <Link to="/health-summary" className="menu-item">
            <ListChecks className="icon" />
            Health Summary
          </Link>
          <Link to="/settings" className="menu-item">
            <Settings className="icon" />
            Settings
          </Link>
        </nav>
        <div className="logout">
          <Link to="/" className="menu-item">
            <User className="icon" />
            Logout
          </Link>
        </div>
      </aside>
      <header className="header">
        <h1>Welcome back, Alex!</h1>
        <p>Here's your life balance overview</p>
      </header>
      <main className="content">
        <section className="metrics">
          <div className="metric-card">
            <h3>Balance Score</h3>
            <p>{balanceScore}/100</p>
          </div>
          <div className="metric-card">
            <h3>Energy Level</h3>
            <p>{energyLevel}</p>
          </div>
          <div className="metric-card">
            <h3>Social Score</h3>
            <p>{socialScore}</p>
          </div>
          <div className="metric-card">
            <h3>Focus Time</h3>
            <p>{focusTime}</p>
          </div>
        </section>
        <section className="charts">
          <div className="chart-card">
            <h3>Life Balance Distribution</h3>
            {/* Placeholder for chart */}
          </div>
          <div className="chart-card">
            <h3>Weekly Mood Tracker</h3>
            {/* Placeholder for chart */}
          </div>
        </section>
        <section className="schedule-recommendations">
          <div className="schedule">
            <h3>Today's Schedule</h3>
            <ul>
              <li>Team Meeting 10:00 AM - 11:00 AM</li>
              <li>Call with Sarah 2:00 PM - 2:30 PM</li>
              <li>Yoga Session 5:00 PM - 6:00 PM</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
