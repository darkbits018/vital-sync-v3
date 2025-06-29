import React, { useState } from 'react';
import { Users, UsersRound, Trophy } from 'lucide-react';
import { SocialTab } from '../../types';
import { FriendsView } from '../friends/FriendsView';
import { GroupManagementView } from '../groups/GroupManagementView'; 
import { ChallengeDashboard } from '../challenges/ChallengeDashboard';

interface SocialViewProps {
  activeSocialTab: SocialTab;
  onSocialTabChange: (tab: SocialTab) => void;
  onBack: () => void;
}

export function SocialView({ activeSocialTab, onSocialTabChange, onBack }: SocialViewProps) {
  return (
    <div className="space-y-4 h-full">
      {/* Sub-tabs Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 overflow-x-auto">
        <button
          onClick={() => onSocialTabChange('friends')}
          className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-1 ${
            activeSocialTab === 'friends'
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Users size={16} />
          <span>Friends</span>
        </button>
        
        <button
          onClick={() => onSocialTabChange('groups')}
          className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-1 ${
            activeSocialTab === 'groups'
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <UsersRound size={16} />
          <span>Groups</span>
        </button>

        <button
          onClick={() => onSocialTabChange('challenges')}
          className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-1 ${
            activeSocialTab === 'challenges'
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Trophy size={16} />
          <span>Challenges</span>
        </button>
      </div>

      {/* Content */}
      {activeSocialTab === 'friends' ? (
        <FriendsView onBack={onBack} />
      ) : activeSocialTab === 'groups' ? (
        <GroupManagementView onBack={onBack} />
      ) : (
        <ChallengeDashboard onBack={onBack} />
      )}
    </div>
  );
}