import { Enrollment } from '../types/database';
import supabase from './supabase';

class EnrollmentService {
  // Enroll student in course
  async enrollInCourse(courseId: string, studentId: string): Promise<Enrollment | null> {
    try {
      // Check if already enrolled
      const { data: existing } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', courseId)
        .eq('student_id', studentId)
        .single();

      if (existing) {
        return existing;
      }

      // Get total lessons count
      const { count } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId);

      // Create enrollment
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          course_id: courseId,
          student_id: studentId,
          total_lessons: count || 0,
          progress: {},
        })
        .select()
        .single();

      if (error) throw error;

      // Increment course student count
      await supabase.rpc('increment_course_students', { course_id: courseId });

      return data;
    } catch (error: any) {
      console.error('Enroll in course error:', error);
      return null;
    }
  }

  // Get student enrollments
  async getStudentEnrollments(studentId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (
            *,
            profiles!courses_teacher_id_fkey (*),
            categories (*),
            lessons (count)
          )
        `)
        .eq('student_id', studentId)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get student enrollments error:', error);
      return [];
    }
  }

  // Get course enrollments (for teachers)
  async getCourseEnrollments(courseId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          profiles!enrollments_student_id_fkey (*)
        `)
        .eq('course_id', courseId)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get course enrollments error:', error);
      return [];
    }
  }

  // Update lesson progress
  async updateProgress(
    enrollmentId: string,
    lessonId: string,
    completed: boolean
  ): Promise<boolean> {
    try {
      // Get current enrollment
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('id', enrollmentId)
        .single();

      if (!enrollment) return false;

      const progress = (enrollment.progress as any) || {};
      progress[lessonId] = { completed, completedAt: new Date().toISOString() };

      // Calculate completed lessons count
      const completedCount = Object.values(progress).filter(
        (p: any) => p.completed
      ).length;

      const progressPercentage = enrollment.total_lessons > 0
        ? Math.round((completedCount / enrollment.total_lessons) * 100)
        : 0;

      // Update enrollment
      const { error } = await supabase
        .from('enrollments')
        .update({
          progress,
          completed_lessons: completedCount,
          progress_percentage: progressPercentage,
          last_accessed: new Date().toISOString(),
        })
        .eq('id', enrollmentId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Update progress error:', error);
      return false;
    }
  }

  // Get enrollment for specific course and student
  async getEnrollment(courseId: string, studentId: string): Promise<Enrollment | null> {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', courseId)
        .eq('student_id', studentId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Get enrollment error:', error);
      return null;
    }
  }

  // Check if student is enrolled
  async isEnrolled(courseId: string, studentId: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('student_id', studentId)
        .single();

      return !!data;
    } catch {
      return false;
    }
  }
}

export default new EnrollmentService();
