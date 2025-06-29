import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Heart, 
  Dumbbell, 
  Utensils, 
  Package,
  Globe,
  Clock,
  Edit3,
  Plus,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { UserPreferences, CustomFood } from '../../types/preferences';
import { preferencesApi } from '../../services/preferencesApi';
import { CustomFoodForm } from './CustomFoodForm';

interface PreferencesViewProps {
  onBack: () => void;
}

export function PreferencesView({ onBack }: PreferencesViewProps) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['ingredients']));
  const [editingItem, setEditingItem] = useState<{ section: string; key: string; value: any } | null>(null);
  const [showCustomFoodForm, setShowCustomFoodForm] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const prefs = await preferencesApi.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleEdit = (section: string, key: string, value: any) => {
    setEditingItem({ section, key, value });
  };

  const handleSave = async (newValue: any) => {
    if (!editingItem || !preferences) return;

    try {
      await preferencesApi.savePreference(
        editingItem.section as any,
        editingItem.key,
        newValue
      );
      
      // Update local state
      const updatedPreferences = { ...preferences };
      const keys = editingItem.key.split('.');
      let current: any = updatedPreferences[editingItem.section as keyof UserPreferences];
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = newValue;
      
      setPreferences(updatedPreferences);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save preference:', error);
    }
  };

  const handleDelete = async (section: string, key: string) => {
    try {
      await preferencesApi.clearPreference(section as any, key);
      await loadPreferences(); // Reload to reflect changes
    } catch (error) {
      console.error('Failed to delete preference:', error);
    }
  };

  const handleDeleteCustomFood = async (foodId: string) => {
    if (confirm('Are you sure you want to delete this custom food?')) {
      try {
        await preferencesApi.deleteCustomFood(foodId);
        await loadPreferences();
      } catch (error) {
        console.error('Failed to delete custom food:', error);
      }
    }
  };

  const handleAddCustomFood = async (food: Omit<CustomFood, 'id' | 'lastUsed' | 'usageCount' | 'createdAt'>) => {
    try {
      await preferencesApi.addCustomFood(food);
      await loadPreferences();
      setShowCustomFoodForm(false);
    } catch (error) {
      console.error('Failed to add custom food:', error);
    }
  };

  const renderEditModal = () => {
    if (!editingItem) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit {editingItem.key}
            </h3>
            <button
              onClick={() => setEditingItem(null)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="p-4">
            <EditForm
              value={editingItem.value}
              onSave={handleSave}
              onCancel={() => setEditingItem(null)}
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="text-purple-600 dark:text-purple-400">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Preferences</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Loading preferences...</p>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="text-purple-600 dark:text-purple-400">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Preferences</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load preferences</p>
          <button
            onClick={loadPreferences}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    {
      id: 'general',
      title: 'General',
      icon: Globe,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      data: preferences.general,
    },
    {
      id: 'workout',
      title: 'Workout',
      icon: Dumbbell,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      data: preferences.workout,
    },
    {
      id: 'health',
      title: 'Health',
      icon: Heart,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      data: preferences.health,
    },
    {
      id: 'eating',
      title: 'Eating',
      icon: Utensils,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      data: preferences.eating,
    },
    {
      id: 'ingredients',
      title: 'Ingredients',
      icon: Package,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      data: preferences.ingredients,
    },
  ];

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Preferences</h1>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <Clock size={14} />
          <span>Updated {preferences.lastUpdated.toLocaleDateString()}</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 text-white">
        <div className="flex items-center space-x-3">
          <Settings size={24} />
          <div>
            <h2 className="font-semibold">Smart Preferences</h2>
            <p className="text-purple-200 text-sm">
              Your AI assistant learns from your conversations and saves preferences automatically
            </p>
          </div>
        </div>
      </div>

      {/* Preference Sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const Icon = section.icon;
          
          return (
            <div key={section.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${section.bgColor}`}>
                    <Icon size={20} className={section.color} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getPreferenceCount(section.data)} preferences
                    </p>
                  </div>
                </div>
                
                {isExpanded ? (
                  <ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
              </button>

              {/* Section Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <PreferenceSection
                    sectionId={section.id}
                    data={section.data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDeleteCustomFood={handleDeleteCustomFood}
                    onShowCustomFoodForm={() => setShowCustomFoodForm(true)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {renderEditModal()}
      
      {/* Custom Food Form Modal */}
      <CustomFoodForm
        isOpen={showCustomFoodForm}
        onClose={() => setShowCustomFoodForm(false)}
        onSave={handleAddCustomFood}
      />
    </div>
  );
}

function getPreferenceCount(data: any): number {
  let count = 0;
  
  const countValues = (obj: any) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (Array.isArray(value)) {
          count += value.length;
        } else if (typeof value === 'object' && value !== null) {
          countValues(value);
        } else {
          count++;
        }
      }
    }
  };
  
  countValues(data);
  return count;
}

interface PreferenceSectionProps {
  sectionId: string;
  data: any;
  onEdit: (section: string, key: string, value: any) => void;
  onDelete: (section: string, key: string) => void;
  onDeleteCustomFood?: (foodId: string) => void;
  onShowCustomFoodForm?: () => void;
}

function PreferenceSection({ 
  sectionId, 
  data, 
  onEdit, 
  onDelete, 
  onDeleteCustomFood,
  onShowCustomFoodForm 
}: PreferenceSectionProps) {
  const renderValue = (key: string, value: any, path: string = key) => {
    if (key === 'customFoods' && typeof value === 'object') {
      const foods = Object.values(value) as any[];
      return (
        <div className="space-y-3">
          {foods.map((food: any) => (
            <div key={food.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">{food.name}</h5>
                  {food.brand && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{food.brand}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500">{food.description}</p>
                </div>
                <button
                  onClick={() => onDeleteCustomFood?.(food.id)}
                  className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <div className="font-bold text-purple-700 dark:text-purple-300">
                    {food.nutritionPer100g.calories}
                  </div>
                  <div className="text-purple-600 dark:text-purple-400">cal</div>
                </div>
                <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <div className="font-bold text-red-700 dark:text-red-300">
                    {food.nutritionPer100g.protein}g
                  </div>
                  <div className="text-red-600 dark:text-red-400">protein</div>
                </div>
                <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div className="font-bold text-blue-700 dark:text-blue-300">
                    {food.nutritionPer100g.carbs}g
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">carbs</div>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Used {food.usageCount} times • Last used {food.lastUsed ? new Date(food.lastUsed).toLocaleDateString() : 'Never'}
              </div>
            </div>
          ))}
          
          <button
            onClick={onShowCustomFoodForm}
            className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-purple-400 dark:hover:border-purple-500 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Custom Food</span>
          </button>
        </div>
      );
    }
    
    if (Array.isArray(value)) {
      return (
        <div className="space-y-2">
          {value.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No items yet. Chat with the AI to add preferences automatically!
            </p>
          ) : (
            value.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                <button
                  onClick={() => {
                    const newValue = value.filter((_, i) => i !== index);
                    onEdit(sectionId, path, newValue);
                  }}
                  className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {subKey.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <button
                  onClick={() => onEdit(sectionId, `${path}.${subKey}`, subValue)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Edit3 size={12} />
                </button>
              </div>
              <div className="ml-4">
                {renderValue(subKey, subValue, `${path}.${subKey}`)}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="text-sm text-gray-700 dark:text-gray-300">{String(value)}</span>
          <button
            onClick={() => onEdit(sectionId, path, value)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Edit3 size={12} />
          </button>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </h4>
          {renderValue(key, value)}
        </div>
      ))}
    </div>
  );
}

interface EditFormProps {
  value: any;
  onSave: (value: any) => void;
  onCancel: () => void;
}

function EditForm({ value, onSave, onCancel }: EditFormProps) {
  const [editValue, setEditValue] = useState(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editValue);
  };

  if (Array.isArray(value)) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Items (one per line)
          </label>
          <textarea
            value={editValue.join('\n')}
            onChange={(e) => setEditValue(e.target.value.split('\n').filter(item => item.trim()))}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
          />
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
        </div>
      </form>
    );
  } else if (typeof value === 'number') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Value
          </label>
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
        </div>
      </form>
    );
  } else {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Value
          </label>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
        </div>
      </form>
    );
  }
}