import React, { useMemo } from 'react';
import { 
  User, 
  Activity, 
  Utensils, 
  Dumbbell, 
  Target, 
  TrendingUp, 
  Calendar, 
  Heart,
  Droplet,
  Flame,
  Scale
} from 'lucide-react';
import { User as UserType, MacroTargets, Meal, Workout } from '../../types';
import { useWorkoutStreak } from '../../hooks/useWorkoutStreak';

interface DashboardViewProps {
  user: UserType;
  macroTargets: MacroTargets;
  meals: Meal[];
  workouts: Workout[];
}

export function DashboardView({ user, macroTargets, meals, workouts }: DashboardViewProps) {
  const streakData = useWorkoutStreak(workouts);
  
  // Calculate BMI
  const bmi = useMemo(() => {
    const heightInMeters = user.height / 100;
    return user.weight / (heightInMeters * heightInMeters);
  }, [user.height, user.weight]);
  
  // Determine BMI category
  const bmiCategory = useMemo(() => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-500' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
    return { label: 'Obese', color: 'text-red-500' };
  }, [bmi]);
  
  // Get today's meals and workouts
  const todayMeals = useMemo(() => {
    const today = new Date().toDateString();
    return meals.filter(meal => meal.date.toDateString() === today);
  }, [meals]);
  
  const todayWorkouts = useMemo(() => {
    const today = new Date().toDateString();
    return workouts.filter(workout => workout.date.toDateString() === today);
  }, [workouts]);
  
  // Calculate today's nutrition totals
  const todayNutrition = useMemo(() => {
    return todayMeals.reduce((totals, meal) => {
      return {
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [todayMeals]);
  
  // Calculate remaining calories
  const remainingCalories = macroTargets.calories - todayNutrition.calories;
  
  // Format goal text
  const getGoalText = (goal: UserType['goal']) => {
    switch (goal) {
      case 'lose_weight': return 'Lose Weight';
      case 'gain_weight': return 'Gain Weight';
      case 'maintain': return 'Maintain Weight';
      case 'build_muscle': return 'Build Muscle';
      default: return 'Unknown Goal';
    }
  };
  
  // Format activity level text
  const getActivityText = (level: UserType['activityLevel']) => {
    switch (level) {
      case 'sedentary': return 'Sedentary';
      case 'light': return 'Light Activity';
      case 'moderate': return 'Moderate Activity';
      case 'active': return 'Active';
      case 'very_active': return 'Very Active';
      default: return 'Unknown Activity Level';
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* User Profile Card */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 text-white">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-purple-200">Member since {user.createdAt.toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <div className="text-lg font-bold">{user.height}</div>
            <div className="text-xs text-purple-200">Height (cm)</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <div className="text-lg font-bold">{user.weight}</div>
            <div className="text-xs text-purple-200">Weight (kg)</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <div className="text-lg font-bold">{user.age}</div>
            <div className="text-xs text-purple-200">Age</div>
          </div>
        </div>
      </div>
      
      {/* Today's Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Calendar size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
            Today's Summary
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Utensils size={16} className="text-green-600 dark:text-green-400" />
              <span className="font-medium text-green-800 dark:text-green-200">Nutrition</span>
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {todayNutrition.calories}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">calories consumed</div>
            <div className="mt-2 text-xs text-green-600 dark:text-green-400">
              {todayMeals.length} meals logged today
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Dumbbell size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-800 dark:text-blue-200">Workouts</span>
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {todayWorkouts.length}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">workouts completed</div>
            {todayWorkouts.length > 0 && (
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                {todayWorkouts.reduce((total, workout) => total + workout.duration, 0)} minutes total
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Calorie & Macro Targets */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Target size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
            Calorie & Macro Targets
          </h3>
          <span className={`text-sm font-medium ${remainingCalories >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {remainingCalories >= 0 ? `${remainingCalories} cal left` : `${Math.abs(remainingCalories)} cal over`}
          </span>
        </div>
        
        {/* Calorie Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Daily Calories</span>
            <span className="text-gray-700 dark:text-gray-300">{todayNutrition.calories} / {macroTargets.calories}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                todayNutrition.calories > macroTargets.calories 
                  ? 'bg-red-600' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600'
              }`}
              style={{ width: `${Math.min((todayNutrition.calories / macroTargets.calories) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Macros Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 text-center">
            <div className="text-sm font-bold text-red-700 dark:text-red-300">
              {todayNutrition.protein}g / {macroTargets.protein}g
            </div>
            <div className="text-xs text-red-600 dark:text-red-400">Protein</div>
            <div className="w-full bg-red-200 dark:bg-red-800/30 rounded-full h-1 mt-1">
              <div 
                className="bg-red-600 h-1 rounded-full"
                style={{ width: `${Math.min((todayNutrition.protein / macroTargets.protein) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 text-center">
            <div className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
              {todayNutrition.carbs}g / {macroTargets.carbs}g
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">Carbs</div>
            <div className="w-full bg-yellow-200 dark:bg-yellow-800/30 rounded-full h-1 mt-1">
              <div 
                className="bg-yellow-600 h-1 rounded-full"
                style={{ width: `${Math.min((todayNutrition.carbs / macroTargets.carbs) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
            <div className="text-sm font-bold text-blue-700 dark:text-blue-300">
              {todayNutrition.fat}g / {macroTargets.fat}g
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Fat</div>
            <div className="w-full bg-blue-200 dark:bg-blue-800/30 rounded-full h-1 mt-1">
              <div 
                className="bg-blue-600 h-1 rounded-full"
                style={{ width: `${Math.min((todayNutrition.fat / macroTargets.fat) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Health Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center mb-4">
          <Heart size={18} className="mr-2 text-red-600 dark:text-red-400" />
          Health Metrics
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Scale size={16} className="text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-purple-800 dark:text-purple-200">BMI</span>
            </div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {bmi.toFixed(1)}
            </div>
            <div className={`text-xs ${bmiCategory.color}`}>
              {bmiCategory.label}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Flame size={16} className="text-orange-600 dark:text-orange-400" />
              <span className="font-medium text-orange-800 dark:text-orange-200">Streak</span>
            </div>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              {streakData.currentStreak}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              day{streakData.currentStreak !== 1 ? 's' : ''} streak
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Target size={16} className="text-green-600 dark:text-green-400" />
              <span className="font-medium text-green-800 dark:text-green-200">Goal</span>
            </div>
            <div className="text-sm font-bold text-green-700 dark:text-green-300">
              {getGoalText(user.goal)}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              {macroTargets.calories} cal/day
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Activity size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-800 dark:text-blue-200">Activity</span>
            </div>
            <div className="text-sm font-bold text-blue-700 dark:text-blue-300">
              {getActivityText(user.activityLevel)}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : 'Other'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center mb-4">
          <TrendingUp size={18} className="mr-2 text-green-600 dark:text-green-400" />
          Recent Activity
        </h3>
        
        {/* Recent Meals */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <Utensils size={14} className="mr-1 text-green-600 dark:text-green-400" />
              Recent Meals
            </h4>
            <a href="#" className="text-xs text-purple-600 dark:text-purple-400">View all</a>
          </div>
          
          {meals.length > 0 ? (
            <div className="space-y-2">
              {meals.slice(0, 2).map(meal => (
                <div key={meal.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{meal.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {meal.date.toLocaleDateString()} • {meal.calories} cal
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                    {meal.mealType}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">No meals logged yet</p>
            </div>
          )}
        </div>
        
        {/* Recent Workouts */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <Dumbbell size={14} className="mr-1 text-blue-600 dark:text-blue-400" />
              Recent Workouts
            </h4>
            <a href="#" className="text-xs text-purple-600 dark:text-purple-400">View all</a>
          </div>
          
          {workouts.length > 0 ? (
            <div className="space-y-2">
              {workouts.slice(0, 2).map(workout => (
                <div key={workout.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{workout.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {workout.date.toLocaleDateString()} • {workout.duration} min
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                    {workout.calories} cal
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">No workouts logged yet</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Water Intake Tracker */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Droplet size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
            Water Intake
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">Goal: 2.5L</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
                style={{ width: '40%' }}
              ></div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">1.0L</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">of 2.5L</div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-2 mt-3">
          <button className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
            +100ml
          </button>
          <button className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
            +250ml
          </button>
          <button className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
            +500ml
          </button>
        </div>
      </div>
    </div>
  );
}