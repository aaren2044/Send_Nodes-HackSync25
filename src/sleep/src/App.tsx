import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, ArrowLeft } from 'lucide-react';
import { SleepStageChart } from './components/SleepStageChart';
import { SleepOverTime } from './components/SleepOverTime';
import { DurationTrend } from './components/DurationTrend';
import { DateSelector } from './components/DateSelector';
import { SleepData } from './types';
import './App.css'; // Import the CSS file

interface CSVData {
  CreationDate: string;
  Value: string;
  Duration: string;
}

function SleepApp() {
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch('/src/sleep/src/sleep_analysis_data.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parsedData = parseCSV(text);
        setCsvData(parsedData);

        if (parsedData.length > 0) {
          const dates = [...new Set(parsedData.map(item => formatDate(item.CreationDate.split(' ')[0])))]
            .sort()
            .reverse();
          setSelectedDate(dates[0]);
        }
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching, whether successful or not
      }
    };

    fetchData();
  }, []);

  const parseCSV = (csvText: string): CSVData[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const data: CSVData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === headers.length) {
        const item: any = {};
        for (let j = 0; j < headers.length; j++) {
          item[headers[j].trim()] = values[j].trim();
        }
        data.push(item);
      }
    }
    return data;
  };

  const formatDate = (dateString: string): string => {
    const [day, month, year] = dateString.split('-').map(Number);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const formatDateForDisplay = (dateString: string): string => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const dates = [...new Set(csvData.map(item => formatDate(item.CreationDate.split(' ')[0])))]
    .sort()
    .reverse();

  const currentDayData = csvData.filter(item => {
      const creationDate = item.CreationDate.split(' ')[0];
      return formatDate(creationDate) === selectedDate;
    })
    .map(item => ({
      date: item.CreationDate.split(' ')[0],
      stage: item.Value,
      duration: parseDuration(item.Duration)
    }));

  const stageDistributionData = () => {
    const initialStages = { Core: 0, Deep: 0, REM: 0, Awake: 0, Unspecified: 0 };
    const aggregatedStages = currentDayData.reduce((acc, { stage, duration }) => {
      let cleanedStage = stage;
      if (stage.includes('Core')) cleanedStage = 'Core';
      else if (stage.includes('Deep')) cleanedStage = 'Deep';
      else if (stage.includes('REM')) cleanedStage = 'REM';
      else if (stage.includes('Awake')) cleanedStage = 'Awake';
      else cleanedStage = 'Unspecified';

      acc[cleanedStage] = (acc[cleanedStage] || 0) + duration;
      return acc;
    }, initialStages);

    const result = Object.entries(aggregatedStages).map(([stage, count]) => ({ stage, count }));
    console.log("stageDistribution data:", result);
    return result;
  };

  function parseDuration(durationString: string): number {
    const [hours, minutes, seconds] = durationString.split(':').map(Number);
    return hours * 60 + minutes + seconds / 60;
  }

  return (
    <div className="min-h-screen">
      <header className="bg-gray-900/30 backdrop-blur-sm border-b border-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/health">
                <ArrowLeft className="w-5 h-5 text-purple-400" />
              </Link>
              <Activity className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Sleep Analysis Dashboard</h1>
            </div>
            {dates.length > 0 && (
              <DateSelector
                dates={dates.map(date => formatDateForDisplay(date))}
                selectedDate={formatDateForDisplay(selectedDate)}
                onDateChange={(date) => {
                  const originalDate = dates.find(d => formatDateForDisplay(d) === date) || dates[0];
                  setSelectedDate(originalDate);
                }}
              />
            )}

          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center text-gray-400">Loading data...</div>
        ) : csvData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <SleepOverTime data={currentDayData} date={selectedDate} />
            </div>
            <SleepStageChart data={stageDistributionData()} />
            <DurationTrend data={currentDayData} />
          </div>
        ) : (
          <div className="text-center text-gray-400">No data available.</div>
        )}
      </main>
    </div>
  );
}

export default SleepApp;
