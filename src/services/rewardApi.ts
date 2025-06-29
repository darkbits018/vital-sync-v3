import { Reward } from '../types/challenges';

// Mock rewards data
const mockRewards: Reward[] = [
  {
    id: 'reward-1',
    challengeId: 'challenge-1',
    name: 'Step Master Badge',
    description: 'Completed the 30-Day Step Challenge',
    image: 'https://images.pexels.com/photos/235922/pexels-photo-235922.jpeg',
    type: 'badge',
    isUnlocked: false,
    requiredProgress: 100,
    isClaimed: false,
  },
  {
    id: 'reward-2',
    challengeId: 'challenge-2',
    name: 'Workout Warrior Badge',
    description: 'Completed the Workout Streak Challenge',
    image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
    type: 'badge',
    isUnlocked: false,
    requiredProgress: 100,
    isClaimed: false,
  },
  {
    id: 'reward-3',
    challengeId: 'challenge-3',
    name: 'Protein Pro Badge',
    description: 'Completed the Protein Challenge',
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    type: 'badge',
    isUnlocked: false,
    requiredProgress: 100,
    isClaimed: false,
  },
  {
    id: 'reward-4',
    challengeId: 'global',
    name: '500 Fitness Points',
    description: 'Earned for completing challenges',
    type: 'points',
    value: 500,
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    isClaimed: true,
    claimedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
    requiredProgress: 100,
  },
  {
    id: 'reward-5',
    challengeId: 'global',
    name: '10% Discount on Premium',
    description: 'Discount on premium subscription',
    type: 'discount',
    value: 10,
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    isClaimed: false,
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    requiredProgress: 100,
  },
  {
    id: 'reward-6',
    challengeId: 'global',
    name: 'Consistency Champion Badge',
    description: 'Completed 5 challenges',
    type: 'badge',
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    isClaimed: false,
    requiredProgress: 100,
  },
];

// Simulate API delay
const simulateApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const rewardApi = {
  /**
   * Get all rewards for the user
   */
  async getRewards(isPremium: boolean): Promise<Reward[]> {
    await simulateApiDelay();
    
    // For free tier, limit to only unlocked rewards
    if (!isPremium) {
      return mockRewards.filter(reward => reward.isUnlocked);
    }
    
    return mockRewards;
  },

  /**
   * Get rewards for a specific challenge
   */
  async getChallengeRewards(challengeId: string): Promise<Reward[]> {
    await simulateApiDelay();
    return mockRewards.filter(reward => reward.challengeId === challengeId);
  },

  /**
   * Claim a reward
   */
  async claimReward(rewardId: string): Promise<Reward> {
    await simulateApiDelay(300);
    
    const reward = mockRewards.find(r => r.id === rewardId);
    if (!reward) {
      throw new Error('Reward not found');
    }
    
    if (!reward.isUnlocked) {
      throw new Error('Reward is not unlocked yet');
    }
    
    if (reward.isClaimed) {
      throw new Error('Reward has already been claimed');
    }
    
    reward.isClaimed = true;
    reward.claimedAt = new Date();
    
    return reward;
  },

  /**
   * Check if a reward is unlocked
   */
  async checkRewardStatus(rewardId: string): Promise<{ isUnlocked: boolean; progress: number }> {
    await simulateApiDelay(200);
    
    const reward = mockRewards.find(r => r.id === rewardId);
    if (!reward) {
      throw new Error('Reward not found');
    }
    
    // In a real app, we would calculate the progress based on challenge completion
    const progress = reward.isUnlocked ? 100 : Math.floor(Math.random() * 100);
    
    return {
      isUnlocked: reward.isUnlocked,
      progress,
    };
  },

  /**
   * Get unlocked rewards
   */
  async getUnlockedRewards(): Promise<Reward[]> {
    await simulateApiDelay();
    return mockRewards.filter(reward => reward.isUnlocked);
  },

  /**
   * Get claimed rewards
   */
  async getClaimedRewards(): Promise<Reward[]> {
    await simulateApiDelay();
    return mockRewards.filter(reward => reward.isUnlocked && reward.isClaimed);
  },

  /**
   * Get unclaimed rewards
   */
  async getUnclaimedRewards(): Promise<Reward[]> {
    await simulateApiDelay();
    return mockRewards.filter(reward => reward.isUnlocked && !reward.isClaimed);
  },
};