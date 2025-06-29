import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Sparkles, ChefHat } from 'lucide-react';
import { CustomFood } from '../../types/preferences';

interface CustomFoodFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (food: Omit<CustomFood, 'id' | 'lastUsed' | 'usageCount' | 'createdAt'>) => void;
}

const defaultNutrients = [
  { key: 'calories', label: 'Calories', unit: '' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Carbs', unit: 'g' },
  { key: 'fat', label: 'Fat', unit: 'g' },
  { key: 'fiber', label: 'Fiber', unit: 'g' },
  { key: 'sugar', label: 'Sugar', unit: 'g' },
  { key: 'sodium', label: 'Sodium', unit: 'mg' },
];

const categoryOptions = [
  { value: 'grains', label: 'Grains', emoji: '🌾' },
  { value: 'protein', label: 'Protein', emoji: '🥩' },
  { value: 'dairy', label: 'Dairy', emoji: '🥛' },
  { value: 'vegetables', label: 'Vegetables', emoji: '🥬' },
  { value: 'fruits', label: 'Fruits', emoji: '🍎' },
  { value: 'nuts', label: 'Nuts & Seeds', emoji: '🥜' },
  { value: 'beverages', label: 'Beverages', emoji: '🥤' },
  { value: 'snacks', label: 'Snacks', emoji: '🍿' },
  { value: 'other', label: 'Other', emoji: '🍽️' },
];

export function CustomFoodForm({ isOpen, onClose, onSave }: CustomFoodFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    servingSize: '100g',
    category: 'other',
    nutritionPer100g: {} as Record<string, number>,
  });

  const [customNutrients, setCustomNutrients] = useState<Array<{ key: string; label: string; unit: string }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Food name is required');
      return;
    }

    if (!formData.nutritionPer100g.calories || formData.nutritionPer100g.calories <= 0) {
      alert('Calories value is required and must be greater than 0');
      return;
    }

    onSave(formData);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      brand: '',
      servingSize: '100g',
      category: 'other',
      nutritionPer100g: {},
    });
    setCustomNutrients([]);
  };

  const updateNutrient = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      nutritionPer100g: {
        ...prev.nutritionPer100g,
        [key]: numValue,
      },
    }));
  };

  const addCustomNutrient = () => {
    const key = prompt('Enter nutrient name (e.g., vitamin-c):');
    if (!key) return;
    
    const label = prompt('Enter display label (e.g., Vitamin C):');
    if (!label) return;
    
    const unit = prompt('Enter unit (e.g., mg, mcg):') || '';
    
    const nutrientKey = key.toLowerCase().replace(/\s+/g, '-');
    
    if (defaultNutrients.some(n => n.key === nutrientKey) || customNutrients.some(n => n.key === nutrientKey)) {
      alert('This nutrient already exists');
      return;
    }
    
    setCustomNutrients(prev => [...prev, { key: nutrientKey, label, unit }]);
  };

  const removeCustomNutrient = (key: string) => {
    setCustomNutrients(prev => prev.filter(n => n.key !== key));
    setFormData(prev => {
      const newNutrition = { ...prev.nutritionPer100g };
      delete newNutrition[key];
      return {
        ...prev,
        nutritionPer100g: newNutrition,
      };
    });
  };

  if (!isOpen) return null;

  const allNutrients = [...defaultNutrients, ...customNutrients];
  const selectedCategory = categoryOptions.find(cat => cat.value === formData.category);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Modern Header with Gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ChefHat size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Add Custom Food</h3>
                  <p className="text-purple-200 text-sm">Create your personalized food entry</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles size={18} className="text-purple-600 dark:text-purple-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Basic Information</h4>
              </div>
              
              {/* Food Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Food Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Organic Quinoa"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Brief description of the food item"
                />
              </div>

              {/* Brand and Serving Size */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Brand (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Organic Valley"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Serving Size
                  </label>
                  <input
                    type="text"
                    value={formData.servingSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, servingSize: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., 100g, 1 cup"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.emoji} {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nutrition Information Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Nutrition per 100g
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={addCustomNutrient}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus size={12} />
                  <span>Add Nutrient</span>
                </button>
              </div>

              {/* Simplified Nutrition Grid */}
              <div className="grid grid-cols-2 gap-3">
                {allNutrients.map((nutrient) => (
                  <div key={nutrient.key} className="relative group">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      {nutrient.label} {nutrient.unit && `(${nutrient.unit})`}
                      {nutrient.key === 'calories' && ' *'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.nutritionPer100g[nutrient.key] || ''}
                        onChange={(e) => updateNutrient(nutrient.key, e.target.value)}
                        className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                          customNutrients.some(n => n.key === nutrient.key) ? 'pr-8' : ''
                        }`}
                        placeholder="0"
                        required={nutrient.key === 'calories'}
                      />
                      {customNutrients.some(n => n.key === nutrient.key) && (
                        <button
                          type="button"
                          onClick={() => removeCustomNutrient(nutrient.key)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Tips Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-700 dark:text-blue-300 text-sm">Pro Tips</span>
                </div>
                <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• All values should be per 100g of the food</li>
                  <li>• Use nutrition labels or food databases for accuracy</li>
                  <li>• Add custom nutrients like vitamins or minerals if needed</li>
                  <li>• Double-check serving sizes for consistency</li>
                </ul>
              </div>
            </div>
          </form>
        </div>

        {/* Modern Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Save size={16} />
              <span>Save Food</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}