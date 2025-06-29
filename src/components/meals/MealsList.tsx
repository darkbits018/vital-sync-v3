import React, { useState, useRef } from 'react';
import { Utensils, Edit3, Camera, Trash2, Plus, BookOpen } from 'lucide-react';
import { Meal, MacroTargets, MealPreset } from '../../types';
import { DateSelector } from '../common/DateSelector';
import { MacroProgress } from './MacroProgress';
import { MealEditModal } from './MealEditModal';
import { MealEntryModal } from './MealEntryModal';
import { MealPresetsView } from './MealPresetsView';

interface MealsListProps {
  meals: Meal[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  macroTargets: MacroTargets;
  onUpdateMeal?: (updatedMeal: Meal) => void;
  onDeleteMeal?: (mealId: string) => void;
  onAddMeal?: (meal: Omit<Meal, 'id'>) => void;
  mealPresets: MealPreset[];
  onAddMealFromPreset: (preset: MealPreset, selectedDate: Date) => void;
  onDeleteMealPreset: (presetId: string) => void;
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

export function MealsList({ 
  meals, 
  selectedDate, 
  onDateChange, 
  macroTargets, 
  onUpdateMeal,
  onDeleteMeal,
  onAddMeal,
  mealPresets,
  onAddMealFromPreset,
  onDeleteMealPreset
}: MealsListProps) {
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showPresetsView, setShowPresetsView] = useState(false);
  const [uploadingMealId, setUploadingMealId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);
  const totalFiber = meals.reduce((sum, meal) => sum + (meal.fiber || 0), 0);
  const totalSugar = meals.reduce((sum, meal) => sum + (meal.sugar || 0), 0);

  const consumedMacros: MacroTargets = {
    calories: totalCalories,
    protein: totalProtein,
    carbs: totalCarbs,
    fat: totalFat,
    fiber: totalFiber,
    sugar: totalSugar,
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
  };

  const handleSaveMeal = (updatedMeal: Meal) => {
    if (onUpdateMeal) {
      onUpdateMeal(updatedMeal);
    }
    setEditingMeal(null);
  };

  const handleDeleteMeal = (mealId: string) => {
    if (onDeleteMeal) {
      onDeleteMeal(mealId);
    }
    setEditingMeal(null);
  };

  const handleAddMeal = (meal: Omit<Meal, 'id'>) => {
    if (onAddMeal) {
      onAddMeal(meal);
    }
  };

  const handleCameraClick = (mealId: string) => {
    setUploadingMealId(mealId);
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadingMealId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      const mealToUpdate = meals.find(meal => meal.id === uploadingMealId);
      
      if (mealToUpdate && onUpdateMeal) {
        const updatedMeal = { ...mealToUpdate, image: imageUrl };
        onUpdateMeal(updatedMeal);
      }
      
      setUploadingMealId(null);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (meal: Meal) => {
    if (onUpdateMeal) {
      const updatedMeal = { ...meal, image: undefined };
      onUpdateMeal(updatedMeal);
    }
  };

  if (showPresetsView) {
    return (
      <MealPresetsView
        presets={mealPresets}
        selectedDate={selectedDate}
        onAddMealFromPreset={onAddMealFromPreset}
        onDeletePreset={onDeleteMealPreset}
        onBack={() => setShowPresetsView(false)}
      />
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Compact Date Selector and Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Progress
          </h2>
          
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            label="Date"
          />
        </div>

        {/* Macro Progress - Optimized for mobile */}
        <MacroProgress 
          consumed={consumedMacros} 
          targets={macroTargets}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowPresetsView(true)}
          className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <BookOpen size={20} />
          <span className="font-medium">Meal Presets</span>
        </button>
        
        <button
          onClick={() => setShowEntryModal(true)}
          className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          <span className="font-medium">Manual Entry</span>
        </button>
      </div>

      {/* Meals List */}
      <div className="space-y-3">
        {meals.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6">
              <Utensils className="mx-auto mb-3 text-gray-400" size={40} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No meals logged yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Use the chat to log your meals with AI assistance, browse presets, or add them manually!
              </p>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setShowPresetsView(true)}
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <BookOpen size={16} />
                  <span>Browse Presets</span>
                </button>
                <button
                  onClick={() => setShowEntryModal(true)}
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus size={16} />
                  <span>Manual Entry</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          meals.map((meal) => (
            <div key={meal.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 overflow-hidden">
              {/* Meal Image */}
              {meal.image && (
                <div className="relative h-32 w-full">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => removeImage(meal)}
                      className="p-1.5 bg-red-500/80 backdrop-blur-sm text-white rounded-full hover:bg-red-600/80 transition-colors"
                      title="Remove photo"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${mealTypeColors[meal.mealType]}`}>
                        {mealTypeLabels[meal.mealType]}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {meal.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{meal.name}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="font-bold text-purple-600 dark:text-purple-400 text-lg">
                        {meal.calories}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">calories</div>
                    </div>
                    
                    {/* Camera Button */}
                    <button
                      onClick={() => handleCameraClick(meal.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        meal.image 
                          ? 'bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30' 
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      title={meal.image ? "Update photo" : "Add photo"}
                    >
                      <Camera size={16} className={
                        meal.image 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      } />
                    </button>
                    
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditMeal(meal)}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Edit meal"
                    >
                      <Edit3 size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center py-3 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                    <div className="font-bold text-red-700 dark:text-red-300">{meal.protein}g</div>
                    <div className="text-xs text-red-600 dark:text-red-400">Protein</div>
                  </div>
                  <div className="text-center py-3 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                    <div className="font-bold text-yellow-700 dark:text-yellow-300">{meal.carbs}g</div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">Carbs</div>
                  </div>
                  <div className="text-center py-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <div className="font-bold text-blue-700 dark:text-blue-300">{meal.fat}g</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Fat</div>
                  </div>
                </div>

                {/* Additional nutrients if available */}
                {(meal.fiber || meal.sugar) && (
                  <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                    {meal.fiber && (
                      <div className="text-center py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="font-medium text-green-700 dark:text-green-300">{meal.fiber}g</div>
                        <div className="text-xs text-green-600 dark:text-green-400">Fiber</div>
                      </div>
                    )}
                    {meal.sugar && (
                      <div className="text-center py-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="font-medium text-orange-700 dark:text-orange-300">{meal.sugar}g</div>
                        <div className="text-xs text-orange-600 dark:text-orange-400">Sugar</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingMeal && (
        <MealEditModal
          meal={editingMeal}
          isOpen={true}
          onClose={() => setEditingMeal(null)}
          onSave={handleSaveMeal}
          onDelete={onDeleteMeal ? handleDeleteMeal : undefined}
        />
      )}

      {/* Entry Modal */}
      <MealEntryModal
        isOpen={showEntryModal}
        onClose={() => setShowEntryModal(false)}
        onSave={handleAddMeal}
        selectedDate={selectedDate}
      />
    </div>
  );
}