import React, { useState } from 'react';
import { MessageCircle, MoreVertical, UserMinus, Trophy, Calendar, Wifi, WifiOff, Clock } from 'lucide-react';
import { Friend } from '../../types/friends';
import { FriendStoryModal } from './FriendStoryModal';

interface FriendsListProps {
  friends: Friend[];
  onRemoveFriend: (friendId: string) => void;
}

export function FriendsList({ friends, onRemoveFriend }: FriendsListProps) {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [expandedFriend, setExpandedFriend] = useState<string | null>(null);

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: Friend['status']) => {
    switch (status) {
      case 'online':
        return <Wifi size={12} className="text-green-600 dark:text-green-400" />;
      case 'offline':
        return <WifiOff size={12} className="text-gray-400" />;
      default:
        return <Clock size={12} className="text-yellow-600 dark:text-yellow-400" />;
    }
  };

  const getLastSeenText = (friend: Friend) => {
    if (friend.status === 'online') return 'Online now';
    if (!friend.lastSeen) return 'Last seen unknown';
    
    const now = new Date();
    const diff = now.getTime() - friend.lastSeen.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleRemoveFriend = (friendId: string, friendName: string) => {
    if (confirm(`Are you sure you want to remove ${friendName} from your friends?`)) {
      onRemoveFriend(friendId);
    }
  };

  const handleFriendClick = (friend: Friend) => {
    setSelectedFriend(friend);
    setShowStoryModal(true);
  };

  if (friends.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="text-purple-600 dark:text-purple-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Friends Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Start connecting with other fitness enthusiasts to motivate each other!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {friends.map((friend) => (
        <div key={friend.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
                {/* Avatar with Status */}
                <button 
                  onClick={() => handleFriendClick(friend)}
                  className="relative hover:scale-105 transition-transform duration-200"
                  title="View today's activity"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {friend.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-white dark:border-gray-800`}></div>
                </button>

                {/* Friend Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {friend.name}
                    </span>
                    {friend.isVerified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Trophy size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    {getStatusIcon(friend.status)}
                    <span>@{friend.username}</span>
                    <span>•</span>
                    <span>{getLastSeenText(friend)}</span>
                  </div>
                  {friend.mutualFriends && friend.mutualFriends > 0 && (
                    <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      {friend.mutualFriends} mutual friend{friend.mutualFriends !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
            </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {expandedFriend === friend.id && (
                  <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 min-w-48">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          handleFriendClick(friend);
                          setExpandedFriend(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        View Today's Activity
                      </button>
                      <button
                        onClick={() => {
                          alert(`Messaging ${friend.name}`);
                          setExpandedFriend(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Send Message
                      </button>
                      <button
                        onClick={() => {
                          alert(`Comparing stats with ${friend.name}`);
                          setExpandedFriend(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Compare Stats
                      </button>
                      <button
                        onClick={() => {
                          alert(`Viewing ${friend.name}'s today activity`);
                          setExpandedFriend(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Today's Activity
                      </button>
                      <button
                        onClick={() => {
                          alert(`Blocking ${friend.name}`);
                          setExpandedFriend(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Block User
                      </button>
                      <button
                        onClick={() => {
                          handleRemoveFriend(friend.id, friend.name);
                          setExpandedFriend(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <UserMinus size={14} />
                        <span>Remove Friend</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          {/* Friend Since */}
          <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            <span>Friends since {friend.friendsSince.toLocaleDateString()}</span>
          </div>
        </div>
      ))}

      {/* Friend Story Modal */}
      <FriendStoryModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        friends={friends}
        initialFriendId={selectedFriend?.id}
      />
    </div>
  );
}