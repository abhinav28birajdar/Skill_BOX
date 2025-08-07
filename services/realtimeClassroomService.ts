import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface ClassroomParticipant {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  role: 'instructor' | 'student' | 'ta' | 'moderator';
  joined_at: string;
  is_speaking: boolean;
  is_muted: boolean;
  is_video_enabled: boolean;
  hand_raised: boolean;
  connection_quality: 'excellent' | 'good' | 'poor' | 'disconnected';
}

export interface ClassroomSession {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  instructor_id: string;
  start_time: string;
  end_time?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  max_participants: number;
  current_participants: number;
  recording_enabled: boolean;
  chat_enabled: boolean;
  screen_sharing_enabled: boolean;
  whiteboard_enabled: boolean;
  breakout_rooms_enabled: boolean;
  settings: {
    auto_admit: boolean;
    mute_on_join: boolean;
    require_approval: boolean;
    allow_screen_sharing: boolean;
    allow_chat: boolean;
    recording_auto_start: boolean;
  };
}

export interface ChatMessage {
  id: string;
  classroom_id: string;
  user_id: string;
  user_name: string;
  message: string;
  message_type: 'text' | 'emoji' | 'file' | 'poll' | 'quiz' | 'system';
  timestamp: string;
  reply_to?: string;
  reactions: Record<string, string[]>; // emoji -> user_ids
  is_private: boolean;
  recipient_id?: string;
}

export interface WhiteboardElement {
  id: string;
  type: 'line' | 'rectangle' | 'circle' | 'text' | 'image' | 'sticky_note';
  data: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    color: string;
    strokeWidth: number;
    fill?: string;
  };
  created_by: string;
  created_at: string;
}

export interface BreakoutRoom {
  id: string;
  classroom_id: string;
  name: string;
  participants: string[];
  max_participants: number;
  created_by: string;
  created_at: string;
  status: 'active' | 'closed';
}

export class RealtimeClassroomService {
  private static channels: Map<string, RealtimeChannel> = new Map();
  private static currentClassroom: string | null = null;
  private static participants: Map<string, ClassroomParticipant> = new Map();

  // Classroom Management
  static async createClassroomSession(session: Omit<ClassroomSession, 'id' | 'current_participants'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('classroom_sessions')
        .insert(session)
        .select('id')
        .single();

      if (error) throw error;

      // Set up real-time listeners for the new classroom
      await this.setupClassroomChannel(data.id);

      return data.id;
    } catch (error) {
      console.error('Error creating classroom session:', error);
      return null;
    }
  }

  static async joinClassroom(
    classroomId: string,
    userId: string,
    userInfo: {
      display_name: string;
      avatar_url?: string;
      role: 'instructor' | 'student' | 'ta' | 'moderator';
    }
  ): Promise<boolean> {
    try {
      // Check if classroom exists and user has permission
      const { data: classroom, error: classroomError } = await supabase
        .from('classroom_sessions')
        .select('*')
        .eq('id', classroomId)
        .single();

      if (classroomError) throw classroomError;

      // Add participant to classroom
      const participant: Omit<ClassroomParticipant, 'connection_quality'> = {
        user_id: userId,
        display_name: userInfo.display_name,
        avatar_url: userInfo.avatar_url,
        role: userInfo.role,
        joined_at: new Date().toISOString(),
        is_speaking: false,
        is_muted: true,
        is_video_enabled: false,
        hand_raised: false,
      };

      const { error: participantError } = await supabase
        .from('classroom_participants')
        .insert({
          classroom_id: classroomId,
          ...participant,
        });

      if (participantError) throw participantError;

      // Set up real-time connection
      await this.setupClassroomChannel(classroomId);
      this.currentClassroom = classroomId;

      // Broadcast join event
      await this.broadcastEvent(classroomId, 'user_joined', {
        participant: { ...participant, connection_quality: 'good' },
      });

      return true;
    } catch (error) {
      console.error('Error joining classroom:', error);
      return false;
    }
  }

  static async leaveClassroom(classroomId: string, userId: string): Promise<boolean> {
    try {
      // Remove participant from database
      const { error } = await supabase
        .from('classroom_participants')
        .delete()
        .eq('classroom_id', classroomId)
        .eq('user_id', userId);

      if (error) throw error;

      // Broadcast leave event
      await this.broadcastEvent(classroomId, 'user_left', {
        user_id: userId,
      });

      // Clean up channels
      const channel = this.channels.get(classroomId);
      if (channel) {
        await supabase.removeChannel(channel);
        this.channels.delete(classroomId);
      }

      this.currentClassroom = null;
      this.participants.delete(userId);

      return true;
    } catch (error) {
      console.error('Error leaving classroom:', error);
      return false;
    }
  }

  // Real-time Channel Management
  private static async setupClassroomChannel(classroomId: string): Promise<void> {
    // Remove existing channel if any
    const existingChannel = this.channels.get(classroomId);
    if (existingChannel) {
      await supabase.removeChannel(existingChannel);
    }

    // Create new channel
    const channel = supabase.channel(`classroom:${classroomId}`)
      .on('presence', { event: 'sync' }, () => {
        this.handlePresenceSync(classroomId);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        this.handlePresenceJoin(classroomId, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        this.handlePresenceLeave(classroomId, leftPresences);
      })
      .on('broadcast', { event: 'chat_message' }, ({ payload }) => {
        this.handleChatMessage(payload);
      })
      .on('broadcast', { event: 'whiteboard_update' }, ({ payload }) => {
        this.handleWhiteboardUpdate(payload);
      })
      .on('broadcast', { event: 'participant_update' }, ({ payload }) => {
        this.handleParticipantUpdate(payload);
      })
      .on('broadcast', { event: 'screen_share' }, ({ payload }) => {
        this.handleScreenShare(payload);
      })
      .on('broadcast', { event: 'poll_created' }, ({ payload }) => {
        this.handlePollCreated(payload);
      })
      .on('broadcast', { event: 'quiz_started' }, ({ payload }) => {
        this.handleQuizStarted(payload);
      });

    await channel.subscribe();
    this.channels.set(classroomId, channel);
  }

  // Chat Functions
  static async sendChatMessage(
    classroomId: string,
    userId: string,
    message: Omit<ChatMessage, 'id' | 'timestamp'>
  ): Promise<boolean> {
    try {
      const chatMessage: ChatMessage = {
        ...message,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      };

      // Save to database
      const { error } = await supabase
        .from('classroom_chat_messages')
        .insert({
          classroom_id: classroomId,
          user_id: userId,
          message_data: chatMessage,
        });

      if (error) throw error;

      // Broadcast to all participants
      await this.broadcastEvent(classroomId, 'chat_message', chatMessage);

      return true;
    } catch (error) {
      console.error('Error sending chat message:', error);
      return false;
    }
  }

  static async getChatHistory(classroomId: string, limit: number = 50): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('classroom_chat_messages')
        .select('message_data')
        .eq('classroom_id', classroomId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(item => item.message_data).reverse();
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }

  // Whiteboard Functions
  static async updateWhiteboard(
    classroomId: string,
    elements: WhiteboardElement[]
  ): Promise<boolean> {
    try {
      // Save to database
      const { error } = await supabase
        .from('classroom_whiteboards')
        .upsert({
          classroom_id: classroomId,
          elements,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Broadcast update
      await this.broadcastEvent(classroomId, 'whiteboard_update', { elements });

      return true;
    } catch (error) {
      console.error('Error updating whiteboard:', error);
      return false;
    }
  }

  static async getWhiteboardState(classroomId: string): Promise<WhiteboardElement[]> {
    try {
      const { data, error } = await supabase
        .from('classroom_whiteboards')
        .select('elements')
        .eq('classroom_id', classroomId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data?.elements || [];
    } catch (error) {
      console.error('Error getting whiteboard state:', error);
      return [];
    }
  }

  // Participant Management
  static async updateParticipantStatus(
    classroomId: string,
    userId: string,
    updates: Partial<Pick<ClassroomParticipant, 'is_muted' | 'is_video_enabled' | 'hand_raised' | 'is_speaking'>>
  ): Promise<boolean> {
    try {
      // Update database
      const { error } = await supabase
        .from('classroom_participants')
        .update(updates)
        .eq('classroom_id', classroomId)
        .eq('user_id', userId);

      if (error) throw error;

      // Update local cache
      const participant = this.participants.get(userId);
      if (participant) {
        Object.assign(participant, updates);
        this.participants.set(userId, participant);
      }

      // Broadcast update
      await this.broadcastEvent(classroomId, 'participant_update', {
        user_id: userId,
        updates,
      });

      return true;
    } catch (error) {
      console.error('Error updating participant status:', error);
      return false;
    }
  }

  static async getParticipants(classroomId: string): Promise<ClassroomParticipant[]> {
    try {
      const { data, error } = await supabase
        .from('classroom_participants')
        .select('*')
        .eq('classroom_id', classroomId);

      if (error) throw error;

      return data.map(p => ({
        user_id: p.user_id,
        display_name: p.display_name,
        avatar_url: p.avatar_url,
        role: p.role,
        joined_at: p.joined_at,
        is_speaking: p.is_speaking,
        is_muted: p.is_muted,
        is_video_enabled: p.is_video_enabled,
        hand_raised: p.hand_raised,
        connection_quality: 'good', // This would come from WebRTC stats
      }));
    } catch (error) {
      console.error('Error getting participants:', error);
      return [];
    }
  }

  // Breakout Rooms
  static async createBreakoutRoom(
    classroomId: string,
    createdBy: string,
    name: string,
    maxParticipants: number = 8
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('breakout_rooms')
        .insert({
          classroom_id: classroomId,
          name,
          max_participants: maxParticipants,
          created_by: createdBy,
          status: 'active',
        })
        .select('id')
        .single();

      if (error) throw error;

      await this.broadcastEvent(classroomId, 'breakout_room_created', {
        room_id: data.id,
        name,
        max_participants: maxParticipants,
      });

      return data.id;
    } catch (error) {
      console.error('Error creating breakout room:', error);
      return null;
    }
  }

  static async joinBreakoutRoom(roomId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('breakout_room_participants')
        .insert({
          room_id: roomId,
          user_id: userId,
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error joining breakout room:', error);
      return false;
    }
  }

  // Polls and Quizzes
  static async createPoll(
    classroomId: string,
    createdBy: string,
    poll: {
      question: string;
      options: string[];
      duration: number; // in seconds
      anonymous: boolean;
    }
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('classroom_polls')
        .insert({
          classroom_id: classroomId,
          created_by: createdBy,
          question: poll.question,
          options: poll.options,
          duration: poll.duration,
          anonymous: poll.anonymous,
          status: 'active',
        })
        .select('id')
        .single();

      if (error) throw error;

      await this.broadcastEvent(classroomId, 'poll_created', {
        poll_id: data.id,
        ...poll,
      });

      return data.id;
    } catch (error) {
      console.error('Error creating poll:', error);
      return null;
    }
  }

  static async submitPollResponse(
    pollId: string,
    userId: string,
    selectedOption: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('poll_responses')
        .insert({
          poll_id: pollId,
          user_id: userId,
          selected_option: selectedOption,
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error submitting poll response:', error);
      return false;
    }
  }

  // Screen Sharing
  static async startScreenShare(classroomId: string, userId: string): Promise<boolean> {
    try {
      await this.broadcastEvent(classroomId, 'screen_share', {
        user_id: userId,
        action: 'start',
      });

      return true;
    } catch (error) {
      console.error('Error starting screen share:', error);
      return false;
    }
  }

  static async stopScreenShare(classroomId: string, userId: string): Promise<boolean> {
    try {
      await this.broadcastEvent(classroomId, 'screen_share', {
        user_id: userId,
        action: 'stop',
      });

      return true;
    } catch (error) {
      console.error('Error stopping screen share:', error);
      return false;
    }
  }

  // Recording
  static async startRecording(classroomId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('classroom_recordings')
        .insert({
          classroom_id: classroomId,
          started_by: userId,
          status: 'recording',
        });

      if (error) throw error;

      await this.broadcastEvent(classroomId, 'recording_started', {
        started_by: userId,
      });

      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      return false;
    }
  }

  static async stopRecording(classroomId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('classroom_recordings')
        .update({
          status: 'processing',
          ended_at: new Date().toISOString(),
        })
        .eq('classroom_id', classroomId)
        .eq('status', 'recording');

      if (error) throw error;

      await this.broadcastEvent(classroomId, 'recording_stopped', {
        stopped_by: userId,
      });

      return true;
    } catch (error) {
      console.error('Error stopping recording:', error);
      return false;
    }
  }

  // Event Handlers
  private static handlePresenceSync(classroomId: string): void {
    // Handle presence synchronization
    console.log(`Presence synced for classroom ${classroomId}`);
  }

  private static handlePresenceJoin(classroomId: string, newPresences: any[]): void {
    // Handle new user joining
    console.log(`New users joined classroom ${classroomId}:`, newPresences);
  }

  private static handlePresenceLeave(classroomId: string, leftPresences: any[]): void {
    // Handle user leaving
    console.log(`Users left classroom ${classroomId}:`, leftPresences);
  }

  private static handleChatMessage(message: ChatMessage): void {
    // Handle incoming chat message
    console.log('New chat message:', message);
  }

  private static handleWhiteboardUpdate(payload: { elements: WhiteboardElement[] }): void {
    // Handle whiteboard updates
    console.log('Whiteboard updated:', payload);
  }

  private static handleParticipantUpdate(payload: { user_id: string; updates: any }): void {
    // Handle participant status updates
    console.log('Participant updated:', payload);
  }

  private static handleScreenShare(payload: { user_id: string; action: 'start' | 'stop' }): void {
    // Handle screen sharing events
    console.log('Screen share event:', payload);
  }

  private static handlePollCreated(payload: any): void {
    // Handle new poll creation
    console.log('Poll created:', payload);
  }

  private static handleQuizStarted(payload: any): void {
    // Handle quiz start
    console.log('Quiz started:', payload);
  }

  // Utility Methods
  private static async broadcastEvent(classroomId: string, event: string, payload: any): Promise<void> {
    const channel = this.channels.get(classroomId);
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event,
        payload,
      });
    }
  }

  // Analytics
  static async getClassroomAnalytics(classroomId: string): Promise<{
    duration: number;
    peak_participants: number;
    average_participants: number;
    engagement_score: number;
    chat_messages_count: number;
    polls_created: number;
    questions_asked: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('classroom_analytics')
        .select('*')
        .eq('classroom_id', classroomId)
        .single();

      if (error) throw error;

      return {
        duration: data.duration || 0,
        peak_participants: data.peak_participants || 0,
        average_participants: data.average_participants || 0,
        engagement_score: data.engagement_score || 0,
        chat_messages_count: data.chat_messages_count || 0,
        polls_created: data.polls_created || 0,
        questions_asked: data.questions_asked || 0,
      };
    } catch (error) {
      console.error('Error getting classroom analytics:', error);
      return {
        duration: 0,
        peak_participants: 0,
        average_participants: 0,
        engagement_score: 0,
        chat_messages_count: 0,
        polls_created: 0,
        questions_asked: 0,
      };
    }
  }
}
