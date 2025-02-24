import React from 'react';
import { Calendar } from 'lucide-react';

interface Props {
  dates: string[];
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DateSelector({ dates, selectedDate, onDateChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <Calendar className="w-5 h-5 text-purple-400" />
      <select
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="bg-gray-800/50 text-white border border-purple-900/20 rounded-lg px-4 py-2 appearance-none cursor-pointer hover:bg-gray-800/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      >
        {dates.map(date => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>
    </div>
  );
}
