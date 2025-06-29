import { Group, GroupMember, GroupData } from '../types';
import { getInitialMockGroups, getAvailableFriendsForGroups, getEmptyGroupData } from './mockGroupData';

// Internal state for mock data persistence and tracking premium status
let _userGroups: Group[] = [];
let _availableFriends: GroupMember[] = [];
let _lastKnownPremiumStatus: boolean | null = null;

// Simulate API delay
const simulateApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const groupApi = {
  /**
   * Get all user groups
   */
  async getAllUserGroups(isPremium: boolean): Promise<Group[]> {
    await simulateApiDelay();
    
    // Initialize mock data if not already set or if premium status has changed
    if (_userGroups.length === 0 || _lastKnownPremiumStatus !== isPremium) {
      _userGroups = getInitialMockGroups(isPremium);
      _availableFriends = getAvailableFriendsForGroups(_userGroups);
      _lastKnownPremiumStatus = isPremium;
    } else {
      // Update maxMembers based on current premium status
      _userGroups = _userGroups.map(group => ({
        ...group,
        maxMembers: isPremium ? 20 : 4
      }));
    }
    
    return _userGroups;
  },

  /**
   * Get group data (legacy function for backward compatibility)
   */
  async getGroup(isPremium: boolean): Promise<GroupData> {
    await simulateApiDelay();
    
    // Get all groups first
    const groups = await this.getAllUserGroups(isPremium);
    
    return {
      group: groups.length > 0 ? groups[0] : null,
      availableFriends: _availableFriends
    };
  },

  /**
   * Create a new group
   */
  async createGroup(name: string, description: string, isPremium: boolean): Promise<Group> {
    await simulateApiDelay(600);
    
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      description,
      createdAt: new Date(),
      createdBy: 'current-user',
      members: [
        {
          id: 'current-user',
          name: 'You',
          username: 'current_user',
          joinedAt: new Date(),
          role: 'admin',
          isActive: true,
        },
      ],
      maxMembers: isPremium ? 20 : 4,
      isActive: true,
    };
    
    // Add to user groups
    _userGroups.push(newGroup);
    
    return newGroup;
  },

  /**
   * Add a member to the group
   */
  async addMember(groupId: string, memberId: string): Promise<void> {
    await simulateApiDelay(400);
    
    // Find the group
    const groupIndex = _userGroups.findIndex(g => g.id === groupId);
    if (groupIndex === -1) return;
    
    // Find the friend to add
    const friendToAdd = _availableFriends.find(f => f.id === memberId);
    if (!friendToAdd) return;
    
    // Add to group members
    _userGroups[groupIndex].members.push({
      ...friendToAdd,
      joinedAt: new Date(),
      role: 'member',
    });
    
    // Remove from available friends
    _availableFriends = _availableFriends.filter(f => f.id !== memberId);
  },

  /**
   * Get a specific group by ID
   */
  async getGroupById(groupId: string): Promise<Group | null> {
    await simulateApiDelay(200);
    
    const group = _userGroups.find(g => g.id === groupId);
    return group || null;
  },

  /**
   * Get members for a specific group
   */
  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    await simulateApiDelay(200);
    
    const group = _userGroups.find(g => g.id === groupId);
    if (!group) {
      return [];
    }
    
    return group.members;
  },

  /**
   * Remove a member from the group
   */
  async removeMember(groupId: string, memberId: string): Promise<void> {
    await simulateApiDelay(400);
    
    // Find the group
    const groupIndex = _userGroups.findIndex(g => g.id === groupId);
    if (groupIndex === -1) return;
    
    // Find the member to remove
    const memberToRemove = _userGroups[groupIndex].members.find(m => m.id === memberId);
    if (!memberToRemove || memberToRemove.id === 'current-user') return;
    
    // Remove from group members
    _userGroups[groupIndex].members = _userGroups[groupIndex].members.filter(m => m.id !== memberId);
    
    // Add back to available friends
    _availableFriends.push({
      ...memberToRemove,
      role: 'member',
    });
  },

  /**
   * Update group details
   */
  async updateGroup(groupId: string, updates: Partial<Group>): Promise<Group> {
    await simulateApiDelay(300);
    
    const groupIndex = _userGroups.findIndex(g => g.id === groupId);
    if (groupIndex === -1) {
      throw new Error('Group not found');
    }
    
    _userGroups[groupIndex] = {
      ..._userGroups[groupIndex],
      ...updates,
    };
    
    return _userGroups[groupIndex];
  },

  /**
   * Get available friends to add to group
   */
  async getFriends(): Promise<GroupMember[]> {
    await simulateApiDelay(300);
    
    return _availableFriends;
  },

  /**
   * Delete the current group
   */
  async deleteGroup(groupId: string): Promise<void> {
    await simulateApiDelay(500);
    
    // Find the group
    const groupIndex = _userGroups.findIndex(g => g.id === groupId);
    if (groupIndex === -1) return;
    
    // Remove the group
    _userGroups.splice(groupIndex, 1);
    
    // Update available friends
    _availableFriends = getAvailableFriendsForGroups(_userGroups);
  },
};