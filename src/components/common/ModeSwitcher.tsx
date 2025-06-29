import React from 'react';
import { Crown, User, Code, Zap } from 'lucide-react';
import { useUserMode } from '../../hooks/useUserMode';

export function ModeSwitcher() {
  const { userMode, toggleMode, isPremium } = useUserMode();
  
  // Only render in development
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-4 border-2 border-dashed border-amber-300 dark:border-amber-700">
      <div className="flex items-center space-x-2 mb-3">
        <Code className="text-amber-600 dark:text-amber-400" size={18} />
        <span className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
          Development Mode Switcher
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isPremium 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            {isPremium ? <Crown size={20} /> : <User size={20} />}
          </div>
          
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {isPremium ? 'Premium Mode' : 'Free Mode'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isPremium 
                ? 'All features unlocked' 
                : 'Limited features available'
              }
            </div>
          </div>
        </div>
        
        <button
          onClick={toggleMode}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isPremium
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
          }`}
        >
          <Zap size={16} />
          <span>
            {isPremium ? 'Switch to Free' : 'Switch to Premium'}
          </span>
        </button>
      </div>
      
      {/* Feature Preview */}
      <div className="mt-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Current Access Level:
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`flex items-center space-x-1 ${
            isPremium ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
          }`}>
            <span>{isPremium ? '✓' : '✗'}</span>
            <span>Advanced Analytics</span>
          </div>
          <div className={`flex items-center space-x-1 ${
            isPremium ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
          }`}>
            <span>{isPremium ? '✓' : '✗'}</span>
            <span>Custom Workouts</span>
          </div>
          <div className={`flex items-center space-x-1 ${
            isPremium ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
          }`}>
            <span>{isPremium ? '✓' : '✗'}</span>
            <span>Meal Planning</span>
          </div>
          <div className={`flex items-center space-x-1 ${
            isPremium ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
          }`}>
            <span>{isPremium ? '✓' : '✗'}</span>
            <span>Export Data</span>
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-amber-700 dark:text-amber-300 text-center">
        This switcher is only visible in development mode
      </div>
    </div>
  );
}