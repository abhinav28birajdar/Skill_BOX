import { RealtimeChannel } from '@supabase/supabase-js';
import { Message, MessageWithSender, Thread, ThreadWithParticipants } from '../types/database';
import supabase from './supabase';

class ChatService {
  private channels: Map<string, RealtimeChannel> = new Map();

  // Get user's threads
  async getThreads(userId: string): Promise<ThreadWithParticipants[]> {
    try {
      const { data, error } = await supabase
        .from('threads')
        .select('*')
        .contains('participants', [userId])
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Fetch participant profiles for each thread
      const threadsWithProfiles = await Promise.all(
        (data || []).map(async (thread) => {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .in('id', thread.participants);

          return {
            ...thread,
            participant_profiles: profiles || [],
          };
        })
      );

      return threadsWithProfiles;
    } catch (error: any) {
      console.error('Get threads error:', error);
      return [];
    }
  }

  // Get messages in a thread
  async getMessages(threadId: string): Promise<MessageWithSender[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (*)
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get messages error:', error);
      return [];
    }
  }

  // Create new thread
  async createThread(
    participants: string[],
    courseId?: string,
    threadType: 'personal' | 'group' = 'personal'
  ): Promise<Thread | null> {
    try {
      // Check if personal thread already exists
      if (threadType === 'personal' && participants.length === 2) {
        const { data: existingThread } = await supabase
          .from('threads')
          .select('*')
          .contains('participants', participants)
          .eq('thread_type', 'personal')
          .single();

        if (existingThread) return existingThread;
      }

      const { data, error } = await supabase
        .from('threads')
        .insert({
          participants,
          course_id: courseId,
          thread_type: threadType,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Create thread error:', error);
      return null;
    }
  }

  // Send message
  async sendMessage(
    threadId: string,
    senderId: string,
    body: string,
    attachmentUrl?: string,
    attachmentType?: string
  ): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          thread_id: threadId,
          sender_id: senderId,
          body,
          attachment_url: attachmentUrl,
          attachment_type: attachmentType,
        })
        .select()
        .single();

      if (error) throw error;

      // Update thread's last message
      await supabase
        .from('threads')
        .update({
          last_message: body,
          last_message_at: new Date().toISOString(),
        })
        .eq('id', threadId);

      return data;
    } catch (error: any) {
      console.error('Send message error:', error);
      return null;
    }
  }

  // Mark messages as read
  async markAsRead(threadId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('thread_id', threadId)
        .neq('sender_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Mark as read error:', error);
      return false;
    }
  }

  // Get unread message count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      // Get all threads user is part of
      const { data: threads } = await supabase
        .from('threads')
        .select('id')
        .contains('participants', [userId]);

      if (!threads || threads.length === 0) return 0;

      const threadIds = threads.map(t => t.id);

      // Count unread messages
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('thread_id', threadIds)
        .neq('sender_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error: any) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }

  // Subscribe to new messages in thread
  subscribeToMessages(
    threadId: string,
    callback: (message: Message) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`messages:${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => callback(payload.new as Message)
      )
      .subscribe();

    this.channels.set(threadId, channel);
    return channel;
  }

  // Unsubscribe from messages
  unsubscribeFromMessages(threadId: string): void {
    const channel = this.channels.get(threadId);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(threadId);
    }
  }

  // Get or create personal thread with another user
  async getOrCreatePersonalThread(userId: string, otherUserId: string): Promise<Thread | null> {
    try {
      const participants = [userId, otherUserId].sort();

      // Try to find existing thread
      const { data: existingThreads } = await supabase
        .from('threads')
        .select('*')
        .contains('participants', participants)
        .eq('thread_type', 'personal');

      if (existingThreads && existingThreads.length > 0) {
        return existingThreads[0];
      }

      // Create new thread
      return await this.createThread(participants, undefined, 'personal');
    } catch (error: any) {
      console.error('Get or create personal thread error:', error);
      return null;
    }
  }
}

export default new ChatService();
