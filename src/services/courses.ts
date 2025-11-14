import { Course, CourseWithDetails, Lesson } from '../types/database';
import supabase, { typedSupabase } from './supabase';
import { insertRecord, updateRecord } from './supabase-helpers';

class CourseService {
  // Get all published courses with filters
  async getAllCourses(filters?: {
    category?: number;
    skill_level?: string;
    search?: string;
    teacher_id?: string;
  }): Promise<CourseWithDetails[]> {
    try {
      let query = supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_teacher_id_fkey (*),
          categories (*),
          lessons (count)
        `)
        .eq('is_published', true);

      if (filters?.category) {
        query = query.eq('category_id', filters.category);
      }
      if (filters?.skill_level) {
        query = query.eq('skill_level', filters.skill_level);
      }
      if (filters?.teacher_id) {
        query = query.eq('teacher_id', filters.teacher_id);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get all courses error:', error);
      return [];
    }
  }

  // Get single course with full details
  async getCourseById(id: string): Promise<CourseWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_teacher_id_fkey (*),
          categories (*),
          lessons (*),
          enrollments (count)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Get course by ID error:', error);
      return null;
    }
  }

  // Get courses by teacher
  async getTeacherCourses(teacherId: string): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get teacher courses error:', error);
      return [];
    }
  }

  // Create new course
  async createCourse(courseData: {
    teacher_id: string;
    title: string;
    description?: string;
    cover_url?: string;
    category_id?: number;
    skill_level?: string;
    language?: string;
    price?: number;
  }): Promise<Course | null> {
    try {
      const { data, error } = await insertRecord('courses', courseData);

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Create course error:', error);
      return null;
    }
  }

  // Update course
  async updateCourse(id: string, updates: Partial<Course>): Promise<boolean> {
    try {
      const { error } = await updateRecord('courses', updates, { id });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Update course error:', error);
      return false;
    }
  }

  // Delete course
  async deleteCourse(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Delete course error:', error);
      return false;
    }
  }

  // Publish/unpublish course
  async togglePublish(id: string, isPublished: boolean): Promise<boolean> {
    try {
      const { error } = await updateRecord('courses', { is_published: isPublished }, { id });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Toggle publish error:', error);
      return false;
    }
  }

  // Get course lessons
  async getCourseLessons(courseId: string): Promise<Lesson[]> {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get course lessons error:', error);
      return [];
    }
  }

  // Add lesson to course
  async addLesson(lessonData: {
    course_id: string;
    title: string;
    video_url?: string;
    document_url?: string;
    text_content?: string;
    order_index: number;
    duration?: number;
  }): Promise<Lesson | null> {
    try {
      const { data, error } = await insertRecord('lessons', lessonData);

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Add lesson error:', error);
      return null;
    }
  }

  // Update lesson
  async updateLesson(id: string, updates: Partial<Lesson>): Promise<boolean> {
    try {
      const { error } = await updateRecord('lessons', updates, { id });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Update lesson error:', error);
      return false;
    }
  }

  // Delete lesson
  async deleteLesson(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Delete lesson error:', error);
      return false;
    }
  }

  // Reorder lessons
  async reorderLessons(lessons: { id: string; order_index: number }[]): Promise<boolean> {
    try {
      const updates = lessons.map(lesson =>
        typedSupabase
          .from('lessons')
          .update({ order_index: lesson.order_index })
          .eq('id', lesson.id)
      );

      await Promise.all(updates);
      return true;
    } catch (error: any) {
      console.error('Reorder lessons error:', error);
      return false;
    }
  }
}

export default new CourseService();
