import React from 'react';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';
import { MacroTargets } from '../../types';

interface MacroProgressProps {
  consumed: MacroTargets;
  targets: MacroTargets;
  className?: string;
}

interface MacroItemProps {
  label: string;
  consumed: number;
  target: number;
  unit: string;
  color: string;
  bgColor: string;
  progressColor: string;
  icon?: React.ReactNode;
}

function MacroItem({ label, consumed, target, unit, color, bgColor, progressColor, icon }: MacroItemProps) {
  const percentage = Math.min((consumed / target) * 100, 100);
  const remaining = Math.max(target - consumed, 0);
  const isOver = consumed > target;
  const isClose = percentage >= 80 && !isOver;

  return (
    <div className={`p-3 rounded-xl ${bgColor} border border-opacity-20`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <span className={`font-medium text-sm ${color}`}>{label}</span>
        </div>
        <div className="text-right">
          <div className={`font-bold text-sm ${color}`}>
            {consumed}<span className="text-xs opacity-75">/{target}{unit}</span>
          </div>
          {isOver ? (
            <div className="text-xs text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle size={10} className="mr-1" />
              +{consumed - target}{unit}
            </div>
          ) : (
            <div className={`text-xs ${color} opacity-75`}>
              {remaining}{unit} left
            </div>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-white/50 dark:bg-gray-700/50 rounded-full h-2 mb-1">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            isOver 
              ? 'bg-red-500 dark:bg-red-400' 
              : isClose 
                ? 'bg-yellow-500 dark:bg-yellow-400' 
                : progressColor
          }`}
          style={{ 
            width: `${Math.min(percentage, 100)}%`,
            opacity: isOver ? 0.8 : 1
          }}
        />
      </div>
      
      <div className={`text-xs ${color} opacity-75`}>
        {percentage.toFixed(0)}% of target
      </div>
    </div>
  );
}

export function MacroProgress({ consumed, targets, className = '' }: MacroProgressProps) {
  const macroItems = [
    {
      label: 'Calories',
      consumed: consumed.calories,
      target: targets.calories,
      unit: '',
      color: 'text-purple-700 dark:text-purple-300',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800',
      progressColor: 'bg-purple-600 dark:bg-purple-400',
      icon: <Target size={14} className="text-purple-600 dark:text-purple-400" />
    },
    {
      label: 'Protein',
      consumed: consumed.protein,
      target: targets.protein,
      unit: 'g',
      color: 'text-red-700 dark:text-red-300',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800',
      progressColor: 'bg-red-600 dark:bg-red-400',
      icon: <TrendingUp size={14} className="text-red-600 dark:text-red-400" />
    },
    {
      label: 'Carbs',
      consumed: consumed.carbs,
      target: targets.carbs,
      unit: 'g',
      color: 'text-yellow-700 dark:text-yellow-300',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800',
      progressColor: 'bg-yellow-600 dark:bg-yellow-400',
      icon: <Target size={14} className="text-yellow-600 dark:text-yellow-400" />
    },
    {
      label: 'Fat',
      consumed: consumed.fat,
      target: targets.fat,
      unit: 'g',
      color: 'text-blue-700 dark:text-blue-300',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800',
      progressColor: 'bg-blue-600 dark:bg-blue-400',
      icon: <Target size={14} className="text-blue-600 dark:text-blue-400" />
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          
        </h3>
      </div>
      
      {/* Compact grid for mobile - 2x2 layout */}
      <div className="grid grid-cols-2 gap-2">
        {macroItems.map((item) => (
          <MacroItem key={item.label} {...item} />
        ))}
      </div>

      {/* Additional Macros - Compact horizontal layout */}
      {(targets.fiber || targets.sugar) && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          {targets.fiber && (
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-center">
                <div className="text-xs font-medium text-green-700 dark:text-green-300">Fiber</div>
                <div className="text-sm font-bold text-green-800 dark:text-green-200">
                  {consumed.fiber || 0}<span className="text-xs text-green-700 dark:text-green-300">/{targets.fiber}g</span>
                </div>
                <div className="w-full bg-green-200/50 dark:bg-green-800/30 rounded-full h-1 mt-1">
                  <div
                    className="h-1 rounded-full bg-green-600 dark:bg-green-400 transition-all duration-300"
                    style={{ 
                      width: `${Math.min(((consumed.fiber || 0) / targets.fiber) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          
          {targets.sugar && (
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-center">
                <div className="text-xs font-medium text-orange-700 dark:text-orange-300">Sugar</div>
                <div className="text-sm font-bold text-orange-800 dark:text-orange-200">
                  {consumed.sugar || 0}<span className="text-xs text-orange-700 dark:text-orange-300">/{targets.sugar}g</span>
                </div>
                <div className="w-full bg-orange-200/50 dark:bg-orange-800/30 rounded-full h-1 mt-1">
                  <div
                    className="h-1 rounded-full bg-orange-600 dark:bg-orange-400 transition-all duration-300"
                    style={{ 
                      width: `${Math.min(((consumed.sugar || 0) / targets.sugar) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}