import { LiveSession } from '../types/database';
import supabase from './supabase';

class LiveSessionService {
  // Schedule new live session
  async scheduleSession(sessionData: {
    course_id: string;
    title: string;
    description?: string;
    meeting_url: string;
    start_time: string;
    duration_minutes: number;
  }): Promise<LiveSession | null> {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Schedule session error:', error);
      return null;
    }
  }

  // Get upcoming sessions for a course
  async getUpcomingSessions(courseId: string): Promise<LiveSession[]> {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('course_id', courseId)
        .gte('start_time', now)
        .eq('status', 'scheduled')
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get upcoming sessions error:', error);
      return [];
    }
  }

  // Get past sessions
  async getPastSessions(courseId: string): Promise<LiveSession[]> {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('course_id', courseId)
        .lt('start_time', now)
        .order('start_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get past sessions error:', error);
      return [];
    }
  }

  // Get session by ID
  async getSessionById(id: string): Promise<LiveSession | null> {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Get session by ID error:', error);
      return null;
    }
  }

  // Update session
  async updateSession(id: string, updates: Partial<LiveSession>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('live_sessions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Update session error:', error);
      return false;
    }
  }

  // Start session
  async startSession(id: string): Promise<boolean> {
    return this.updateSession(id, {
      status: 'ongoing',
      actual_start_time: new Date().toISOString(),
    });
  }

  // End session
  async endSession(id: string): Promise<boolean> {
    return this.updateSession(id, {
      status: 'completed',
      actual_end_time: new Date().toISOString(),
    });
  }

  // Cancel session
  async cancelSession(id: string): Promise<boolean> {
    return this.updateSession(id, { status: 'cancelled' });
  }

  // Delete session
  async deleteSession(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('live_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Delete session error:', error);
      return false;
    }
  }

  // Get all sessions for enrolled students
  async getStudentSessions(studentId: string): Promise<any[]> {
    try {
      // Get enrolled course IDs
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', studentId);

      if (!enrollments || enrollments.length === 0) return [];

      const courseIds = enrollments.map(e => e.course_id);

      // Get upcoming sessions
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('live_sessions')
        .select(`
          *,
          courses (
            id,
            title,
            cover_url,
            profiles:teacher_id (
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .in('course_id', courseIds)
        .gte('start_time', now)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get student sessions error:', error);
      return [];
    }
  }

  // Get teacher's sessions
  async getTeacherSessions(teacherId: string): Promise<any[]> {
    try {
      // Get teacher's course IDs
      const { data: courses } = await supabase
        .from('courses')
        .select('id')
        .eq('teacher_id', teacherId);

      if (!courses || courses.length === 0) return [];

      const courseIds = courses.map(c => c.id);

      const { data, error } = await supabase
        .from('live_sessions')
        .select(`
          *,
          courses (
            id,
            title,
            cover_url
          )
        `)
        .in('course_id', courseIds)
        .order('start_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get teacher sessions error:', error);
      return [];
    }
  }
}

export default new LiveSessionService();
