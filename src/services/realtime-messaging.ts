/**
 * Enhanced Real-time Messaging Service
 * Handles real-time messaging with proper cleanup and error handling
 */

import type { Message } from '../types/database';
import supabase from './supabase';

type RealtimeChannel = any; // Supabase Realtime Channel type

class RealtimeMessagingService {
  private subscriptions: Map<string, RealtimeChannel> = new Map();

  /**
   * Subscribe to messages in a specific thread
   */
  subscribeToThread(
    threadId: string,
    onNewMessage: (message: Message) => void,
    onError?: (error: Error) => void
  ): () => void {
    // Check if already subscribed
    if (this.subscriptions.has(threadId)) {
      console.warn(`Already subscribed to thread: ${threadId}`);
      return () => this.unsubscribeFromThread(threadId);
    }

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
        (payload: any) => {
          try {
            onNewMessage(payload.new as Message);
          } catch (error) {
            console.error('Error handling new message:', error);
            onError?.(error as Error);
          }
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to messages in thread: ${threadId}`);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.error(`Subscription error for thread ${threadId}:`, status);
        }
      });

    this.subscriptions.set(threadId, channel);

    // Return cleanup function
    return () => this.unsubscribeFromThread(threadId);
  }

  /**
   * Unsubscribe from a specific thread
   */
  async unsubscribeFromThread(threadId: string): Promise<void> {
    const channel = this.subscriptions.get(threadId);
    if (channel) {
      await supabase.removeChannel(channel);
      this.subscriptions.delete(threadId);
      console.log(`Unsubscribed from thread: ${threadId}`);
    }
  }

  /**
   * Unsubscribe from all threads
   */
  async unsubscribeAll(): Promise<void> {
    const promises = Array.from(this.subscriptions.keys()).map((threadId) =>
      this.unsubscribeFromThread(threadId)
    );
    await Promise.all(promises);
    console.log('Unsubscribed from all threads');
  }

  /**
   * Get active subscriptions count
   */
  getActiveSubscriptionsCount(): number {
    return this.subscriptions.size;
  }
}

export const realtimeMessagingService = new RealtimeMessagingService();
export default realtimeMessagingService;
