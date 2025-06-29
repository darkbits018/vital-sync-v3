import { Friend, FriendRequest, FriendSearchResult, FriendActivity, FriendsStats } from '../types/friends';

// Mock data for development
const mockFriends: Friend[] = [
  {
    id: '1',
    username: 'alex_fitness',
    email: 'alex@example.com',
    name: 'Alex Johnson',
    status: 'online',
    friendsSince: new Date('2024-01-15'),
    mutualFriends: 3,
    isVerified: true,
  },
  {
    id: '2',
    username: 'jordan_runner',
    email: 'jordan@example.com',
    name: 'Jordan Smith',
    status: 'away',
    lastSeen: new Date(Date.now() - 1800000), // 30 minutes ago
    friendsSince: new Date('2024-02-20'),
    mutualFriends: 1,
    isVerified: false,
  },
  {
    id: '3',
    username: 'sam_lifter',
    email: 'sam@example.com',
    name: 'Sam Wilson',
    status: 'offline',
    lastSeen: new Date(Date.now() - 7200000), // 2 hours ago
    friendsSince: new Date('2024-03-10'),
    mutualFriends: 5,
    isVerified: true,
  },
];

const mockPendingRequests: FriendRequest[] = [
  {
    id: '1',
    fromUserId: '4',
    toUserId: 'current-user',
    fromUser: {
      id: '4',
      username: 'mike_yoga',
      name: 'Mike Chen',
      isVerified: false,
    },
    message: 'Hey! I saw your workout progress, would love to connect!',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: '2',
    fromUserId: '5',
    toUserId: 'current-user',
    fromUser: {
      id: '5',
      username: 'emma_cardio',
      name: 'Emma Davis',
      isVerified: true,
    },
    message: 'Let\'s motivate each other to reach our fitness goals!',
    status: 'pending',
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  },
];

const mockSearchResults: FriendSearchResult[] = [
  {
    id: '6',
    username: 'chris_crossfit',
    email: 'chris@example.com',
    name: 'Chris Taylor',
    mutualFriends: 2,
    isVerified: true,
    friendshipStatus: 'none',
  },
  {
    id: '7',
    username: 'lisa_pilates',
    email: 'lisa@example.com',
    name: 'Lisa Brown',
    mutualFriends: 0,
    isVerified: false,
    friendshipStatus: 'none',
  },
  {
    id: '8',
    username: 'david_swimmer',
    email: 'david@example.com',
    name: 'David Lee',
    mutualFriends: 1,
    isVerified: true,
    friendshipStatus: 'pending_sent',
  },
];

// Simulate API delay
const simulateApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const friendsApi = {
  /**
   * Get user's friends list
   */
  async getFriends(): Promise<Friend[]> {
    await simulateApiDelay();
    return mockFriends;
  },

  /**
   * Get pending friend requests
   */
  async getPendingRequests(): Promise<FriendRequest[]> {
    await simulateApiDelay();
    return mockPendingRequests;
  },

  /**
   * Search for users by username or email
   */
  async searchUsers(query: string): Promise<FriendSearchResult[]> {
    await simulateApiDelay(300);
    
    if (!query.trim()) return [];
    
    return mockSearchResults.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  },

  /**
   * Send friend request
   */
  async sendFriendRequest(userId: string, message?: string): Promise<void> {
    await simulateApiDelay(400);
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/friends/request', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId, message })
    // });
    
    console.log(`Friend request sent to user ${userId}`, { message });
  },

  /**
   * Accept friend request
   */
  async acceptFriendRequest(requestId: string): Promise<void> {
    await simulateApiDelay(300);
    
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/friends/request/${requestId}/accept`, {
    //   method: 'POST'
    // });
    
    console.log(`Friend request ${requestId} accepted`);
  },

  /**
   * Decline friend request
   */
  async declineFriendRequest(requestId: string): Promise<void> {
    await simulateApiDelay(300);
    
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/friends/request/${requestId}/decline`, {
    //   method: 'POST'
    // });
    
    console.log(`Friend request ${requestId} declined`);
  },

  /**
   * Remove friend
   */
  async removeFriend(friendId: string): Promise<void> {
    await simulateApiDelay(400);
    
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/friends/${friendId}`, {
    //   method: 'DELETE'
    // });
    
    console.log(`Friend ${friendId} removed`);
  },

  /**
   * Get friends statistics
   */
  async getFriendsStats(): Promise<FriendsStats> {
    await simulateApiDelay();
    
    return {
      totalFriends: mockFriends.length,
      onlineFriends: mockFriends.filter(f => f.status === 'online').length,
      pendingRequests: mockPendingRequests.length,
      sentRequests: 1, // Mock data
      mutualWorkouts: 12, // Mock data
      sharedGoals: 3, // Mock data
    };
  },

  /**
   * Add friend via QR code
   */
  async addFriendByQR(qrData: string): Promise<void> {
    await simulateApiDelay(600);
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/friends/qr', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ qrData })
    // });
    
    console.log('Friend added via QR code:', qrData);
  },

  /**
   * Add friend via NFC
   */
  async addFriendByNFC(nfcData: string): Promise<void> {
    await simulateApiDelay(600);
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/friends/nfc', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ nfcData })
    // });
    
    console.log('Friend added via NFC:', nfcData);
  },

  /**
   * Generate user's QR code data
   */
  async generateQRCode(): Promise<string> {
    await simulateApiDelay(200);
    
    // TODO: Replace with actual API call that generates QR data
    // const response = await fetch('/api/user/qr-code');
    // const data = await response.json();
    // return data.qrCode;
    
    return `fittracker://add-friend?user=current-user&token=${Date.now()}`;
  },

  /**
   * Get recent friend activities
   */
  async getFriendActivities(): Promise<FriendActivity[]> {
    await simulateApiDelay();
    
    // Mock activities
    return [
      {
        id: '1',
        friendId: '1',
        type: 'workout',
        title: 'Alex completed a workout',
        description: 'Upper Body Strength - 45 minutes',
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: '2',
        friendId: '2',
        type: 'achievement',
        title: 'Jordan reached a milestone',
        description: 'Completed 100 workouts this year!',
        timestamp: new Date(Date.now() - 7200000),
      },
      {
        id: '3',
        friendId: '3',
        type: 'goal_reached',
        title: 'Sam achieved their goal',
        description: 'Lost 5kg this month',
        timestamp: new Date(Date.now() - 86400000),
      },
    ];
  },
};