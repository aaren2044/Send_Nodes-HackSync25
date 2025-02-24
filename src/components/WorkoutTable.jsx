import React, { useState } from 'react';
import './WorkoutTable.css'; // Import the CSS file for styling

function WorkoutTable({ workouts }) {
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  if (!workouts || workouts.length === 0) {
    return <p>No workouts found.</p>;
  }

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Function to round up the duration to the nearest minute
  const roundUpToMinute = (duration) => {
    return Math.ceil(duration);
  };

  const handleRowClick = (workout) => {
    setSelectedWorkout(workout);
  };

  const handleClosePopup = () => {
    setSelectedWorkout(null);
  };

  const workoutIcon = (type, isPopup = false) => {
    let iconClass = "fas"; // Base class for Font Awesome icons
    let animationClass = ""; // Class for animation
    let iconStyle = { color: '#90EE90' }; // Light green color

    switch (type) {
      case 'CoreTraining':
        iconClass += " fa-dumbbell";
        animationClass = isPopup ? " fa-spin" : ""; // Apply spin animation only in popup
        break;
      case 'HighIntensityIntervalTraining':
        iconClass += " fa-fire-alt";
        animationClass = isPopup ? " fa-beat" : ""; // Apply beat animation only in popup
        break;
      case 'Walking':
        iconClass += " fa-walking";
        animationClass = isPopup ? " fa-bounce" : ""; // Apply bounce animation only in popup
        break;
      case 'Training':
        iconClass += " fa-running";
        animationClass = isPopup ? " fa-pulse" : ""; // Apply pulse animation only in popup
        break;
      default:
        iconClass += " fa-heart";
        break;
    }

    return <i className={`${iconClass} ${animationClass}`} style={iconStyle}></i>;
  };

  const getDetailIcon = (header) => {
    let iconClass = "fas ";
    let iconStyle = { color: '#90EE90' };

    switch (header) {
      case 'averageMET':
        iconClass += "fa-bolt";
        break;
      case 'ActiveEnergyBurned':
        iconClass += "fa-burn";
        break;
      case 'HeartRateAverage':
        iconClass += "fa-heartbeat";
        break;
      case 'HeartRateMinimum':
        iconClass += "fa-heart";
        break;
      case 'HeartRateMaximum':
        iconClass += "fa-heart";
        break;
      case 'BasalEnergyBurned':
        iconClass += "fa-battery-half";
        break;
      default:
        iconClass += "fa-info-circle";
        break;
    }

    return <i className={iconClass} style={iconStyle}></i>;
  };

  const headers = {
    creationDate: 'Date',
    workoutActivityType: 'Workout Type',
    duration: 'Duration (Minutes)',
  };

  const detailHeaders = {
    averageMET: 'Average MET',
    ActiveEnergyBurned: 'Active Energy Burned',
    HeartRateAverage: 'Avg Heart Rate',
    HeartRateMinimum: 'Min Heart Rate',
    HeartRateMaximum: 'Max Heart Rate',
    BasalEnergyBurned: 'Basal Energy Burned',
  };

  return (
    <div className="workout-container">
      <h2>Workouts</h2>
      <table>
        <thead>
          <tr>
            {Object.values(headers).map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout, index) => (
            <tr key={index} onClick={() => handleRowClick(workout)}>
              <td>{formatDate(workout.creationDate)}</td>
              <td>
                {workoutIcon(workout.workoutActivityType)} {workout.workoutActivityType}
              </td>
              <td><i className="fas fa-clock" style={{ color: '#90EE90' }}></i> {roundUpToMinute(parseFloat(workout.duration))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedWorkout && (
        <div className="workout-popup">
          <div className="workout-popup-content">
            <span className="close-popup" onClick={handleClosePopup}>
              &times;
            </span>
            <div className="popup-header">
              {workoutIcon(selectedWorkout.workoutActivityType, true)}
              <h3>Workout Details</h3>
            </div>
            <p>
              <i className="fas fa-calendar-alt"></i> Date:{' '}
              {formatDate(selectedWorkout.creationDate)}
            </p>
            <p>
              <i className="fas fa-clock"></i> Duration:{' '}
              {roundUpToMinute(parseFloat(selectedWorkout.duration))} minutes
            </p>
            <p>Type: {selectedWorkout.workoutActivityType}</p>
            <h4>Additional Details:</h4>
            <div className="details-grid">
              {Object.entries(detailHeaders).map(([key, header]) => (
                <div key={key} className="detail-item">
                  <strong>{header}:</strong> {getDetailIcon(key)} {selectedWorkout[key]}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutTable;
