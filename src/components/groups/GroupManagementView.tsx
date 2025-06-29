import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Users, 
  MessageSquare,
  Plus,
  Crown, 
  UserMinus, 
  UserPlus, 
  Settings,
  Trash2,
  Edit3,
  Calendar,
  Shield,
  AlertTriangle,
  Zap,
  Lock,
  X,
  Check
} from 'lucide-react';
import { Group, GroupMember, GroupData } from '../../types';
import { useUserMode } from '../../hooks/useUserMode';
import { groupApi } from '../../services/groupApi';
import { chatService } from '../../services/chatService';
import { GroupChatWindow } from './GroupChatWindow';
import { MealSummary, WorkoutSummary } from '../../types/chat';

interface GroupManagementViewProps {
  onBack: () => void;
}

export function GroupManagementView({ onBack }: GroupManagementViewProps): React.JSX.Element {
  const { isPremium, userMode } = useUserMode();
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [availableFriends, setAvailableFriends] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupMessages, setGroupMessages] = useState<Record<string, any[]>>({});
  
  // Form state
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  useEffect(() => {
    loadGroupData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPremium]);

  const loadGroupData = async () => {
    try {
      setLoading(true);
      const groups = await groupApi.getAllUserGroups(isPremium);
      setUserGroups(groups);
      
      // Get available friends
      const friends = await groupApi.getFriends();
      setAvailableFriends(friends);
      
      // Load messages for all groups
      for (const group of groups) {
        if (group) {
          const messages = await chatService.getGroupMessages(group.id);
          setGroupMessages(prev => ({
            ...prev,
            [group.id]: messages
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load group data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert('Group name is required');
      return;
    }

    // Check free tier limits
    if (!isPremium && userGroups.length >= 1) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      setActionLoading('create');
      await groupApi.createGroup(groupName, groupDescription, isPremium);
      const updatedGroups = await groupApi.getAllUserGroups(isPremium);
      setUserGroups(updatedGroups);
      setShowCreateForm(false);
      setGroupName('');
      setGroupDescription('');
    } catch (error) {
      console.error('Failed to create group:', error);
      alert('Failed to create group. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendMessage = async (groupId: string, content: string) => {
    try {
      await chatService.sendMessage(groupId, content);
      // Fetch the updated messages from the service instead of appending
      const updatedMessages = await chatService.getGroupMessages(groupId);
      setGroupMessages(prev => ({ ...prev, [groupId]: updatedMessages }));
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleShareMeal = async (groupId: string, mealSummary: MealSummary) => {
    try {
      await chatService.shareMeal(groupId, mealSummary);
      // Fetch the updated messages from the service instead of appending
      const updatedMessages = await chatService.getGroupMessages(groupId);
      setGroupMessages(prev => ({ ...prev, [groupId]: updatedMessages }));
    } catch (error) {
      console.error('Failed to share meal:', error);
    }
  };

  const handleShareWorkout = async (groupId: string, workoutSummary: WorkoutSummary) => {
    try {
      await chatService.shareWorkout(groupId, workoutSummary);
      // Fetch the updated messages from the service instead of appending
      const updatedMessages = await chatService.getGroupMessages(groupId);
      setGroupMessages(prev => ({ ...prev, [groupId]: updatedMessages }));
    } catch (error) {
      console.error('Failed to share workout:', error);
    }
  };

  const handleAddMember = async (memberId: string) => {
    if (!selectedGroup) return;

    // Check member limits
    const currentMemberCount = selectedGroup.members.length;
    const maxMembers = isPremium ? 20 : 4;
    
    if (currentMemberCount >= maxMembers) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      setActionLoading(`add-${memberId}`);
      await groupApi.addMember(selectedGroup.id, memberId);
      await refreshSelectedGroup();
      setShowAddMemberModal(false);
    } catch (error) {
      console.error('Failed to add member:', error);
      alert('Failed to add member. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveMember = async (groupId: string, memberId: string) => {
    if (memberId === 'current-user') return;

    if (window.confirm('Are you sure you want to remove this member from the group?')) {
      try {
        setActionLoading(`remove-${memberId}`);
        await groupApi.removeMember(groupId, memberId);
        await refreshSelectedGroup();
      } catch (error) {
        console.error('Failed to remove member:', error);
        alert('Failed to remove member. Please try again.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const refreshSelectedGroup = async () => {
    if (!selectedGroup) return;
    
    try {
      const updatedGroup = await groupApi.getGroupById(selectedGroup.id);
      if (updatedGroup) {
        setSelectedGroup(updatedGroup);
        // Also update in the groups list
        setUserGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
      }
    } catch (error) {
      console.error('Failed to refresh group:', error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!groupId) return;

    if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      try {
        setActionLoading('delete');
        await groupApi.deleteGroup(groupId);
        await loadGroupData(); // Reload all groups
      } catch (error) {
        console.error('Failed to delete group:', error);
        alert('Failed to delete group. Please try again.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  // If a group is selected, show the chat window for that group
  if (selectedGroup) {
    return (
      <GroupChatWindow
        group={selectedGroup}
        messages={groupMessages[selectedGroup.id] || []}
        onSendMessage={handleSendMessage}
        onShareMeal={handleShareMeal}
        onShareWorkout={handleShareWorkout}
        onBack={() => setSelectedGroup(null)} 
        onAddMember={() => setShowAddMemberModal(true)} 
        onRemoveMember={handleRemoveMember}
      />
    );
  }

  if (loading) {
    return (
      <div className="pt-0 px-4 pb-24">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Loading group data...</p>
        </div>
      </div>
    );
  }

  // Calculate limits and counts
  const maxGroups = isPremium ? 'Unlimited' : 1;
  const maxMembers = isPremium ? 20 : 4;
  const currentGroupCount = userGroups.length;
  const canCreateNewGroup = isPremium || currentGroupCount < 1;

  return (
    <div className="pt-0 px-4 pb-24 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
          <span className="font-semibold text-lg text-gray-900 dark:text-white">Groups</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Add any header actions here if needed */}
          {canCreateNewGroup && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={16} />
              <span>New Group</span>
            </button>
          )}
        </div>
      </div>

      {/* Plan Limits */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="mr-2 text-blue-600 dark:text-blue-400" size={18} />
            Current Plan Limits
          </div>
          {isPremium ? (
            <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm">
              <Crown size={14} />
              <span>Premium</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
              <Lock size={14} />
              <span>Free</span>
            </div>
          )}
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Groups</div>
            <div className="flex items-center justify-between font-semibold text-gray-900 dark:text-white">
              <span>{currentGroupCount}</span>
              <span>/ {typeof maxGroups === 'string' ? maxGroups : maxGroups}</span>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Members per group</div>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-gray-900 dark:text-white">{maxMembers}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Groups List */}
      {userGroups.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Users className="mr-2 text-purple-600 dark:text-purple-400" size={18} />
            Your Groups ({userGroups.length})
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {userGroups.map(group => (
              <div 
                key={group.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700"
                onClick={() => setSelectedGroup(group)}
                style={{ cursor: 'pointer' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Users size={18} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{group.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {group.members.length} members
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group.id);
                      }}
                      disabled={actionLoading === 'delete'}
                      className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
                
                {group.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {group.description}
                  </p>
                )}                
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* No Group Yet */}
          {!showCreateForm ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-purple-600 dark:text-purple-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Group Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Create a group to connect with friends and track fitness goals together
              </p>
              {canCreateNewGroup ? (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus size={20} />
                  <span className="font-medium">Create Group</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Crown size={20} />
                  <span className="font-medium">Upgrade to Create More Groups</span>
                </button>
              )}
              
              {!isPremium && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-left">
                  <div className="flex items-start space-x-3">
                    <Crown size={18} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                        Premium Benefits
                      </p>
                      <ul className="text-xs text-blue-600 dark:text-blue-400 mt-1 space-y-1">
                        <li>• Create unlimited groups</li>
                        <li>• Add up to 20 members per group</li>
                        <li>• Advanced group analytics</li>
                        <li>• Group challenges and competitions</li>
                      </ul>
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="mt-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-xs font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
                      >
                        Upgrade to Premium
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Create Group Form
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New Group
                </h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Fitness Buddies"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                    placeholder="Describe your group's purpose..."
                  />
                </div>
                
                <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <Shield size={16} className="text-blue-600 dark:text-blue-400" />
                  <span>You'll be the admin of this group</span>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleCreateGroup}
                    disabled={!groupName.trim() || actionLoading === 'create'}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {actionLoading === 'create' ? (
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Plus size={18} />
                        <span>Create Group</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Free Tier Limitations */}
          {!isPremium && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                  <Zap size={24} className="text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Free Tier Limitations
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span>Create {maxGroups} group</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span>Add up to {maxMembers} members</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <X size={12} className="text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-gray-400 dark:text-gray-500">Group challenges</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <X size={12} className="text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-gray-400 dark:text-gray-500">Advanced analytics</span>
                    </li>
                  </ul>
                  
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="mt-4 w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between text-white">
                <h3 className="text-xl font-bold">Upgrade to Premium</h3>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <Crown size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Premium Benefits</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Unlock all features and remove limitations
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <Check size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Unlimited Groups</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Create as many groups as you need</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <Check size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">20 Members Per Group</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Add up to 20 members to each group</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <Check size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Group Challenges</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Create and participate in fitness challenges</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <Check size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Advanced Analytics</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Track group progress and achievements</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Current Plan</div>
                  <div className="font-bold text-gray-900 dark:text-white text-lg">
                    {isPremium ? 'Premium' : 'Free'}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => {
                    // In a real app, this would redirect to a payment page
                    alert('This would redirect to a payment page in a real app.');
                    setShowUpgradeModal(false);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  Upgrade Now
                </button>
                
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}