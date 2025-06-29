import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Calendar, Target, Users, Clock, ChevronRight, Crown, Zap, Bell } from 'lucide-react';
import { Challenge } from '../../types/challenges';
import { challengeApi } from '../../services/challengeApi';
import { useUserMode } from '../../hooks/useUserMode';
import { UpgradeModal } from '../common/UpgradeModal';
import { ChallengeCreationModal } from './ChallengeCreationModal';
import { ChallengeDetailView } from './ChallengeDetailView';
import { reminderService } from '../../services/reminderService';

interface ChallengeDashboardProps {
  onBack?: () => void;
}

export function ChallengeDashboard({ onBack }: ChallengeDashboardProps) {
  const { isPremium } = useUserMode();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    loadChallenges();
    
    // Clean up reminder timers when component unmounts
    return () => {
      reminderService.cleanupTimers();
    };
  }, [isPremium]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const data = await challengeApi.getChallenges(isPremium);
      setChallenges(data);
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = () => {
    if (isPremium) {
      setShowCreateModal(true);
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleChallengeCreated = (newChallenge: Challenge) => {
    // Remove the line that adds the challenge to the state
    // This prevents the challenge from being added twice
    setShowCreateModal(false);
    loadChallenges(); // Reload challenges from the API
  };

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleBackFromDetail = () => {
    setSelectedChallenge(null);
    loadChallenges(); // Refresh challenges in case of updates
  };

  // If a challenge is selected, show the detail view
  if (selectedChallenge) {
    return (
      <ChallengeDetailView
        challenge={selectedChallenge}
        onBack={handleBackFromDetail}
      />
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Challenges</h1>
        </div>
        
        <button
          onClick={handleCreateChallenge}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors shadow-md"
        >
          <Plus size={16} />
          <span>New Challenge</span>
        </button>
      </div>

      {/* Challenge Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Trophy size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Your Challenges</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isPremium 
                ? 'Unlimited challenges available' 
                : `${challenges.length}/1 challenges (Free tier)`
              }
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-700 dark:text-green-300">{challenges.length}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Active Challenges</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">2</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Completed</div>
          </div>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
          <Zap size={18} className="mr-2 text-yellow-500" />
          Active Challenges
        </h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading challenges...</p>
          </div>
        ) : challenges.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <Trophy size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Active Challenges</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Join or create a challenge to start competing with friends!
            </p>
            <button
              onClick={handleCreateChallenge}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors shadow-md"
            >
              <Plus size={18} />
              <span>Create Your First Challenge</span>
            </button>
          </div>
        ) : (
          challenges.map(challenge => (
            <div 
              key={challenge.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleChallengeClick(challenge)}
            >
              {challenge.image && (
                <div className="h-32 w-full overflow-hidden">
                  <img 
                    src={challenge.image} 
                    alt={challenge.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{challenge.name}</h4>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {challenge.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    <span>
                      {Math.ceil((challenge.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Users size={14} />
                    <span>{challenge.members.length} members</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Your Progress</span>
                    <span>
                      {challenge.members.find(m => m.userId === 'current-user')?.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${challenge.members.find(m => m.userId === 'current-user')?.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Free Tier Limit Warning */}
        {!isPremium && challenges.length >= 1 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                <Crown size={24} className="text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Free Tier Limit Reached
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  You've reached the limit of 1 active challenge for free accounts. Upgrade to Premium to create unlimited challenges!
                </p>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors shadow-md"
                >
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Challenge Invites */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Bell size={18} className="mr-2 text-blue-500" />
            Challenge Invites
          </h3>
          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            1
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Protein Challenge</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">From Alex Johnson</div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm">
                Accept
              </button>
              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Challenges */}
      {isPremium && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Target size={18} className="mr-2 text-green-500" />
            Recommended Challenges
          </h3>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Trophy size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">Hydration Challenge</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Drink 2.5L of water daily for 21 days
                </p>
              </div>
              <button className="px-3 py-1 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg text-sm">
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Upgrade to Premium"
        message="Get unlimited challenges and more premium features!"
        features={[
          'Create unlimited challenges',
          'Access exclusive challenge templates',
          'Full leaderboard analytics',
          'Exclusive rewards and badges',
          'Advanced challenge settings',
        ]}
        onUpgradeClick={() => {
          // In a real app, this would redirect to a payment page
          alert('This would redirect to a payment page in a real app.');
          setShowUpgradeModal(false);
        }}
      />

      <ChallengeCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onChallengeCreated={handleChallengeCreated}
      />
    </div>
  );
}