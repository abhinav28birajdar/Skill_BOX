/**
 * Enhanced Real-time Progress Tracking Service
 * Tracks user progress updates in real-time
 */

import supabase from './supabase';

type RealtimeChannel = any; // Supabase channel type

interface UserProgress {
  id: string;
  user_id: string;
  course_id?: string;
  lesson_id?: string;
  progress_status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  time_spent_seconds: number;
  completed_at?: string;
  updated_at: string;
}

class RealtimeProgressService {
  private channel: RealtimeChannel | null = null;
  private userId: string | null = null;

  /**
   * Subscribe to user progress updates
   */
  subscribeToProgress(
    userId: string,
    onProgressUpdate: (progress: UserProgress) => void,
    onError?: (error: Error) => void
  ): () => void {
    // Unsubscribe from previous subscription if exists
    if (this.channel) {
      this.unsubscribe();
    }

    this.userId = userId;

    this.channel = supabase
      .channel(`progress:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          try {
            // Handle different event types
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              onProgressUpdate(payload.new as UserProgress);
            } else if (payload.eventType === 'DELETE') {
              // Handle deletion if needed
              console.log('Progress entry deleted:', payload.old);
            }
          } catch (error) {
            console.error('Error handling progress update:', error);
            onError?.(error as Error);
          }
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to progress updates for user: ${userId}`);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.error(`Progress subscription error:`, status);
        }
      });

    // Return cleanup function
    return () => this.unsubscribe();
  }

  /**
   * Subscribe to course-specific progress
   */
  subscribeToCourseProgress(
    userId: string,
    courseId: string,
    onProgressUpdate: (progress: UserProgress) => void,
    onError?: (error: Error) => void
  ): () => void {
    const channel = supabase
      .channel(`progress:${userId}:${courseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${userId},course_id=eq.${courseId}`,
        },
        (payload: any) => {
          try {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              onProgressUpdate(payload.new as UserProgress);
            }
          } catch (error) {
            console.error('Error handling course progress update:', error);
            onError?.(error as Error);
          }
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to course ${courseId} progress for user: ${userId}`);
        }
      });

    return async () => {
      await supabase.removeChannel(channel);
      console.log(`Unsubscribed from course ${courseId} progress`);
    };
  }

  /**
   * Unsubscribe from progress updates
   */
  async unsubscribe(): Promise<void> {
    if (this.channel) {
      await supabase.removeChannel(this.channel);
      this.channel = null;
      this.userId = null;
      console.log('Unsubscribed from progress updates');
    }
  }

  /**
   * Check if currently subscribed
   */
  isSubscribed(): boolean {
    return this.channel !== null;
  }
}

export const realtimeProgressService = new RealtimeProgressService();
export default realtimeProgressService;
