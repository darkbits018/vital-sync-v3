import { Group, GroupMember, GroupData } from '../types';

// Mock group members data
const mockMembers: GroupMember[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    username: 'alex_fitness',
    joinedAt: new Date('2024-01-15'),
    role: 'member',
    isActive: true,
  },
  {
    id: '2',
    name: 'Jordan Smith',
    username: 'jordan_runner',
    joinedAt: new Date('2024-02-20'),
    role: 'member',
    isActive: true,
  },
  {
    id: '3',
    name: 'Sam Wilson',
    username: 'sam_lifter',
    joinedAt: new Date('2024-03-10'),
    role: 'member',
    isActive: true,
  },
  {
    id: '4',
    name: 'Mike Chen',
    username: 'mike_yoga',
    joinedAt: new Date('2024-03-15'),
    role: 'member',
    isActive: true,
  },
  {
    id: '5',
    name: 'Emma Davis',
    username: 'emma_cardio',
    joinedAt: new Date('2024-03-20'),
    role: 'member',
    isActive: true,
  },
  {
    id: '6',
    name: 'Chris Taylor',
    username: 'chris_crossfit',
    joinedAt: new Date('2024-03-25'),
    role: 'member',
    isActive: true,
  },
  {
    id: '7',
    name: 'Lisa Brown',
    username: 'lisa_pilates',
    joinedAt: new Date('2024-04-01'),
    role: 'member',
    isActive: true,
  },
  {
    id: '8',
    name: 'David Lee',
    username: 'david_swimmer',
    joinedAt: new Date('2024-04-05'),
    role: 'member',
    isActive: true,
  },
];

// Current user member object
const currentUserMember: GroupMember = {
  id: 'current-user',
  name: 'You',
  username: 'current_user',
  joinedAt: new Date('2024-01-01'),
  role: 'admin',
  isActive: true,
};

// Mock groups for free tier (1 group, max 4 members)
const mockGroupsFree: Group[] = [
  {
    id: 'group-1',
    name: 'Fitness Buddies',
    description: 'Our small but mighty fitness group!',
    createdAt: new Date('2024-01-01'),
    createdBy: 'current-user',
    members: [
      currentUserMember,
      mockMembers[0], // Alex
      mockMembers[1], // Jordan
    ],
    maxMembers: 4,
    isActive: true,
  }
];

// Mock groups for premium tier (multiple groups, max 20 members per group)
const mockGroupsPremium: Group[] = [
  {
    id: 'group-premium-1',
    name: 'Elite Fitness Squad',
    description: 'Premium fitness group with advanced features and unlimited potential!',
    createdAt: new Date('2024-01-01'),
    createdBy: 'current-user',
    members: [
      currentUserMember,
      ...mockMembers.slice(0, 4), // First 4 friends
    ],
    maxMembers: 20,
    isActive: true,
  },
  {
    id: 'group-premium-2',
    name: 'Morning Runners',
    description: 'For those who love to start their day with a run!',
    createdAt: new Date('2024-02-15'),
    createdBy: 'current-user',
    members: [
      currentUserMember,
      mockMembers[1], // Jordan
      mockMembers[3], // Mike
    ],
    maxMembers: 20,
    isActive: true,
  },
  {
    id: 'group-premium-3',
    name: 'Yoga Enthusiasts',
    description: 'Find your zen with fellow yoga lovers',
    createdAt: new Date('2024-03-10'),
    createdBy: 'current-user',
    members: [
      currentUserMember,
      mockMembers[3], // Mike
      mockMembers[6], // Lisa
    ],
    maxMembers: 20,
    isActive: true,
  }
];

// Get initial mock groups based on premium status
export const getInitialMockGroups = (isPremium: boolean): Group[] => {
  return isPremium ? mockGroupsPremium : mockGroupsFree;
};

// Get available friends for groups
export const getAvailableFriendsForGroups = (groups: Group[]): GroupMember[] => {
  // Collect all member IDs from all groups
  const allMemberIds = new Set<string>();
  groups.forEach(group => {
    group.members.forEach(member => {
      allMemberIds.add(member.id);
    });
  });
  
  // Return friends who are not in any group
  return mockMembers.filter(member => !allMemberIds.has(member.id));
};

// Legacy function for backward compatibility
export const getGroupDataForMode = (isPremium: boolean): GroupData => {
  const groups = getInitialMockGroups(isPremium);
  const availableFriends = getAvailableFriendsForGroups(groups);
  
  return {
    group: groups.length > 0 ? groups[0] : null,
    availableFriends,
  };
};

export const getEmptyGroupData = (): GroupData => ({
  group: null,
  availableFriends: mockMembers,
});