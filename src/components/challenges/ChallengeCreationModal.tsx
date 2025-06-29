import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Calendar, Users, Trophy, Target, Plus, Trash2, Clock, Bell } from 'lucide-react';
import { Challenge, ChallengeGoal, ChallengeTemplate } from '../../types/challenges';
import { challengeApi } from '../../services/challengeApi';
import { friendsApi } from '../../services/friendsApi';
import { groupApi } from '../../services/groupApi';
import { Friend } from '../../types/friends';
import { GroupMember } from '../../types';

interface ChallengeCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChallengeCreated: (challenge: Challenge) => void;
}

export function ChallengeCreationModal({ isOpen, onClose, onChallengeCreated }: ChallengeCreationModalProps) {
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<ChallengeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ChallengeTemplate | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const isSubmittingRef = useRef(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    rules: '',
    rewards: '',
    category: 'steps' as Challenge['category'],
    isPublic: true,
    maxMembers: 20,
    goals: [] as Omit<ChallengeGoal, 'id' | 'challengeId' | 'currentValue' | 'isCompleted'>[],
    invitedFriends: [] as string[],
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [templatesData, friendsData, groupData] = await Promise.all([
        challengeApi.getChallengeTemplates(),
        friendsApi.getFriends(),
        groupApi.getFriends(),
      ]);
      
      setTemplates(templatesData);
      setFriends(friendsData);
      setGroupMembers(groupData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: ChallengeTemplate) => {
    setSelectedTemplate(template);
    
    // Pre-fill form data from template
    setFormData(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      rules: template.rules,
      rewards: template.rewards,
      category: template.category,
      endDate: new Date(Date.now() + template.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      goals: template.goals,
    }));
    
    setStep(2);
  };

  const handleAddGoal = () => {
    setFormData(prev => ({
      ...prev,
      goals: [
        ...prev.goals,
        {
          name: '',
          description: '',
          targetValue: 0,
          unit: '',
          type: prev.category,
        },
      ],
    }));
  };

  const handleRemoveGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateGoal = (index: number, field: keyof Omit<ChallengeGoal, 'id' | 'challengeId' | 'currentValue' | 'isCompleted'>, value: any) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === index ? { ...goal, [field]: value } : goal
      ),
    }));
  };

  const handleToggleFriend = (friendId: string) => {
    setFormData(prev => {
      const invitedFriends = [...prev.invitedFriends];
      
      if (invitedFriends.includes(friendId)) {
        return {
          ...prev,
          invitedFriends: invitedFriends.filter(id => id !== friendId),
        };
      } else {
        return {
          ...prev,
          invitedFriends: [...invitedFriends, friendId],
        };
      }
    });
  };

  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (isSubmittingRef.current) {
      return;
    }
    
    isSubmittingRef.current = true;
    
    try {
      setLoading(true);
      
      // Validate form data
      if (!formData.name.trim()) {
        alert('Please enter a challenge name');
        return;
      }
      
      if (formData.goals.length === 0) {
        alert('Please add at least one goal');
        return;
      }
      
      // Create challenge
      const challenge: Omit<Challenge, 'id' | 'createdAt' | 'members'> = {
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        createdBy: 'current-user',
        isActive: true,
        isPublic: formData.isPublic,
        rules: formData.rules,
        rewards: formData.rewards,
        goals: formData.goals.map(goal => ({
          ...goal,
          id: '', // Will be set by the API
          challengeId: '', // Will be set by the API
          currentValue: 0,
          isCompleted: false,
        })),
        category: formData.category,
        maxMembers: formData.maxMembers,
      };
      
      const newChallenge = await challengeApi.createChallenge(challenge);
      
      // Invite friends
      if (formData.invitedFriends.length > 0) {
        await challengeApi.inviteToChallenge(newChallenge.id, formData.invitedFriends);
      }
      
      onChallengeCreated(newChallenge);
    } catch (error) {
      console.error('Failed to create challenge:', error);
      alert('Failed to create challenge. Please try again.');
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleClose = () => {
    // Reset form data
    setFormData({
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rules: '',
      rewards: '',
      category: 'steps',
      isPublic: true,
      maxMembers: 20,
      goals: [],
      invitedFriends: [],
    });
    setSelectedTemplate(null);
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {step === 1 ? 'Choose a Template' : 'Create Challenge'}
          </h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading...</p>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="p-4 space-y-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Choose a template to get started quickly, or create a custom challenge.
                </p>
                
                <div className="space-y-3">
                  {templates.map(template => (
                    <div
                      key={template.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <Trophy size={20} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{template.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{template.duration} days</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                          {template.category}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {template.goals.length} goal{template.goals.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <div
                    className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-colors cursor-pointer border-2 border-dashed border-purple-200 dark:border-purple-800"
                    onClick={() => setStep(2)}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <Plus size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Custom Challenge</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Create from scratch</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Design your own challenge with custom goals, rules, and rewards.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="p-4 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Challenge Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., 30-Day Step Challenge"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={3}
                      placeholder="Describe your challenge..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date
                      </label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date
                      </label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                          className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Challenge['category'] }))}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="steps">Steps</option>
                      <option value="workouts">Workouts</option>
                      <option value="meals">Meals</option>
                      <option value="weight">Weight</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                {/* Goals */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                      <Target size={16} className="mr-2 text-blue-500" />
                      Challenge Goals
                    </h4>
                    <button
                      onClick={handleAddGoal}
                      className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors text-sm"
                    >
                      <Plus size={14} />
                      <span>Add Goal</span>
                    </button>
                  </div>
                  
                  {formData.goals.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No goals added yet. Click "Add Goal" to create one.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.goals.map((goal, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900 dark:text-white text-sm">Goal {index + 1}</h5>
                            <button
                              onClick={() => handleRemoveGoal(index)}
                              className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={goal.name}
                              onChange={(e) => handleUpdateGoal(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Goal name"
                            />
                            
                            <input
                              type="text"
                              value={goal.description}
                              onChange={(e) => handleUpdateGoal(index, 'description', e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Goal description"
                            />
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <input
                                  type="number"
                                  value={goal.targetValue}
                                  onChange={(e) => handleUpdateGoal(index, 'targetValue', parseInt(e.target.value) || 0)}
                                  className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="Target value"
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  value={goal.unit}
                                  onChange={(e) => handleUpdateGoal(index, 'unit', e.target.value)}
                                  className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="Unit (e.g., steps)"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rules and Rewards */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rules
                    </label>
                    <textarea
                      value={formData.rules}
                      onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={3}
                      placeholder="Describe the rules of your challenge..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rewards
                    </label>
                    <textarea
                      value={formData.rewards}
                      onChange={(e) => setFormData(prev => ({ ...prev, rewards: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={3}
                      placeholder="Describe the rewards for completing the challenge..."
                    />
                  </div>
                </div>

                {/* Invite Friends */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <Users size={16} className="mr-2 text-green-500" />
                    Invite Friends
                  </h4>
                  
                  {friends.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        You don't have any friends yet. Add friends to invite them to your challenge.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {friends.map(friend => (
                        <div
                          key={friend.id}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {friend.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white text-sm">{friend.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">@{friend.username}</div>
                            </div>
                          </div>
                          
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.invitedFriends.includes(friend.id)}
                              onChange={() => handleToggleFriend(friend.id)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Privacy Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Privacy Settings</h4>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">Public Challenge</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Anyone can find and join this challenge
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                {/* Reminders */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <Bell size={16} className="mr-2 text-orange-500" />
                    Reminders
                  </h4>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">Daily Reminders</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Remind participants daily about the challenge
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-gray-400" />
                      <select
                        className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white text-sm p-1"
                      >
                        <option value="08:00">8:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="20:00">8:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 flex space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Back
                </button>
              )}
              
              <div className="flex-1" />
              
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              
              {step === 1 ? (
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>Skip Template</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || isSubmittingRef.current}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Create Challenge</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}