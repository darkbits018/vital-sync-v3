import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Users, Target, Calendar, Bell, ChevronRight, Clock, Flame, Award, Share2, BarChart3 } from 'lucide-react';
import { Challenge, ChallengeGoal, LeaderboardEntry } from '../../types/challenges';
import { challengeApi } from '../../services/challengeApi';
import { rewardApi } from '../../services/rewardApi';
import { reminderService } from '../../services/reminderService';
import { useUserMode } from '../../hooks/useUserMode';
import { UpgradeModal } from '../common/UpgradeModal';
import { LeaderboardViewer } from './LeaderboardViewer';
import { RewardsSystem } from './RewardsSystem';

interface ChallengeDetailViewProps {
  challenge: Challenge;
  onBack: () => void;
}

export function ChallengeDetailView({ challenge, onBack }: ChallengeDetailViewProps) {
  const { isPremium } = useUserMode();
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'rewards'>('overview');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all-time'>('all-time');

  useEffect(() => {
    loadLeaderboard();
  }, [challenge.id, timeframe]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await challengeApi.getLeaderboard(challenge.id, timeframe);
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGoal = async (goal: ChallengeGoal, newValue: number) => {
    try {
      setLoading(true);
      await challengeApi.updateChallengeProgress(challenge.id, goal.id, newValue);
      // Refresh the challenge data
      onBack();
    } catch (error) {
      console.error('Failed to update goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleReminder = async () => {
    try {
      const now = new Date();
      const reminderTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
      
      await reminderService.scheduleChallengeReminder(
        challenge.id,
        challenge.name,
        `Don't forget to log your progress for the ${challenge.name} challenge!`,
        reminderTime
      );
      
      alert('Reminder scheduled for tomorrow!');
    } catch (error) {
      console.error('Failed to schedule reminder:', error);
    }
  };

  const handleShareChallenge = () => {
    // In a real app, this would open a share dialog
    alert('This would open a share dialog in a real app.');
  };

  const handleViewLeaderboard = () => {
    if (isPremium) {
      setActiveTab('leaderboard');
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleViewRewards = () => {
    if (isPremium) {
      setActiveTab('rewards');
    } else {
      setShowUpgradeModal(true);
    }
  };

  const currentUserMember = challenge.members.find(m => m.userId === 'current-user');
  const daysLeft = Math.ceil((challenge.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.ceil((challenge.endDate.getTime() - challenge.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = totalDays - daysLeft;
  const timeProgress = Math.min(Math.round((daysElapsed / totalDays) * 100), 100);

  if (activeTab === 'leaderboard') {
    return (
      <LeaderboardViewer
        challenge={challenge}
        leaderboard={leaderboard}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        onBack={() => setActiveTab('overview')}
        isPremium={isPremium}
      />
    );
  }

  if (activeTab === 'rewards') {
    return (
      <RewardsSystem
        challengeId={challenge.id}
        onBack={() => setActiveTab('overview')}
        isPremium={isPremium}
      />
    );
  }

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
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Challenge Details</h1>
      </div>

      {/* Challenge Header */}
      <div className="relative">
        {challenge.image && (
          <div className="h-40 w-full overflow-hidden rounded-t-xl">
            <img 
              src={challenge.image} 
              alt={challenge.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
        )}
        
        <div className={`bg-white dark:bg-gray-800 p-4 ${challenge.image ? 'rounded-b-xl' : 'rounded-xl'}`}>
          <div className={`${challenge.image ? 'mt-[-60px]' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className={`text-xl font-bold mb-1 ${challenge.image ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {challenge.name}
                </h2>
                <p className={`text-sm ${challenge.image ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
                  {challenge.description}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleShareChallenge}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Share2 size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={handleScheduleReminder}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Bell size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar size={16} />
                <span>{daysLeft} days left</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Users size={16} />
                <span>{challenge.members.length} members</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Trophy size={16} />
                <span>Rank #{currentUserMember?.rank || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Clock size={16} className="mr-2 text-blue-500" />
            Time Progress
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {daysElapsed} of {totalDays} days
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
          <div 
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${timeProgress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{challenge.startDate.toLocaleDateString()}</span>
          <span>{challenge.endDate.toLocaleDateString()}</span>
        </div>
      </div>

      {/* Your Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Target size={16} className="mr-2 text-green-500" />
            Your Progress
          </h3>
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            {currentUserMember?.progress || 0}% Complete
          </span>
        </div>
        
        <div className="space-y-4">
          {challenge.goals.map(goal => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">{goal.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{goal.description}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100)}% complete
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    goal.isCompleted 
                      ? 'bg-green-500' 
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}
                  style={{ width: `${Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100)}%` }}
                ></div>
              </div>
              
              {/* Update Progress Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const newValue = prompt(`Update your progress for ${goal.name} (current: ${goal.currentValue}/${goal.targetValue} ${goal.unit}):`, goal.currentValue.toString());
                    if (newValue !== null) {
                      const parsedValue = parseInt(newValue);
                      if (!isNaN(parsedValue)) {
                        handleUpdateGoal(goal, parsedValue);
                      }
                    }
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Update Progress
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Trophy size={16} className="mr-2 text-yellow-500" />
            Leaderboard
          </h3>
          <button
            onClick={handleViewLeaderboard}
            className="flex items-center space-x-1 text-sm text-purple-600 dark:text-purple-400"
          >
            <span>View Full Leaderboard</span>
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No leaderboard data available yet.</p>
            </div>
          ) : (
            leaderboard.slice(0, 3).map((entry, index) => (
              <div 
                key={entry.userId}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.isCurrentUser 
                    ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800' 
                    : 'bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 
                      ? 'bg-yellow-500 text-white' 
                      : index === 1 
                        ? 'bg-gray-400 text-white' 
                        : index === 2 
                          ? 'bg-amber-700 text-white' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {entry.rank}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {entry.name} {entry.isCurrentUser && '(You)'}
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
          
          {!isPremium && (
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-3">
                <Trophy size={18} className="text-purple-600 dark:text-purple-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Upgrade to Premium to see the full leaderboard and detailed analytics!
                  </p>
                </div>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                >
                  Upgrade
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Challenge Rules */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Challenge Rules</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
          {challenge.rules}
        </p>
      </div>

      {/* Rewards Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Award size={16} className="mr-2 text-amber-500" />
            Rewards
          </h3>
          <button
            onClick={handleViewRewards}
            className="flex items-center space-x-1 text-sm text-purple-600 dark:text-purple-400"
          >
            <span>View All Rewards</span>
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-200 whitespace-pre-line">
            {challenge.rewards}
          </p>
        </div>
        
        {!isPremium && (
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-3">
              <Award size={18} className="text-purple-600 dark:text-purple-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Upgrade to Premium to unlock exclusive rewards and badges!
                </p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Members */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Users size={16} className="mr-2 text-blue-500" />
          Members ({challenge.members.length})
        </h3>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {challenge.members.map(member => (
            <div
              key={member.id}
              className={`flex items-center justify-between p-2 rounded-lg ${
                member.userId === 'current-user' 
                  ? 'bg-purple-50 dark:bg-purple-900/20' 
                  : 'bg-gray-50 dark:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {member.name} {member.userId === 'current-user' && '(You)'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Joined {member.joinedAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                  {member.progress}%
                </div>
                {member.isAdmin && (
                  <div className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full">
                    Admin
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Preview (Premium Only) */}
      {isPremium && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <BarChart3 size={16} className="mr-2 text-purple-500" />
            Analytics
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg text-center">
              <div className="text-xl font-bold text-purple-700 dark:text-purple-300">85%</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Avg. Completion</div>
            </div>
            
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg text-center">
              <div className="text-xl font-bold text-blue-700 dark:text-blue-300">92%</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Engagement Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Unlock Premium Features"
        message="Get access to full leaderboards, detailed analytics, and exclusive rewards!"
        features={[
          'Complete leaderboard with detailed stats',
          'Advanced analytics and insights',
          'Exclusive rewards and badges',
          'Create unlimited challenges',
          'Premium challenge templates',
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