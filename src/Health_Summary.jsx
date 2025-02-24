import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ArrowLeft } from 'lucide-react';
import './Health_Summary.css';

Chart.register(...registerables);

function Health_Summary() {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);  // Ref to keep track of the chart instance

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/src/summary_data.csv');
      const text = await response.text();

      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          setData(result.data);
        },
      });
    };

    fetchData();
  }, []);

  const exerciseData = data.map(item => item.ExerciseTime);
  const standData = data.map(item => item.StandHours);
  const activeEnergyData = data.map(item => item.ActiveEnergyBurned);
  const labels = data.map(item => item.date);

  const activeEnergyChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Active Energy Burned',
        data: activeEnergyData,
        backgroundColor: 'rgba(255, 0, 0, 0.7)', // Neon Red
        borderColor: 'rgba(255, 0, 0, 1)', // Ensuring borderColor is always defined
        borderWidth: 2,
      },
    ],
  };

  const exerciseChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Exercise Time (minutes)',
        data: exerciseData,
        backgroundColor: 'rgba(0, 255, 0, 0.7)', // Neon Green
        borderColor: 'rgba(0, 255, 0, 1)', // Ensuring borderColor is always defined
        borderWidth: 2,
      },
    ],
  };

  const standChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Stand Hours',
        data: standData,
        backgroundColor: 'rgba(0, 0, 255, 0.7)', // Neon Blue
        borderColor: 'rgba(0, 0, 255, 1)', // Ensuring borderColor is always defined
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        color: 'white',
        maxRotation: 90,
        minRotation: 45, // Reduced minimum rotation
        fontSize: 10, // Reduced font size for labels
        align: 'right', // Align labels to the right
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
    y: {
      ticks: {
        color: 'white',
        fontSize: 10, // Reduced font size for labels
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};  // Removed the extra semicolon here

  // Cleanup function to destroy the chart instance on re-render
  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.chartInstance;

      // Destroy previous chart instance before creating a new one
      if (chartInstance) {
        chartInstance.destroy();
      }
    }
  }, [data]); // Ensure this runs when the data changes

  return (
    <div className="app-container">
      <Link to="/health" className="back-button">
        <ArrowLeft /> Back to Health Overview
      </Link>
      <h1>Health Summary</h1>

      <section className="activity-section">
        <h2>Active Energy</h2>
        <div className="chart-container">
          <Bar data={activeEnergyChartData} options={chartOptions} ref={chartRef} />
        </div>
      </section>

      <section className="activity-section">
        <h2>Exercise</h2>
        <div className="chart-container">
          <Bar data={exerciseChartData} options={chartOptions} ref={chartRef} />
        </div>
      </section>

      <section className="activity-section">
        <h2>Stand</h2>
        <div className="chart-container">
          <Bar data={standChartData} options={chartOptions} ref={chartRef} />
        </div>
      </section>
    </div>
  );
}

export default Health_Summary;
