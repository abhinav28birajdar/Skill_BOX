import { supabase } from '@/lib/supabase';
import { cacheManager } from './cacheManager';

interface SearchFilters {
  category?: string;
  difficulty?: string;
  duration?: string;
  rating?: number;
  price?: 'free' | 'paid';
  language?: string;
}

interface SearchOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'rating' | 'popularity' | 'date' | 'price';
  sortOrder?: 'asc' | 'desc';
}

interface SearchResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  facets?: {
    categories: { name: string; count: number }[];
    difficulties: { name: string; count: number }[];
    languages: { name: string; count: number }[];
  };
}

export type { SearchResult };

class SearchService {
  private readonly CACHE_TTL = 15; // 15 minutes

  async searchCourses(
    query: string,
    filters: SearchFilters = {},
    options: SearchOptions = {}
  ): Promise<SearchResult<any>> {
    const cacheKey = `search_courses_${JSON.stringify({ query, filters, options })}`;
    
    return cacheManager.getOrFetch(
      cacheKey,
      () => this.performCourseSearch(query, filters, options),
      { ttl: this.CACHE_TTL }
    );
  }

  async searchUsers(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult<any>> {
    const cacheKey = `search_users_${JSON.stringify({ query, options })}`;
    
    return cacheManager.getOrFetch(
      cacheKey,
      () => this.performUserSearch(query, options),
      { ttl: this.CACHE_TTL }
    );
  }

  async searchSkills(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult<any>> {
    const cacheKey = `search_skills_${JSON.stringify({ query, options })}`;
    
    return cacheManager.getOrFetch(
      cacheKey,
      () => this.performSkillSearch(query, options),
      { ttl: this.CACHE_TTL }
    );
  }

  private async performCourseSearch(
    query: string,
    filters: SearchFilters,
    options: SearchOptions
  ): Promise<SearchResult<any>> {
    try {
      let queryBuilder = supabase
        .from('courses')
        .select(`
          *,
          categories(name),
          user_profiles(full_name, avatar_url),
          course_ratings(rating)
        `);

      // Apply text search
      if (query.trim()) {
        queryBuilder = queryBuilder.or(`
          title.ilike.%${query}%,
          description.ilike.%${query}%,
          tags.ilike.%${query}%
        `);
      }

      // Apply filters
      if (filters.category) {
        queryBuilder = queryBuilder.eq('category_id', filters.category);
      }
      
      if (filters.difficulty) {
        queryBuilder = queryBuilder.eq('difficulty_level', filters.difficulty);
      }
      
      if (filters.price === 'free') {
        queryBuilder = queryBuilder.eq('is_free', true);
      } else if (filters.price === 'paid') {
        queryBuilder = queryBuilder.eq('is_free', false);
      }

      if (filters.language) {
        queryBuilder = queryBuilder.eq('language', filters.language);
      }

      // Apply sorting
      switch (options.sortBy) {
        case 'rating':
          queryBuilder = queryBuilder.order('average_rating', { 
            ascending: options.sortOrder === 'asc' 
          });
          break;
        case 'date':
          queryBuilder = queryBuilder.order('created_at', { 
            ascending: options.sortOrder === 'asc' 
          });
          break;
        case 'price':
          queryBuilder = queryBuilder.order('price', { 
            ascending: options.sortOrder === 'asc' 
          });
          break;
        case 'popularity':
          queryBuilder = queryBuilder.order('enrollment_count', { 
            ascending: options.sortOrder === 'asc' 
          });
          break;
        default:
          // Default relevance sorting can be implemented with full-text search ranking
          queryBuilder = queryBuilder.order('created_at', { ascending: false });
      }

      // Apply pagination
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      
      const { data, error, count } = await (queryBuilder as any)
        .range(offset, offset + limit - 1)
        .limit(limit);

      if (error) throw error;

      // Get facets for filtering
      const facets = await this.getCourseFacets(query, filters);

      return {
        items: data || [],
        total: count || 0,
        hasMore: (count || 0) > offset + limit,
        facets,
      };
    } catch (error) {
      console.error('Course search error:', error);
      return {
        items: [],
        total: 0,
        hasMore: false,
      };
    }
  }

  private async performUserSearch(
    query: string,
    options: SearchOptions
  ): Promise<SearchResult<any>> {
    try {
      let queryBuilder = supabase
        .from('user_profiles')
        .select(`
          *,
          user_skills(skill_name, proficiency_level)
        `);

      if (query.trim()) {
        queryBuilder = queryBuilder.or(`
          full_name.ilike.%${query}%,
          bio.ilike.%${query}%,
          expertise.ilike.%${query}%
        `);
      }

      const limit = options.limit || 20;
      const offset = options.offset || 0;
      
      const { data, error, count } = await (queryBuilder as any)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        items: data || [],
        total: count || 0,
        hasMore: (count || 0) > offset + limit,
      };
    } catch (error) {
      console.error('User search error:', error);
      return {
        items: [],
        total: 0,
        hasMore: false,
      };
    }
  }

  private async performSkillSearch(
    query: string,
    options: SearchOptions
  ): Promise<SearchResult<any>> {
    try {
      let queryBuilder = supabase
        .from('skills')
        .select('*');

      if (query.trim()) {
        queryBuilder = queryBuilder.or(`
          name.ilike.%${query}%,
          description.ilike.%${query}%,
          category.ilike.%${query}%
        `);
      }

      const limit = options.limit || 20;
      const offset = options.offset || 0;
      
      const { data, error, count } = await (queryBuilder as any)
        .order('popularity_score', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        items: data || [],
        total: count || 0,
        hasMore: (count || 0) > offset + limit,
      };
    } catch (error) {
      console.error('Skill search error:', error);
      return {
        items: [],
        total: 0,
        hasMore: false,
      };
    }
  }

  private async getCourseFacets(query: string, filters: SearchFilters) {
    try {
      const [categoriesResult, difficultiesResult, languagesResult] = await Promise.all([
        (supabase as any)
          .from('courses')
          .select('categories(name)')
          .or(query ? `title.ilike.%${query}%,description.ilike.%${query}%` : '1.eq.1'),
        
        (supabase as any)
          .from('courses')
          .select('difficulty_level')
          .or(query ? `title.ilike.%${query}%,description.ilike.%${query}%` : '1.eq.1'),
        
        (supabase as any)
          .from('courses')
          .select('language')
          .or(query ? `title.ilike.%${query}%,description.ilike.%${query}%` : '1.eq.1'),
      ] as any);

      // Count occurrences for facets
      const categories = this.countOccurrences(
        ((categoriesResult as any)?.data || []).map((item: any) => item.categories?.name).filter(Boolean) || []
      );
      
      const difficulties = this.countOccurrences(
        ((difficultiesResult as any)?.data || []).map((item: any) => item.difficulty_level).filter(Boolean) || []
      );
      
      const languages = this.countOccurrences(
        ((languagesResult as any)?.data || []).map((item: any) => item.language).filter(Boolean) || []
      );

      return {
        categories,
        difficulties,
        languages,
      };
    } catch (error) {
      console.error('Facets error:', error);
      return {
        categories: [],
        difficulties: [],
        languages: [],
      };
    }
  }

  private countOccurrences(items: string[]): { name: string; count: number }[] {
    const counts: Record<string, number> = {};
    
    items.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  async clearSearchCache(): Promise<void> {
    await cacheManager.invalidatePattern('search_');
  }

  async getPopularSearches(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('search_analytics')
        .select('query')
        .order('search_count', { ascending: false })
        .limit(10);

      if (error) throw error;

      return data?.map((item: any) => item.query) || [];
    } catch (error) {
      console.error('Popular searches error:', error);
      return [];
    }
  }

  async recordSearch(query: string): Promise<void> {
    try {
      await (supabase as any)
          .from('search_analytics')
          .upsert({
            query: query.toLowerCase().trim(),
            search_count: 1,
          }, {
            onConflict: 'query',
            ignoreDuplicates: false,
          });
    } catch (error) {
      console.error('Record search error:', error);
    }
  }
}

export const searchService = new SearchService();