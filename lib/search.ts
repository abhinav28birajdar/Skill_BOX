/**
 * Search and Filter Utilities
 * Advanced search, filtering, and sorting helpers
 */

import { supabase } from '@/lib/supabase';

export type SortOrder = 'asc' | 'desc';
export type SortField = string;

export interface SearchFilters {
  query?: string;
  skillId?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  tags?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
  language?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

export interface SearchResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Search courses with filters and pagination
 */
export async function searchCourses(
  filters: SearchFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 20 }
): Promise<SearchResult<any>> {
  try {
    let query = supabase
      .from('courses')
      .select(
        `
        *,
        instructor:user_profiles!instructor_id(id, first_name, last_name, avatar_url),
        skill:skills(id, name, icon)
      `,
        { count: 'exact' }
      );

    // Apply filters
    if (filters.query) {
      query = query.or(
        `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
      );
    }

    if (filters.skillId) {
      query = query.eq('skill_id', filters.skillId);
    }

    if (filters.level) {
      query = query.eq('level', filters.level);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.rating !== undefined) {
      query = query.gte('rating', filters.rating);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    if (filters.isPublished !== undefined) {
      query = query.eq('is_published', filters.isPublished);
    }

    if (filters.isFeatured !== undefined) {
      query = query.eq('is_featured', filters.isFeatured);
    }

    if (filters.language) {
      query = query.eq('language', filters.language);
    }

    // Apply sorting
    const sortField = pagination.sortBy || 'created_at';
    const sortOrder = pagination.sortOrder || 'desc';
    query = query.order(sortField, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / pagination.limit);

    return {
      data: data || [],
      total: count || 0,
      page: pagination.page,
      totalPages,
      hasMore: pagination.page < totalPages,
    };
  } catch (error) {
    console.error('Error searching courses:', error);
    throw error;
  }
}

/**
 * Search users/instructors
 */
export async function searchUsers(
  query: string,
  role?: string,
  pagination: PaginationOptions = { page: 1, limit: 20 }
): Promise<SearchResult<any>> {
  try {
    let dbQuery = supabase
      .from('user_profiles')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    if (query) {
      dbQuery = dbQuery.or(
        `first_name.ilike.%${query}%,last_name.ilike.%${query}%,username.ilike.%${query}%,display_name.ilike.%${query}%`
      );
    }

    if (role) {
      dbQuery = dbQuery.eq('role', role);
    }

    // Apply pagination
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    dbQuery = dbQuery.range(from, to);

    const { data, error, count } = await dbQuery;

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / pagination.limit);

    return {
      data: data || [],
      total: count || 0,
      page: pagination.page,
      totalPages,
      hasMore: pagination.page < totalPages,
    };
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}

/**
 * Search learning content
 */
export async function searchContent(
  filters: {
    query?: string;
    type?: string;
    skillId?: string;
    status?: string;
  } = {},
  pagination: PaginationOptions = { page: 1, limit: 20 }
): Promise<SearchResult<any>> {
  try {
    let query = supabase
      .from('learning_content')
      .select(
        `
        *,
        creator:user_profiles!creator_id(id, first_name, last_name, avatar_url),
        skill:skills(id, name, icon)
      `,
        { count: 'exact' }
      );

    if (filters.query) {
      query = query.or(
        `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
      );
    }

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.skillId) {
      query = query.eq('skill_id', filters.skillId);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // Apply pagination
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / pagination.limit);

    return {
      data: data || [],
      total: count || 0,
      page: pagination.page,
      totalPages,
      hasMore: pagination.page < totalPages,
    };
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
  }
}

/**
 * Get popular courses (trending)
 */
export async function getTrendingCourses(limit: number = 10): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(
        `
        *,
        instructor:user_profiles!instructor_id(id, first_name, last_name, avatar_url),
        skill:skills(id, name, icon)
      `
      )
      .eq('is_published', true)
      .order('total_students', { ascending: false })
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching trending courses:', error);
    return [];
  }
}

/**
 * Get recommended courses for a user
 */
export async function getRecommendedCourses(
  userId: string,
  limit: number = 10
): Promise<any[]> {
  try {
    // Get user's enrolled courses and skills
    const { data: userSkills } = await supabase
      .from('user_skills')
      .select('skill_id')
      .eq('user_id', userId);

    const skillIds = userSkills?.map((us: any) => us.skill_id) || [];

    if (skillIds.length === 0) {
      // If no skills, return featured courses
      const { data } = await supabase
        .from('courses')
        .select(
          `
          *,
          instructor:user_profiles!instructor_id(id, first_name, last_name, avatar_url),
          skill:skills(id, name, icon)
        `
        )
        .eq('is_published', true)
        .eq('is_featured', true)
        .limit(limit);

      return data || [];
    }

    // Get courses matching user's skills
    const { data, error } = await supabase
      .from('courses')
      .select(
        `
        *,
        instructor:user_profiles!instructor_id(id, first_name, last_name, avatar_url),
        skill:skills(id, name, icon)
      `
      )
      .eq('is_published', true)
      .in('skill_id', skillIds)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recommended courses:', error);
    return [];
  }
}

/**
 * Filter and sort array of items locally
 */
export function filterAndSort<T extends Record<string, any>>(
  items: T[],
  {
    query,
    searchFields = [],
    filters = {},
    sortBy,
    sortOrder = 'asc',
  }: {
    query?: string;
    searchFields?: (keyof T)[];
    filters?: Partial<Record<keyof T, any>>;
    sortBy?: keyof T;
    sortOrder?: SortOrder;
  }
): T[] {
  let filtered = [...items];

  // Apply text search
  if (query && searchFields.length > 0) {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter((item) =>
      searchFields.some((field) =>
        String(item[field]).toLowerCase().includes(lowerQuery)
      )
    );
  }

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      filtered = filtered.filter((item) => item[key] === value);
    }
  });

  // Apply sorting
  if (sortBy) {
    filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }

  return filtered;
}

export default {
  searchCourses,
  searchUsers,
  searchContent,
  getTrendingCourses,
  getRecommendedCourses,
  filterAndSort,
};
