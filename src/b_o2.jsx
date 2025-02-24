import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Papa from 'papaparse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat, faCalendarAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import 'chartjs-plugin-datalabels';
import { Moon, Sun } from 'lucide-react';
import './b_o2.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const B_o2 = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/src/blood_oxygen.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csvData = decoder.decode(result.value);

        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            // Extract all available dates
            const allDates = [...new Set(results.data.map((item) => item.CreationDate.split(' ')[0]))];
            setAvailableDates(allDates);

            // If no date is selected, pick the first available date
            const initialDate = selectedDate || allDates[0];
            setSelectedDate(initialDate);

            // Filter data based on the initial or selected date
            updateChartData(results.data, initialDate);
          },
        });
      } catch (error) {
        console.error("Error fetching or parsing CSV data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/src/blood_oxygen.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csvData = decoder.decode(result.value);

        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            updateChartData(results.data, selectedDate);
          },
        });
      } catch (error) {
        console.error("Error fetching or parsing CSV data:", error);
      }
    };

    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  const updateChartData = (data, date) => {
    const filteredData = data.filter((item) => item.CreationDate.startsWith(date));

    const labels = filteredData.map((item) => {
      const time = item.CreationDate.split(' ')[1];
      return time.substring(0, 5); // Extract hours and minutes
    });
    const values = filteredData.map((item) => item.Value * 100); // Convert to percentage

    // Calculate average blood oxygen level
    const total = values.reduce((sum, value) => sum + value, 0);
    const average = total / values.length;

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Blood O2 Level (%)',
          data: values,
          fill: false,
          showLine: false,
          backgroundColor: 'rgba(0, 191, 255, 0.2)', // Neon Blue with transparency
          borderColor: 'rgba(0, 191, 255, 1)',
          pointRadius: 4,
          pointBackgroundColor: 'rgba(0, 191, 255, 0.7)',
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: 'rgba(0, 191, 255, 1)',
          pointHoverBorderColor: '#fff',
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: 'Average Blood O2 Level (%)',
          data: new Array(labels.length).fill(average),
          fill: false,
          borderColor: 'rgba(173, 216, 230, 0.7)', // Light Blue
          borderDash: [5, 5], // Dotted line
          pointRadius: 0, // Hide points
        }
      ],
    };
    setChartData(chartData);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const options = {
    responsive: false, // set to false
    maintainAspectRatio: false,
    width: 800, // set a fixed width
    height: 500, // set a fixed height
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad'
    },
    layout: {
      padding: {
        top: 20,
        right: 30,
        bottom: 10,
        left: 20
      }
    },
    scales: {
      y: {
        min: 85,
        max: 100,
        ticks: {
          stepSize: 5,
          color: isDarkMode ? 'white' : 'black',
          callback: function(value) {
            return value + '%';
          },
          padding: 10,
        },
        title: {
          display: true,
          text: 'Blood Oxygen Level (%)',
          color: isDarkMode ? 'white' : 'black',
          font: {
            size: 16
          }
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          borderWidth: 1
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time',
          color: isDarkMode ? 'white' : 'black',
          font: {
            size: 16
          }
        },
        ticks: {
          color: isDarkMode ? 'white' : 'black',
          maxRotation: 50,
          minRotation: 50,
          padding: 5,
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          borderWidth: 1
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? 'white' : 'black',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Blood Oxygen Levels Over Time',
        color: isDarkMode ? 'white' : 'black',
        font: {
          size: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';

            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + '%';
            }
            return label;
          }
        }
      },
      datalabels: {
        display: false
      },
       chartAreaBorder: {
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        borderWidth: 2
      }
    }
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
      <Link to="/health" className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Health Overview
      </Link>
      <h1 className="app-title">
        <FontAwesomeIcon icon={faHeartbeat} style={{ color: '#ff69b4' }} className="heartbeat-icon" />
        Blood Oxygen Visualization
      </h1>
      <div className="date-selector">
        <label htmlFor="date">
          <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#c778dd' }} className="calendar-icon" />
          Select Date:
        </label>
        <select id="date" value={selectedDate} onChange={handleDateChange}>
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>Loading chart...</p>
      ) : chartData ? (
        <div className="chart-wrapper">
          <h2 className="chart-header">Blood O2 Level</h2>
          <Line data={chartData} options={options} width={800} height={500} />
        </div>
      ) : (
        <p>No data available for the selected date.</p>
      )}
    </div>
  );
};

export default B_o2;
