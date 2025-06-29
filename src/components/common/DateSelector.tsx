import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Calendar } from './Calendar';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  label?: string;
}

export function DateSelector({ selectedDate, onDateChange, label }: DateSelectorProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsCalendarOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 group"
      >
        <CalendarIcon size={18} className="text-purple-600 dark:text-purple-400" />
        <div className="flex flex-col items-start">
          {label && (
            <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
          )}
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(selectedDate)}
          </span>
        </div>
        <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
      </button>

      <Calendar
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
    </>
  );
}