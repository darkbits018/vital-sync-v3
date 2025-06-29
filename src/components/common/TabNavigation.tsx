import React from 'react';
import { MessageCircle, Utensils, Dumbbell, UsersRound, LayoutDashboard } from 'lucide-react';
import { AppTab } from '../../types';

interface TabNavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const tabs = [
  { id: 'dashboard' as AppTab, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chat' as AppTab, label: 'Chat', icon: MessageCircle },
  { id: 'meals' as AppTab, label: 'Meals', icon: Utensils },
  { id: 'gym' as AppTab, label: 'Gym', icon: Dumbbell },
  { id: 'social' as AppTab, label: 'Social', icon: UsersRound },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-1 z-50 flex justify-center">
      <div className="flex justify-around w-full max-w-md">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
              activeTab === id
                ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}