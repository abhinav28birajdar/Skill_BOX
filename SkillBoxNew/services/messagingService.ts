import { subscribeToTable, supabase } from '../lib/supabase';
import { Message, Notification, PaginatedResponse } from '../types/database';

export class MessagingService {
  // Message Management
  static async sendMessage(
    senderId: string,
    receiverId: string,
    messageText: string,
    threadId?: string,
    relatedBookingId?: string
  ): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          thread_id: threadId,
          related_booking_id: relatedBookingId,
          message_text: messageText,
          is_read: false,
          created_at: new Date().toISOString(),
        })
        .select(`
          *,
          sender:users!sender_id(*),
          receiver:users!receiver_id(*)
        `)
        .single();

      if (error) throw error;

      // Create notification for receiver
      await NotificationService.createNotification(
        receiverId,
        'new_message',
        `New message from ${data.sender?.full_name || 'someone'}`,
        `/messages/${threadId || data.id}`
      );

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  static async getConversations(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<{
    other_user: any;
    latest_message: Message;
    unread_count: number;
    thread_id: string;
  }>> {
    try {
      // This would typically be implemented with a more complex query or RPC function
      // For now, we'll get recent messages and group them
      const { data: messages, error, count } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!sender_id(*),
          receiver:users!receiver_id(*)
        `, { count: 'exact' })
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      // Group messages by conversation partner
      const conversationsMap = new Map();
      
      for (const message of messages || []) {
        const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
        const otherUser = message.sender_id === userId ? message.receiver : message.sender;
        
        if (!conversationsMap.has(otherUserId)) {
          // Get unread count for this conversation
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', otherUserId)
            .eq('receiver_id', userId)
            .eq('is_read', false);

          conversationsMap.set(otherUserId, {
            other_user: otherUser,
            latest_message: message,
            unread_count: unreadCount || 0,
            thread_id: message.thread_id || `${[userId, otherUserId].sort().join('-')}`,
          });
        }
      }

      const conversations = Array.from(conversationsMap.values());

      return {
        data: conversations,
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return { data: [], count: 0, page: 1, limit: 20, total_pages: 0 };
    }
  }

  static async getMessages(
    userId: string,
    otherUserId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResponse<Message & { sender: any; receiver: any }>> {
    try {
      const { data, error, count } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!sender_id(*),
          receiver:users!receiver_id(*)
        `, { count: 'exact' })
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      // Mark messages as read if they were sent to the current user
      if (data && data.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('sender_id', otherUserId)
          .eq('receiver_id', userId)
          .eq('is_read', false);
      }

      return {
        data: data || [],
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { data: [], count: 0, page: 1, limit: 50, total_pages: 0 };
    }
  }

  static async markMessageAsRead(messageId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('receiver_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  }

  static async markConversationAsRead(userId: string, otherUserId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', otherUserId)
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      return false;
    }
  }

  static async getUnreadMessageCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching unread message count:', error);
      return 0;
    }
  }

  static async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', userId); // Only sender can delete

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  // Real-time message subscription
  static subscribeToMessages(
    userId: string,
    callback: (payload: any) => void
  ) {
    return subscribeToTable(
      'messages',
      (payload) => {
        // Only notify if the user is involved in the message
        if (payload.new?.receiver_id === userId || payload.new?.sender_id === userId) {
          callback(payload);
        }
      },
      [{ column: 'receiver_id', value: userId }]
    );
  }

  // Message Search
  static async searchMessages(
    userId: string,
    query: string,
    limit: number = 20
  ): Promise<(Message & { sender: any; receiver: any })[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!sender_id(*),
          receiver:users!receiver_id(*)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .ilike('message_text', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching messages:', error);
      return [];
    }
  }
}

export class NotificationService {
  // Notification Management
  static async createNotification(
    recipientId: string,
    type: Notification['notification_type'],
    message: string,
    linkTo?: string
  ): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          recipient_id: recipientId,
          notification_type: type,
          message,
          link_to: linkTo,
          is_read: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  static async getNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<PaginatedResponse<Notification>> {
    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { data: [], count: 0, page: 1, limit: 20, total_pages: 0 };
    }
  }

  static async markNotificationAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('recipient_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  static async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  static async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('recipient_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  static async getUnreadNotificationCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
      return 0;
    }
  }

  // Real-time notification subscription
  static subscribeToNotifications(
    userId: string,
    callback: (payload: any) => void
  ) {
    return subscribeToTable(
      'notifications',
      callback,
      [{ column: 'recipient_id', value: userId }]
    );
  }

  // Bulk notification creation (for admin announcements)
  static async createBulkNotification(
    type: Notification['notification_type'],
    message: string,
    targetRoles?: string[],
    targetUserIds?: string[],
    linkTo?: string
  ): Promise<boolean> {
    try {
      let recipientIds: string[] = [];

      if (targetUserIds && targetUserIds.length > 0) {
        recipientIds = targetUserIds;
      } else {
        // Get all users or users with specific roles
        let query = supabase.from('users').select('id').eq('is_active', true);
        
        if (targetRoles && targetRoles.length > 0) {
          query = query.in('role', targetRoles);
        }

        const { data: users, error } = await query;
        if (error) throw error;

        recipientIds = users?.map(u => u.id) || [];
      }

      if (recipientIds.length === 0) return false;

      // Create notifications in batches to avoid database limits
      const batchSize = 100;
      for (let i = 0; i < recipientIds.length; i += batchSize) {
        const batch = recipientIds.slice(i, i + batchSize);
        const notifications = batch.map(recipientId => ({
          recipient_id: recipientId,
          notification_type: type,
          message,
          link_to: linkTo,
          is_read: false,
          created_at: new Date().toISOString(),
        }));

        const { error } = await supabase
          .from('notifications')
          .insert(notifications);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error creating bulk notification:', error);
      return false;
    }
  }

  // Notification templates for common events
  static async notifyBookingConfirmed(
    teacherId: string,
    studentName: string,
    className: string
  ): Promise<void> {
    await this.createNotification(
      teacherId,
      'booking_update',
      `${studentName} booked your class "${className}"`,
      '/teacher/bookings'
    );
  }

  static async notifyBookingCancelled(
    teacherId: string,
    studentName: string,
    className: string
  ): Promise<void> {
    await this.createNotification(
      teacherId,
      'booking_update',
      `${studentName} cancelled their booking for "${className}"`,
      '/teacher/bookings'
    );
  }

  static async notifyClassReminder(
    studentId: string,
    className: string,
    startTime: string
  ): Promise<void> {
    const reminderTime = new Date(startTime);
    reminderTime.setMinutes(reminderTime.getMinutes() - 30); // 30 minutes before

    await this.createNotification(
      studentId,
      'class_reminder',
      `Your class "${className}" starts in 30 minutes`,
      '/student/classes'
    );
  }

  static async notifyContentApproved(
    teacherId: string,
    contentTitle: string
  ): Promise<void> {
    await this.createNotification(
      teacherId,
      'content_status_update',
      `Your content "${contentTitle}" has been approved!`,
      '/teacher/content'
    );
  }

  static async notifyContentRejected(
    teacherId: string,
    contentTitle: string,
    reason: string
  ): Promise<void> {
    await this.createNotification(
      teacherId,
      'content_status_update',
      `Your content "${contentTitle}" was rejected: ${reason}`,
      '/teacher/content'
    );
  }

  static async notifyReviewReceived(
    teacherId: string,
    rating: number,
    reviewerName: string
  ): Promise<void> {
    await this.createNotification(
      teacherId,
      'review_received',
      `You received a ${rating}-star review from ${reviewerName}`,
      '/teacher/reviews'
    );
  }

  static async notifyAssignmentGraded(
    studentId: string,
    assignmentTitle: string,
    grade: number
  ): Promise<void> {
    await this.createNotification(
      studentId,
      'assignment_graded',
      `Your assignment "${assignmentTitle}" has been graded: ${grade}`,
      '/student/assignments'
    );
  }

  static async notifyAdminAnnouncement(
    message: string,
    targetRoles?: string[]
  ): Promise<void> {
    await this.createBulkNotification(
      'admin_announcement',
      message,
      targetRoles,
      undefined,
      '/announcements'
    );
  }

  // Cleanup old notifications
  static async cleanupOldNotifications(olderThanDays: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .eq('is_read', true);

      if (error) throw error;
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  }
}
