import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Trash2, ChevronDown, Check } from 'lucide-react';
import { Meal } from '../../types';

interface MealEditModalProps {
  meal: Meal;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMeal: Meal) => void;
  onDelete?: (mealId: string) => void;
}

const mealTypeOptions = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅', color: 'from-yellow-400 to-orange-400', description: 'Start your day right' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️', color: 'from-green-400 to-emerald-400', description: 'Midday fuel' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙', color: 'from-blue-400 to-indigo-400', description: 'Evening nourishment' },
  { value: 'snack', label: 'Snack', emoji: '🍎', color: 'from-purple-400 to-pink-400', description: 'Quick bite' },
];

export function MealEditModal({ meal, isOpen, onClose, onSave, onDelete }: MealEditModalProps) {
  const [editedMeal, setEditedMeal] = useState<Meal>(meal);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    // Validate required fields
    if (!editedMeal.name.trim()) {
      alert('Meal name is required');
      return;
    }

    if (editedMeal.calories < 0 || editedMeal.protein < 0 || editedMeal.carbs < 0 || editedMeal.fat < 0) {
      alert('Macro values cannot be negative');
      return;
    }

    onSave(editedMeal);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this meal?')) {
      onDelete(meal.id);
      onClose();
    }
  };

  const updateMacro = (field: keyof Meal, value: string) => {
    const numValue = parseFloat(value) || 0;
    setEditedMeal(prev => ({ ...prev, [field]: numValue }));
  };

  const handleMealTypeSelect = (mealType: Meal['mealType']) => {
    setEditedMeal(prev => ({ ...prev, mealType }));
    setIsDropdownOpen(false);
  };

  const selectedMealType = mealTypeOptions.find(option => option.value === editedMeal.mealType);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Edit Meal</h3>
              <p className="text-purple-200 text-sm">Update your meal information</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Meal Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meal Name
            </label>
            <input
              type="text"
              value={editedMeal.name}
              onChange={(e) => setEditedMeal(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              placeholder="Enter meal name"
            />
          </div>

          {/* Modern Meal Type Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meal Type
            </label>
            
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:shadow-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${selectedMealType?.color} flex items-center justify-center`}>
                    <span className="text-white text-sm">{selectedMealType?.emoji}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{selectedMealType?.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{selectedMealType?.description}</div>
                  </div>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {/* Enhanced Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                {mealTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleMealTypeSelect(option.value as Meal['mealType'])}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150 ${
                      editedMeal.mealType === option.value ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center`}>
                          <span className="text-white text-sm">{option.emoji}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                        </div>
                      </div>
                      {editedMeal.mealType === option.value && (
                        <Check size={16} className="text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Macros Grid */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Nutrition Information</h4>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Calories */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Calories
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={editedMeal.calories}
                  onChange={(e) => updateMacro('calories', e.target.value)}
                  className="w-full px-3 py-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-900 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
              </div>

              {/* Protein */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Protein (g)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={editedMeal.protein}
                  onChange={(e) => updateMacro('protein', e.target.value)}
                  className="w-full px-3 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-900 dark:text-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                />
              </div>

              {/* Carbs */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={editedMeal.carbs}
                  onChange={(e) => updateMacro('carbs', e.target.value)}
                  className="w-full px-3 py-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                />
              </div>

              {/* Fat */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Fat (g)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={editedMeal.fat}
                  onChange={(e) => updateMacro('fat', e.target.value)}
                  className="w-full px-3 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {/* Fiber */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Fiber (g)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={editedMeal.fiber || 0}
                  onChange={(e) => updateMacro('fiber', e.target.value)}
                  className="w-full px-3 py-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-900 dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
              </div>

              {/* Sugar */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Sugar (g)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={editedMeal.sugar || 0}
                  onChange={(e) => updateMacro('sugar', e.target.value)}
                  className="w-full px-3 py-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-900 dark:text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modern Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 rounded-b-3xl">
          <div className="flex space-x-3">
            {onDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors font-medium"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            )}
            
            <div className="flex-1" />
            
            <button
              onClick={onClose}
              className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}