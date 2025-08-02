import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';

// Real-time hooks for different data types

// Hook for real-time notifications
export function useRealtimeNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!user) return;

    const notificationChannel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Notification change received!', payload);
          
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev =>
              prev.map(notification =>
                notification.id === payload.new.id ? payload.new : notification
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev =>
              prev.filter(notification => notification.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    setChannel(notificationChannel);

    return () => {
      if (notificationChannel) {
        supabase.removeChannel(notificationChannel);
      }
    };
  }, [user]);

  return { notifications, setNotifications };
}

// Hook for real-time class presence
export function useClassPresence(classId: string) {
  const { user } = useAuth();
  const [participants, setParticipants] = useState<any[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!classId || !user) return;

    const presenceChannel = supabase
      .channel(`class-${classId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const participants = Object.values(state).flat();
        setParticipants(participants);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined class:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left class:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user.id,
            username: user.username,
            full_name: user.full_name,
            profile_image_url: user.profile_image_url,
            joined_at: new Date().toISOString(),
          });
        }
      });

    setChannel(presenceChannel);

    return () => {
      if (presenceChannel) {
        presenceChannel.untrack();
        supabase.removeChannel(presenceChannel);
      }
    };
  }, [classId, user]);

  return { participants };
}

// Hook for real-time chat messages
export function useRealtimeChat(chatId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!chatId) return;

    const chatChannel = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('New message received!', payload);
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          setMessages(prev =>
            prev.map(message =>
              message.id === payload.new.id ? payload.new : message
            )
          );
        }
      )
      .subscribe();

    setChannel(chatChannel);

    return () => {
      if (chatChannel) {
        supabase.removeChannel(chatChannel);
      }
    };
  }, [chatId]);

  const sendMessage = useCallback(async (content: string, messageType: string = 'text') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: user.id,
        content,
        message_type: messageType,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    return data;
  }, [chatId]);

  return { messages, setMessages, sendMessage };
}

// Hook for real-time course progress updates
export function useRealtimeCourseProgress(courseId: string) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!courseId || !user) return;

    const progressChannel = supabase
      .channel(`course-progress-${courseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Progress update received!', payload);
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setProgress(payload.new);
          }
        }
      )
      .subscribe();

    setChannel(progressChannel);

    return () => {
      if (progressChannel) {
        supabase.removeChannel(progressChannel);
      }
    };
  }, [courseId, user]);

  return { progress, setProgress };
}

// Hook for real-time live class events
export function useRealtimeLiveClass(classId: string) {
  const [classState, setClassState] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!classId) return;

    const classChannel = supabase
      .channel(`live-class-${classId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_classes',
          filter: `id=eq.${classId}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Live class update:', payload);
          if (payload.eventType === 'UPDATE') {
            setClassState(payload.new);
          }
        }
      )
      .on(
        'broadcast',
        { event: 'class-event' },
        (payload) => {
          console.log('Class event received:', payload);
          setEvents(prev => [...prev, payload.payload]);
        }
      )
      .subscribe();

    setChannel(classChannel);

    return () => {
      if (classChannel) {
        supabase.removeChannel(classChannel);
      }
    };
  }, [classId]);

  const broadcastEvent = useCallback(async (eventType: string, data: any) => {
    if (!channel) return;

    await channel.send({
      type: 'broadcast',
      event: 'class-event',
      payload: {
        type: eventType,
        data,
        timestamp: new Date().toISOString(),
      },
    });
  }, [channel]);

  return { classState, events, broadcastEvent };
}

// Hook for real-time forum activity
export function useRealtimeForum(forumId: string) {
  const [posts, setPosts] = useState<any[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!forumId) return;

    const forumChannel = supabase
      .channel(`forum-${forumId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_posts',
          filter: `forum_id=eq.${forumId}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('New forum post:', payload);
          setPosts(prev => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_comments',
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('New forum comment:', payload);
          // Update the post's comment count
          setPosts(prev =>
            prev.map(post =>
              post.id === payload.new.post_id
                ? { ...post, comments_count: (post.comments_count || 0) + 1 }
                : post
            )
          );
        }
      )
      .subscribe();

    setChannel(forumChannel);

    return () => {
      if (forumChannel) {
        supabase.removeChannel(forumChannel);
      }
    };
  }, [forumId]);

  return { posts, setPosts };
}

// Hook for real-time user status/online presence
export function useUserPresence() {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!user) return;

    const presenceChannel = supabase
      .channel('global-presence')
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users = Object.values(state).flat();
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User came online:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User went offline:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user.id,
            username: user.username,
            full_name: user.full_name,
            profile_image_url: user.profile_image_url,
            status: 'online',
            last_seen: new Date().toISOString(),
          });
        }
      });

    setChannel(presenceChannel);

    // Update last seen periodically
    const interval = setInterval(async () => {
      if (presenceChannel) {
        await presenceChannel.track({
          user_id: user.id,
          username: user.username,
          full_name: user.full_name,
          profile_image_url: user.profile_image_url,
          status: 'online',
          last_seen: new Date().toISOString(),
        });
      }
    }, 30000); // Update every 30 seconds

    return () => {
      clearInterval(interval);
      if (presenceChannel) {
        presenceChannel.untrack();
        supabase.removeChannel(presenceChannel);
      }
    };
  }, [user]);

  return { onlineUsers };
}

// Centralized real-time connection manager
export class RealtimeManager {
  private static instance: RealtimeManager;
  private channels: Map<string, RealtimeChannel> = new Map();

  public static getInstance(): RealtimeManager {
    if (!RealtimeManager.instance) {
      RealtimeManager.instance = new RealtimeManager();
    }
    return RealtimeManager.instance;
  }

  public subscribeToChannel(
    channelName: string,
    config: any,
    callbacks: any
  ): RealtimeChannel {
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!;
    }

    const channel = supabase.channel(channelName);
    
    // Apply configuration and callbacks
    Object.entries(callbacks).forEach(([event, callback]) => {
      if (event === 'presence') {
        channel.on('presence', config.presence || {}, callback as any);
      } else if (event === 'broadcast') {
        channel.on('broadcast', config.broadcast || {}, callback as any);
      } else if (event === 'postgres_changes') {
        channel.on('postgres_changes', config.postgres_changes || {}, callback as any);
      }
    });

    channel.subscribe();
    this.channels.set(channelName, channel);
    
    return channel;
  }

  public unsubscribeFromChannel(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  public unsubscribeFromAll(): void {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }
}

export default RealtimeManager;
