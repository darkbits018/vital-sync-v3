import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, Gift, Check, Lock, Crown, Download, Share2, Trophy, Star } from 'lucide-react';
import { Reward } from '../../types/challenges';
import { rewardApi } from '../../services/rewardApi';
import { UpgradeModal } from '../common/UpgradeModal';

interface RewardsSystemProps {
  challengeId?: string; // Optional - if provided, show only rewards for this challenge
  onBack: () => void;
  isPremium: boolean;
}

export function RewardsSystem({ challengeId, onBack, isPremium }: RewardsSystemProps) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [claimingRewardId, setClaimingRewardId] = useState<string | null>(null);

  useEffect(() => {
    loadRewards();
  }, [challengeId, isPremium]);

  const loadRewards = async () => {
    try {
      setLoading(true);
      let rewardsData: Reward[];
      
      if (challengeId) {
        rewardsData = await rewardApi.getChallengeRewards(challengeId);
      } else {
        rewardsData = await rewardApi.getRewards(isPremium);
      }
      
      setRewards(rewardsData);
    } catch (error) {
      console.error('Failed to load rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async (rewardId: string) => {
    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    
    try {
      setClaimingRewardId(rewardId);
      await rewardApi.claimReward(rewardId);
      
      // Refresh rewards
      await loadRewards();
    } catch (error) {
      console.error('Failed to claim reward:', error);
      alert('Failed to claim reward. Please try again.');
    } finally {
      setClaimingRewardId(null);
    }
  };

  const handleShareReward = (reward: Reward) => {
    // In a real app, this would open a share dialog
    alert(`Sharing reward: ${reward.name}`);
  };

  const handleDownloadReward = (reward: Reward) => {
    // In a real app, this would download the reward image or certificate
    alert(`Downloading reward: ${reward.name}`);
  };

  // Filter rewards based on active tab
  const filteredRewards = rewards.filter(reward => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unlocked') return reward.isUnlocked;
    if (activeTab === 'locked') return !reward.isUnlocked;
    return true;
  });

  // For free tier, limit to only a few rewards
  const displayRewards = isPremium 
    ? filteredRewards 
    : filteredRewards.slice(0, 3);

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
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Rewards</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'all'
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('unlocked')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'unlocked'
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Unlocked
        </button>
        <button
          onClick={() => setActiveTab('locked')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'locked'
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Locked
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading rewards...</p>
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl p-6">
            <Award size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Rewards Found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab === 'unlocked' 
                ? "You haven't unlocked any rewards yet. Complete challenges to earn rewards!" 
                : activeTab === 'locked' 
                  ? "No locked rewards found. Check back later for new challenges and rewards!" 
                  : "No rewards found. Complete challenges to earn rewards!"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              {displayRewards.map(reward => (
                <div 
                  key={reward.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm ${
                    reward.isUnlocked ? 'border-2 border-yellow-400 dark:border-yellow-600' : ''
                  }`}
                >
                  {/* Reward Image */}
                  <div className="relative h-32 w-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                    {reward.image ? (
                      <img 
                        src={reward.image} 
                        alt={reward.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Trophy size={48} className="text-white" />
                    )}
                    
                    {/* Locked Overlay */}
                    {!reward.isUnlocked && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Lock size={32} className="text-white" />
                      </div>
                    )}
                    
                    {/* Claimed Badge */}
                    {reward.isUnlocked && reward.isClaimed && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <Check size={12} />
                        <span>Claimed</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{reward.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                      {reward.description}
                    </p>
                    
                    {reward.isUnlocked ? (
                      reward.isClaimed ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleShareReward(reward)}
                            className="flex-1 flex items-center justify-center space-x-1 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs"
                          >
                            <Share2 size={12} />
                            <span>Share</span>
                          </button>
                          <button
                            onClick={() => handleDownloadReward(reward)}
                            className="flex-1 flex items-center justify-center space-x-1 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-xs"
                          >
                            <Download size={12} />
                            <span>Download</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleClaimReward(reward.id)}
                          disabled={claimingRewardId === reward.id}
                          className="w-full py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-amber-600 transition-colors flex items-center justify-center space-x-1"
                        >
                          {claimingRewardId === reward.id ? (
                            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <Gift size={14} />
                              <span>Claim Reward</span>
                            </>
                          )}
                        </button>
                      )
                    ) : (
                      <div className="w-full py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-sm text-center">
                        {reward.requiredProgress}% completion required
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Free Tier Limit */}
            {!isPremium && filteredRewards.length > 3 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
                <Crown size={24} className="text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Upgrade to See All Rewards
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Free users can only see 3 rewards. Upgrade to Premium to see all {filteredRewards.length} rewards!
                </p>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors shadow-md"
                >
                  Upgrade to Premium
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Premium Rewards Section */}
      {isPremium && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg">
              <Star size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Premium Exclusive Rewards</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Special rewards only available to premium members
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-3 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy size={16} className="text-yellow-600 dark:text-yellow-400" />
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">Elite Badge</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Exclusive badge for premium members who complete 5+ challenges
              </p>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">
                3/5 challenges completed
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-2 mb-2">
                <Gift size={16} className="text-purple-600 dark:text-purple-400" />
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">Premium Points</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Earn 2x points for all completed challenges
              </p>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                500 points earned so far
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Unlock Premium Rewards"
        message="Get access to exclusive rewards and premium features!"
        features={[
          'Access all rewards, not just the first 3',
          'Claim rewards instantly',
          'Earn exclusive premium badges',
          'Get 2x points for completed challenges',
          'Download high-resolution reward certificates',
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