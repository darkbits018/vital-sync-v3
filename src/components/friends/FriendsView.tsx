import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Clock, UserPlus, QrCode, Smartphone, TrendingUp } from 'lucide-react';
import { Friend, FriendRequest, FriendsStats } from '../../types/friends';
import { friendsApi } from '../../services/friendsApi';
import { FriendSearchBar } from './FriendSearchBar';
import { FriendsList } from './FriendsList';
import { PendingRequests } from './PendingRequests';
import { QRCodeModal } from './QRCodeModal';
import { NFCModal } from './NFCModal';
import { TodaysActivity } from './TodaysActivity';

interface FriendsViewProps {
  onBack: () => void;
}

export function FriendsView({ onBack }: FriendsViewProps): React.JSX.Element {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [stats, setStats] = useState<FriendsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search' | 'activity'>('friends');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrMode, setQRMode] = useState<'generate' | 'scan'>('generate');
  const [showNFCModal, setShowNFCModal] = useState(false);

  useEffect(() => {
    loadFriendsData();
  }, []);

  const loadFriendsData = async () => {
    try {
      setLoading(true);
      const [friendsData, requestsData, statsData] = await Promise.all([
        friendsApi.getFriends(),
        friendsApi.getPendingRequests(),
        friendsApi.getFriendsStats(),
      ]);
      
      setFriends(friendsData);
      setPendingRequests(requestsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load friends data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId: string, message?: string) => {
    try {
      await friendsApi.sendFriendRequest(userId, message);
      // Show success notification
      console.log('Friend request sent successfully');
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await friendsApi.acceptFriendRequest(requestId);
      await loadFriendsData(); // Refresh data
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await friendsApi.declineFriendRequest(requestId);
      await loadFriendsData(); // Refresh data
    } catch (error) {
      console.error('Failed to decline friend request:', error);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await friendsApi.removeFriend(friendId);
      await loadFriendsData(); // Refresh data
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  const handleMessageFriend = (friendId: string) => {
    // TODO: Implement messaging functionality
    console.log('Message friend:', friendId);
  };

  const handleQRScanner = () => {
    setQRMode('scan');
    setShowQRModal(true);
  };

  const handleNFCReader = () => {
    setShowNFCModal(true);
  };

  const handleFriendAdded = () => {
    loadFriendsData(); // Refresh data when friend is added
  };

  const tabs = [
    { 
      id: 'friends', 
      label: 'Friends', 
      icon: Users, 
      count: stats?.totalFriends || 0,
      color: 'text-blue-600 dark:text-blue-400'
    },
    { 
      id: 'requests', 
      label: 'Requests', 
      icon: Clock, 
      count: stats?.pendingRequests || 0,
      color: 'text-orange-600 dark:text-orange-400'
    },
    { 
      id: 'search', 
      label: 'Add Friends', 
      icon: UserPlus, 
      count: 0,
      color: 'text-green-600 dark:text-green-400'
    },
    { 
      id: 'activity', 
      label: 'Activity', 
      icon: TrendingUp, 
      count: 0,
      color: 'text-purple-600 dark:text-purple-400'
    },
  ];

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="text-purple-600 dark:text-purple-400">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Friends</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Loading friends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-0 px-4 pb-24 space-y-4">
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setQRMode('generate');
              setShowQRModal(true);
            }}
            className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
            title="Share QR Code"
          >
            <QrCode size={18} />
          </button>
          
          <button
            onClick={() => setShowNFCModal(true)}
            className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
            title="NFC Add"
          >
            <Smartphone size={18} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-2 text-center">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalFriends}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Total Friends</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-2 text-center">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.onlineFriends}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Online Now</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-2 text-center">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.mutualWorkouts}</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Shared Workouts</div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'search' && (
          <FriendSearchBar
            onAddFriend={handleAddFriend}
            onShowQRScanner={handleQRScanner}
            onShowNFCReader={handleNFCReader}
          />
        )}

        {activeTab === 'friends' && (
          <FriendsList
            friends={friends}
            onRemoveFriend={handleRemoveFriend}
          />
        )}

        {activeTab === 'requests' && (
          <PendingRequests
            requests={pendingRequests}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
          />
        )}

        {activeTab === 'activity' && (
          <TodaysActivity friends={friends} />
        )}
      </div>

      {/* Modals */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        mode={qrMode}
        onFriendAdded={handleFriendAdded}
      />

      <NFCModal
        isOpen={showNFCModal}
        onClose={() => setShowNFCModal(false)}
        onFriendAdded={handleFriendAdded}
      />
    </div>
  );
}