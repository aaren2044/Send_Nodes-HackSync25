import React from 'react';

function Filter({ workoutTypes, selectedType, onFilterChange }) {
  return (
    <div>
      <label htmlFor="workoutType">Filter by Workout Type:</label>
      <select
        id="workoutType"
        value={selectedType}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        {workoutTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filter;
