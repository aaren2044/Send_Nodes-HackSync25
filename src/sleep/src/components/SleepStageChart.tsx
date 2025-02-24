import React, { useState, useEffect } from 'react';
import { BarChart, Percent } from 'lucide-react';
import { SleepData } from '../types';

interface Props {
  data: { stage: string; count: number }[];
}

const stageColors: { [stage: string]: string } = {
  'Core': '#1e3a8a', // Dark Blue
  'Deep': '#0a1b3f', // Dark Dark Blue
  'REM': '#60a5fa',
  'Awake': '#ef4444',
  'Unspecified': '#cbd5e1'
};

export function SleepStageChart({ data }: Props) {
  const [displayPercentage, setDisplayPercentage] = useState(true);
  const [maxCount, setMaxCount] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      setMaxCount(Math.max(...data.map(d => d.count)));
    } else {
      setMaxCount(0);
    }
  }, [data]);

  const totalMinutes = data ? data.reduce((sum, item) => sum + item.count, 0) : 0;

  const toggleDisplay = () => {
    setDisplayPercentage(!displayPercentage);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hr ${mins} min`;
  };
  
  const stageOrder = ['Core', 'Deep', 'REM', 'Awake', 'Unspecified'];

  return (
    <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl shadow-lg shadow-purple-900/20 p-6 border border-purple-900/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Sleep Stage Distribution</h2>
        </div>
        <button
          onClick={toggleDisplay}
          className="px-3 py-1 bg-purple-800/50 text-purple-300 rounded-full text-xs hover:bg-purple-700/50 transition-colors duration-200"
        >
          View {displayPercentage ? 'Time' : 'Percentage'}
        </button>
      </div>
      <div className="space-y-4">
        {data && stageOrder.map(stage => {
          const item = data.find(item => item.stage === stage);
          const duration = item ? item.count : 0;
          const percentage = totalMinutes > 0 ? (duration / totalMinutes) * 100 : 0;
          const barWidth = Math.min(percentage, 100);

          return (
            item && (
              <div key={stage} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{stage}</span>
                  <span className="text-purple-300 font-medium">
                    {displayPercentage
                      ? `${percentage.toFixed(1)}%`
                      : formatTime(duration)}
                  </span>
                </div>
                <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden shadow-inner shadow-black/20">
                  <div
                    className="h-full transition-all duration-300 hover:brightness-110"
                    style={{ 
                      width: `${barWidth}%`,
                      backgroundColor: stageColors[stage] || '#cbd5e1'
                    }}
                  />
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}
