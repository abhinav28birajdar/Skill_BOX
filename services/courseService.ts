import { supabase } from '../lib/supabase';
import { Assignment, Course, CourseEnrollment, CourseWithDetails, Lesson, Module, PaginatedResponse, SearchFilters, StudentSubmission, UserProgress } from '../types/database';

export class CourseService {
  // Course CRUD Operations
  static async createCourse(
    teacherId: string,
    courseData: Partial<Course>
  ): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          teacher_id: teacherId,
          status: 'draft',
          average_rating: null,
          total_students_enrolled: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating course:', error);
      return null;
    }
  }

  static async updateCourse(
    courseId: string,
    teacherId: string,
    updates: Partial<Course>
  ): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', courseId)
        .eq('teacher_id', teacherId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating course:', error);
      return null;
    }
  }

  static async deleteCourse(courseId: string, teacherId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)
        .eq('teacher_id', teacherId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      return false;
    }
  }

  static async getCourse(courseId: string): Promise<CourseWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:users(*),
          skill:skills(*),
          sub_skill:sub_skills(*),
          modules:modules(
            *,
            lessons:lessons(
              *,
              learning_content:learning_content(*)
            )
          )
        `)
        .eq('id', courseId)
        .single();

      if (error) throw error;
      return data as CourseWithDetails;
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  }

  static async getCoursesByTeacher(
    teacherId: string,
    page: number = 1,
    limit: number = 20,
    status?: Course['status']
  ): Promise<PaginatedResponse<CourseWithDetails>> {
    try {
      let query = supabase
        .from('courses')
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
        data: (data as CourseWithDetails[]) || [],
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
      return { data: [], count: 0, page: 1, limit: 20, total_pages: 0 };
    }
  }

  // Course Discovery and Search
  static async searchCourses(filters: SearchFilters & {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<CourseWithDetails>> {
    try {
      let query = supabase
        .from('courses')
        .select(`
          *,
          teacher:users(*),
          skill:skills(*),
          sub_skill:sub_skills(*)
        `, { count: 'exact' })
        .eq('status', 'published');

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

      if (filters.price_range) {
        query = query.gte('price', filters.price_range[0]).lte('price', filters.price_range[1]);
      }

      if (filters.rating_min) {
        query = query.gte('average_rating', filters.rating_min);
      }

      if (filters.language) {
        query = query.eq('language_taught', filters.language);
      }

      // Apply sorting
      const sortBy = filters.sort_by || 'created_at';
      const sortOrder = filters.sort_order === 'asc';

      if (sortBy === 'popularity') {
        query = query.order('total_students_enrolled', { ascending: sortOrder });
      } else if (sortBy === 'rating') {
        query = query.order('average_rating', { ascending: sortOrder, nullsFirst: false });
      } else if (sortBy === 'price') {
        query = query.order('price', { ascending: sortOrder });
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
        data: (data as CourseWithDetails[]) || [],
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Error searching courses:', error);
      return { data: [], count: 0, page: 1, limit: 20, total_pages: 0 };
    }
  }

  static async getFeaturedCourses(limit: number = 10): Promise<CourseWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:users(*),
          skill:skills(*),
          sub_skill:sub_skills(*)
        `)
        .eq('status', 'published')
        .order('average_rating', { ascending: false, nullsFirst: false })
        .order('total_students_enrolled', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as CourseWithDetails[]) || [];
    } catch (error) {
      console.error('Error fetching featured courses:', error);
      return [];
    }
  }

  static async getPopularCourses(limit: number = 10): Promise<CourseWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:users(*),
          skill:skills(*),
          sub_skill:sub_skills(*)
        `)
        .eq('status', 'published')
        .order('total_students_enrolled', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as CourseWithDetails[]) || [];
    } catch (error) {
      console.error('Error fetching popular courses:', error);
      return [];
    }
  }

  // Module Management
  static async createModule(
    courseId: string,
    moduleData: Partial<Module>
  ): Promise<Module | null> {
    try {
      const { data, error } = await supabase
        .from('modules')
        .insert({
          ...moduleData,
          course_id: courseId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating module:', error);
      return null;
    }
  }

  static async updateModule(
    moduleId: string,
    updates: Partial<Module>
  ): Promise<Module | null> {
    try {
      const { data, error } = await supabase
        .from('modules')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', moduleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating module:', error);
      return null;
    }
  }

  static async deleteModule(moduleId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting module:', error);
      return false;
    }
  }

  // Lesson Management
  static async createLesson(
    moduleId: string,
    lessonData: Partial<Lesson>
  ): Promise<Lesson | null> {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          ...lessonData,
          module_id: moduleId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating lesson:', error);
      return null;
    }
  }

  static async updateLesson(
    lessonId: string,
    updates: Partial<Lesson>
  ): Promise<Lesson | null> {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .update(updates)
        .eq('id', lessonId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating lesson:', error);
      return null;
    }
  }

  static async deleteLesson(lessonId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting lesson:', error);
      return false;
    }
  }

  // Course Enrollment
  static async enrollInCourse(
    studentId: string,
    courseId: string
  ): Promise<CourseEnrollment | null> {
    try {
      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('student_id', studentId)
        .eq('course_id', courseId)
        .single();

      if (existingEnrollment) {
        return existingEnrollment;
      }

      const { data, error } = await supabase
        .from('course_enrollments')
        .insert({
          student_id: studentId,
          course_id: courseId,
          enrollment_date: new Date().toISOString(),
          progress_percentage: 0,
          status: 'in_progress',
        })
        .select()
        .single();

      if (error) throw error;

      // Update course enrollment count
      await supabase.rpc('increment_course_enrollments', { course_id: courseId });

      return data;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      return null;
    }
  }

  static async getStudentEnrollments(
    studentId: string,
    status?: CourseEnrollment['status']
  ): Promise<(CourseEnrollment & { course: CourseWithDetails })[]> {
    try {
      let query = supabase
        .from('course_enrollments')
        .select(`
          *,
          course:courses(
            *,
            teacher:users(*),
            skill:skills(*),
            sub_skill:sub_skills(*)
          )
        `)
        .eq('student_id', studentId)
        .order('enrollment_date', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching student enrollments:', error);
      return [];
    }
  }

  static async getCourseStudents(
    courseId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<CourseEnrollment & { student: any }>> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          student:users(*)
        `, { count: 'exact' })
        .eq('course_id', courseId)
        .order('enrollment_date', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Error fetching course students:', error);
      return { data: [], count: 0, page: 1, limit: 20, total_pages: 0 };
    }
  }

  // Progress Tracking
  static async updateProgress(
    userId: string,
    entityId: string,
    entityType: UserProgress['entity_type'],
    progressStatus: UserProgress['progress_status'],
    score?: number
  ): Promise<UserProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          entity_id: entityId,
          entity_type: entityType,
          progress_status: progressStatus,
          score,
          last_accessed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update course progress percentage if this is a lesson completion
      if (entityType === 'lesson' && progressStatus === 'completed') {
        await this.updateCourseProgress(userId, entityId);
      }

      return data;
    } catch (error) {
      console.error('Error updating progress:', error);
      return null;
    }
  }

  private static async updateCourseProgress(userId: string, lessonId: string): Promise<void> {
    try {
      // Get the course ID from the lesson
      const { data: lesson } = await supabase
        .from('lessons')
        .select(`
          module:modules(course_id)
        `)
        .eq('id', lessonId)
        .single();

      if (!lesson?.module?.course_id) return;

      const courseId = lesson.module.course_id;

      // Calculate progress percentage
      const { data: courseProgress } = await supabase.rpc('calculate_course_progress', {
        student_id: userId,
        course_id: courseId,
      });

      if (courseProgress !== null) {
        await supabase
          .from('course_enrollments')
          .update({
            progress_percentage: courseProgress,
            ...(courseProgress === 100 && {
              completion_date: new Date().toISOString(),
              status: 'completed',
            }),
          })
          .eq('student_id', userId)
          .eq('course_id', courseId);
      }
    } catch (error) {
      console.error('Error updating course progress:', error);
    }
  }

  static async getStudentProgress(
    userId: string,
    courseId: string
  ): Promise<{
    progress_percentage: number;
    completed_lessons: number;
    total_lessons: number;
    last_accessed: string | null;
  }> {
    try {
      const { data: enrollment } = await supabase
        .from('course_enrollments')
        .select('progress_percentage')
        .eq('student_id', userId)
        .eq('course_id', courseId)
        .single();

      const { data: totalLessons } = await supabase
        .from('lessons')
        .select('id', { count: 'exact' })
        .in('module_id',
          supabase.from('modules').select('id').eq('course_id', courseId)
        );

      const { data: completedLessons } = await supabase
        .from('user_progress')
        .select('entity_id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('entity_type', 'lesson')
        .eq('progress_status', 'completed')
        .in('entity_id',
          supabase
            .from('lessons')
            .select('id')
            .in('module_id',
              supabase.from('modules').select('id').eq('course_id', courseId)
            )
        );

      const { data: lastAccessed } = await supabase
        .from('user_progress')
        .select('last_accessed_at')
        .eq('user_id', userId)
        .in('entity_id',
          supabase
            .from('lessons')
            .select('id')
            .in('module_id',
              supabase.from('modules').select('id').eq('course_id', courseId)
            )
        )
        .order('last_accessed_at', { ascending: false })
        .limit(1)
        .single();

      return {
        progress_percentage: enrollment?.progress_percentage || 0,
        completed_lessons: completedLessons?.length || 0,
        total_lessons: totalLessons?.length || 0,
        last_accessed: lastAccessed?.last_accessed_at || null,
      };
    } catch (error) {
      console.error('Error fetching student progress:', error);
      return {
        progress_percentage: 0,
        completed_lessons: 0,
        total_lessons: 0,
        last_accessed: null,
      };
    }
  }

  // Assignment Management
  static async createAssignment(
    teacherId: string,
    assignmentData: Partial<Assignment>
  ): Promise<Assignment | null> {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert({
          ...assignmentData,
          teacher_id: teacherId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      return null;
    }
  }

  static async submitAssignment(
    studentId: string,
    assignmentId: string,
    submissionData: Partial<StudentSubmission>
  ): Promise<StudentSubmission | null> {
    try {
      const { data, error } = await supabase
        .from('student_submissions')
        .insert({
          ...submissionData,
          assignment_id: assignmentId,
          student_id: studentId,
          submitted_at: new Date().toISOString(),
          status: 'submitted',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting assignment:', error);
      return null;
    }
  }

  static async gradeAssignment(
    submissionId: string,
    teacherId: string,
    grade: number,
    feedback?: string
  ): Promise<StudentSubmission | null> {
    try {
      const { data, error } = await supabase
        .from('student_submissions')
        .update({
          teacher_grade: grade,
          teacher_feedback: feedback,
          status: 'graded',
        })
        .eq('id', submissionId)
        .select(`
          *,
          assignment:assignments!inner(teacher_id)
        `)
        .single();

      if (error) throw error;

      // Verify teacher owns this assignment
      if ((data as any).assignment.teacher_id !== teacherId) {
        throw new Error('Unauthorized');
      }

      // Create notification for student
      await supabase
        .from('notifications')
        .insert({
          recipient_id: data.student_id,
          notification_type: 'assignment_graded',
          message: `Your assignment has been graded: ${grade}${feedback ? ` - ${feedback}` : ''}`,
          is_read: false,
          created_at: new Date().toISOString(),
        });

      return data;
    } catch (error) {
      console.error('Error grading assignment:', error);
      return null;
    }
  }

  // Course Publishing
  static async publishCourse(courseId: string, teacherId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', courseId)
        .eq('teacher_id', teacherId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error publishing course:', error);
      return false;
    }
  }

  static async unpublishCourse(courseId: string, teacherId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          status: 'private',
          updated_at: new Date().toISOString(),
        })
        .eq('id', courseId)
        .eq('teacher_id', teacherId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unpublishing course:', error);
      return false;
    }
  }
}
