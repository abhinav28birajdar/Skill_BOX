/**
 * Enhanced Real-time Notifications Service
 * Handles real-time notifications with proper cleanup
 */

import supabase from './supabase';

type RealtimeChannel = any; // Supabase channel type

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: string;
}

class RealtimeNotificationsService {
  private channel: RealtimeChannel | null = null;
  private userId: string | null = null;

  /**
   * Subscribe to user notifications
   */
  subscribeToNotifications(
    userId: string,
    onNewNotification: (notification: Notification) => void,
    onError?: (error: Error) => void
  ): () => void {
    // Unsubscribe from previous subscription if exists
    if (this.channel) {
      this.unsubscribe();
    }

    this.userId = userId;

    this.channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          try {
            onNewNotification(payload.new as Notification);
          } catch (error) {
            console.error('Error handling new notification:', error);
            onError?.(error as Error);
          }
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to notifications for user: ${userId}`);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.error(`Notification subscription error:`, status);
        }
      });

    // Return cleanup function
    return () => this.unsubscribe();
  }

  /**
   * Unsubscribe from notifications
   */
  async unsubscribe(): Promise<void> {
    if (this.channel) {
      await supabase.removeChannel(this.channel);
      this.channel = null;
      this.userId = null;
      console.log('Unsubscribed from notifications');
    }
  }

  /**
   * Check if currently subscribed
   */
  isSubscribed(): boolean {
    return this.channel !== null;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    return this.userId;
  }
}

export const realtimeNotificationsService = new RealtimeNotificationsService();
export default realtimeNotificationsService;
