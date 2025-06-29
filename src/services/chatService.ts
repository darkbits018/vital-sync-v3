import { GroupChatMessage, MealSummary, WorkoutSummary } from '../types/chat';

// In-memory storage for chat messages
const chatMessages: Record<string, GroupChatMessage[]> = {};

// Mock user data
const currentUser = {
  id: 'current-user',
  name: 'You',
  avatar: undefined
};

// Simulate API delay
const simulateApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const chatService = {
  /**
   * Get chat messages for a specific group
   */
  async getGroupMessages(groupId: string): Promise<GroupChatMessage[]> {
    await simulateApiDelay();
    
    // Initialize if not exists
    if (!chatMessages[groupId]) {
      chatMessages[groupId] = generateInitialMessages(groupId);
    }
    
    return chatMessages[groupId];
  },

  /**
   * Send a message to a group
   */
  async sendMessage(
    groupId: string, 
    content: string, 
    type: 'text' | 'shared_meal' | 'shared_workout' = 'text',
    data?: MealSummary | WorkoutSummary
  ): Promise<GroupChatMessage> {
    await simulateApiDelay(300);
    
    // Create new message
    const newMessage: GroupChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      groupId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content,
      timestamp: new Date(),
      type,
      data
    };
    
    // Store the message in the internal storage
    if (!chatMessages[groupId]) {
      chatMessages[groupId] = [];
    }
    chatMessages[groupId].push(newMessage);
    
    return newMessage;
  },

  /**
   * Share a meal in the group chat
   */
  async shareMeal(groupId: string, mealSummary: MealSummary): Promise<GroupChatMessage> {
    const content = `I just logged my ${mealSummary.mealType}: ${mealSummary.name}`;
    return this.sendMessage(groupId, content, 'shared_meal', mealSummary);
  },

  /**
   * Share a workout in the group chat
   */
  async shareWorkout(groupId: string, workoutSummary: WorkoutSummary): Promise<GroupChatMessage> {
    const content = `I just completed a workout: ${workoutSummary.name}`;
    return this.sendMessage(groupId, content, 'shared_workout', workoutSummary);
  },

  /**
   * Clear chat history for a group (for testing)
   */
  clearGroupChat(groupId: string): void {
    chatMessages[groupId] = [];
  }
};

// Generate some initial messages for a new group chat
function generateInitialMessages(groupId: string): GroupChatMessage[] {
  const now = new Date();
  const messages = [
    {
      id: `welcome-${groupId}`,
      groupId,
      senderId: 'system',
      senderName: 'System',
      content: 'Welcome to the group chat! Share your fitness journey with friends.',
      timestamp: new Date(now.getTime() - 86400000), // 1 day ago
      type: 'text' as const
    },
    {
      id: `tip-${groupId}`,
      groupId,
      senderId: 'system',
      senderName: 'System',
      content: 'Tip: Use the quick share buttons to share your meals and workouts with the group.',
      timestamp: new Date(now.getTime() - 86300000), // 23 hours 58 minutes ago
      type: 'text' as const
    }
  ];
  
  // Store the messages in the internal storage
  chatMessages[groupId] = messages;
  
  return messages;
}