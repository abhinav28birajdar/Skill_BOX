import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationPreferences {
  push_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  learning_reminders: boolean;
  assignment_deadlines: boolean;
  live_class_alerts: boolean;
  achievement_notifications: boolean;
  marketing_communications: boolean;
  quiet_hours: {
    enabled: boolean;
    start_time: string; // "22:00"
    end_time: string;   // "08:00"
  };
}

export interface NotificationTemplate {
  id: string;
  type: 'learning_reminder' | 'assignment_due' | 'live_class' | 'achievement' | 'system' | 'marketing';
  title: string;
  body: string;
  data?: Record<string, any>;
  priority: 'normal' | 'high' | 'max';
  category?: string;
}

export class NotificationService {
  static async initializeNotifications(): Promise<string | null> {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permission denied');
        return null;
      }

      // Get push token
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      
      // Configure notification categories
      await this.setupNotificationCategories();

      return token;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return null;
    }
  }

  private static async setupNotificationCategories(): Promise<void> {
    if (Platform.OS === 'ios') {
      await Notifications.setNotificationCategoryAsync('learning', [
        {
          identifier: 'VIEW_COURSE',
          buttonTitle: 'View Course',
          options: { opensAppToForeground: true },
        },
        {
          identifier: 'SNOOZE',
          buttonTitle: 'Remind Later',
          options: { opensAppToForeground: false },
        },
      ]);

      await Notifications.setNotificationCategoryAsync('assignment', [
        {
          identifier: 'VIEW_ASSIGNMENT',
          buttonTitle: 'View Assignment',
          options: { opensAppToForeground: true },
        },
        {
          identifier: 'MARK_COMPLETE',
          buttonTitle: 'Mark Complete',
          options: { opensAppToForeground: false },
        },
      ]);

      await Notifications.setNotificationCategoryAsync('live_class', [
        {
          identifier: 'JOIN_CLASS',
          buttonTitle: 'Join Now',
          options: { opensAppToForeground: true },
        },
        {
          identifier: 'VIEW_DETAILS',
          buttonTitle: 'View Details',
          options: { opensAppToForeground: true },
        },
      ]);
    }
  }

  // Push Token Management
  static async updatePushToken(userId: string, token: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_devices')
        .upsert({
          user_id: userId,
          push_token: token,
          platform: Platform.OS,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating push token:', error);
      return false;
    }
  }

  // Notification Preferences
  static async updateNotificationPreferences(
    userId: string, 
    preferences: Partial<NotificationPreferences>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  }

  static async getNotificationPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data || {
        push_enabled: true,
        email_enabled: true,
        sms_enabled: false,
        learning_reminders: true,
        assignment_deadlines: true,
        live_class_alerts: true,
        achievement_notifications: true,
        marketing_communications: false,
        quiet_hours: {
          enabled: true,
          start_time: '22:00',
          end_time: '08:00',
        },
      };
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return null;
    }
  }

  // Send Notifications
  static async sendLearningReminder(
    userId: string,
    courseTitle: string,
    courseId: string,
    scheduledTime?: Date
  ): Promise<boolean> {
    try {
      const preferences = await this.getNotificationPreferences(userId);
      if (!preferences?.learning_reminders || !preferences?.push_enabled) {
        return false;
      }

      const notification: NotificationTemplate = {
        id: `learning-${userId}-${courseId}-${Date.now()}`,
        type: 'learning_reminder',
        title: '📚 Time to Learn!',
        body: `Continue your progress in "${courseTitle}"`,
        data: {
          type: 'learning_reminder',
          course_id: courseId,
          user_id: userId,
        },
        priority: 'normal',
        category: 'learning',
      };

      return await this.scheduleNotification(notification, scheduledTime);
    } catch (error) {
      console.error('Error sending learning reminder:', error);
      return false;
    }
  }

  static async sendAssignmentDeadlineAlert(
    userId: string,
    assignmentTitle: string,
    assignmentId: string,
    dueDate: Date
  ): Promise<boolean> {
    try {
      const preferences = await this.getNotificationPreferences(userId);
      if (!preferences?.assignment_deadlines || !preferences?.push_enabled) {
        return false;
      }

      const hoursUntilDue = Math.round((dueDate.getTime() - Date.now()) / (1000 * 60 * 60));
      let body = '';

      if (hoursUntilDue <= 1) {
        body = `⚠️ "${assignmentTitle}" is due in less than 1 hour!`;
      } else if (hoursUntilDue <= 24) {
        body = `⏰ "${assignmentTitle}" is due in ${hoursUntilDue} hours`;
      } else {
        const daysUntilDue = Math.round(hoursUntilDue / 24);
        body = `📅 "${assignmentTitle}" is due in ${daysUntilDue} days`;
      }

      const notification: NotificationTemplate = {
        id: `assignment-${userId}-${assignmentId}-${Date.now()}`,
        type: 'assignment_due',
        title: 'Assignment Due Soon',
        body,
        data: {
          type: 'assignment_due',
          assignment_id: assignmentId,
          user_id: userId,
        },
        priority: hoursUntilDue <= 24 ? 'high' : 'normal',
        category: 'assignment',
      };

      return await this.scheduleNotification(notification);
    } catch (error) {
      console.error('Error sending assignment deadline alert:', error);
      return false;
    }
  }

  static async sendLiveClassAlert(
    userId: string,
    className: string,
    classId: string,
    startTime: Date,
    minutesBefore: number = 15
  ): Promise<boolean> {
    try {
      const preferences = await this.getNotificationPreferences(userId);
      if (!preferences?.live_class_alerts || !preferences?.push_enabled) {
        return false;
      }

      const notification: NotificationTemplate = {
        id: `live-class-${userId}-${classId}-${Date.now()}`,
        type: 'live_class',
        title: '🎥 Live Class Starting Soon',
        body: `"${className}" starts in ${minutesBefore} minutes`,
        data: {
          type: 'live_class',
          class_id: classId,
          user_id: userId,
        },
        priority: 'high',
        category: 'live_class',
      };

      const scheduledTime = new Date(startTime.getTime() - (minutesBefore * 60 * 1000));
      return await this.scheduleNotification(notification, scheduledTime);
    } catch (error) {
      console.error('Error sending live class alert:', error);
      return false;
    }
  }

  static async sendAchievementNotification(
    userId: string,
    achievementTitle: string,
    achievementDescription: string,
    achievementId: string
  ): Promise<boolean> {
    try {
      const preferences = await this.getNotificationPreferences(userId);
      if (!preferences?.achievement_notifications || !preferences?.push_enabled) {
        return false;
      }

      const notification: NotificationTemplate = {
        id: `achievement-${userId}-${achievementId}-${Date.now()}`,
        type: 'achievement',
        title: '🎉 Achievement Unlocked!',
        body: `${achievementTitle}: ${achievementDescription}`,
        data: {
          type: 'achievement',
          achievement_id: achievementId,
          user_id: userId,
        },
        priority: 'normal',
      };

      return await this.scheduleNotification(notification);
    } catch (error) {
      console.error('Error sending achievement notification:', error);
      return false;
    }
  }

  // Smart Notification Scheduling
  static async scheduleSmartLearningReminders(userId: string): Promise<boolean> {
    try {
      // Get user's learning patterns and preferences
      const { data: learningData, error } = await supabase
        .from('learning_analytics')
        .select('preferred_learning_times, weekly_goals')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      const preferences = await this.getNotificationPreferences(userId);
      if (!preferences?.learning_reminders) return false;

      // Schedule reminders based on user's optimal learning times
      const preferredTimes = learningData?.preferred_learning_times || ['09:00', '14:00', '19:00'];
      
      for (const time of preferredTimes) {
        const [hours, minutes] = time.split(':').map(Number);
        const scheduledDate = new Date();
        scheduledDate.setHours(hours, minutes, 0, 0);
        
        // If time has passed today, schedule for tomorrow
        if (scheduledDate < new Date()) {
          scheduledDate.setDate(scheduledDate.getDate() + 1);
        }

        await this.scheduleNotification({
          id: `smart-reminder-${userId}-${time}`,
          type: 'learning_reminder',
          title: '🧠 Time for Your Learning Session',
          body: 'Your brain is most receptive to learning right now!',
          data: {
            type: 'smart_learning_reminder',
            user_id: userId,
            scheduled_time: time,
          },
          priority: 'normal',
        }, scheduledDate);
      }

      return true;
    } catch (error) {
      console.error('Error scheduling smart learning reminders:', error);
      return false;
    }
  }

  // Local Notification Scheduling
  private static async scheduleNotification(
    notification: NotificationTemplate,
    scheduledTime?: Date
  ): Promise<boolean> {
    try {
      // Check quiet hours
      if (scheduledTime && await this.isInQuietHours(notification.data?.user_id, scheduledTime)) {
        // Reschedule outside quiet hours
        scheduledTime = await this.getNextAvailableTime(notification.data?.user_id, scheduledTime);
      }

      const notificationRequest: Notifications.NotificationRequestInput = {
        identifier: notification.id,
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
          categoryIdentifier: notification.category,
        },
        trigger: scheduledTime 
          ? { 
              type: 'date' as const,
              date: scheduledTime
            } as Notifications.DateTriggerInput
          : null, // Send immediately if no scheduled time
      };

      await Notifications.scheduleNotificationAsync(notificationRequest);

      // Log notification for analytics
      await this.logNotification(notification);

      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  }

  // Utility Methods
  private static async isInQuietHours(userId: string, time: Date): Promise<boolean> {
    try {
      const preferences = await this.getNotificationPreferences(userId);
      if (!preferences?.quiet_hours?.enabled) return false;

      const timeStr = time.toTimeString().slice(0, 5); // "HH:MM"
      const startTime = preferences.quiet_hours.start_time;
      const endTime = preferences.quiet_hours.end_time;

      // Handle overnight quiet hours (e.g., 22:00 to 08:00)
      if (startTime > endTime) {
        return timeStr >= startTime || timeStr <= endTime;
      } else {
        return timeStr >= startTime && timeStr <= endTime;
      }
    } catch (error) {
      console.error('Error checking quiet hours:', error);
      return false;
    }
  }

  private static async getNextAvailableTime(userId: string, originalTime: Date): Promise<Date> {
    const preferences = await this.getNotificationPreferences(userId);
    if (!preferences?.quiet_hours?.enabled) return originalTime;

    const nextTime = new Date(originalTime);
    const endTime = preferences.quiet_hours.end_time;
    const [hours, minutes] = endTime.split(':').map(Number);
    
    nextTime.setHours(hours, minutes, 0, 0);
    
    // If end time is tomorrow
    if (nextTime <= originalTime) {
      nextTime.setDate(nextTime.getDate() + 1);
    }

    return nextTime;
  }

  private static async logNotification(notification: NotificationTemplate): Promise<void> {
    try {
      await supabase
        .from('notification_logs')
        .insert({
          notification_id: notification.id,
          user_id: notification.data?.user_id,
          type: notification.type,
          title: notification.title,
          body: notification.body,
          scheduled_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Error logging notification:', error);
    }
  }

  // Analytics
  static async getNotificationAnalytics(userId: string): Promise<{
    total_sent: number;
    open_rate: number;
    most_effective_times: string[];
    preferred_types: string[];
  }> {
    try {
      const { data, error } = await supabase
        .from('notification_analytics')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return {
        total_sent: data.total_sent || 0,
        open_rate: data.open_rate || 0,
        most_effective_times: data.most_effective_times || [],
        preferred_types: data.preferred_types || [],
      };
    } catch (error) {
      console.error('Error getting notification analytics:', error);
      return {
        total_sent: 0,
        open_rate: 0,
        most_effective_times: [],
        preferred_types: [],
      };
    }
  }

  // Bulk Operations
  static async cancelAllScheduledNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling scheduled notifications:', error);
    }
  }

  static async cancelNotificationsByType(type: string): Promise<void> {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const toCancel = scheduled
        .filter(notification => notification.content.data?.type === type)
        .map(notification => notification.identifier);

      for (const identifier of toCancel) {
        await Notifications.cancelScheduledNotificationAsync(identifier);
      }
    } catch (error) {
      console.error('Error canceling notifications by type:', error);
    }
  }
}
