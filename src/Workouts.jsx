import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Papa from 'papaparse';
import WorkoutTable from './components/WorkoutTable';
import Filter from './components/Filter';
import './Workout.css'; // Import the CSS file

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/src/workout.csv');
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csvData = decoder.decode(result.value);

      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setWorkouts(results.data);
          setFilteredWorkouts(results.data);

          const types = [...new Set(results.data.map((workout) => workout.workoutActivityType))];
          setWorkoutTypes(['All', ...types]);
        },
      });
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedType === 'All') {
      setFilteredWorkouts(workouts);
    } else {
      const filtered = workouts.filter((workout) => workout.workoutActivityType === selectedType);
      setFilteredWorkouts(filtered);
    }
  }, [selectedType, workouts]);

  const handleFilterChange = (type) => {
    setSelectedType(type);
  };

  return (
    <div className="app-container">
      <Link to="/health" className="back-button">
        <ArrowLeft /> Back to Health Overview
      </Link>
      <header>
        <h1><i className="fas fa-dumbbell"></i> Workout Summary</h1>
      </header>
      <main>
        <Filter workoutTypes={workoutTypes} selectedType={selectedType} onFilterChange={handleFilterChange} />
        <WorkoutTable workouts={filteredWorkouts} />
      </main>
      <footer>
        <p>&copy; 2024 Workout Tracker</p>
      </footer>
    </div>
  );
}

export default Workouts;
