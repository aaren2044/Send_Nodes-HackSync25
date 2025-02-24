import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Physical_Effort.css';

function Physical_Effort() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [latestDate, setLatestDate] = useState(null);
  const [hourlyAverages, setHourlyAverages] = useState({});
  const [maxEffort, setMaxEffort] = useState({ morning: 0, afternoon: 0 }); // Initialize as object
  const [morningAverage, setMorningAverage] = useState(0);
  const [afternoonAverage, setAfternoonAverage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/src/physical_effort.csv');
        const csvData = await response.text();

        // Determine the latest date from the CSV data
        const dates = extractDates(csvData);
        const latest = dates.sort((a, b) => new Date(b) - new Date(a))[0];
        setLatestDate(new Date(latest));

        // If selectedDate is null, initialize it with the latest date
        if (!selectedDate) {
          setSelectedDate(new Date(latest));
        }

        const data = parseCSV(csvData, formatDate(selectedDate || new Date(latest)));
        const averages = calculateAverageEffortPerHour(data);
        setHourlyAverages(averages);

        // Calculate max effort for scaling the chart
        const morningMax = Math.max(...morningHours.map(hour => averages[hour] || 0), 0);
        const afternoonMax = Math.max(...afternoonHours.map(hour => averages[hour] || 0), 0);

        setMaxEffort({ morning: morningMax, afternoon: afternoonMax });

        // Calculate average for morning and afternoon
        setMorningAverage(calculateGraphAverage(averages, 0, 12));
        setAfternoonAverage(calculateGraphAverage(averages, 12, 24));

      } catch (error) {
        console.error("Error fetching or processing CSV data:", error);
      }
    };

    fetchData();
  }, [selectedDate]);

  // Function to extract unique dates from CSV
  const extractDates = (csv) => {
    const lines = csv.split('\n');
    const dates = new Set();
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const parts = line.split(',');
        const creationDate = parts[0];
        const datePart = creationDate.split(' ')[0];
        dates.add(datePart);
      }
    }
    return Array.from(dates);
  };

  // Function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to handle date navigation
  const navigateDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Function to parse CSV data for a specific date
  function parseCSV(csv, targetDate) {
    const lines = csv.split('\n');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const parts = line.split(',');
        const creationDate = parts[0];
        const value = parseFloat(parts[1]);

        // Extract the date part from the creationDate
        const datePart = creationDate.split(' ')[0];

        if (!isNaN(value) && datePart === targetDate) {
          data.push({ creationDate, value });
        }
      }
    }
    return data;
  }

  // Function to calculate average effort per hour
  function calculateAverageEffortPerHour(data) {
    const hourlyData = {};

    for (const item of data) {
      const date = new Date(item.creationDate);
      const hour = date.getHours();

      if (!hourlyData[hour]) {
        hourlyData[hour] = {
          total: 0,
          count: 0
        };
      }

      hourlyData[hour].total += item.value;
      hourlyData[hour].count++;
    }

    const hourlyAverages = {};
    for (const hour in hourlyData) {
      hourlyAverages[hour] = (hourlyData[hour].total / hourlyData[hour].count).toFixed(2);
    }

    return hourlyAverages;
  }

  // Function to calculate average for a graph
  const calculateGraphAverage = (averages, startHour, endHour) => {
    let total = 0;
    let count = 0;
    for (let i = startHour; i < endHour; i++) {
      if (averages[i]) {
        total += parseFloat(averages[i]);
        count++;
      }
    }
    return count > 0 ? (total / count).toFixed(2) : 0;
  };

  const morningHours = Array.from({ length: 12 }, (_, i) => i); // 0-11
  const afternoonHours = Array.from({ length: 12 }, (_, i) => i + 12); // 12-23

  return (
    <div className="container">
      <Link to="/health" className="back-button">
        <ArrowLeft /> Back to Health Overview
      </Link>
      <h1>Physical Effort Summary</h1>
      <div className="date-navigation">
        <button onClick={() => navigateDate(-1)}>Previous Day</button>
        <span>{formatDate(selectedDate)}</span>
        <button onClick={() => navigateDate(1)}>Next Day</button>
      </div>

      <p className="intro-text">
        This page visualizes your physical effort throughout the day. Use the navigation to view different dates.
        Hover over the bars to see the average effort for each hour.
      </p>

      <h2>12 AM - 11 AM</h2>
      <div className="chart morning">
        <div
          className="average-line"
          style={{
            bottom: `${maxEffort.morning > 0 ? (morningAverage / maxEffort.morning) * 250 : 0}px`,
          }}
        >
          <span>Average: {morningAverage}</span>
        </div>
        {morningHours.map(hour => {
          const average = hourlyAverages[hour] || 0;
          const barHeight = maxEffort.morning > 0 ? (average / maxEffort.morning) * 100 : 0;
          const timeLabel = String(hour).padStart(2, '0');

          return (
            <div
              key={hour}
              className="bar"
              style={{ height: `${barHeight}px` }}
            >
              <span className="hour-label">{timeLabel}:00</span>
              <span className="average-value">{average}</span>
            </div>
          );
        })}
      </div>

      <h2>12 PM - 11 PM</h2>
      <div className="chart afternoon">
        <div
          className="average-line"
          style={{
            bottom: `${maxEffort.afternoon > 0 ? (afternoonAverage / maxEffort.afternoon) * 250 : 0}px`,
          }}
        >
          <span>Average: {afternoonAverage}</span>
        </div>
        {afternoonHours.map(hour => {
          const average = hourlyAverages[hour] || 0;
          const barHeight = maxEffort.afternoon > 0 ? (average / maxEffort.afternoon) * 100 : 0;
          const timeLabel = String(hour).padStart(2, '0');

          return (
            <div
              key={hour}
              className="bar"
              style={{ height: `${barHeight}px` }}
            >
              <span className="hour-label">{timeLabel}:00</span>
              <span className="average-value">{average}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Physical_Effort;
