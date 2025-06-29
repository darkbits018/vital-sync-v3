import React, { useState, useEffect } from 'react';
import { X, Utensils, Dumbbell, Clock, Flame, Target, Calendar } from 'lucide-react';
import { Friend } from '../../types/friends';

interface FriendMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: Date;
  image?: string;
}

interface FriendWorkout {
  id: string;
  name: string;
  duration: number;
  calories: number;
  exercises: string[];
  time: Date;
  category: string;
}

interface FriendDayActivity {
  friend: Friend;
  meals: FriendMeal[];
  workouts: FriendWorkout[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalWorkoutTime: number;
  totalCaloriesBurned: number;
}

interface FriendStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends: Friend[];
  initialFriendId?: string;
}

// Generate mock data for a single friend's daily activity
const generateFriendActivity = (friend: Friend): FriendDayActivity => {
  const mealOptions = [
    { name: 'Protein Smoothie', calories: 320, protein: 25, carbs: 28, fat: 8, type: 'breakfast' },
    { name: 'Grilled Chicken Salad', calories: 350, protein: 35, carbs: 12, fat: 18, type: 'lunch' },
    { name: 'Salmon with Quinoa', calories: 450, protein: 32, carbs: 35, fat: 22, type: 'dinner' },
    { name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 12, fat: 5, type: 'snack' },
    { name: 'Oatmeal with Berries', calories: 280, protein: 8, carbs: 45, fat: 6, type: 'breakfast' },
    { name: 'Turkey Wrap', calories: 380, protein: 28, carbs: 32, fat: 16, type: 'lunch' },
    { name: 'Stir-fry Vegetables', calories: 220, protein: 12, carbs: 25, fat: 10, type: 'dinner' },
    { name: 'Protein Bar', calories: 200, protein: 20, carbs: 15, fat: 8, type: 'snack' },
  ];

  const workoutOptions = [
    { name: 'Upper Body Strength', duration: 45, calories: 320, exercises: ['Bench Press', 'Pull-ups', 'Shoulder Press'], category: 'Strength' },
    { name: 'Morning Run', duration: 30, calories: 280, exercises: ['5K Run'], category: 'Cardio' },
    { name: 'HIIT Session', duration: 25, calories: 350, exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats'], category: 'HIIT' },
    { name: 'Yoga Flow', duration: 60, calories: 180, exercises: ['Sun Salutations', 'Warrior Poses', 'Meditation'], category: 'Yoga' },
    { name: 'Leg Day', duration: 50, calories: 400, exercises: ['Squats', 'Deadlifts', 'Lunges'], category: 'Strength' },
    { name: 'Swimming', duration: 40, calories: 320, exercises: ['Freestyle', 'Backstroke'], category: 'Cardio' },
  ];

  // Generate 2-4 meals
  const mealCount = Math.floor(Math.random() * 3) + 2;
  const meals: FriendMeal[] = [];
  
  for (let i = 0; i < mealCount; i++) {
    const meal = mealOptions[Math.floor(Math.random() * mealOptions.length)];
    const now = new Date();
    const mealTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 
      8 + (i * 4) + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
    
    meals.push({
      id: `${friend.id}-meal-${i}`,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      mealType: meal.type as any,
      time: mealTime,
    });
  }

  // Generate 0-2 workouts
  const workoutCount = Math.floor(Math.random() * 3);
  const workouts: FriendWorkout[] = [];
  
  for (let i = 0; i < workoutCount; i++) {
    const workout = workoutOptions[Math.floor(Math.random() * workoutOptions.length)];
    const now = new Date();
    const workoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 
      6 + (i * 8) + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60));
    
    workouts.push({
      id: `${friend.id}-workout-${i}`,
      name: workout.name,
      duration: workout.duration,
      calories: workout.calories,
      exercises: workout.exercises,
      time: workoutTime,
      category: workout.category,
    });
  }

  // Calculate totals
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);
  const totalWorkoutTime = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCaloriesBurned = workouts.reduce((sum, workout) => sum + workout.calories, 0);

  return {
    friend,
    meals,
    workouts,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    totalWorkoutTime,
    totalCaloriesBurned,
  };
};

export function FriendStoryModal({ isOpen, onClose, friends, initialFriendId }: FriendStoryModalProps) {
  const [currentFriendIndex, setCurrentFriendIndex] = useState(0);
  const [activityData, setActivityData] = useState<FriendDayActivity | null>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'meals' | 'workouts'>('overview');
  const [loading, setLoading] = useState(false);
  
  // Touch gesture state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Initialize current friend index based on initialFriendId
  useEffect(() => {
    if (initialFriendId && friends.length > 0) {
      const index = friends.findIndex(friend => friend.id === initialFriendId);
      setCurrentFriendIndex(index >= 0 ? index : 0);
    }
  }, [initialFriendId, friends]);

  const currentFriend = friends[currentFriendIndex];

  // Generate activity data when friend changes
  useEffect(() => {
    if (isOpen && currentFriend) {
      setLoading(true);
      setCurrentView('overview'); // Reset view when switching friends
      // Simulate API call
      setTimeout(() => {
        const data = generateFriendActivity(currentFriend);
        setActivityData(data);
        setLoading(false);
      }, 500);
    }
  }, [isOpen, currentFriend]);

  const handleNextFriend = () => {
    if (currentFriendIndex < friends.length - 1) {
      setCurrentFriendIndex(currentFriendIndex + 1);
    }
  };

  const handlePreviousFriend = () => {
    if (currentFriendIndex > 0) {
      setCurrentFriendIndex(currentFriendIndex - 1);
    }
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && friends.length > 1) {
      handleNextFriend();
    }
    if (isRightSwipe && friends.length > 1) {
      handlePreviousFriend();
    }
  };

  const getMealTypeEmoji = (type: string) => {
    switch (type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const getWorkoutCategoryColor = (category: string) => {
    switch (category) {
      case 'Strength': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      case 'Cardio': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'HIIT': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      case 'Yoga': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (!isOpen || !currentFriend) return null;

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md h-[85vh] flex flex-col overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {currentFriend.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-bold">{currentFriend.name}</h3>
                <p className="text-purple-200 text-sm">@{currentFriend.username}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-purple-200 text-sm">
              <Calendar size={14} />
              <span>{today}</span>
              <div className={`w-2 h-2 rounded-full ${
                currentFriend.status === 'online' ? 'bg-green-400' :
                currentFriend.status === 'away' ? 'bg-yellow-400' :
                'bg-gray-400'
              }`}></div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-gray-50 dark:bg-gray-800">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'meals', label: 'Meals', icon: Utensils },
            { id: 'workouts', label: 'Workouts', icon: Dumbbell },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 transition-colors ${
                  currentView === tab.id
                    ? 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Loading activity...</p>
              </div>
            </div>
          ) : activityData ? (
            <div className="space-y-4">
              {currentView === 'overview' && (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Utensils className="text-green-600 dark:text-green-400" size={16} />
                        <h4 className="font-medium text-green-900 dark:text-green-100 text-sm">Nutrition</h4>
                      </div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
                        {activityData.totalCalories}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">calories consumed</div>
                      <div className="grid grid-cols-3 gap-1 mt-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-green-900 dark:text-green-100">{activityData.totalProtein}g</div>
                          <div className="text-green-600 dark:text-green-400">Protein</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-900 dark:text-green-100">{activityData.totalCarbs}g</div>
                          <div className="text-green-600 dark:text-green-400">Carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-900 dark:text-green-100">{activityData.totalFat}g</div>
                          <div className="text-green-600 dark:text-green-400">Fat</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Dumbbell className="text-blue-600 dark:text-blue-400" size={16} />
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm">Workouts</h4>
                      </div>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                        {activityData.totalWorkoutTime}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">minutes trained</div>
                      <div className="flex justify-between mt-2 text-xs">
                        <div>
                          <div className="font-semibold text-blue-900 dark:text-blue-100">{activityData.totalCaloriesBurned}</div>
                          <div className="text-blue-600 dark:text-blue-400">calories burned</div>
                        </div>
                        <div>
                          <div className="font-semibold text-blue-900 dark:text-blue-100">{activityData.workouts.length}</div>
                          <div className="text-blue-600 dark:text-blue-400">workouts</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activities */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Recent Activities</h4>
                    
                    {/* Latest Meals */}
                    {activityData.meals.slice(0, 2).map((meal) => (
                      <div key={meal.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-lg">{getMealTypeEmoji(meal.mealType)}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white text-sm">{meal.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {meal.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
                            {meal.calories} cal • {meal.protein}g protein
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Latest Workouts */}
                    {activityData.workouts.slice(0, 1).map((workout) => (
                      <div key={workout.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <Dumbbell className="text-blue-600 dark:text-blue-400" size={16} />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white text-sm">{workout.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {workout.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
                              {workout.duration}min • {workout.calories} cal burned
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWorkoutCategoryColor(workout.category)}`}>
                            {workout.category}
                          </span>
                        </div>
                      </div>
                    ))}

                    {activityData.meals.length === 0 && activityData.workouts.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No activities logged today
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {currentView === 'meals' && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Today's Meals ({activityData.meals.length})
                  </h4>
                  
                  {activityData.meals.length === 0 ? (
                    <div className="text-center py-8">
                      <Utensils className="mx-auto mb-3 text-gray-400" size={32} />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No meals logged today</p>
                    </div>
                  ) : (
                    activityData.meals.map((meal) => (
                      <div key={meal.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{getMealTypeEmoji(meal.mealType)}</span>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{meal.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {meal.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            meal.mealType === 'breakfast' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' :
                            meal.mealType === 'lunch' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
                            meal.mealType === 'dinner' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                            'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                          }`}>
                            {meal.mealType}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-3 text-center">
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
                            <div className="font-bold text-purple-700 dark:text-purple-300">{meal.calories}</div>
                            <div className="text-xs text-purple-600 dark:text-purple-400">cal</div>
                          </div>
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                            <div className="font-bold text-red-700 dark:text-red-300">{meal.protein}g</div>
                            <div className="text-xs text-red-600 dark:text-red-400">protein</div>
                          </div>
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2">
                            <div className="font-bold text-yellow-700 dark:text-yellow-300">{meal.carbs}g</div>
                            <div className="text-xs text-yellow-600 dark:text-yellow-400">carbs</div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                            <div className="font-bold text-blue-700 dark:text-blue-300">{meal.fat}g</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400">fat</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {currentView === 'workouts' && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Today's Workouts ({activityData.workouts.length})
                  </h4>
                  
                  {activityData.workouts.length === 0 ? (
                    <div className="text-center py-8">
                      <Dumbbell className="mx-auto mb-3 text-gray-400" size={32} />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No workouts logged today</p>
                    </div>
                  ) : (
                    activityData.workouts.map((workout) => (
                      <div key={workout.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Dumbbell className="text-blue-600 dark:text-blue-400" size={20} />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{workout.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {workout.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getWorkoutCategoryColor(workout.category)}`}>
                            {workout.category}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">{workout.duration} minutes</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Flame size={14} className="text-orange-500" />
                            <span className="text-gray-600 dark:text-gray-400">{workout.calories} calories</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Exercises:</div>
                          <div className="flex flex-wrap gap-1">
                            {workout.exercises.map((exercise, index) => (
                              <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                {exercise}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Failed to load activity data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}