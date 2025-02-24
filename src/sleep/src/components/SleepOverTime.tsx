import React from 'react';
import { Clock } from 'lucide-react';
import { SleepData } from '../types';

interface Props {
  data: SleepData[];
  date: string;
}

const stageColors: { [stage: string]: string } = {
  'Core': '#1e3a8a', // Dark Blue
  'Deep': '#0a1b3f', // Dark Dark Blue
  'REM': '#60a5fa',
  'Awake': '#ef4444',
  'Unspecified': '#cbd5e1'
};

export function SleepOverTime({ data, date }: Props) {
  const stages = ['Core', 'Deep', 'REM', 'Awake', 'Unspecified'];
  const total = data.reduce((sum, d) => sum + d.duration, 0);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hr ${mins} min`;
  };

  const stageDurations: { [stage: string]: number } = data.reduce((acc, item) => {
    let cleanedStage = item.stage;
    if (item.stage.includes('Core')) cleanedStage = 'Core';
    else if (item.stage.includes('Deep')) cleanedStage = 'Deep';
    else if (item.stage.includes('REM')) cleanedStage = 'REM';
    else if (item.stage.includes('Awake')) cleanedStage = 'Awake';
    else cleanedStage = 'Unspecified';
    acc[cleanedStage] = (acc[cleanedStage] || 0) + item.duration;
    return acc;
  }, { Core: 0, Deep: 0, REM: 0, Awake: 0, Unspecified: 0 });

  return (
    <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl shadow-lg shadow-purple-900/20 p-6 border border-purple-900/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Sleep Analysis</h2>
        </div>
        <span className="text-purple-300 font-medium">
          Total: {formatTime(total)}
        </span>
      </div>
      <div className="space-y-6">
        <div className="h-12 flex rounded-lg overflow-hidden shadow-inner shadow-purple-900/20">
          {stages.map((stage) => {
            const stageDuration = stageDurations[stage] || 0;
            const percentage = total > 0 ? (stageDuration / total) * 100 : 0;

            return (
              <div
                key={stage}
                className="h-full first:rounded-l-lg last:rounded-r-lg transition-all duration-300 hover:brightness-110 relative group"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: stageColors[stage] || '#cbd5e1',
                }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200">
                  <span className="text-white text-sm font-medium">
                    {formatTime(stageDuration)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-6 flex-wrap">
          {stages.map((stage) => (
            <div key={stage} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full shadow-inner shadow-black/20"
                style={{ backgroundColor: stageColors[stage] || '#cbd5e1' }}
              />
              <span className="text-sm text-gray-300">{stage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
