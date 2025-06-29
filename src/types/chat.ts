import { Meal, Workout } from './index';

export interface MealSummary {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface WorkoutSummary {
  id: string;
  name: string;
  duration: number;
  calories: number;
  exercises: string[];
  date: Date;
}

export interface GroupChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'shared_meal' | 'shared_workout';
  data?: MealSummary | WorkoutSummary;
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  lastActivity?: Date;
  memberCount: number;
  isAdmin: boolean;
  avatar?: string;
}

export function createMealSummary(meal: Meal): MealSummary {
  return {
    id: meal.id,
    name: meal.name,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    date: meal.date,
    mealType: meal.mealType
  };
}

export function createWorkoutSummary(workout: Workout): WorkoutSummary {
  return {
    id: workout.id,
    name: workout.name,
    duration: workout.duration,
    calories: workout.calories,
    exercises: workout.exercises.map(ex => ex.name),
    date: workout.date
  };
}