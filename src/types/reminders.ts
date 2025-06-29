export interface Reminder {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'challenge' | 'workout' | 'meal' | 'medicine' | 'water' | 'custom';
  scheduledTime: Date;
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number; // every X days/weeks/months
    daysOfWeek?: number[]; // 0-6, where 0 is Sunday
    endDate?: Date;
  };
  isEnabled: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  relatedItemId?: string; // ID of related challenge, workout, etc.
  relatedItemType?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  snoozeCount?: number;
}

export interface ReminderSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // "22:00"
  quietHoursEnd?: string; // "07:00"
  defaultSnoozeMinutes: number;
  maxSnoozes: number;
  groupSimilarReminders: boolean;
}