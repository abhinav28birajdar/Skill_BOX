import { supabase } from '../lib/supabase';
import { Class, ClassBooking, ClassSession, ClassWithDetails, PaginatedResponse, SearchFilters, TeacherAvailabilitySlot, TeacherBlockedDate } from '../types/database';

export class ClassService {
  // Class CRUD Operations
  static async createClass(
    teacherId: string,
    classData: Partial<Class>
  ): Promise<Class | null> {
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert({
          ...classData,
          teacher_id: teacherId,
          status: 'draft',
          currently_enrolled: 0,
          average_rating: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating class:', error);
      return null;
    }
  }

  static async updateClass(
    classId: string,
    teacherId: string,
    updates: Partial<Class>
  ): Promise<Class | null> {
    try {
      const { data, error } = await supabase
        .from('classes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', classId)
        .eq('teacher_id', teacherId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating class:', error);
      return null;
    }
  }

  static async deleteClass(classId: string, teacherId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId)
        .eq('teacher_id', teacherId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting class:', error);
      return false;
    }
  }

  static async getClass(classId: string): Promise<ClassWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          teacher:users(*),
          skill:skills(*),
          sub_skill:sub_skills(*),
          sessions:class_sessions(*)
        `)
        .eq('id', classId)
        .single();

      if (error) throw error;
      return data as ClassWithDetails;
    } catch (error) {
      console.error('Error fetching class:', error);
      return null;
    }
  }

  static async getClassesByTeacher(
    teacherId: string,
    page: number = 1,
    limit: number = 20,
    status?: Class['status']
  ): Promise<PaginatedResponse<ClassWithDetails>> {
    try {
      let query = supabase
        .from('classes')
        .select(`
          *,
          skill:skills(*),
          sub_skill:sub_skills(*)
        `, { count: 'exact' })
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: (data as ClassWithDetails[]) || [],
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
      return { data: [], count: 0, page: 1, limit: 20, total_pages: 0 };
    }
  }

  // Class Discovery and Search
  static async searchClasses(filters: SearchFilters & {
    page?: number;
    limit?: number;
    class_type?: Class['class_type'];
    available_only?: boolean;
  }): Promise<PaginatedResponse<ClassWithDetails>> {
    try {
      let query = supabase
        .from('classes')
        .select(`
          *,
          teacher:users(*),
          skill:skills(*),
          sub_skill:sub_skills(*)
        `, { count: 'exact' })
        .eq('status', 'active');

      // Apply filters
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      if (filters.skill_id) {
        query = query.eq('skill_id', filters.skill_id);
      }

      if (filters.sub_skill_id) {
        query = query.eq('sub_skill_id', filters.sub_skill_id);
      }

      if (filters.class_type) {
        query = query.eq('class_type', filters.class_type);
      }

      if (filters.price_range) {
        query = query.gte('base_price', filters.price_range[0]).lte('base_price', filters.price_range[1]);
      }

      if (filters.rating_min) {
        query = query.gte('average_rating', filters.rating_min);
      }

      if (filters.language) {
        query = query.eq('language_of_instruction', filters.language);
      }

      if (filters.available_only) {
        // Only show classes that have availability
        query = query.lt('currently_enrolled', supabase.from('classes').select('max_students'));
      }

      // Apply sorting
      const sortBy = filters.sort_by || 'created_at';
      const sortOrder = filters.sort_order === 'asc';

      if (sortBy === 'popularity') {
        query = query.order('currently_enrolled', { ascending: sortOrder });
      } else if (sortBy === 'rating') {
        query = query.order('average_rating', { ascending: sortOrder, nullsFirst: false });
      } else if (sortBy === 'price') {
        query = query.order('base_price', { ascending: sortOrder });
      } else {
        query = query.order(sortBy, { ascending: sortOrder });
      }

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: (data as ClassWithDetails[]) || [],
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Error searching classes:', error);
      return { data: [], count: 0, page: 1, limit: 20, total_pages: 0 };
    }
  }

  static async getFeaturedClasses(limit: number = 10): Promise<ClassWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          teacher:users(*),
          skill:skills(*),
          sub_skill:sub_skills(*)
        `)
        .eq('status', 'active')
        .order('average_rating', { ascending: false, nullsFirst: false })
        .order('currently_enrolled', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as ClassWithDetails[]) || [];
    } catch (error) {
      console.error('Error fetching featured classes:', error);
      return [];
    }
  }

  // Class Session Management
  static async createClassSession(
    classId: string,
    sessionData: Partial<ClassSession>
  ): Promise<ClassSession | null> {
    try {
      // Get class details to set capacity limit
      const classDetails = await this.getClass(classId);
      if (!classDetails) throw new Error('Class not found');

      const { data, error } = await supabase
        .from('class_sessions')
        .insert({
          ...sessionData,
          class_id: classId,
          capacity_limit: classDetails.max_students,
          students_booked: 0,
          status: 'scheduled',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating class session:', error);
      return null;
    }
  }

  static async updateClassSession(
    sessionId: string,
    updates: Partial<ClassSession>
  ): Promise<ClassSession | null> {
    try {
      const { data, error } = await supabase
        .from('class_sessions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating class session:', error);
      return null;
    }
  }

  static async getClassSessions(
    classId: string,
    futureOnly: boolean = true
  ): Promise<ClassSession[]> {
    try {
      let query = supabase
        .from('class_sessions')
        .select('*')
        .eq('class_id', classId)
        .order('scheduled_start_time', { ascending: true });

      if (futureOnly) {
        query = query.gte('scheduled_start_time', new Date().toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching class sessions:', error);
      return [];
    }
  }

  static async getUpcomingSessions(
    teacherId?: string,
    studentId?: string,
    limit: number = 10
  ): Promise<(ClassSession & { class: ClassWithDetails; bookings?: ClassBooking[] })[]> {
    try {
      let query = supabase
        .from('class_sessions')
        .select(`
          *,
          class:classes(
            *,
            teacher:users(*),
            skill:skills(*),
            sub_skill:sub_skills(*)
          )
        `)
        .gte('scheduled_start_time', new Date().toISOString())
        .in('status', ['scheduled', 'in_progress'])
        .order('scheduled_start_time', { ascending: true })
        .limit(limit);

      if (teacherId) {
        // Use a subquery to filter by teacher
        const { data: teacherClassIds } = await supabase
          .from('classes')
          .select('id')
          .eq('teacher_id', teacherId);

        const classIds = teacherClassIds?.map(c => c.id) || [];
        if (classIds.length === 0) return [];

        query = query.in('class_id', classIds);
      }

      const { data, error } = await query;
      if (error) throw error;

      let sessions = data || [];

      // If filtering for student, get their bookings
      if (studentId) {
        const { data: studentBookings } = await supabase
          .from('class_bookings')
          .select('class_session_id')
          .eq('student_id', studentId)
          .in('status', ['confirmed', 'attended']);

        const bookedSessionIds = studentBookings?.map(b => b.class_session_id) || [];
        sessions = sessions.filter(s => bookedSessionIds.includes(s.id));
      }

      return sessions;
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      return [];
    }
  }

  // Teacher Availability Management
  static async setTeacherAvailability(
    teacherId: string,
    availabilitySlots: Partial<TeacherAvailabilitySlot>[]
  ): Promise<boolean> {
    try {
      // Delete existing availability
      await supabase
        .from('teacher_availability_slots')
        .delete()
        .eq('teacher_id', teacherId);

      // Insert new availability
      if (availabilitySlots.length > 0) {
        const { error } = await supabase
          .from('teacher_availability_slots')
          .insert(
            availabilitySlots.map(slot => ({
              ...slot,
              teacher_id: teacherId,
              created_at: new Date().toISOString(),
            }))
          );

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error setting teacher availability:', error);
      return false;
    }
  }

  static async getTeacherAvailability(teacherId: string): Promise<TeacherAvailabilitySlot[]> {
    try {
      const { data, error } = await supabase
        .from('teacher_availability_slots')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('day_of_week', { ascending: true })
        .order('start_time_local', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching teacher availability:', error);
      return [];
    }
  }

  static async blockTeacherDate(
    teacherId: string,
    blockDate: string,
    reason?: string
  ): Promise<TeacherBlockedDate | null> {
    try {
      const { data, error } = await supabase
        .from('teacher_blocked_dates')
        .insert({
          teacher_id: teacherId,
          block_date: blockDate,
          reason,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error blocking teacher date:', error);
      return null;
    }
  }

  static async getTeacherBlockedDates(
    teacherId: string,
    fromDate?: string,
    toDate?: string
  ): Promise<TeacherBlockedDate[]> {
    try {
      let query = supabase
        .from('teacher_blocked_dates')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('block_date', { ascending: true });

      if (fromDate) {
        query = query.gte('block_date', fromDate);
      }

      if (toDate) {
        query = query.lte('block_date', toDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching teacher blocked dates:', error);
      return [];
    }
  }

  // Class Booking
  static async bookClass(
    studentId: string,
    classId: string,
    sessionId?: string,
    isDemoClass: boolean = false
  ): Promise<ClassBooking | null> {
    try {
      // Get class details for pricing
      const classDetails = await this.getClass(classId);
      if (!classDetails) throw new Error('Class not found');

      const { data, error } = await supabase
        .from('class_bookings')
        .insert({
          student_id: studentId,
          class_id: classId,
          class_session_id: sessionId,
          booking_price_at_time: isDemoClass ? 0 : classDetails.base_price,
          booking_date: new Date().toISOString(),
          status: 'pending_payment',
          is_demo_class: isDemoClass,
          attendance_marked: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update session booking count if session-specific booking
      if (sessionId) {
        await supabase.rpc('increment_session_bookings', { session_id: sessionId });
      }

      // Update class enrollment count
      await supabase.rpc('increment_class_enrollments', { class_id: classId });

      return data;
    } catch (error) {
      console.error('Error booking class:', error);
      return null;
    }
  }

  static async confirmBooking(bookingId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('class_bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) throw error;

      // Create notification for teacher
      const { data: booking } = await supabase
        .from('class_bookings')
        .select(`
          *,
          class:classes(teacher_id, title)
        `)
        .eq('id', bookingId)
        .single();

      if (booking?.class) {
        await supabase
          .from('notifications')
          .insert({
            recipient_id: (booking.class as any).teacher_id,
            notification_type: 'booking_update',
            message: `New booking confirmed for "${(booking.class as any).title}"`,
            is_read: false,
            created_at: new Date().toISOString(),
          });
      }

      return true;
    } catch (error) {
      console.error('Error confirming booking:', error);
      return false;
    }
  }

  static async cancelBooking(
    bookingId: string,
    cancelledBy: 'student' | 'teacher',
    refundAmount?: number
  ): Promise<boolean> {
    try {
      const status = cancelledBy === 'student' ? 'cancelled_by_student' : 'cancelled_by_teacher';
      
      const { error } = await supabase
        .from('class_bookings')
        .update({ 
          status,
          refund_amount: refundAmount || null,
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Decrement booking counts
      const { data: booking } = await supabase
        .from('class_bookings')
        .select('class_id, class_session_id')
        .eq('id', bookingId)
        .single();

      if (booking) {
        await supabase.rpc('decrement_class_enrollments', { class_id: booking.class_id });
        
        if (booking.class_session_id) {
          await supabase.rpc('decrement_session_bookings', { session_id: booking.class_session_id });
        }
      }

      return true;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return false;
    }
  }

  static async getStudentBookings(
    studentId: string,
    status?: ClassBooking['status']
  ): Promise<(ClassBooking & { class: ClassWithDetails; class_session?: ClassSession })[]> {
    try {
      let query = supabase
        .from('class_bookings')
        .select(`
          *,
          class:classes(
            *,
            teacher:users(*),
            skill:skills(*),
            sub_skill:sub_skills(*)
          ),
          class_session:class_sessions(*)
        `)
        .eq('student_id', studentId)
        .order('booking_date', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching student bookings:', error);
      return [];
    }
  }

  static async getClassBookings(
    classId: string,
    sessionId?: string
  ): Promise<(ClassBooking & { student: any; class_session?: ClassSession })[]> {
    try {
      let query = supabase
        .from('class_bookings')
        .select(`
          *,
          student:users(*),
          class_session:class_sessions(*)
        `)
        .eq('class_id', classId)
        .order('booking_date', { ascending: false });

      if (sessionId) {
        query = query.eq('class_session_id', sessionId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching class bookings:', error);
      return [];
    }
  }

  // Attendance Management
  static async markAttendance(
    bookingId: string,
    attended: boolean,
    teacherId: string
  ): Promise<boolean> {
    try {
      // Verify teacher owns this class
      const { data: booking } = await supabase
        .from('class_bookings')
        .select(`
          *,
          class:classes!inner(teacher_id)
        `)
        .eq('id', bookingId)
        .single();

      if (!booking || (booking.class as any).teacher_id !== teacherId) {
        throw new Error('Unauthorized');
      }

      const { error } = await supabase
        .from('class_bookings')
        .update({
          status: attended ? 'attended' : 'not_attended',
          attendance_marked: true,
        })
        .eq('id', bookingId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking attendance:', error);
      return false;
    }
  }

  // Class Publishing
  static async publishClass(classId: string, teacherId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('classes')
        .update({
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', classId)
        .eq('teacher_id', teacherId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error publishing class:', error);
      return false;
    }
  }

  static async unpublishClass(classId: string, teacherId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('classes')
        .update({
          status: 'private',
          updated_at: new Date().toISOString(),
        })
        .eq('id', classId)
        .eq('teacher_id', teacherId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unpublishing class:', error);
      return false;
    }
  }

  // Live Session Management
  static async startSession(sessionId: string, teacherId: string): Promise<boolean> {
    try {
      // Verify teacher owns this session
      const { data: session } = await supabase
        .from('class_sessions')
        .select(`
          *,
          class:classes!inner(teacher_id)
        `)
        .eq('id', sessionId)
        .single();

      if (!session || (session.class as any).teacher_id !== teacherId) {
        throw new Error('Unauthorized');
      }

      const { error } = await supabase
        .from('class_sessions')
        .update({
          status: 'in_progress',
          actual_start_time: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error starting session:', error);
      return false;
    }
  }

  static async endSession(sessionId: string, teacherId: string): Promise<boolean> {
    try {
      // Verify teacher owns this session
      const { data: session } = await supabase
        .from('class_sessions')
        .select(`
          *,
          class:classes!inner(teacher_id)
        `)
        .eq('id', sessionId)
        .single();

      if (!session || (session.class as any).teacher_id !== teacherId) {
        throw new Error('Unauthorized');
      }

      const { error } = await supabase
        .from('class_sessions')
        .update({
          status: 'completed',
          actual_end_time: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error ending session:', error);
      return false;
    }
  }
}
