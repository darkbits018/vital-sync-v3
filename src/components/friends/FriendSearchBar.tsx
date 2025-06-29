import React, { useState, useEffect } from 'react';
import { Search, X, UserPlus, Clock, Check, QrCode, Smartphone } from 'lucide-react';
import { FriendSearchResult } from '../../types/friends';
import { friendsApi } from '../../services/friendsApi';

interface FriendSearchBarProps {
  onAddFriend: (userId: string, message?: string) => void;
  onShowQRScanner: () => void;
  onShowNFCReader: () => void;
}

export function FriendSearchBar({ onAddFriend, onShowQRScanner, onShowNFCReader }: FriendSearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FriendSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await friendsApi.searchUsers(query);
        setResults(searchResults);
        setShowResults(true);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleAddFriend = (userId: string) => {
    onAddFriend(userId, `Hi! I'd like to connect with you on Vital Sync.`);
    // Update local state to show request sent
    setResults(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, friendshipStatus: 'pending_sent' as const }
          : user
      )
    );
  };

  const getStatusButton = (user: FriendSearchResult) => {
    switch (user.friendshipStatus) {
      case 'friends':
        return (
          <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm">
            <Check size={14} />
            <span>Friends</span>
          </div>
        );
      case 'pending_sent':
        return (
          <div className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-full text-sm">
            <Clock size={14} />
            <span>Pending</span>
          </div>
        );
      case 'pending_received':
        return (
          <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors">
            <Check size={14} />
            <span>Accept</span>
          </button>
        );
      default:
        return (
          <button
            onClick={() => handleAddFriend(user.id)}
            className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700 transition-colors"
          >
            <UserPlus size={14} />
            <span>Add</span>
          </button>
        );
    }
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username or email..."
          className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Quick Add Options */}
      <div className="flex space-x-2 mt-3">
        <button
          onClick={onShowQRScanner}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
        >
          <QrCode size={16} />
          <span className="text-sm font-medium">Scan QR</span>
        </button>
        
        <button
          onClick={onShowNFCReader}
          className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
        >
          <Smartphone size={16} />
          <span className="text-sm font-medium">NFC Tap</span>
        </button>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No users found</p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </span>
                        {user.isVerified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check size={10} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        @{user.username}
                      </div>
                      {user.mutualFriends && user.mutualFriends > 0 && (
                        <div className="text-xs text-purple-600 dark:text-purple-400">
                          {user.mutualFriends} mutual friend{user.mutualFriends !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {getStatusButton(user)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}