import React from 'react';
import { MealSummary } from '../../types/chat';

interface SharedMealCardProps {
  mealSummary: MealSummary;
}

const mealTypeEmojis = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export function SharedMealCard({ mealSummary }: SharedMealCardProps) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xl">{mealTypeEmojis[mealSummary.mealType]}</span>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{mealSummary.name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {mealSummary.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {mealSummary.mealType}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2">
          <div className="font-bold text-purple-600 dark:text-purple-400">{mealSummary.calories}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">calories</div>
        </div>
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2">
          <div className="font-bold text-red-600 dark:text-red-400">{mealSummary.protein}g</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">protein</div>
        </div>
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2">
          <div className="font-bold text-yellow-600 dark:text-yellow-400">{mealSummary.carbs}g</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">carbs</div>
        </div>
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2">
          <div className="font-bold text-blue-600 dark:text-blue-400">{mealSummary.fat}g</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">fat</div>
        </div>
      </div>
    </div>
  );
}