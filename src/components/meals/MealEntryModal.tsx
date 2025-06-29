import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Camera, Upload, Trash2, ChevronDown, Check } from 'lucide-react';
import { Meal } from '../../types';

interface MealEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meal: Omit<Meal, 'id'>) => void;
  selectedDate: Date;
}

const mealTypeOptions = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅', color: 'from-yellow-400 to-orange-400', description: 'Start your day right' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️', color: 'from-green-400 to-emerald-400', description: 'Midday fuel' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙', color: 'from-blue-400 to-indigo-400', description: 'Evening nourishment' },
  { value: 'snack', label: 'Snack', emoji: '🍎', color: 'from-purple-400 to-pink-400', description: 'Quick bite' },
];

export function MealEntryModal({ isOpen, onClose, onSave, selectedDate }: MealEntryModalProps) {
  const [mealData, setMealData] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    mealType: 'breakfast' as Meal['mealType'],
    image: undefined as string | undefined,
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    // Validate required fields
    if (!mealData.name.trim()) {
      alert('Meal name is required');
      return;
    }

    if (mealData.calories < 0 || mealData.protein < 0 || mealData.carbs < 0 || mealData.fat < 0) {
      alert('Macro values cannot be negative');
      return;
    }

    const newMeal: Omit<Meal, 'id'> = {
      ...mealData,
      date: selectedDate,
      image: imagePreview || undefined,
    };

    onSave(newMeal);
    
    // Reset form
    setMealData({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      mealType: 'breakfast',
      image: undefined,
    });
    setImagePreview(null);
    
    onClose();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
        setImagePreview(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateField = (field: keyof typeof mealData, value: string | number) => {
    setMealData(prev => ({ ...prev, [field]: value }));
  };

  const updateMacro = (field: keyof typeof mealData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setMealData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleMealTypeSelect = (mealType: Meal['mealType']) => {
    setMealData(prev => ({ ...prev, mealType }));
    setIsDropdownOpen(false);
  };

  const selectedMealType = mealTypeOptions.find(option => option.value === mealData.mealType);

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
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Log New Meal</h3>
              <p className="text-green-200 text-sm">Add your meal with nutrition info</p>
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
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Meal Photo (Optional)
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Meal preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <Camera size={20} />
                  <Upload size={20} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Tap to add photo
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Max 5MB • JPG, PNG
                </p>
              </div>
            )}
          </div>

          {/* Meal Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meal Name *
            </label>
            <input
              type="text"
              value={mealData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              placeholder="e.g., Grilled Chicken Salad"
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
                      mealData.mealType === option.value ? 'bg-purple-50 dark:bg-purple-900/20' : ''
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
                      {mealData.mealType === option.value && (
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
                  Calories *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={mealData.calories}
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
                  value={mealData.protein}
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
                  value={mealData.carbs}
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
                  value={mealData.fat}
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
                  value={mealData.fiber}
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
                  value={mealData.sugar}
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
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Save size={16} />
              <span>Log Meal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}