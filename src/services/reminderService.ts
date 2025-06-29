import { Reminder, ReminderSettings } from '../types/reminders';

// In-memory storage for reminders
let reminders: Reminder[] = [];
let reminderTimers: Record<string, NodeJS.Timeout> = {};

// Default reminder settings
let reminderSettings: ReminderSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  defaultSnoozeMinutes: 10,
  maxSnoozes: 3,
  groupSimilarReminders: true,
};

// Simulate API delay
const simulateApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock notification function
const showNotification = (reminder: Reminder) => {
  console.log(`NOTIFICATION: ${reminder.title} - ${reminder.message}`);
  
  // In a real app, we would use the Notification API or a notification library
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(reminder.title, {
        body: reminder.message,
        icon: '/favicon.ico',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(reminder.title, {
            body: reminder.message,
            icon: '/favicon.ico',
          });
        }
      });
    }
  }
  
  // For demo purposes, we'll also show an alert
  alert(`${reminder.title}: ${reminder.message}`);
};

// Check if current time is within quiet hours
const isQuietHours = (): boolean => {
  if (!reminderSettings.quietHoursEnabled) {
    return false;
  }
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;
  
  const [startHour, startMinute] = reminderSettings.quietHoursStart?.split(':').map(Number) || [22, 0];
  const [endHour, endMinute] = reminderSettings.quietHoursEnd?.split(':').map(Number) || [7, 0];
  
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  
  // Handle case where quiet hours span midnight
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime <= endTime;
  }
  
  return currentTime >= startTime && currentTime <= endTime;
};

export const reminderService = {
  /**
   * Schedule a new reminder
   */
  async scheduleReminder(reminder: Omit<Reminder, 'id' | 'createdAt'>): Promise<Reminder> {
    await simulateApiDelay(300);
    
    const newReminder: Reminder = {
      ...reminder,
      id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    
    reminders.push(newReminder);
    
    // Schedule the reminder
    this.scheduleReminderNotification(newReminder);
    
    return newReminder;
  },

  /**
   * Schedule a notification for a reminder
   */
  scheduleReminderNotification(reminder: Reminder): void {
    if (!reminder.isEnabled) return;
    
    const now = new Date();
    const scheduledTime = new Date(reminder.scheduledTime);
    
    // Calculate delay in milliseconds
    let delay = scheduledTime.getTime() - now.getTime();
    
    // If the scheduled time is in the past, don't schedule
    if (delay < 0) return;
    
    // Schedule the notification
    const timerId = setTimeout(() => {
      // Check if it's quiet hours
      if (isQuietHours()) {
        console.log(`Reminder "${reminder.title}" suppressed due to quiet hours`);
        return;
      }
      
      // Show the notification
      showNotification(reminder);
      
      // Update the reminder
      const index = reminders.findIndex(r => r.id === reminder.id);
      if (index !== -1) {
        reminders[index].lastTriggered = new Date();
      }
      
      // If it's recurring, schedule the next occurrence
      if (reminder.isRecurring && reminder.recurringPattern) {
        this.scheduleNextRecurrence(reminder);
      } else {
        // Remove the timer reference
        delete reminderTimers[reminder.id];
      }
    }, delay);
    
    // Store the timer reference
    reminderTimers[reminder.id] = timerId;
  },

  /**
   * Schedule the next recurrence of a recurring reminder
   */
  scheduleNextRecurrence(reminder: Reminder): void {
    if (!reminder.isRecurring || !reminder.recurringPattern) return;
    
    const now = new Date();
    const pattern = reminder.recurringPattern;
    let nextDate = new Date(reminder.scheduledTime);
    
    switch (pattern.frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + pattern.interval);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + (pattern.interval * 7));
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + pattern.interval);
        break;
    }
    
    // If end date is specified and next date is after end date, don't schedule
    if (pattern.endDate && nextDate > pattern.endDate) return;
    
    // Update the reminder with the new scheduled time
    const index = reminders.findIndex(r => r.id === reminder.id);
    if (index !== -1) {
      reminders[index].scheduledTime = nextDate;
      
      // Schedule the next notification
      this.scheduleReminderNotification(reminders[index]);
    }
  },

  /**
   * Cancel a reminder
   */
  async cancelReminder(reminderId: string): Promise<void> {
    await simulateApiDelay(200);
    
    // Clear the timer
    if (reminderTimers[reminderId]) {
      clearTimeout(reminderTimers[reminderId]);
      delete reminderTimers[reminderId];
    }
    
    // Remove the reminder
    reminders = reminders.filter(r => r.id !== reminderId);
  },

  /**
   * Update a reminder
   */
  async updateReminder(reminderId: string, updates: Partial<Reminder>): Promise<Reminder> {
    await simulateApiDelay(300);
    
    const index = reminders.findIndex(r => r.id === reminderId);
    if (index === -1) {
      throw new Error('Reminder not found');
    }
    
    // Cancel the existing timer
    if (reminderTimers[reminderId]) {
      clearTimeout(reminderTimers[reminderId]);
      delete reminderTimers[reminderId];
    }
    
    // Update the reminder
    reminders[index] = {
      ...reminders[index],
      ...updates,
    };
    
    // Reschedule if enabled
    if (reminders[index].isEnabled) {
      this.scheduleReminderNotification(reminders[index]);
    }
    
    return reminders[index];
  },

  /**
   * Get all reminders
   */
  async getReminders(): Promise<Reminder[]> {
    await simulateApiDelay();
    return reminders;
  },

  /**
   * Get reminder settings
   */
  async getReminderSettings(): Promise<ReminderSettings> {
    await simulateApiDelay();
    return reminderSettings;
  },

  /**
   * Update reminder settings
   */
  async updateReminderSettings(updates: Partial<ReminderSettings>): Promise<ReminderSettings> {
    await simulateApiDelay(300);
    
    reminderSettings = {
      ...reminderSettings,
      ...updates,
    };
    
    return reminderSettings;
  },

  /**
   * Snooze a reminder
   */
  async snoozeReminder(reminderId: string): Promise<Reminder> {
    await simulateApiDelay(200);
    
    const index = reminders.findIndex(r => r.id === reminderId);
    if (index === -1) {
      throw new Error('Reminder not found');
    }
    
    // Cancel the existing timer
    if (reminderTimers[reminderId]) {
      clearTimeout(reminderTimers[reminderId]);
      delete reminderTimers[reminderId];
    }
    
    // Update snooze count
    reminders[index].snoozeCount = (reminders[index].snoozeCount || 0) + 1;
    
    // Calculate new scheduled time
    const now = new Date();
    const snoozeMinutes = reminderSettings.defaultSnoozeMinutes;
    const newScheduledTime = new Date(now.getTime() + snoozeMinutes * 60 * 1000);
    
    reminders[index].scheduledTime = newScheduledTime;
    
    // Reschedule
    this.scheduleReminderNotification(reminders[index]);
    
    return reminders[index];
  },

  /**
   * Schedule a challenge reminder
   */
  async scheduleChallengeReminder(
    challengeId: string,
    challengeName: string,
    message: string,
    scheduledTime: Date
  ): Promise<Reminder> {
    return this.scheduleReminder({
      userId: 'current-user',
      title: `Challenge: ${challengeName}`,
      message,
      type: 'challenge',
      scheduledTime,
      isRecurring: false,
      isEnabled: true,
      priority: 'medium',
      relatedItemId: challengeId,
      relatedItemType: 'challenge',
    });
  },

  /**
   * Clean up all timers (useful for component unmounting)
   */
  cleanupTimers(): void {
    Object.values(reminderTimers).forEach(timer => clearTimeout(timer));
    reminderTimers = {};
  },
};