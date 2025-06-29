import React from 'react';
import { Clock, Flame, Dumbbell } from 'lucide-react';
import { WorkoutSummary } from '../../types/chat';

interface SharedWorkoutCardProps {
  workoutSummary: WorkoutSummary;
}

export function SharedWorkoutCard({ workoutSummary }: SharedWorkoutCardProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center space-x-2 mb-3">
        <Dumbbell className="text-blue-600 dark:text-blue-400" size={20} />
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{workoutSummary.name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {workoutSummary.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1 text-sm">
          <Clock size={14} className="text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">{workoutSummary.duration} min</span>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          <Flame size={14} className="text-orange-500" />
          <span className="text-gray-700 dark:text-gray-300">{workoutSummary.calories} cal</span>
        </div>
      </div>
      
      {workoutSummary.exercises.length > 0 && (
        <div className="mt-2">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Exercises:</div>
          <div className="flex flex-wrap gap-1">
            {workoutSummary.exercises.map((exercise, index) => (
              <span 
                key={index}
                className="text-xs bg-white/60 dark:bg-gray-800/60 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
              >
                {exercise}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}