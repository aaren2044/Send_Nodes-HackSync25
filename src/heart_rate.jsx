import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
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
import { Line } from 'react-chartjs-2';
import { Calendar, Heart, ArrowLeft } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function HeartRate() {
  const [heartRateData, setHeartRateData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Heart Rate',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  });
  const [hourly, setHourly] = useState(false);
  const [dailyStats, setDailyStats] = useState({ min: 0, max: 0, avg: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/src/heart_rate.csv');
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csvData = decoder.decode(result.value);

        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const data = results.data;
            setHeartRateData(data);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = heartRateData.filter((item) => {
      if (!item.CreationDate) return false;

      try {
        const itemDate = new Date(item.CreationDate);
        const selectedDateObj = new Date(selectedDate);

        const isSameDate = (
          itemDate.getFullYear() === selectedDateObj.getFullYear() &&
          itemDate.getMonth() === selectedDateObj.getMonth() &&
          itemDate.getDate() === selectedDateObj.getDate()
        );
        
        return isSameDate;
      } catch (error) {
        console.error("Error parsing date:", item.CreationDate, error);
        return false;
      }
    });

    prepareChartData(filteredData, hourly);
    calculateDailyStats(filteredData);

  }, [heartRateData, selectedDate, hourly]);

  const calculateDailyStats = (data) => {
    if (data.length === 0) {
      setDailyStats({ min: 0, max: 0, avg: 0 });
      return;
    }

    const heartRates = data.map((item) => item.Value);
    const min = Math.ceil(Math.min(...heartRates));
    const max = Math.ceil(Math.max(...heartRates));
    const avg = Math.ceil(heartRates.reduce((a, b) => a + b, 0) / data.length);

    setDailyStats({ min, max, avg });
  };

  const prepareChartData = (data, hourly) => {
    const groupedData = {};

    data.forEach((item) => {
      if (!item.CreationDate) return;
      const date = new Date(item.CreationDate);
      const hours = date.getHours();

      let timeKey;
      if (hourly) {
        timeKey = `${String(hours).padStart(2, '0')}:00`;
      } else {
        const startHour = Math.floor(hours / 4) * 4;
        const endHour = startHour + 4;
        timeKey = `${String(startHour).padStart(2, '0')}:00-${String(endHour).padStart(2, '0')}:00`;
      }

      if (!groupedData[timeKey]) {
        groupedData[timeKey] = [];
      }
      groupedData[timeKey].push(item.Value);
    });

    let labels = Object.keys(groupedData).sort(); // Ensure labels are sorted chronologically

    // Ensure all hours are present, even if there's no data
    if (hourly) {
      const allHours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
      labels = allHours; // Use allHours as the labels
    } else {
      const allFourHourIntervals = Array.from({ length: 6 }, (_, i) => {
        const startHour = i * 4;
        const endHour = startHour + 4;
        return `${String(startHour).padStart(2, '0')}:00-${String(endHour).padStart(2, '0')}:00`;
      });
      labels = allFourHourIntervals; // Use allFourHourIntervals as labels
    }

    const avgHeartRates = labels.map((key) => {
      if (groupedData[key]) {
        const sum = groupedData[key].reduce((a, b) => a + b, 0);
        return Math.ceil(sum / groupedData[key].length); // Round the average up
      } else {
        return null; // Return null if all values are NaN
      }
    });

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Heart Rate',
          data: avgHeartRates,
          borderColor: 'rgba(255, 99, 132, 1)', // Solid border color
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Semi-transparent fill
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2,
          pointBackgroundColor: 'rgba(255, 99, 132, 0.7)', // Point color
          pointBorderColor: 'rgba(255, 99, 132, 1)', // Point border color
          pointHoverBackgroundColor: 'rgba(255, 99, 132, 1)',
          pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
          fill: true, // Fill the area under the line
          cubicInterpolationMode: 'monotone', // Smoother curves
        },
      ],
    });
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const toggleHourly = () => {
    setHourly(!hourly);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: `Heart Rate on ${selectedDate}`,
        color: '#fff',
        font: {
          size: 20,
        },
      },
      // Add a gradient background
      background: {
        color: 'rgba(0, 0, 0, 0.5)'
      },
      // Add chart area border
      chartAreaBorder: {
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 2
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  // Chart.js plugin to add a border around the chart area
  ChartJS.register({
    id: 'chartAreaBorder',
    beforeDraw(chart) {
      const { ctx, chartArea: { top, right, bottom, left, width, height } } = chart;
      ctx.save();
      ctx.strokeStyle = chart.config.options.plugins.chartAreaBorder.borderColor;
      ctx.lineWidth = chart.config.options.plugins.chartAreaBorder.borderWidth;
      ctx.strokeRect(left, top, width, height);
      ctx.restore();
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-3xl font-semibold text-white flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 mr-2 text-red-500" /> Heart Rate Visualizer
              </h1>
              <Link to="/health" className="text-sm text-gray-400 hover:text-gray-100 flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Health Overview
              </Link>
            </div>
            <div className="divide-y divide-gray-600">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-300 sm:text-lg sm:leading-7">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-6 w-6 text-purple-300" />
                  <label htmlFor="date" className="text-white font-medium">Select Date:</label>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="ml-2 px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  onClick={toggleHourly}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {hourly ? 'Show 4-Hour Intervals' : 'Show Hourly Data'}
                </button>
                <div className="text-center">
                  <p>
                    <span className="font-semibold text-purple-300">Range:</span> {dailyStats.min} - {dailyStats.max} BPM
                  </p>
                  <p>
                    <span className="font-semibold text-purple-300">Average:</span> {dailyStats.avg} BPM
                  </p>
                </div>
              </div>
              <div className="py-8">
                {loading ? (
                  <p className="text-center text-gray-400">Loading chart...</p>
                ) : chartData ? (
                  <div style={{ width: '100%', height: '400px' }}>
                    <Line data={chartData} options={chartOptions} />
                  </div>
                ) : (
                  <p className="text-center text-gray-400">No data available for the selected date.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeartRate;
