import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Health from './Health';
import B_o2 from './b_o2';
import HeartRate from './heart_rate';
import SleepApp from './sleep/src/App.tsx';
import Workouts from './Workouts';
import Physical_Effort from './Physical_Effort';
import Health_Summary from './Health_Summary';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Login onLogin={handleLogin} />} />
        <Route path="/health" element={isLoggedIn ? <Health /> : <Login onLogin={handleLogin} />} />
        <Route path="/blood-oxygen" element={isLoggedIn ? <B_o2 /> : <Login onLogin={handleLogin} />} />
        <Route path="/heart-rate" element={isLoggedIn ? <HeartRate /> : <Login onLogin={handleLogin} />} />
        <Route path="/Sleep" element={isLoggedIn ? <SleepApp /> : <Login onLogin={handleLogin} />} />
        <Route path="/workout-summary" element={isLoggedIn ? <Workouts /> : <Login onLogin={handleLogin} />} />
        <Route path="/physical-effort" element={isLoggedIn ? <Physical_Effort /> : <Login onLogin={handleLogin} />} />
        <Route path="/health-summary" element={isLoggedIn ? <Health_Summary /> : <Login onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
