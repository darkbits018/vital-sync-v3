import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Workout } from '../types';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: Date | null;
  workoutDates: string[]; // Array of date strings (YYYY-MM-DD)
  milestoneBadges: MilestoneBadge[];
}

export interface MilestoneBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  threshold: number;
  unlocked: boolean;
  unlockedDate?: Date;
}

// Predefined milestone badges
const MILESTONE_BADGES: Omit<MilestoneBadge, 'unlocked' | 'unlockedDate'>[] = [
  { id: 'fire-7', name: 'Week Warrior', emoji: '🔥', description: '7-day workout streak', threshold: 7 },
  { id: 'lightning-14', name: 'Lightning Bolt', emoji: '⚡', description: '14-day workout streak', threshold: 14 },
  { id: 'star-30', name: 'Monthly Star', emoji: '⭐', description: '30-day workout streak', threshold: 30 },
  { id: 'diamond-60', name: 'Diamond Dedication', emoji: '💎', description: '60-day workout streak', threshold: 60 },
  { id: 'crown-90', name: 'Streak Crown', emoji: '👑', description: '90-day workout streak', threshold: 90 },
  { id: 'trophy-180', name: 'Legendary Trophy', emoji: '🏆', description: '180-day workout streak', threshold: 180 },
  { id: 'rocket-365', name: 'Year Rocket', emoji: '🚀', description: '365-day workout streak', threshold: 365 },
];

// Helper function to format date as YYYY-MM-DD
const formatDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper function to parse date string back to Date
const parseDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

// Helper function to check if two dates are consecutive days
const areConsecutiveDays = (date1: Date, date2: Date): boolean => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

// Helper function to calculate days between dates
const daysBetween = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Calculate current streak from workout dates
const calculateCurrentStreak = (workoutDates: string[]): number => {
  if (workoutDates.length === 0) return 0;

  const sortedDates = workoutDates
    .map(parseDate)
    .sort((a, b) => b.getTime() - a.getTime()); // Sort descending (newest first)

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if the most recent workout was today or yesterday
  const mostRecentWorkout = sortedDates[0];
  const daysSinceLastWorkout = daysBetween(mostRecentWorkout, today);
  
  if (daysSinceLastWorkout > 1) {
    return 0; // Streak is broken if more than 1 day has passed
  }

  let streak = 1;
  let currentDate = mostRecentWorkout;

  for (let i = 1; i < sortedDates.length; i++) {
    const previousDate = sortedDates[i];
    
    if (areConsecutiveDays(previousDate, currentDate)) {
      streak++;
      currentDate = previousDate;
    } else {
      break; // Streak is broken
    }
  }

  return streak;
};

// Calculate longest streak from workout dates
const calculateLongestStreak = (workoutDates: string[]): number => {
  if (workoutDates.length === 0) return 0;

  const sortedDates = workoutDates
    .map(parseDate)
    .sort((a, b) => a.getTime() - b.getTime()); // Sort ascending (oldest first)

  let longestStreak = 1;
  let currentStreak = 1;
  let previousDate = sortedDates[0];

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i];
    
    if (areConsecutiveDays(previousDate, currentDate)) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
    
    previousDate = currentDate;
  }

  return longestStreak;
};

// Update milestone badges based on current streak
const updateMilestoneBadges = (
  currentStreak: number, 
  longestStreak: number,
  existingBadges: MilestoneBadge[]
): MilestoneBadge[] => {
  return MILESTONE_BADGES.map(badge => {
    const existing = existingBadges.find(b => b.id === badge.id);
    const shouldUnlock = currentStreak >= badge.threshold || longestStreak >= badge.threshold;
    
    if (shouldUnlock && (!existing || !existing.unlocked)) {
      return {
        ...badge,
        unlocked: true,
        unlockedDate: new Date(),
      };
    }
    
    return existing || {
      ...badge,
      unlocked: false,
    };
  });
};

export function useWorkoutStreak(workouts: Workout[]) {
  // Date reviver function to convert date strings back to Date objects
  const streakDataReviver = (key: string, value: any) => {
    if (key === 'lastWorkoutDate' && typeof value === 'string') {
      return new Date(value);
    }
    if (key === 'unlockedDate' && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  };

  const [streakData, setStreakData] = useLocalStorage<StreakData>('workoutStreak', {
    currentStreak: 0,
    longestStreak: 0,
    lastWorkoutDate: null,
    workoutDates: [],
    milestoneBadges: MILESTONE_BADGES.map(badge => ({ ...badge, unlocked: false })),
  }, streakDataReviver);

  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<MilestoneBadge[]>([]);

  useEffect(() => {
    // Extract unique workout dates from workouts
    const workoutDates = Array.from(
      new Set(
        workouts.map(workout => formatDateString(workout.date))
      )
    ).sort();

    // Calculate streaks
    const currentStreak = calculateCurrentStreak(workoutDates);
    const longestStreak = Math.max(
      calculateLongestStreak(workoutDates),
      streakData.longestStreak
    );

    // Get the most recent workout date
    const lastWorkoutDate = workoutDates.length > 0 
      ? parseDate(workoutDates[workoutDates.length - 1])
      : null;

    // Update milestone badges and check for newly unlocked ones
    const updatedBadges = updateMilestoneBadges(currentStreak, longestStreak, streakData.milestoneBadges);
    
    // Find newly unlocked badges
    const newlyUnlocked = updatedBadges.filter(badge => 
      badge.unlocked && 
      !streakData.milestoneBadges.find(existing => existing.id === badge.id && existing.unlocked)
    );

    if (newlyUnlocked.length > 0) {
      setNewlyUnlockedBadges(newlyUnlocked);
      // Clear newly unlocked badges after 5 seconds
      setTimeout(() => setNewlyUnlockedBadges([]), 5000);
    }

    // Update streak data
    const newStreakData: StreakData = {
      currentStreak,
      longestStreak,
      lastWorkoutDate,
      workoutDates,
      milestoneBadges: updatedBadges,
    };

    setStreakData(newStreakData);
  }, [workouts, setStreakData]);

  const getStreakMessage = (): string => {
    if (streakData.currentStreak === 0) {
      return "Start your streak today! 💪";
    } else if (streakData.currentStreak === 1) {
      return "Great start! Keep it going! 🔥";
    } else if (streakData.currentStreak < 7) {
      return `${streakData.currentStreak} days strong! 💪`;
    } else if (streakData.currentStreak < 30) {
      return `${streakData.currentStreak} days on fire! 🔥`;
    } else {
      return `${streakData.currentStreak} days legendary! 🏆`;
    }
  };

  const getNextMilestone = (): MilestoneBadge | null => {
    const unlockedBadges = streakData.milestoneBadges.filter(badge => badge.unlocked);
    const nextBadge = MILESTONE_BADGES.find(badge => 
      !unlockedBadges.some(unlocked => unlocked.id === badge.id)
    );
    return nextBadge ? { ...nextBadge, unlocked: false } : null;
  };

  const getDaysUntilNextMilestone = (): number => {
    const nextMilestone = getNextMilestone();
    return nextMilestone ? nextMilestone.threshold - streakData.currentStreak : 0;
  };

  return {
    ...streakData,
    newlyUnlockedBadges,
    getStreakMessage,
    getNextMilestone,
    getDaysUntilNextMilestone,
    clearNewlyUnlockedBadges: () => setNewlyUnlockedBadges([]),
  };
}