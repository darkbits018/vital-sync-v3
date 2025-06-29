export interface Friend {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: Date;
  friendsSince: Date;
  mutualFriends?: number;
  isVerified?: boolean;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    isVerified?: boolean;
  };
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  expiresAt?: Date;
}

export interface FriendSearchResult {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  mutualFriends?: number;
  isVerified?: boolean;
  friendshipStatus: 'none' | 'pending_sent' | 'pending_received' | 'friends' | 'blocked';
}

export interface FriendActivity {
  id: string;
  friendId: string;
  type: 'workout' | 'meal' | 'achievement' | 'goal_reached';
  title: string;
  description: string;
  timestamp: Date;
  data?: any;
}

export interface FriendsStats {
  totalFriends: number;
  onlineFriends: number;
  pendingRequests: number;
  sentRequests: number;
  mutualWorkouts: number;
  sharedGoals: number;
}