import React, { useState, useEffect } from 'react';
import { Activity, Dumbbell, Utensils, Trophy, Clock, TrendingUp, Users } from 'lucide-react';
import { Friend } from '../../types/friends';

interface FriendActivity {
  id: string;
  friendId: string;
  friendName: string;
  type: 'workout' | 'meal' | 'achievement' | 'goal_reached';
  title: string;
  description: string;
  timestamp: Date;
  data?: any;
}

interface TodaysActivityProps {
  friends: Friend[];
}

// Mock activity data
const generateMockActivities = (friends: Friend[]): FriendActivity[] => {
  const activities: FriendActivity[] = [];
  const now = new Date();
  
  friends.forEach((friend, index) => {
    // Generate 1-3 activities per friend for today
    const activityCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < activityCount; i++) {
      const activityTypes = ['workout', 'meal', 'achievement', 'goal_reached'] as const;
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      
      let title = '';
      let description = '';
      
      switch (type) {
        case 'workout':
          const workouts = ['Upper Body Strength', 'Cardio Session', 'Leg Day', 'Full Body HIIT', 'Yoga Flow'];
          const workout = workouts[Math.floor(Math.random() * workouts.length)];
          title = `${friend.name} completed a workout`;
          description = `${workout} - ${30 + Math.floor(Math.random() * 60)} minutes`;
          break;
        case 'meal':
          const meals = ['Protein Smoothie', 'Grilled Chicken Salad', 'Quinoa Bowl', 'Greek Yogurt Parfait'];
          const meal = meals[Math.floor(Math.random() * meals.length)];
          title = `${friend.name} logged a meal`;
          description = `${meal} - ${200 + Math.floor(Math.random() * 400)} calories`;
          break;
        case 'achievement':
          const achievements = ['Completed 100 workouts', 'Lost 5kg this month', 'Hit protein goal for 7 days', 'Ran 10km personal best'];
          title = `${friend.name} earned an achievement`;
          description = achievements[Math.floor(Math.random() * achievements.length)];
          break;
        case 'goal_reached':
          const goals = ['Weekly workout goal', 'Daily water intake', 'Step count target', 'Sleep goal'];
          title = `${friend.name} reached their goal`;
          description = goals[Math.floor(Math.random() * goals.length)];
          break;
      }
      
      activities.push({
        id: `${friend.id}-${i}-${Date.now()}`,
        friendId: friend.id,
        friendName: friend.name,
        type,
        title,
        description,
        timestamp: new Date(now.getTime() - Math.random() * 12 * 60 * 60 * 1000), // Random time within last 12 hours
      });
    }
  });
  
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export function TodaysActivity({ friends }: TodaysActivityProps) {
  const [activities, setActivities] = useState<FriendActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadActivities = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockActivities = generateMockActivities(friends);
      setActivities(mockActivities);
      setLoading(false);
    };

    loadActivities();
  }, [friends]);

  const getActivityIcon = (type: FriendActivity['type']) => {
    switch (type) {
      case 'workout':
        return <Dumbbell size={16} className="text-blue-600 dark:text-blue-400" />;
      case 'meal':
        return <Utensils size={16} className="text-green-600 dark:text-green-400" />;
      case 'achievement':
        return <Trophy size={16} className="text-yellow-600 dark:text-yellow-400" />;
      case 'goal_reached':
        return <TrendingUp size={16} className="text-purple-600 dark:text-purple-400" />;
      default:
        return <Activity size={16} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const getActivityColor = (type: FriendActivity['type']) => {
    switch (type) {
      case 'workout':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'meal':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'achievement':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'goal_reached':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
          <Users className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Activity Today
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Your friends haven't logged any activities yet today. Check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Activity className="mr-2 text-purple-600 dark:text-purple-400" size={20} />
          Today's Activity
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {activities.length} activities
        </span>
      </div>

      {activities.map((activity) => (
        <div
          key={activity.id}
          className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${getActivityColor(activity.type)}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {activity.title}
                </h4>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock size={12} className="mr-1" />
                  {getTimeAgo(activity.timestamp)}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activity.description}
              </p>
              
              {/* Friend Avatar */}
              <div className="flex items-center mt-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-medium">
                    {activity.friendName.charAt(0)}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.friendName}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Activity Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mt-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Today's Summary</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {activities.filter(a => a.type === 'workout').length}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Workouts</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {activities.filter(a => a.type === 'meal').length}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">Meals</div>
          </div>
          
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {activities.filter(a => a.type === 'achievement').length}
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">Achievements</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {activities.filter(a => a.type === 'goal_reached').length}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Goals</div>
          </div>
        </div>
      </div>
    </div>
  );
}