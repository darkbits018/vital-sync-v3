import React, { useState } from 'react';
import { Flame, Trophy, Target, Calendar, Star, ChevronRight, X } from 'lucide-react';
import { StreakData, MilestoneBadge } from '../../hooks/useWorkoutStreak';
import { DateSelector } from '../common/DateSelector';

interface GymStreakDisplayProps {
  streakData: StreakData;
  newlyUnlockedBadges: MilestoneBadge[];
  getStreakMessage: () => string;
  getNextMilestone: () => MilestoneBadge | null;
  getDaysUntilNextMilestone: () => number;
  onClearNewlyUnlocked: () => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function GymStreakDisplay({ 
  streakData, 
  newlyUnlockedBadges,
  getStreakMessage,
  getNextMilestone,
  getDaysUntilNextMilestone,
  onClearNewlyUnlocked,
  selectedDate,
  onDateChange
}: GymStreakDisplayProps) {
  const [showAllBadges, setShowAllBadges] = useState(false);
  
  const nextMilestone = getNextMilestone();
  const daysUntilNext = getDaysUntilNextMilestone();
  const unlockedBadges = streakData.milestoneBadges.filter(badge => badge.unlocked);
  const recentBadges = unlockedBadges.slice(-3); // Show last 3 unlocked badges

  const getStreakColor = (streak: number) => {
    if (streak === 0) return 'text-gray-500 dark:text-gray-400';
    if (streak < 7) return 'text-orange-600 dark:text-orange-400';
    if (streak < 30) return 'text-red-600 dark:text-red-400';
    return 'text-purple-600 dark:text-purple-400';
  };

  const getStreakBgColor = (streak: number) => {
    if (streak === 0) return 'bg-gray-50 dark:bg-gray-800';
    if (streak < 7) return 'bg-orange-50 dark:bg-orange-900/20';
    if (streak < 30) return 'bg-red-50 dark:bg-red-900/20';
    return 'bg-purple-50 dark:bg-purple-900/20';
  };

  const getStreakIcon = (streak: number) => {
    if (streak === 0) return <Target size={24} className="text-gray-500 dark:text-gray-400" />;
    if (streak < 7) return <Flame size={24} className="text-orange-600 dark:text-orange-400" />;
    if (streak < 30) return <Flame size={24} className="text-red-600 dark:text-red-400" />;
    return <Trophy size={24} className="text-purple-600 dark:text-purple-400" />;
  };

  return (
    <>
      {/* Newly Unlocked Badge Notification */}
      {newlyUnlockedBadges.length > 0 && (
        <div className="fixed top-20 left-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white shadow-2xl border border-white/20 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Trophy size={16} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Star size={16} className="text-yellow-200" />
                  <h3 className="font-semibold text-sm">New Badge Unlocked!</h3>
                </div>
                
                <div className="space-y-1">
                  {newlyUnlockedBadges.map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-2">
                      <span className="text-2xl">{badge.emoji}</span>
                      <div>
                        <div className="font-medium text-sm">{badge.name}</div>
                        <div className="text-yellow-200 text-xs">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={onClearNewlyUnlocked}
                className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Streak Display */}
      <div className={`rounded-2xl p-4 transition-all duration-300 ${getStreakBgColor(streakData.currentStreak)}`}>
        {/* Date Selector at the top */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Workouts for</span>
          </div>
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={onDateChange}
          />
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {React.cloneElement(getStreakIcon(streakData.currentStreak), { size: 20 })}
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Workout Streak</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{getStreakMessage()}</p>
            </div>
          </div>
          
          {recentBadges.length > 0 && (
            <button
              onClick={() => setShowAllBadges(true)}
              className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <div className="flex -space-x-1">
                {recentBadges.map((badge, index) => (
                  <span key={badge.id} className="text-base" style={{ zIndex: recentBadges.length - index }}>
                    {badge.emoji}
                  </span>
                ))}
              </div>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getStreakColor(streakData.currentStreak)}`}>
              {streakData.currentStreak}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Current Streak</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {streakData.longestStreak}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Longest Streak</div>
          </div>
        </div>

        {/* Next Milestone Progress */}
        {nextMilestone && (
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1">
                <span className="text-base">{nextMilestone.emoji}</span>
                <span className="font-medium text-gray-900 dark:text-white text-xs">
                  {nextMilestone.name}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {daysUntilNext} days to go
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min((streakData.currentStreak / nextMilestone.threshold) * 100, 100)}%` 
                }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{streakData.currentStreak} days</span>
              <span>{nextMilestone.threshold} days</span>
            </div>
          </div>
        )}

        {/* Last Workout Info */}
        {streakData.lastWorkoutDate && (
          <div className="flex items-center space-x-2 mt-3 text-xs text-gray-600 dark:text-gray-400">
            <Calendar size={14} />
            <span>
              Last workout: {streakData.lastWorkoutDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        )}
      </div>

      {/* All Badges Modal */}
      {showAllBadges && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Trophy className="mr-2 text-yellow-600 dark:text-yellow-400" size={20} />
                Streak Badges
              </h3>
              <button
                onClick={() => setShowAllBadges(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-3">
                {streakData.milestoneBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      badge.unlocked
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 shadow-md'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-60'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-3xl mb-2 ${badge.unlocked ? '' : 'grayscale'}`}>
                        {badge.emoji}
                      </div>
                      <div className={`font-medium text-sm mb-1 ${
                        badge.unlocked 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {badge.name}
                      </div>
                      <div className={`text-xs ${
                        badge.unlocked 
                          ? 'text-gray-600 dark:text-gray-300' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {badge.description}
                      </div>
                      {badge.unlocked && badge.unlockedDate && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                          Unlocked {badge.unlockedDate.toLocaleDateString()}
                        </div>
                      )}
                      {!badge.unlocked && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {badge.threshold} day streak needed
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  🎯 Keep Going!
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Consistency is key to building lasting fitness habits. Every workout counts towards your next milestone!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}