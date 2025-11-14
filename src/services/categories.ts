import type { Category } from '../types/database';
import supabase from './supabase';

class CategoryService {
  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get all categories error:', error);
      return [];
    }
  }

  // Get category by ID
  async getCategoryById(id: number): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Get category by ID error:', error);
      return null;
    }
  }

  // Get courses by category
  async getCategoryCourses(categoryId: number): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_teacher_id_fkey (*),
          categories (*)
        `)
        .eq('category_id', categoryId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get category courses error:', error);
      return [];
    }
  }
}

export default new CategoryService();
