import React from 'react';
import { Link } from 'react-router-dom';
import '/src/Health.css';

function Health() {
  return (
    <div className="health-container">
      <h1>Health Overview</h1>
      <div className="health-sections">
        <div className="health-section">
          <h2><Link to="/blood-oxygen">Blood O2</Link></h2>
          <p>98%</p>
        </div>
        <div className="health-section">
          <h2>Heart Rate</h2>
          <p>72 bpm</p>
        </div>
        <div className="health-section">
          <h2>Physical Effort</h2>
          <p>Moderate</p>
        </div>
        <div className="health-section">
          <h2>Workout Summary</h2>
          <ul>
            <li>Total Calories Burned: 500</li>
            <li>Workout Duration: 60 minutes</li>
          </ul>
        </div>
        <div className="health-section">
          <h2>Health Summary</h2>
          <ul>
            <li>Take a Break: You've been working for 2 hours straight. Consider a 10-minute walk.</li>
            <li>Social Connection: Haven't caught up with Mike in a while. Schedule a coffee chat?</li>
          </ul>
        </div>
        <div className="health-section">
          <h2>Sleep Analysis</h2>
          <p>8 hours of sleep</p>
        </div>
      </div>
    </div>
  );
}

export default Health;
