import { RealtimeChannel } from '@supabase/supabase-js';
import { Notification } from '../types/database';
import { NotificationInsert } from './database-types';
import { insertRecord, typedSupabase, updateRecord } from './supabase-helpers';

class NotificationService {
  private channel: RealtimeChannel | null = null;

  // Get user notifications
  async getNotifications(userId: string, limit = 50): Promise<Notification[]> {
    try {
      const { data, error } = await typedSupabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get notifications error:', error);
      return [];
    }
  }

  // Create notification
  async createNotification(
    userId: string,
    title: string,
    body: string,
    type: string,
    payload?: any
  ): Promise<Notification | null> {
    try {
      const insertData: NotificationInsert = {
        user_id: userId,
        title,
        body,
        notification_type: type,
        payload: payload || {},
      };
      
      const { data, error } = await insertRecord('notifications', insertData);

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Create notification error:', error);
      return null;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await updateRecord('notifications', { is_read: true }, { id: notificationId });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Mark notification as read error:', error);
      return false;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await typedSupabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Mark all as read error:', error);
      return false;
    }
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await typedSupabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error: any) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await typedSupabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Delete notification error:', error);
      return false;
    }
  }

  // Subscribe to real-time notifications
  subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ): RealtimeChannel | null {
    this.channel = typedSupabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => callback(payload.new as Notification)
      )
      .subscribe();

    return this.channel;
  }

  // Unsubscribe from notifications
  unsubscribeFromNotifications(): void {
    if (this.channel) {
      typedSupabase.removeChannel(this.channel);
      this.channel = null;
    }
  }

  // Notify course enrollment
  async notifyCourseEnrollment(teacherId: string, studentName: string, courseTitle: string): Promise<void> {
    await this.createNotification(
      teacherId,
      'New Student Enrolled',
      `${studentName} enrolled in your course "${courseTitle}"`,
      'enrollment',
      { courseTitle, studentName }
    );
  }

  // Notify new message
  async notifyNewMessage(recipientId: string, senderName: string): Promise<void> {
    await this.createNotification(
      recipientId,
      'New Message',
      `You have a new message from ${senderName}`,
      'message',
      { senderName }
    );
  }

  // Notify live class
  async notifyLiveClass(studentId: string, courseTitle: string, startTime: string): Promise<void> {
    await this.createNotification(
      studentId,
      'Live Class Reminder',
      `Your live class for "${courseTitle}" starts soon`,
      'live_class',
      { courseTitle, startTime }
    );
  }
}

export default new NotificationService();
