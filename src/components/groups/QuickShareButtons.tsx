import React, { useState, useEffect } from 'react';
import { Utensils, Dumbbell } from 'lucide-react';
import { mealService, workoutService } from '../../services/api';
import { Meal, Workout } from '../../types';
import { MealSummary, WorkoutSummary, createMealSummary, createWorkoutSummary } from '../../types/chat';

interface QuickShareButtonsProps {
  onShareMeal: (mealSummary: MealSummary) => void;
  onShareWorkout: (workoutSummary: WorkoutSummary) => void;
}

export function QuickShareButtons({ onShareMeal, onShareWorkout }: QuickShareButtonsProps) {
  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([]);
  const [todaysWorkouts, setTodaysWorkouts] = useState<Workout[]>([]);
  const [showMealOptions, setShowMealOptions] = useState(false);
  const [showWorkoutOptions, setShowWorkoutOptions] = useState(false);

  useEffect(() => {
    // Load today's meals and workouts
    const today = new Date();
    const meals = mealService.getMeals(today);
    const workouts = workoutService.getWorkouts(today);
    
    setTodaysMeals(meals);
    setTodaysWorkouts(workouts);
  }, []);

  const handleShareMeal = (meal: Meal) => {
    const mealSummary = createMealSummary(meal);
    onShareMeal(mealSummary);
    setShowMealOptions(false);
  };

  const handleShareWorkout = (workout: Workout) => {
    const workoutSummary = createWorkoutSummary(workout);
    onShareWorkout(workoutSummary);
    setShowWorkoutOptions(false);
  };

  return (
    <div className="flex space-x-2">
      {/* Share Meal Button */}
      <div className="relative">
        <button
          onClick={() => setShowMealOptions(!showMealOptions)}
          className="p-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
        >
          <Utensils size={16} />
        </button>
        
        {showMealOptions && (
          <div className="absolute left-0 bottom-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 min-w-48 max-h-60 overflow-y-auto">
            {todaysMeals.length === 0 ? (
              <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                No meals logged today
              </div>
            ) : (
              <div className="p-2">
                {todaysMeals.map(meal => (
                  <button
                    key={meal.id}
                    onClick={() => handleShareMeal(meal)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{meal.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {meal.calories} cal • {meal.mealType}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share Workout Button */}
      <div className="relative">
        <button
          onClick={() => setShowWorkoutOptions(!showWorkoutOptions)}
          className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Dumbbell size={16} />
        </button>
        
        {showWorkoutOptions && (
          <div className="absolute left-0 bottom-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 min-w-48 max-h-60 overflow-y-auto">
            {todaysWorkouts.length === 0 ? (
              <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                No workouts logged today
              </div>
            ) : (
              <div className="p-2">
                {todaysWorkouts.map(workout => (
                  <button
                    key={workout.id}
                    onClick={() => handleShareWorkout(workout)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{workout.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {workout.duration} min • {workout.exercises.length} exercises
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}