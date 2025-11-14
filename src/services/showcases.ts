import { Showcase } from '../types/database';
import supabase from './supabase';

class ShowcaseService {
  // Create showcase
  async createShowcase(showcaseData: {
    student_id: string;
    course_id: string;
    title: string;
    description?: string;
    media_url: string;
    media_type: string;
    tags?: string[];
  }): Promise<Showcase | null> {
    try {
      const { data, error } = await supabase
        .from('showcases')
        .insert(showcaseData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Create showcase error:', error);
      return null;
    }
  }

  // Get showcases by student
  async getStudentShowcases(studentId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('showcases')
        .select(`
          *,
          courses (
            id,
            title,
            cover_url
          )
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get student showcases error:', error);
      return [];
    }
  }

  // Get showcases by course
  async getCourseShowcases(courseId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('showcases')
        .select(`
          *,
          profiles!showcases_student_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get course showcases error:', error);
      return [];
    }
  }

  // Get all showcases (explore feed)
  async getAllShowcases(limit = 20, offset = 0): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('showcases')
        .select(`
          *,
          profiles!showcases_student_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          courses (
            id,
            title,
            cover_url
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get all showcases error:', error);
      return [];
    }
  }

  // Get showcase by ID
  async getShowcaseById(id: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('showcases')
        .select(`
          *,
          profiles!showcases_student_id_fkey (
            id,
            full_name,
            avatar_url,
            bio
          ),
          courses (
            id,
            title,
            cover_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Get showcase by ID error:', error);
      return null;
    }
  }

  // Update showcase
  async updateShowcase(
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      tags: string[];
    }>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('showcases')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Update showcase error:', error);
      return false;
    }
  }

  // Delete showcase
  async deleteShowcase(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('showcases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Delete showcase error:', error);
      return false;
    }
  }

  // Toggle like on showcase
  async toggleLike(id: string, increment: boolean): Promise<boolean> {
    try {
      const { data: showcase } = await supabase
        .from('showcases')
        .select('likes_count')
        .eq('id', id)
        .single();

      if (!showcase) return false;

      const newCount = Math.max(0, showcase.likes_count + (increment ? 1 : -1));

      const { error } = await supabase
        .from('showcases')
        .update({ likes_count: newCount })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Toggle like error:', error);
      return false;
    }
  }

  // Search showcases by tags
  async searchByTags(tags: string[]): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('showcases')
        .select(`
          *,
          profiles!showcases_student_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          courses (
            id,
            title
          )
        `)
        .overlaps('tags', tags)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Search by tags error:', error);
      return [];
    }
  }
}

export default new ShowcaseService();
