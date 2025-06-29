import { Challenge, ChallengeGoal, ChallengeMember, LeaderboardEntry, ChallengeTemplate, ChallengeInvite, ChallengeStats } from '../types/challenges';

// Mock challenge templates
const challengeTemplates: ChallengeTemplate[] = [
  {
    id: 'template-1',
    name: '30-Day Step Challenge',
    description: 'Walk 10,000 steps every day for 30 days',
    category: 'steps',
    duration: 30,
    goals: [
      {
        name: 'Daily Steps',
        description: 'Walk 10,000 steps every day',
        targetValue: 10000,
        unit: 'steps',
        type: 'steps',
      }
    ],
    rules: 'Complete at least 10,000 steps every day. You can miss up to 3 days and still complete the challenge.',
    rewards: 'Step Master Badge, 500 Fitness Points',
    image: 'https://images.pexels.com/photos/235922/pexels-photo-235922.jpeg',
  },
  {
    id: 'template-2',
    name: 'Workout Streak Challenge',
    description: 'Complete at least 20 workouts in 30 days',
    category: 'workouts',
    duration: 30,
    goals: [
      {
        name: 'Workout Count',
        description: 'Complete at least 20 workouts',
        targetValue: 20,
        unit: 'workouts',
        type: 'workouts',
      }
    ],
    rules: 'Log at least 20 workouts in the 30-day period. Each workout must be at least 20 minutes long.',
    rewards: 'Workout Warrior Badge, 750 Fitness Points',
    image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
  },
  {
    id: 'template-3',
    name: 'Protein Challenge',
    description: 'Meet your daily protein goal for 14 consecutive days',
    category: 'meals',
    duration: 14,
    goals: [
      {
        name: 'Protein Intake',
        description: 'Meet your daily protein goal',
        targetValue: 100, // percentage of daily goal
        unit: '%',
        type: 'meals',
      }
    ],
    rules: 'Log all your meals and meet at least 100% of your daily protein target for 14 consecutive days.',
    rewards: 'Protein Pro Badge, 600 Fitness Points',
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
  },
  {
    id: 'template-4',
    name: 'Weight Loss Challenge',
    description: 'Lose 5% of your body weight in 60 days',
    category: 'weight',
    duration: 60,
    goals: [
      {
        name: 'Weight Loss',
        description: 'Lose 5% of your starting weight',
        targetValue: 5, // percentage
        unit: '%',
        type: 'weight',
      }
    ],
    rules: 'Log your weight at least once a week. The goal is to lose 5% of your starting weight within 60 days.',
    rewards: 'Transformation Badge, 1000 Fitness Points',
    image: 'https://images.pexels.com/photos/4098228/pexels-photo-4098228.jpeg',
  },
  {
    id: 'template-5',
    name: 'Hydration Challenge',
    description: 'Drink at least 2.5 liters of water daily for 21 days',
    category: 'custom',
    duration: 21,
    goals: [
      {
        name: 'Water Intake',
        description: 'Drink at least 2.5 liters of water daily',
        targetValue: 2500,
        unit: 'ml',
        type: 'custom',
      }
    ],
    rules: 'Log your water intake daily. You must drink at least 2.5 liters (2500ml) of water each day.',
    rewards: 'Hydration Hero Badge, 400 Fitness Points',
    image: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg',
  },
];

// Mock challenges for free tier (limited to 1)
const mockChallengesFree: Challenge[] = [
  {
    id: 'challenge-1',
    name: '30-Day Step Challenge',
    description: 'Walk 10,000 steps every day for 30 days',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Started 7 days ago
    endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // Ends in 23 days
    createdBy: 'current-user',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isActive: true,
    isPublic: true,
    rules: 'Complete at least 10,000 steps every day. You can miss up to 3 days and still complete the challenge.',
    rewards: 'Step Master Badge, 500 Fitness Points',
    category: 'steps',
    maxMembers: 10,
    image: 'https://images.pexels.com/photos/235922/pexels-photo-235922.jpeg',
    goals: [
      {
        id: 'goal-1',
        challengeId: 'challenge-1',
        name: 'Daily Steps',
        description: 'Walk 10,000 steps every day',
        targetValue: 10000,
        currentValue: 8500,
        unit: 'steps',
        type: 'steps',
        isCompleted: false,
      }
    ],
    members: [
      {
        id: 'member-1',
        userId: 'current-user',
        challengeId: 'challenge-1',
        name: 'You',
        username: 'current_user',
        joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'active',
        progress: 85,
        rank: 2,
        isAdmin: true,
      },
      {
        id: 'member-2',
        userId: 'user-1',
        challengeId: 'challenge-1',
        name: 'Alex Johnson',
        username: 'alex_fitness',
        avatar: undefined,
        joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'active',
        progress: 92,
        rank: 1,
        isAdmin: false,
      },
      {
        id: 'member-3',
        userId: 'user-2',
        challengeId: 'challenge-1',
        name: 'Jordan Smith',
        username: 'jordan_runner',
        avatar: undefined,
        joinedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        status: 'active',
        progress: 78,
        rank: 3,
        isAdmin: false,
      },
    ],
  },
];

// Mock challenges for premium tier (unlimited)
const mockChallengesPremium: Challenge[] = [
  ...mockChallengesFree,
  {
    id: 'challenge-2',
    name: 'Workout Streak Challenge',
    description: 'Complete at least 20 workouts in 30 days',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Started 10 days ago
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // Ends in 20 days
    createdBy: 'current-user',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    isActive: true,
    isPublic: true,
    rules: 'Log at least 20 workouts in the 30-day period. Each workout must be at least 20 minutes long.',
    rewards: 'Workout Warrior Badge, 750 Fitness Points',
    category: 'workouts',
    maxMembers: 20,
    image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
    goals: [
      {
        id: 'goal-2',
        challengeId: 'challenge-2',
        name: 'Workout Count',
        description: 'Complete at least 20 workouts',
        targetValue: 20,
        currentValue: 7,
        unit: 'workouts',
        type: 'workouts',
        isCompleted: false,
      }
    ],
    members: [
      {
        id: 'member-4',
        userId: 'current-user',
        challengeId: 'challenge-2',
        name: 'You',
        username: 'current_user',
        joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        status: 'active',
        progress: 35,
        rank: 3,
        isAdmin: true,
      },
      {
        id: 'member-5',
        userId: 'user-3',
        challengeId: 'challenge-2',
        name: 'Sam Wilson',
        username: 'sam_lifter',
        avatar: undefined,
        joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        status: 'active',
        progress: 45,
        rank: 1,
        isAdmin: false,
      },
      {
        id: 'member-6',
        userId: 'user-4',
        challengeId: 'challenge-2',
        name: 'Mike Chen',
        username: 'mike_yoga',
        avatar: undefined,
        joinedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        status: 'active',
        progress: 40,
        rank: 2,
        isAdmin: false,
      },
    ],
  },
  {
    id: 'challenge-3',
    name: 'Protein Challenge',
    description: 'Meet your daily protein goal for 14 consecutive days',
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Started 5 days ago
    endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // Ends in 9 days
    createdBy: 'user-1',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isActive: true,
    isPublic: true,
    rules: 'Log all your meals and meet at least 100% of your daily protein target for 14 consecutive days.',
    rewards: 'Protein Pro Badge, 600 Fitness Points',
    category: 'meals',
    maxMembers: 15,
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    goals: [
      {
        id: 'goal-3',
        challengeId: 'challenge-3',
        name: 'Protein Intake',
        description: 'Meet your daily protein goal',
        targetValue: 100, // percentage of daily goal
        currentValue: 90,
        unit: '%',
        type: 'meals',
        isCompleted: false,
      }
    ],
    members: [
      {
        id: 'member-7',
        userId: 'current-user',
        challengeId: 'challenge-3',
        name: 'You',
        username: 'current_user',
        joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'active',
        progress: 90,
        rank: 2,
        isAdmin: false,
      },
      {
        id: 'member-8',
        userId: 'user-1',
        challengeId: 'challenge-3',
        name: 'Alex Johnson',
        username: 'alex_fitness',
        avatar: undefined,
        joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'active',
        progress: 95,
        rank: 1,
        isAdmin: true,
      },
    ],
  },
];

// Mock leaderboard data
const mockLeaderboard: Record<string, LeaderboardEntry[]> = {
  'challenge-1': [
    {
      userId: 'user-1',
      name: 'Alex Johnson',
      username: 'alex_fitness',
      rank: 1,
      score: 92000, // total steps
      progress: 92,
      completedGoals: 0,
      totalGoals: 1,
      isCurrentUser: false,
    },
    {
      userId: 'current-user',
      name: 'You',
      username: 'current_user',
      rank: 2,
      score: 85000, // total steps
      progress: 85,
      completedGoals: 0,
      totalGoals: 1,
      isCurrentUser: true,
    },
    {
      userId: 'user-2',
      name: 'Jordan Smith',
      username: 'jordan_runner',
      rank: 3,
      score: 78000, // total steps
      progress: 78,
      completedGoals: 0,
      totalGoals: 1,
      isCurrentUser: false,
    },
  ],
  'challenge-2': [
    {
      userId: 'user-3',
      name: 'Sam Wilson',
      username: 'sam_lifter',
      rank: 1,
      score: 9, // workouts completed
      progress: 45,
      completedGoals: 0,
      totalGoals: 1,
      isCurrentUser: false,
    },
    {
      userId: 'user-4',
      name: 'Mike Chen',
      username: 'mike_yoga',
      rank: 2,
      score: 8, // workouts completed
      progress: 40,
      completedGoals: 0,
      totalGoals: 1,
      isCurrentUser: false,
    },
    {
      userId: 'current-user',
      name: 'You',
      username: 'current_user',
      rank: 3,
      score: 7, // workouts completed
      progress: 35,
      completedGoals: 0,
      totalGoals: 1,
      isCurrentUser: true,
    },
  ],
  'challenge-3': [
    {
      userId: 'user-1',
      name: 'Alex Johnson',
      username: 'alex_fitness',
      rank: 1,
      score: 95, // percentage of protein goal met
      progress: 95,
      completedGoals: 0,
      totalGoals: 1,
      isCurrentUser: false,
    },
    {
      userId: 'current-user',
      name: 'You',
      username: 'current_user',
      rank: 2,
      score: 90, // percentage of protein goal met
      progress: 90,
      completedGoals: 0,
      totalGoals: 1,
      isCurrentUser: true,
    },
  ],
};

// Mock challenge invites
const mockChallengeInvites: ChallengeInvite[] = [
  {
    id: 'invite-1',
    challengeId: 'challenge-3',
    challengeName: 'Protein Challenge',
    inviterId: 'user-1',
    inviterName: 'Alex Johnson',
    inviteeId: 'current-user',
    inviteeName: 'You',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Expires in 5 days
  },
];

// Simulate API delay
const simulateApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const challengeApi = {
  /**
   * Get all challenges for the user based on premium status
   */
  async getChallenges(isPremium: boolean): Promise<Challenge[]> {
    await simulateApiDelay();
    return isPremium ? mockChallengesPremium : mockChallengesFree;
  },

  /**
   * Get a specific challenge by ID
   */
  async getChallengeById(challengeId: string): Promise<Challenge | null> {
    await simulateApiDelay();
    
    const allChallenges = [...mockChallengesPremium];
    return allChallenges.find(challenge => challenge.id === challengeId) || null;
  },

  /**
   * Create a new challenge
   */
  async createChallenge(challenge: Omit<Challenge, 'id' | 'createdAt' | 'members'>): Promise<Challenge> {
    await simulateApiDelay(800);
    
    const newChallenge: Challenge = {
      ...challenge,
      id: `challenge-${Date.now()}`,
      createdAt: new Date(),
      members: [
        {
          id: `member-${Date.now()}`,
          userId: 'current-user',
          challengeId: `challenge-${Date.now()}`,
          name: 'You',
          username: 'current_user',
          joinedAt: new Date(),
          status: 'active',
          progress: 0,
          rank: 1,
          isAdmin: true,
        },
      ],
    };
    
    // Add to premium challenges
    mockChallengesPremium.push(newChallenge);
    
    return newChallenge;
  },

  /**
   * Join a challenge
   */
  async joinChallenge(challengeId: string): Promise<void> {
    await simulateApiDelay(300);
    
    const challenge = mockChallengesPremium.find(c => c.id === challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    
    // Check if user is already a member
    if (challenge.members.some(m => m.userId === 'current-user')) {
      return;
    }
    
    // Add user as a member
    const newMember: ChallengeMember = {
      id: `member-${Date.now()}`,
      userId: 'current-user',
      challengeId,
      name: 'You',
      username: 'current_user',
      joinedAt: new Date(),
      status: 'active',
      progress: 0,
      rank: challenge.members.length + 1,
      isAdmin: false,
    };
    
    challenge.members.push(newMember);
  },

  /**
   * Leave a challenge
   */
  async leaveChallenge(challengeId: string): Promise<void> {
    await simulateApiDelay(300);
    
    const challenge = mockChallengesPremium.find(c => c.id === challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    
    // Remove user from members
    challenge.members = challenge.members.filter(m => m.userId !== 'current-user');
  },

  /**
   * Update challenge progress
   */
  async updateChallengeProgress(challengeId: string, goalId: string, newValue: number): Promise<void> {
    await simulateApiDelay(200);
    
    const challenge = mockChallengesPremium.find(c => c.id === challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    
    const goal = challenge.goals.find(g => g.id === goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }
    
    goal.currentValue = newValue;
    goal.isCompleted = newValue >= goal.targetValue;
    
    // Update member progress
    const member = challenge.members.find(m => m.userId === 'current-user');
    if (member) {
      const totalProgress = challenge.goals.reduce((sum, g) => {
        const goalProgress = Math.min((g.currentValue / g.targetValue) * 100, 100);
        return sum + goalProgress;
      }, 0);
      
      member.progress = Math.round(totalProgress / challenge.goals.length);
    }
    
    // Update leaderboard
    this._updateLeaderboard(challengeId);
  },

  /**
   * Get challenge leaderboard
   */
  async getLeaderboard(challengeId: string, timeframe: 'week' | 'month' | 'all-time' = 'all-time'): Promise<LeaderboardEntry[]> {
    await simulateApiDelay();
    
    // In a real app, we would filter by timeframe
    return mockLeaderboard[challengeId] || [];
  },

  /**
   * Update leaderboard (internal function)
   */
  _updateLeaderboard(challengeId: string): void {
    const challenge = mockChallengesPremium.find(c => c.id === challengeId);
    if (!challenge) return;
    
    // Sort members by progress
    const sortedMembers = [...challenge.members].sort((a, b) => b.progress - a.progress);
    
    // Update ranks
    sortedMembers.forEach((member, index) => {
      member.rank = index + 1;
    });
    
    // Update leaderboard
    if (!mockLeaderboard[challengeId]) {
      mockLeaderboard[challengeId] = [];
    }
    
    mockLeaderboard[challengeId] = sortedMembers.map(member => ({
      userId: member.userId,
      name: member.name,
      username: member.username,
      avatar: member.avatar,
      rank: member.rank || 0,
      score: this._calculateScore(challenge, member),
      progress: member.progress,
      completedGoals: challenge.goals.filter(g => g.isCompleted).length,
      totalGoals: challenge.goals.length,
      isCurrentUser: member.userId === 'current-user',
    }));
  },

  /**
   * Calculate score for leaderboard (internal function)
   */
  _calculateScore(challenge: Challenge, member: ChallengeMember): number {
    switch (challenge.category) {
      case 'steps':
        return member.progress * 1000; // Approximate steps
      case 'workouts':
        return Math.round(member.progress / 5); // Approximate workout count
      case 'meals':
      case 'weight':
      default:
        return member.progress;
    }
  },

  /**
   * Get challenge templates
   */
  async getChallengeTemplates(): Promise<ChallengeTemplate[]> {
    await simulateApiDelay();
    return challengeTemplates;
  },

  /**
   * Get challenge invites
   */
  async getChallengeInvites(): Promise<ChallengeInvite[]> {
    await simulateApiDelay();
    return mockChallengeInvites;
  },

  /**
   * Respond to challenge invite
   */
  async respondToChallengeInvite(inviteId: string, accept: boolean): Promise<void> {
    await simulateApiDelay(300);
    
    const invite = mockChallengeInvites.find(i => i.id === inviteId);
    if (!invite) {
      throw new Error('Invite not found');
    }
    
    invite.status = accept ? 'accepted' : 'declined';
    
    if (accept) {
      // Join the challenge
      await this.joinChallenge(invite.challengeId);
    }
    
    // Remove from invites
    mockChallengeInvites.splice(mockChallengeInvites.indexOf(invite), 1);
  },

  /**
   * Invite users to a challenge
   */
  async inviteToChallenge(challengeId: string, userIds: string[]): Promise<void> {
    await simulateApiDelay(400);
    
    const challenge = mockChallengesPremium.find(c => c.id === challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    
    // In a real app, we would create invites for each user
    console.log(`Invited users ${userIds.join(', ')} to challenge ${challengeId}`);
  },

  /**
   * Get challenge statistics
   */
  async getChallengeStats(): Promise<ChallengeStats> {
    await simulateApiDelay();
    
    return {
      totalChallenges: 5,
      activeChallenges: 3,
      completedChallenges: 2,
      totalRewards: 8,
      unlockedRewards: 3,
      winRate: 75,
      bestCategory: 'steps',
      currentStreak: 2,
      longestStreak: 4,
    };
  },
};