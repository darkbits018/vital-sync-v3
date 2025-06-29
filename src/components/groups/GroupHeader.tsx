import React from 'react';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useUserMode } from '../../hooks/useUserMode';

interface GroupHeaderProps {
  groupName: string;
  memberCount: number;
  isShowingMembers: boolean;
  onToggleMembers: () => void;
  onlineCount?: number;
}

export function GroupHeader({ 
  groupName, 
  memberCount, 
  isShowingMembers, 
  onToggleMembers,
  onlineCount = 0
}: GroupHeaderProps) {
  const { isPremium } = useUserMode();

  return (
    <button
      onClick={onToggleMembers}
      className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
          <Users size={20} className="text-white" />
        </div>
        
        <div className="text-left">
          <h3 className="font-semibold text-gray-900 dark:text-white">{groupName}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{memberCount} members</span>
            {isPremium && (
              <>
                <span>•</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span>{onlineCount} online</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {isShowingMembers ? (
        <ChevronUp size={20} className="text-gray-400" />
      ) : (
        <ChevronDown size={20} className="text-gray-400" />
      )}
    </button>
  );
}