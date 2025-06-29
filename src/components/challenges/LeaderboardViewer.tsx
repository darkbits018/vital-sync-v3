import React, { useState } from 'react';
import { ArrowLeft, Trophy, Medal, Users, Filter, Search, Calendar, ChevronDown, Crown } from 'lucide-react';
import { Challenge, LeaderboardEntry } from '../../types/challenges';
import { UpgradeModal } from '../common/UpgradeModal';

interface LeaderboardViewerProps {
  challenge: Challenge;
  leaderboard: LeaderboardEntry[];
  timeframe: 'week' | 'month' | 'all-time';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'all-time') => void;
  onBack: () => void;
  isPremium: boolean;
}

export function LeaderboardViewer({ 
  challenge, 
  leaderboard, 
  timeframe, 
  onTimeframeChange, 
  onBack,
  isPremium
}: LeaderboardViewerProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);

  // Filter leaderboard by search query
  const filteredLeaderboard = leaderboard.filter(entry => 
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // For free tier, limit to top 3 and current user
  const displayLeaderboard = isPremium 
    ? filteredLeaderboard 
    : filteredLeaderboard.filter(entry => entry.rank <= 3 || entry.isCurrentUser);

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'all-time': return 'All Time';
    }
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-700';
      default: return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
      </div>

      {/* Challenge Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-1">{challenge.name}</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Users size={14} />
          <span>{challenge.members.length} participants</span>
          <span>•</span>
          <Calendar size={14} />
          <span>{Math.ceil((challenge.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Filter size={16} className="mr-2 text-purple-500" />
            Filters
          </h3>
          
          {!isPremium && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-xs"
            >
              <Crown size={12} />
              <span>Upgrade</span>
            </button>
          )}
        </div>
        
        <div className="flex flex-col space-y-3">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search participants..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={!isPremium}
            />
            {!isPremium && (
              <div className="absolute inset-0 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center cursor-not-allowed">
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Crown size={12} />
                  <span>Premium Feature</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Timeframe */}
          <div className="relative">
            <button
              onClick={() => isPremium && setShowTimeframeDropdown(!showTimeframeDropdown)}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={!isPremium}
            >
              <div className="flex items-center space-x-2">
                <Calendar size={18} className="text-gray-400" />
                <span>{getTimeframeLabel()}</span>
              </div>
              <ChevronDown size={18} className="text-gray-400" />
            </button>
            
            {!isPremium && (
              <div className="absolute inset-0 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center cursor-not-allowed">
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Crown size={12} />
                  <span>Premium Feature</span>
                </div>
              </div>
            )}
            
            {showTimeframeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onTimeframeChange('week');
                    setShowTimeframeDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  This Week
                </button>
                <button
                  onClick={() => {
                    onTimeframeChange('month');
                    setShowTimeframeDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  This Month
                </button>
                <button
                  onClick={() => {
                    onTimeframeChange('all-time');
                    setShowTimeframeDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  All Time
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top 3 Podium (Visual) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Trophy size={16} className="mr-2 text-yellow-500" />
          Top Performers
        </h3>
        
        <div className="flex items-end justify-center space-x-4 h-32 mb-4">
          {/* Second Place */}
          {leaderboard.length > 1 && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {leaderboard[1].name.split(' ')[0]}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {leaderboard[1].score} {challenge.goals[0]?.unit || 'pts'}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* First Place */}
          {leaderboard.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <Crown size={32} className="text-white" />
              </div>
              <div className="w-24 h-28 bg-yellow-100 dark:bg-yellow-900/30 rounded-t-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white text-lg">
                    {leaderboard[0].name.split(' ')[0]}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {leaderboard[0].score} {challenge.goals[0]?.unit || 'pts'}
                  </div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    {leaderboard[0].progress}% complete
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Third Place */}
          {leaderboard.length > 2 && (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full flex items-center justify-center mb-2">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <div className="w-18 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-t-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {leaderboard[2].name.split(' ')[0]}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {leaderboard[2].score} {challenge.goals[0]?.unit || 'pts'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Full Leaderboard</h3>
        
        <div className="space-y-2">
          {displayLeaderboard.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No results found.</p>
            </div>
          ) : (
            displayLeaderboard.map(entry => (
              <div 
                key={entry.userId}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.isCurrentUser 
                    ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800' 
                    : 'bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                    <Medal size={16} className={getMedalColor(entry.rank)} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm flex items-center space-x-1">
                      <span>{entry.name}</span>
                      {entry.isCurrentUser && (
                        <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      @{entry.username}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {entry.score} {challenge.goals[0]?.unit || 'points'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.progress}% complete
                  </div>
                </div>
              </div>
            ))
          )}
          
          {!isPremium && leaderboard.length > 3 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800 text-center">
              <Crown size={24} className="text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Upgrade to See Full Leaderboard
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Free users can only see the top 3 participants. Upgrade to Premium to see all {leaderboard.length} participants!
              </p>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors shadow-md"
              >
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Unlock Premium Leaderboard"
        message="Get access to the full leaderboard and advanced filtering options!"
        features={[
          'See all participants, not just top 3',
          'Search for specific participants',
          'Filter by different time periods',
          'View detailed progress statistics',
          'Export leaderboard data',
        ]}
        onUpgradeClick={() => {
          // In a real app, this would redirect to a payment page
          alert('This would redirect to a payment page in a real app.');
          setShowUpgradeModal(false);
        }}
      />
    </div>
  );
}