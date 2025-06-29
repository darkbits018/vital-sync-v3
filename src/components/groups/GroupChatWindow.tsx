import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { GroupChatMessage, MealSummary, WorkoutSummary } from '../../types/chat';
import { Group } from '../../types';
import { GroupHeader } from './GroupHeader';
import { MemberListDrawer } from './MemberListDrawer';
import { QuickShareButtons } from './QuickShareButtons';
import { SharedMealCard } from './SharedMealCard';
import { SharedWorkoutCard } from './SharedWorkoutCard';
import { useUserMode } from '../../hooks/useUserMode';

interface GroupChatWindowProps {
  group: Group;
  messages: GroupChatMessage[];
  onSendMessage: (groupId: string, content: string) => Promise<void>;
  onShareMeal: (groupId: string, mealSummary: MealSummary) => Promise<void>;
  onShareWorkout: (groupId: string, workoutSummary: WorkoutSummary) => Promise<void>;
  onBack: () => void;
  onAddMember: () => void;
  onRemoveMember: (groupId: string, memberId: string) => void;
}

export function GroupChatWindow({ 
  group, 
  messages, 
  onSendMessage, 
  onShareMeal,
  onShareWorkout,
  onBack,
  onAddMember,
  onRemoveMember
}: GroupChatWindowProps) {
  const [message, setMessage] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isPremium } = useUserMode();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await onSendMessage(group.id, message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleShareMeal = async (mealSummary: MealSummary) => {
    await onShareMeal(group.id, mealSummary);
  };

  const handleShareWorkout = async (workoutSummary: WorkoutSummary) => {
    await onShareWorkout(group.id, workoutSummary);
  };

  const onlineCount = group.members.filter(member => member.status === 'online').length;

  return (
    <div className="flex flex-col h-full">
      {/* Back Button and Header */}
      <div className="flex items-center bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          className="p-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex-1">
          <GroupHeader
            groupName={group.name}
            memberCount={group.members.length}
            isShowingMembers={showMembers}
            onToggleMembers={() => setShowMembers(!showMembers)}
            onlineCount={onlineCount}
          />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              msg.senderId === 'current-user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              {/* Avatar */}
              {msg.senderId !== 'system' && (
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.senderId === 'current-user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}>
                  <span className="text-sm font-medium">
                    {msg.senderName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Message Content */}
              <div className={`flex flex-col ${msg.senderId === 'current-user' ? 'items-end' : 'items-start'}`}>
                {/* Sender Name (not for current user) */}
                {msg.senderId !== 'current-user' && msg.senderId !== 'system' && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
                    {msg.senderName}
                  </span>
                )}
                
                {/* System Message */}
                {msg.senderId === 'system' ? (
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <>
                    {/* Regular Text Message */}
                    {msg.type === 'text' && (
                      <div className={`px-3 py-2 rounded-lg ${
                        msg.senderId === 'current-user' 
                          ? 'bg-purple-600 text-white rounded-br-none' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    )}
                    
                    {/* Shared Meal */}
                    {msg.type === 'shared_meal' && (
                      <div className="space-y-2">
                        <div className={`px-3 py-2 rounded-lg ${
                          msg.senderId === 'current-user' 
                            ? 'bg-purple-600 text-white rounded-br-none' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <SharedMealCard mealSummary={msg.data as MealSummary} />
                      </div>
                    )}
                    
                    {/* Shared Workout */}
                    {msg.type === 'shared_workout' && (
                      <div className="space-y-2">
                        <div className={`px-3 py-2 rounded-lg ${
                          msg.senderId === 'current-user' 
                            ? 'bg-purple-600 text-white rounded-br-none' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <SharedWorkoutCard workoutSummary={msg.data as WorkoutSummary} />
                      </div>
                    )}
                  </>
                )}
                
                {/* Timestamp */}
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Share Buttons */}
      {/* Removed the separate Quick Share Buttons section */}

      {/* Message Input */}
      <div className="fixed bottom-[60px] left-0 right-0 px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40 flex justify-center">
        <div className="w-full max-w-md">
          <div className="flex items-center space-x-2">
            <QuickShareButtons
              onShareMeal={handleShareMeal}
              onShareWorkout={handleShareWorkout}
            />

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`p-2 rounded-lg ${
                message.trim()
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Member List Drawer */}
      <MemberListDrawer
        isOpen={showMembers}
        onClose={() => setShowMembers(false)}
        members={group.members}
        onAddMember={onAddMember}
        onRemoveMember={(memberId) => onRemoveMember(group.id, memberId)}
        maxMembers={group.maxMembers}
      />
    </div>
  );
}