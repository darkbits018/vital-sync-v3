import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Target, Calendar, Star, Award, Lock, Globe, EyeOff, Share2, Download, Medal, Dumbbell, Zap, Flame, Clock } from 'lucide-react';
import { User, Workout } from '../../types';
import { useWorkoutStreak } from '../../hooks/useWorkoutStreak';

interface AchievementsViewProps {
  user: User;
  workouts: Workout[];
  onUpdateUser: (updatedUser: User) => void;
  onBack: () => void;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  icon?: React.ReactNode;
  category: 'streak' | 'workout' | 'consistency' | 'milestone' | 'nutrition';
  unlocked: boolean;
  unlockedDate?: Date;
  progress?: number;
  target?: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export function AchievementsView({ user, workouts, onUpdateUser, onBack }: AchievementsViewProps) {
  const streakData = useWorkoutStreak(workouts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showShareModal, setShowShareModal] = useState(false);

  // Calculate workout-based achievements
  const totalWorkouts = workouts.length;
  const totalWorkoutTime = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCaloriesBurned = workouts.reduce((sum, workout) => sum + workout.calories, 0);
  
  // Get unique workout dates for consistency tracking
  const workoutDates = Array.from(new Set(workouts.map(w => w.date.toDateString())));
  const thisWeekWorkouts = workouts.filter(w => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return w.date >= weekAgo;
  }).length;

  // Define all available achievements
  const allAchievements: Achievement[] = [
    // Streak achievements (from useWorkoutStreak)
    ...streakData.milestoneBadges.map(badge => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      emoji: badge.emoji,
      icon: <Flame size={18} className="text-orange-500" />,
      category: 'streak' as const,
      unlocked: badge.unlocked,
      unlockedDate: badge.unlockedDate,
      progress: Math.min(streakData.currentStreak, badge.threshold),
      target: badge.threshold,
      rarity: badge.threshold <= 14 ? 'common' : 
              badge.threshold <= 60 ? 'uncommon' : 
              badge.threshold <= 180 ? 'rare' : 'legendary',
    })),
    
    // Workout count achievements
    {
      id: 'first-workout',
      name: 'First Steps',
      description: 'Complete your first workout',
      emoji: '🎯',
      icon: <Target size={18} className="text-blue-500" />,
      category: 'milestone',
      unlocked: totalWorkouts >= 1,
      progress: Math.min(totalWorkouts, 1),
      target: 1,
      rarity: 'common',
    },
    {
      id: 'workout-10',
      name: 'Getting Started',
      description: 'Complete 10 workouts',
      emoji: '💪',
      icon: <Dumbbell size={18} className="text-blue-500" />,
      category: 'milestone',
      unlocked: totalWorkouts >= 10,
      progress: Math.min(totalWorkouts, 10),
      target: 10,
      rarity: 'common',
    },
    {
      id: 'workout-50',
      name: 'Fitness Enthusiast',
      description: 'Complete 50 workouts',
      emoji: '🏃',
      icon: <Dumbbell size={18} className="text-green-500" />,
      category: 'milestone',
      unlocked: totalWorkouts >= 50,
      progress: Math.min(totalWorkouts, 50),
      target: 50,
      rarity: 'uncommon',
    },
    {
      id: 'workout-100',
      name: 'Century Club',
      description: 'Complete 100 workouts',
      emoji: '🏆',
      icon: <Trophy size={18} className="text-yellow-500" />,
      category: 'milestone',
      unlocked: totalWorkouts >= 100,
      progress: Math.min(totalWorkouts, 100),
      target: 100,
      rarity: 'rare',
    },
    {
      id: 'workout-365',
      name: 'Year of Fitness',
      description: 'Complete 365 workouts',
      emoji: '🌟',
      icon: <Award size={18} className="text-purple-500" />,
      category: 'milestone',
      unlocked: totalWorkouts >= 365,
      progress: Math.min(totalWorkouts, 365),
      target: 365,
      rarity: 'legendary',
    },
    
    // Time-based achievements
    {
      id: 'time-10h',
      name: 'Time Keeper',
      description: 'Accumulate 10 hours of workout time',
      emoji: '⏰',
      icon: <Clock size={18} className="text-blue-500" />,
      category: 'workout',
      unlocked: totalWorkoutTime >= 600,
      progress: Math.min(totalWorkoutTime, 600),
      target: 600,
      rarity: 'common',
    },
    {
      id: 'time-50h',
      name: 'Time Master',
      description: 'Accumulate 50 hours of workout time',
      emoji: '⌚',
      icon: <Clock size={18} className="text-green-500" />,
      category: 'workout',
      unlocked: totalWorkoutTime >= 3000,
      progress: Math.min(totalWorkoutTime, 3000),
      target: 3000,
      rarity: 'uncommon',
    },
    {
      id: 'time-100h',
      name: 'Century Timer',
      description: 'Accumulate 100 hours of workout time',
      emoji: '🕰️',
      icon: <Clock size={18} className="text-yellow-500" />,
      category: 'workout',
      unlocked: totalWorkoutTime >= 6000,
      progress: Math.min(totalWorkoutTime, 6000),
      target: 6000,
      rarity: 'rare',
    },
    
    // Calorie achievements
    {
      id: 'calories-5k',
      name: 'Calorie Crusher',
      description: 'Burn 5,000 calories through workouts',
      emoji: '🔥',
      icon: <Flame size={18} className="text-orange-500" />,
      category: 'workout',
      unlocked: totalCaloriesBurned >= 5000,
      progress: Math.min(totalCaloriesBurned, 5000),
      target: 5000,
      rarity: 'common',
    },
    {
      id: 'calories-25k',
      name: 'Inferno',
      description: 'Burn 25,000 calories through workouts',
      emoji: '🌋',
      icon: <Flame size={18} className="text-red-500" />,
      category: 'workout',
      unlocked: totalCaloriesBurned >= 25000,
      progress: Math.min(totalCaloriesBurned, 25000),
      target: 25000,
      rarity: 'uncommon',
    },
    {
      id: 'calories-100k',
      name: 'Supernova',
      description: 'Burn 100,000 calories through workouts',
      emoji: '💫',
      icon: <Zap size={18} className="text-yellow-500" />,
      category: 'workout',
      unlocked: totalCaloriesBurned >= 100000,
      progress: Math.min(totalCaloriesBurned, 100000),
      target: 100000,
      rarity: 'rare',
    },
    
    // Consistency achievements
    {
      id: 'weekly-warrior',
      name: 'Weekly Warrior',
      description: 'Complete 3 workouts in a week',
      emoji: '📅',
      icon: <Calendar size={18} className="text-blue-500" />,
      category: 'consistency',
      unlocked: thisWeekWorkouts >= 3,
      progress: Math.min(thisWeekWorkouts, 3),
      target: 3,
      rarity: 'common',
    },
    {
      id: 'dedication',
      name: 'Dedication',
      description: 'Work out on the same day for 4 consecutive weeks',
      emoji: '🗓️',
      icon: <Calendar size={18} className="text-green-500" />,
      category: 'consistency',
      unlocked: false, // Would need more complex logic to track this
      progress: 0,
      target: 4,
      rarity: 'uncommon',
    },
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Complete 5 workouts before 8 AM',
      emoji: '🌅',
      icon: <Clock size={18} className="text-orange-500" />,
      category: 'consistency',
      unlocked: workouts.filter(w => {
        const workoutHour = new Date(w.date).getHours();
        return workoutHour < 8;
      }).length >= 5,
      progress: Math.min(workouts.filter(w => {
        const workoutHour = new Date(w.date).getHours();
        return workoutHour < 8;
      }).length, 5),
      target: 5,
      rarity: 'uncommon',
    },
    
    // Nutrition achievements (placeholders - would need meal data)
    {
      id: 'protein-perfect',
      name: 'Protein Perfect',
      description: 'Hit your protein goal for 7 consecutive days',
      emoji: '🥩',
      icon: <Award size={18} className="text-red-500" />,
      category: 'nutrition',
      unlocked: false, // Would need meal tracking data
      progress: 0,
      target: 7,
      rarity: 'uncommon',
    },
    {
      id: 'hydration-hero',
      name: 'Hydration Hero',
      description: 'Log 2+ liters of water daily for 5 days',
      emoji: '💧',
      icon: <Award size={18} className="text-blue-500" />,
      category: 'nutrition',
      unlocked: false, // Would need water tracking data
      progress: 0,
      target: 5,
      rarity: 'common',
    },
  ];

  // Filter achievements based on selected category
  const filteredAchievements = selectedCategory === 'all' 
    ? allAchievements 
    : allAchievements.filter(a => a.category === selectedCategory);

  // Count unlocked achievements
  const unlockedCount = allAchievements.filter(a => a.unlocked).length;
  const totalCount = allAchievements.length;
  const unlockedPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Group achievements by category for stats
  const achievementsByCategory = allAchievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = { total: 0, unlocked: 0 };
    }
    acc[achievement.category].total++;
    if (achievement.unlocked) {
      acc[achievement.category].unlocked++;
    }
    return acc;
  }, {} as Record<string, { total: number; unlocked: number }>);

  // Get rarity counts
  const rarityCount = allAchievements.reduce((acc, achievement) => {
    if (!acc[achievement.rarity || 'common']) {
      acc[achievement.rarity || 'common'] = { total: 0, unlocked: 0 };
    }
    acc[achievement.rarity || 'common'].total++;
    if (achievement.unlocked) {
      acc[achievement.rarity || 'common'].unlocked++;
    }
    return acc;
  }, {} as Record<string, { total: number; unlocked: number }>);

  // Toggle achievements visibility
  const toggleAchievementsVisibility = () => {
    onUpdateUser({
      ...user,
      isAchievementsPublic: !user.isAchievementsPublic
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 dark:text-gray-400';
      case 'uncommon': return 'text-green-600 dark:text-green-400';
      case 'rare': return 'text-blue-600 dark:text-blue-400';
      case 'epic': return 'text-purple-600 dark:text-purple-400';
      case 'legendary': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRarityBgColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 dark:bg-gray-700';
      case 'uncommon': return 'bg-green-100 dark:bg-green-900/20';
      case 'rare': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'epic': return 'bg-purple-100 dark:bg-purple-900/20';
      case 'legendary': return 'bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'streak': return <Flame size={20} className="text-orange-500" />;
      case 'workout': return <Dumbbell size={20} className="text-blue-500" />;
      case 'consistency': return <Calendar size={20} className="text-green-500" />;
      case 'milestone': return <Trophy size={20} className="text-yellow-500" />;
      case 'nutrition': return <Award size={20} className="text-purple-500" />;
      default: return <Star size={20} className="text-gray-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'streak': return 'Streaks';
      case 'workout': return 'Workouts';
      case 'consistency': return 'Consistency';
      case 'milestone': return 'Milestones';
      case 'nutrition': return 'Nutrition';
      default: return category;
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
            title="Share Achievements"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Trophy size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Achievement Progress</h2>
            <p className="text-purple-200 text-sm">
              {unlockedCount} of {totalCount} achievements unlocked
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>{unlockedPercentage}% Complete</span>
            <span>{unlockedCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div 
              className="bg-white h-2.5 rounded-full"
              style={{ width: `${unlockedPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Privacy Toggle */}
        <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
          <div className="flex items-center space-x-2">
            {user.isAchievementsPublic ? (
              <Globe size={18} className="text-white" />
            ) : (
              <EyeOff size={18} className="text-white" />
            )}
            <span className="text-sm">
              {user.isAchievementsPublic ? 'Public' : 'Private'} achievements
            </span>
          </div>
          <button
            onClick={toggleAchievementsVisibility}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              user.isAchievementsPublic 
                ? 'bg-green-500 text-white' 
                : 'bg-white/20 text-white'
            }`}
          >
            {user.isAchievementsPublic ? 'Public' : 'Private'}
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="overflow-x-auto">
        <div className="flex space-x-2 py-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          
          {Object.keys(achievementsByCategory).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {getCategoryIcon(category)}
              <span>{getCategoryLabel(category)}</span>
              <span className="bg-white/20 text-xs rounded-full px-2 py-0.5">
                {achievementsByCategory[category].unlocked}/{achievementsByCategory[category].total}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-4">
        {filteredAchievements.map(achievement => (
          <div 
            key={achievement.id}
            className={`p-4 rounded-xl transition-all duration-200 ${
              achievement.unlocked
                ? 'bg-white dark:bg-gray-800'
                : 'bg-gray-100 dark:bg-gray-700 opacity-70'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 ${getRarityBgColor(achievement.rarity || 'common')} rounded-xl flex items-center justify-center flex-shrink-0`}>
                {achievement.unlocked ? (
                  <span className="text-2xl">{achievement.emoji}</span>
                ) : (
                  <Lock size={20} className="text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {achievement.name}
                  </h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRarityBgColor(achievement.rarity || 'common')} ${getRarityColor(achievement.rarity || 'common')}`}>
                    {achievement.rarity || 'common'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {achievement.description}
                </p>
                
                {achievement.target && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progress: {achievement.progress || 0}/{achievement.target}</span>
                      <span>{Math.round(((achievement.progress || 0) / achievement.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          achievement.unlocked 
                            ? 'bg-green-500 dark:bg-green-400' 
                            : 'bg-purple-500 dark:bg-purple-400'
                        }`}
                        style={{ width: `${Math.min(((achievement.progress || 0) / achievement.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {achievement.unlocked && achievement.unlockedDate && (
                  <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar size={12} />
                    <span>Unlocked on {achievement.unlockedDate.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Share Your Achievements
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                  <div className="text-center mb-4">
                    <Trophy size={40} className="mx-auto mb-2" />
                    <h4 className="font-bold text-lg">{user.name}'s Achievements</h4>
                    <p className="text-purple-200">
                      {unlockedCount} of {totalCount} achievements unlocked!
                    </p>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span>{unlockedPercentage}% Complete</span>
                    <span>{unlockedCount}/{totalCount}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-white h-2.5 rounded-full"
                      style={{ width: `${unlockedPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-center space-x-2">
                    {allAchievements
                      .filter(a => a.unlocked)
                      .slice(0, 3)
                      .map(achievement => (
                        <div key={achievement.id} className="text-2xl">
                          {achievement.emoji}
                        </div>
                      ))}
                    {unlockedCount > 3 && (
                      <div className="text-sm bg-white/20 rounded-full px-2 flex items-center">
                        +{unlockedCount - 3} more
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors">
                    <Share2 size={18} />
                    <span className="font-medium">Share</span>
                  </button>
                  
                  <button className="flex items-center justify-center space-x-2 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors">
                    <Download size={18} />
                    <span className="font-medium">Download</span>
                  </button>
                </div>
                
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {user.isAchievementsPublic ? (
                    <p>Your achievements are public and can be viewed by friends</p>
                  ) : (
                    <p>Your achievements are private. Make them public to share with friends.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}