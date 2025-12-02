import { supabase } from '@/lib/supabase';
import * as Notifications from 'expo-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  categoryIdentifier?: string;
  trigger?: {
    type: 'time' | 'daily' | 'weekly';
    date?: Date;
    hour?: number;
    minute?: number;
    weekday?: number;
  };
}

class NotificationService {
  private expoPushToken: string | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Register for push notifications
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return;
      }

      // Get the push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });
      
      this.expoPushToken = tokenData.data;

      // Configure notification categories
      await this.setupNotificationCategories();

      // Save token to user profile
      await this.saveTokenToProfile();

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  private async setupNotificationCategories() {
    await Notifications.setNotificationCategoryAsync('message', [
      {
        identifier: 'reply',
        buttonTitle: 'Reply',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'mark_read',
        buttonTitle: 'Mark as Read',
        options: { opensAppToForeground: false },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('course', [
      {
        identifier: 'view',
        buttonTitle: 'View Course',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'dismiss',
        buttonTitle: 'Dismiss',
        options: { opensAppToForeground: false },
      },
    ]);
  }

  private async saveTokenToProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && this.expoPushToken) {
        await (supabase as any)
          .from('user_profiles')
          .update({ 
            push_token: this.expoPushToken,
            push_notifications_enabled: true,
          })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  }

  async scheduleNotification(notification: NotificationData): Promise<string | null> {
    try {
      let trigger: any = null;

      if (notification.trigger) {
        switch (notification.trigger.type) {
          case 'time':
            trigger = notification.trigger.date;
            break;
          case 'daily':
            trigger = {
              hour: notification.trigger.hour || 19,
              minute: notification.trigger.minute || 0,
              repeats: true,
            };
            break;
          case 'weekly':
            trigger = {
              weekday: notification.trigger.weekday || 1,
              hour: notification.trigger.hour || 19,
              minute: notification.trigger.minute || 0,
              repeats: true,
            };
            break;
        }
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.categoryIdentifier,
          sound: 'default',
        },
        trigger,
      });

      return id;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  async cancelNotification(notificationId: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  async sendLocalNotification(notification: NotificationData) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.categoryIdentifier,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  getPushToken(): string | null {
    return this.expoPushToken;
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

export const notificationService = new NotificationService();