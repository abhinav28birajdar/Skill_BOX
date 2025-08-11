import { supabase } from '../lib/supabase';
import { PaginatedResponse, TeacherApplication, User } from '../types/database';

export class UserService {
  // User Profile Management
  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  static async uploadProfileImage(userId: string, imageFile: File): Promise<string | null> {
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Update user profile with new image URL
      await this.updateUserProfile(userId, { profile_image_url: data.publicUrl });
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return null;
    }
  }

  // Teacher Application Management
  static async submitTeacherApplication(
    userId: string, 
    applicationData: any
  ): Promise<TeacherApplication | null> {
    try {
      const { data, error } = await supabase
        .from('teacher_applications')
        .insert({
          user_id: userId,
          application_data: applicationData,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update user role to teacher_pending
      await this.updateUserProfile(userId, { role: 'teacher_pending' });

      return data;
    } catch (error) {
      console.error('Error submitting teacher application:', error);
      return null;
    }
  }

  static async getTeacherApplication(userId: string): Promise<TeacherApplication | null> {
    try {
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching teacher application:', error);
      return null;
    }
  }

  // Search and Discovery
  static async searchUsers(
    query: string,
    filters: {
      role?: User['role'];
      skills?: string[];
      page?: number;
      limit?: number;
    } = {}
  ): Promise<PaginatedResponse<User>> {
    try {
      let dbQuery = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%,bio.ilike.%${query}%`)
        .eq('is_active', true);

      if (filters.role) {
        dbQuery = dbQuery.eq('role', filters.role);
      }

      if (filters.skills && filters.skills.length > 0) {
        dbQuery = dbQuery.overlaps('teaching_skills', filters.skills);
      }

      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      dbQuery = dbQuery.range(from, to);

      const { data, error, count } = await dbQuery;
      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Error searching users:', error);
      return { data: [], count: 0, page: 1, limit: 20, total_pages: 0 };
    }
  }

  static async getFeaturedTeachers(limit: number = 10): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'teacher_approved')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured teachers:', error);
      return [];
    }
  }

  // Following System
  static async followTeacher(followerId: string, teacherId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_follows_teacher')
        .insert({
          follower_id: followerId,
          teacher_id: teacherId,
          followed_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Create notification for teacher
      await supabase
        .from('notifications')
        .insert({
          recipient_id: teacherId,
          notification_type: 'follow',
          message: 'Someone started following you!',
          is_read: false,
          created_at: new Date().toISOString(),
        });

      return true;
    } catch (error) {
      console.error('Error following teacher:', error);
      return false;
    }
  }

  static async unfollowTeacher(followerId: string, teacherId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_follows_teacher')
        .delete()
        .eq('follower_id', followerId)
        .eq('teacher_id', teacherId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unfollowing teacher:', error);
      return false;
    }
  }

  static async isFollowingTeacher(followerId: string, teacherId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_follows_teacher')
        .select('follower_id')
        .eq('follower_id', followerId)
        .eq('teacher_id', teacherId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }

  static async getFollowedTeachers(userId: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('user_follows_teacher')
        .select(`
          teacher:users!teacher_id (*)
        `)
        .eq('follower_id', userId)
        .order('followed_at', { ascending: false });

      if (error) throw error;
      return (data?.map((item: any) => item.teacher).filter(Boolean) as User[]) || [];
    } catch (error) {
      console.error('Error fetching followed teachers:', error);
      return [];
    }
  }

  static async getFollowerCount(teacherId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('user_follows_teacher')
        .select('*', { count: 'exact', head: true })
        .eq('teacher_id', teacherId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching follower count:', error);
      return 0;
    }
  }

  // Activity Logging
  static async logUserActivity(
    userId: string,
    action: string,
    relatedId?: string,
    metadata?: any
  ): Promise<void> {
    try {
      await supabase
        .from('user_activity_log')
        .insert({
          user_id: userId,
          action,
          related_id: relatedId,
          ip_address: null, // Will be set by server-side function if needed
          user_agent: navigator?.userAgent || null,
          created_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Error logging user activity:', error);
    }
  }

  // User Statistics
  static async getUserStats(userId: string): Promise<{
    follower_count: number;
    following_count: number;
    content_count: number;
    course_count: number;
    class_count: number;
    total_students: number;
    average_rating: number;
  }> {
    try {
      const [
        followerCount,
        followingCount,
        contentCount,
        courseCount,
        classCount,
        studentStats,
        ratingStats,
      ] = await Promise.all([
        this.getFollowerCount(userId),
        this.getFollowingCount(userId),
        this.getContentCount(userId),
        this.getCourseCount(userId),
        this.getClassCount(userId),
        this.getStudentCount(userId),
        this.getAverageRating(userId),
      ]);

      return {
        follower_count: followerCount,
        following_count: followingCount,
        content_count: contentCount,
        course_count: courseCount,
        class_count: classCount,
        total_students: studentStats,
        average_rating: ratingStats,
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        follower_count: 0,
        following_count: 0,
        content_count: 0,
        course_count: 0,
        class_count: 0,
        total_students: 0,
        average_rating: 0,
      };
    }
  }

  private static async getFollowingCount(userId: string): Promise<number> {
    const { count } = await supabase
      .from('user_follows_teacher')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);
    return count || 0;
  }

  private static async getContentCount(userId: string): Promise<number> {
    const { count } = await supabase
      .from('learning_content')
      .select('*', { count: 'exact', head: true })
      .eq('teacher_id', userId)
      .eq('status', 'approved');
    return count || 0;
  }

  private static async getCourseCount(userId: string): Promise<number> {
    const { count } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('teacher_id', userId)
      .eq('status', 'published');
    return count || 0;
  }

  private static async getClassCount(userId: string): Promise<number> {
    const { count } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .eq('teacher_id', userId)
      .eq('status', 'active');
    return count || 0;
  }

  private static async getStudentCount(userId: string): Promise<number> {
    // Count unique students from both course enrollments and class bookings
    try {
      // Get course IDs for this teacher
      const { data: teacherCourses } = await supabase
        .from('courses')
        .select('id')
        .eq('teacher_id', userId);

      const courseIds = teacherCourses?.map(c => c.id) || [];

      // Get class IDs for this teacher
      const { data: teacherClasses } = await supabase
        .from('classes')
        .select('id')
        .eq('teacher_id', userId);

      const classIds = teacherClasses?.map(c => c.id) || [];

      // Get students from courses
      let courseStudents: string[] = [];
      if (courseIds.length > 0) {
        const { data } = await supabase
          .from('course_enrollments')
          .select('student_id')
          .in('course_id', courseIds);
        courseStudents = data?.map(s => s.student_id) || [];
      }

      // Get students from classes
      let classStudents: string[] = [];
      if (classIds.length > 0) {
        const { data } = await supabase
          .from('class_bookings')
          .select('student_id')
          .in('class_id', classIds);
        classStudents = data?.map(s => s.student_id) || [];
      }

      const uniqueStudents = new Set([...courseStudents, ...classStudents]);
      return uniqueStudents.size;
    } catch (error) {
      console.error('Error getting student count:', error);
      return 0;
    }
  }

  private static async getAverageRating(userId: string): Promise<number> {
    try {
      const { data } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewed_entity_id', userId)
        .eq('entity_type', 'teacher')
        .eq('is_published', true);

      if (!data || data.length === 0) return 0;

      const sum = data.reduce((acc, review) => acc + review.rating, 0);
      return Math.round((sum / data.length) * 10) / 10; // Round to 1 decimal place
    } catch (error) {
      console.error('Error getting average rating:', error);
      return 0;
    }
  }

  // User Preferences
  static async updateUserPreferences(
    userId: string, 
    preferences: Record<string, any>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ preferences })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return false;
    }
  }

  // Account Deactivation
  static async deactivateAccount(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deactivating account:', error);
      return false;
    }
  }

  static async reactivateAccount(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error reactivating account:', error);
      return false;
    }
  }
}
