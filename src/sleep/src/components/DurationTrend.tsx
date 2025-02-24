import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { SleepData } from '../types';

interface Props {
  data: SleepData[];
}

export function DurationTrend({ data }: Props) {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; duration: number } | null>(null);

  if (!data || data.length === 0) {
    return <div className="text-center text-gray-400">No data available for trend analysis.</div>;
  }

  const stages = [...new Set(data.map(item => item.stage))];

  const durationByStage: { [stage: string]: number } = data.reduce((acc: { [stage: string]: number }, item) => {
    acc[item.stage] = (acc[item.stage] || 0) + item.duration;
    return acc;
  }, {});

  const durationTrendData = Object.entries(durationByStage).map(([stage, duration]) => ({ stage, duration }));

  const maxDuration = Math.max(...durationTrendData.map(d => d.duration));
  const minDuration = Math.min(...durationTrendData.map(d => d.duration));
  const range = maxDuration - minDuration;

  const points = durationTrendData.map((d, i) => ({
    x: (i / (durationTrendData.length - 1)) * 100,
    y: 100 - (((d.duration - minDuration) / range) * 100),
    duration: d.duration
  }));
  
  const pathData = points.reduce((path, point, i) => 
    path + (i === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`),
    ''
  );

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    return `${hours} hr`;
  };

  const formatTooltipTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hr ${mins} min`;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl shadow-lg shadow-purple-900/20 p-6 border border-purple-900/20">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">Sleep Duration Trend</h2>
      </div>
      <div className="h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <path
            d={`${pathData} L 100,100 L 0,100 Z`}
            fill="url(#lineGradient)"
            fillOpacity="0.1"
          />
          <path
            d={pathData}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
          />
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="3"
              className="fill-purple-400 cursor-pointer"
              onMouseEnter={() => setHoveredPoint({ x: point.x, y: point.y, duration: point.duration })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>
        <div className="absolute bottom-0 left-0 w-full h-full flex flex-col justify-between pointer-events-none">
          {[...Array(5)].map((_, i) => {
            const value = minDuration + (range * (i / 4));
            return (
              <div
                key={i}
                className="w-full border-t border-gray-700/30 text-xs text-gray-400"
              >
                {formatTime(Math.round(value))}
              </div>
            );
          })}
        </div>
        {hoveredPoint && (
          <div
            className="absolute text-white text-sm bg-gray-800 border border-gray-700 rounded p-2 pointer-events-none"
            style={{
              top: `${hoveredPoint.y - 8}%`,
              left: `${hoveredPoint.x + 2}%`,
            }}
          >
            {formatTooltipTime(hoveredPoint.duration)}
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between text-sm text-gray-400">
        {durationTrendData.map((d, i) => (
          i % Math.ceil(durationTrendData.length / 5) === 0 && (
            <span key={d.stage}>{d.stage}</span>
          )
        ))}
      </div>
    </div>
  );
}
