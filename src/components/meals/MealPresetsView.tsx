import React, { useState } from 'react';
import { ArrowLeft, Search, Clock, Utensils, Trash2, Play, X } from 'lucide-react';
import { MealPreset } from '../../types';

interface MealPresetsViewProps {
  presets: MealPreset[];
  selectedDate: Date;
  onAddMealFromPreset: (preset: MealPreset, selectedDate: Date) => void;
  onDeletePreset: (presetId: string) => void;
  onBack: () => void;
}

const mealTypeLabels = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

const mealTypeColors = {
  breakfast: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  lunch: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  dinner: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  snack: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
};

const mealTypeEmojis = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export function MealPresetsView({ 
  presets, 
  selectedDate, 
  onAddMealFromPreset, 
  onDeletePreset, 
  onBack 
}: MealPresetsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');

  // Filter presets based on search query and meal type
  const filteredPresets = presets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMealType = selectedMealType === 'all' || preset.mealType === selectedMealType;
    return matchesSearch && matchesMealType;
  });

  // Group presets by meal type
  const groupedPresets = filteredPresets.reduce((acc, preset) => {
    const type = preset.mealType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(preset);
    return acc;
  }, {} as Record<string, MealPreset[]>);

  // Sort presets by usage count (most used first)
  Object.keys(groupedPresets).forEach(type => {
    groupedPresets[type].sort((a, b) => b.usageCount - a.usageCount);
  });

  const handleDeletePreset = (presetId: string) => {
    if (confirm('Are you sure you want to delete this meal preset?')) {
      onDeletePreset(presetId);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
        >
          <ArrowLeft size={20} />
          <span>Back to Meals</span>
        </button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {presets.length} preset{presets.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your meal presets..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Meal Type Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedMealType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedMealType === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All Meals
          </button>
          {Object.entries(mealTypeLabels).map(([type, label]) => (
            <button
              key={type}
              onClick={() => setSelectedMealType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center space-x-2 ${
                selectedMealType === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{mealTypeEmojis[type as keyof typeof mealTypeEmojis]}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Presets List */}
      {filteredPresets.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
            <Utensils className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No matching presets found' : 'No Meal Presets Yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {searchQuery 
                ? `Try searching for "${searchQuery}" with different terms`
                : 'Start logging meals to automatically create presets for quick reuse!'
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPresets).map(([mealType, typePresets]) => (
            <div key={mealType} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Meal Type Header */}
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{mealTypeEmojis[mealType as keyof typeof mealTypeEmojis]}</span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {mealTypeLabels[mealType as keyof typeof mealTypeLabels]}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                    {typePresets.length} preset{typePresets.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Presets Grid */}
              <div className="p-4 space-y-3">
                {typePresets.map((preset) => (
                  <div key={preset.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {preset.name}
                          </h4>
                          {preset.usageCount > 1 && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                              Used {preset.usageCount}x
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-purple-600 dark:text-purple-400">
                            {preset.calories} cal
                          </span>
                          <span>{preset.protein}g protein</span>
                          <span>{preset.carbs}g carbs</span>
                          <span>{preset.fat}g fat</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onAddMealFromPreset(preset, selectedDate)}
                          className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                          title="Add this meal"
                        >
                          <Play size={16} className="text-green-600 dark:text-green-400" />
                        </button>
                        
                        <button
                          onClick={() => handleDeletePreset(preset.id)}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                          title="Delete preset"
                        >
                          <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>

                    {/* Preset Image */}
                    {preset.image && (
                      <div className="mb-3">
                        <img
                          src={preset.image}
                          alt={preset.name}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Macro Breakdown */}
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="font-bold text-purple-700 dark:text-purple-300">{preset.calories}</div>
                        <div className="text-purple-600 dark:text-purple-400">cal</div>
                      </div>
                      <div className="text-center py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="font-bold text-red-700 dark:text-red-300">{preset.protein}g</div>
                        <div className="text-red-600 dark:text-red-400">protein</div>
                      </div>
                      <div className="text-center py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="font-bold text-yellow-700 dark:text-yellow-300">{preset.carbs}g</div>
                        <div className="text-yellow-600 dark:text-yellow-400">carbs</div>
                      </div>
                      <div className="text-center py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="font-bold text-blue-700 dark:text-blue-300">{preset.fat}g</div>
                        <div className="text-blue-600 dark:text-blue-400">fat</div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Added {preset.createdAt.toLocaleDateString()}</span>
                      <span className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        Last used recently
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}