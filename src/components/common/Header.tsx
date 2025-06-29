import React from 'react';
import { User, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

interface HeaderProps {
  title: string;
  user?: any;
  onProfileClick?: () => void;
}

export function Header({ title, user, onProfileClick }: HeaderProps) {

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        
        {user && (
          <div className="flex items-center space-x-3">
            {/* Profile Button */}
            <button
              onClick={onProfileClick}
              className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
              title="View Profile"
            >
              <User size={16} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}