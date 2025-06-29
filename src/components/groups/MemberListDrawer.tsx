import React, { useState } from 'react';
import { X, UserPlus, UserMinus, Search, Clock, Dumbbell, Utensils, Crown, Shield } from 'lucide-react';
import { GroupMember } from '../../types';
import { useUserMode } from '../../hooks/useUserMode';

interface MemberListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  members: GroupMember[];
  onAddMember: () => void;
  onRemoveMember: (memberId: string) => void;
  maxMembers: number;
}

export function MemberListDrawer({ 
  isOpen, 
  onClose, 
  members, 
  onAddMember, 
  onRemoveMember,
  maxMembers
}: MemberListDrawerProps) {
  const { isPremium } = useUserMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const filteredMembers = searchQuery
    ? members.filter(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : members;

  const handleAddMember = () => {
    if (members.length >= maxMembers && !isPremium) {
      setShowUpgradeModal(true);
    } else {
      onAddMember();
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Group Members</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Search and Add */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search members..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <button
              onClick={handleAddMember}
              className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <UserPlus size={18} />
              <span className="text-sm font-medium">Add</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {members.length} of {maxMembers} members
            </span>
            {isPremium ? (
              <span className="flex items-center text-purple-600 dark:text-purple-400">
                <Crown size={14} className="mr-1" />
                <span>Premium Group</span>
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">Free Group</span>
            )}
          </div>
        </div>

        {/* Members List */}
        <div className="overflow-y-auto max-h-[50vh]">
          <div className="p-4 space-y-3">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">No members found</p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div key={member.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    {/* Avatar with Status */}
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white dark:border-gray-800`}></div>
                    </div>
                    
                    {/* Member Info */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </span>
                        {member.role === 'admin' && (
                          <Shield size={14} className="text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        @{member.username}
                      </div>
                    </div>
                  </div>
                  
                  {/* Remove Button (not for current user or if not admin) */}
                  {member.id !== 'current-user' && (
                    <button
                      onClick={() => onRemoveMember(member.id)}
                      className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <UserMinus size={16} className="text-red-600 dark:text-red-400" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Member Activity (Premium Only) */}
        {isPremium && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Activity</h4>
            
            <div className="space-y-2">
              {filteredMembers.slice(0, 3).map((member) => (
                <div key={`activity-${member.id}`} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {member.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs">
                    {member.lastWorkout && (
                      <div className="flex items-center text-blue-600 dark:text-blue-400">
                        <Dumbbell size={12} className="mr-1" />
                        <span>{new Date(member.lastWorkout.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {member.lastMeal && (
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <Utensils size={12} className="mr-1" />
                        <span>{new Date(member.lastMeal.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {!member.lastWorkout && !member.lastMeal && (
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Clock size={12} className="mr-1" />
                        <span>No recent activity</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Upgrade to Premium
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You've reached the member limit for free groups. Upgrade to premium to add more members and unlock additional features.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <UserPlus size={20} className="text-purple-600 dark:text-purple-400" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">Add up to 20 members</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Free tier limited to 4 members</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Users size={20} className="text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">Create unlimited groups</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Free tier limited to 1 group</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Maybe Later
              </button>
              
              <button
                onClick={() => {
                  // In a real app, this would redirect to a payment page
                  alert('This would redirect to a payment page in a real app.');
                  setShowUpgradeModal(false);
                }}
                className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}