export interface Challenge {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
  isPublic: boolean;
  rules: string;
  rewards: string;
  goals: ChallengeGoal[];
  members: ChallengeMember[];
  category: 'steps' | 'workouts' | 'meals' | 'weight' | 'custom';
  maxMembers: number;
  image?: string;
}

export interface ChallengeGoal {
  id: string;
  challengeId: string;
  name: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  type: 'steps' | 'workouts' | 'meals' | 'weight' | 'custom';
  isCompleted: boolean;
  deadline?: Date;
}

export interface ChallengeMember {
  id: string;
  userId: string;
  challengeId: string;
  name: string;
  username: string;
  avatar?: string;
  joinedAt: Date;
  status: 'active' | 'inactive' | 'completed' | 'failed';
  progress: number; // 0-100
  rank?: number;
  isAdmin: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  username: string;
  avatar?: string;
  rank: number;
  score: number;
  progress: number; // 0-100
  completedGoals: number;
  totalGoals: number;
  isCurrentUser: boolean;
}

export interface Reward {
  id: string;
  challengeId: string;
  name: string;
  description: string;
  image?: string;
  type: 'badge' | 'points' | 'discount' | 'custom';
  value?: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  isClaimed: boolean;
  claimedAt?: Date;
  expiresAt?: Date;
  requiredProgress: number; // 0-100
}

export interface ChallengeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'steps' | 'workouts' | 'meals' | 'weight' | 'custom';
  duration: number; // in days
  goals: Omit<ChallengeGoal, 'id' | 'challengeId' | 'currentValue' | 'isCompleted'>[];
  rules: string;
  rewards: string;
  image?: string;
}

export interface ChallengeInvite {
  id: string;
  challengeId: string;
  challengeName: string;
  inviterId: string;
  inviterName: string;
  inviteeId: string;
  inviteeName: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  expiresAt?: Date;
}

export interface ChallengeStats {
  totalChallenges: number;
  activeChallenges: number;
  completedChallenges: number;
  totalRewards: number;
  unlockedRewards: number;
  winRate: number; // 0-100
  bestCategory?: string;
  currentStreak: number;
  longestStreak: number;
}