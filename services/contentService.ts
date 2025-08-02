import { supabase } from '../lib/supabase';
import { ContentQA, ContentQAAnswer, LearningContent, LearningContentWithDetails, PaginatedResponse, SearchFilters } from '../types/database';

export class ContentService {
  // Content CRUD Operations
  static async createContent(
    teacherId: string,
    contentData: Partial<LearningContent>
  ): Promise<LearningContent | null> {
    try {
      const { data, error } = await supabase
        .from('learning_content')
        .insert({
          ...contentData,
          teacher_id: teacherId,
          status: 'pending_review',
          views_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating content:', error);
      return null;
    }
  }

  static async updateContent(
    contentId: string,
    teacherId: string,
    updates: Partial<LearningContent>
  ): Promise<LearningContent | null> {
    try {
      const { data, error } = await supabase
        .from('learning_content')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contentId)
        .eq('teacher_id', teacherId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating content:', error);
      return null;
    }
  }

  static async deleteContent(contentId: string, teacherId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_content')
        .delete()
        .eq('id', contentId)
        .eq('teacher_id', teacherId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting content:', error);
      return false;
    }
  }

  static async getContent(contentId: string): Promise<LearningContentWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('learning_content')
        .select(`
          *,
          skill:skills(*),
          sub_skill:sub_skills(*),
          teacher:users(*)
        `)
        .eq('id', contentId)
        .single();

      if (error) throw error;

      // Increment view count
      await this.incrementViewCount(contentId);

      return data as LearningContentWithDetails;
    } catch (error) {
      console.error('Error fetching content:', error);
      return null;
    }
  }

  static async getContentByTeacher(
    teacherId: string,
    page: number = 1,
    limit: number = 20,
    status?: LearningContent['status']
  ): Promise<PaginatedResponse<LearningContentWithDetails>> {
    try {
      let query = supabase
        .from('learning_content')
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
        data: (data as LearningContentWithDetails[]) || [],
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Error fetching teacher content:', error);
      return { data: [], count: 0, page: 1, limit: 20, total_pages: 0 };
    }
  }

  // Content Discovery and Search
  static async searchContent(filters: SearchFilters & {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<LearningContentWithDetails>> {
    try {
      let query = supabase
        .from('learning_content')
        .select(`
          *,
          skill:skills(*),
          sub_skill:sub_skills(*),
          teacher:users(*)
        `, { count: 'exact' })
        .eq('status', 'approved');

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

      if (filters.skill_level) {
        query = query.eq('skill_level', filters.skill_level);
      }

      if (filters.content_type) {
        query = query.eq('content_type', filters.content_type);
      }

      if (filters.language) {
        // Assuming language is stored in a language field or can be inferred
        query = query.ilike('title', `%${filters.language}%`);
      }

      if (filters.rating_min) {
        query = query.gte('rating_avg', filters.rating_min);
      }

      // Apply sorting
      const sortBy = filters.sort_by || 'created_at';
      const sortOrder = filters.sort_order === 'asc';

      if (sortBy === 'popularity') {
        query = query.order('views_count', { ascending: sortOrder });
      } else if (sortBy === 'rating') {
        query = query.order('rating_avg', { ascending: sortOrder, nullsFirst: false });
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
        data: (data as LearningContentWithDetails[]) || [],
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Error searching content:', error);
      return { data: [], count: 0, page: 1, limit: 20, total_pages: 0 };
    }
  }

  static async getFeaturedContent(limit: number = 10): Promise<LearningContentWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('learning_content')
        .select(`
          *,
          skill:skills(*),
          sub_skill:sub_skills(*),
          teacher:users(*)
        `)
        .eq('status', 'approved')
        .eq('is_curated_by_skillbox', true)
        .order('rating_avg', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) throw error;
      return (data as LearningContentWithDetails[]) || [];
    } catch (error) {
      console.error('Error fetching featured content:', error);
      return [];
    }
  }

  static async getPopularContent(limit: number = 10): Promise<LearningContentWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('learning_content')
        .select(`
          *,
          skill:skills(*),
          sub_skill:sub_skills(*),
          teacher:users(*)
        `)
        .eq('status', 'approved')
        .order('views_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as LearningContentWithDetails[]) || [];
    } catch (error) {
      console.error('Error fetching popular content:', error);
      return [];
    }
  }

  static async getRecentContent(limit: number = 10): Promise<LearningContentWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('learning_content')
        .select(`
          *,
          skill:skills(*),
          sub_skill:sub_skills(*),
          teacher:users(*)
        `)
        .eq('status', 'approved')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as LearningContentWithDetails[]) || [];
    } catch (error) {
      console.error('Error fetching recent content:', error);
      return [];
    }
  }

  // Content Interactions
  static async incrementViewCount(contentId: string): Promise<void> {
    try {
      await supabase.rpc('increment_content_views', { content_id: contentId });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  static async likeContent(userId: string, contentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_likes_content')
        .insert({
          user_id: userId,
          content_id: contentId,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error liking content:', error);
      return false;
    }
  }

  static async unlikeContent(userId: string, contentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_likes_content')
        .delete()
        .eq('user_id', userId)
        .eq('content_id', contentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unliking content:', error);
      return false;
    }
  }

  static async isContentLiked(userId: string, contentId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_likes_content')
        .select('user_id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  }

  static async saveContent(userId: string, contentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_saved_content')
        .insert({
          user_id: userId,
          content_id: contentId,
          saved_at: new Date().toISOString(),
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving content:', error);
      return false;
    }
  }

  static async unsaveContent(userId: string, contentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_saved_content')
        .delete()
        .eq('user_id', userId)
        .eq('content_id', contentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unsaving content:', error);
      return false;
    }
  }

  static async isContentSaved(userId: string, contentId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_saved_content')
        .select('user_id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking saved status:', error);
      return false;
    }
  }

  static async getSavedContent(userId: string): Promise<LearningContentWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('user_saved_content')
        .select(`
          content:learning_content(
            *,
            skill:skills(*),
            sub_skill:sub_skills(*),
            teacher:users(*)
          )
        `)
        .eq('user_id', userId)
        .order('saved_at', { ascending: false });

      if (error) throw error;
      return (data?.map((item: any) => item.content).filter(Boolean) as LearningContentWithDetails[]) || [];
    } catch (error) {
      console.error('Error fetching saved content:', error);
      return [];
    }
  }

  // Q&A System
  static async askQuestion(
    userId: string,
    contentId: string,
    questionText: string
  ): Promise<ContentQA | null> {
    try {
      const { data, error } = await supabase
        .from('content_qa')
        .insert({
          content_id: contentId,
          user_id: userId,
          question_text: questionText,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error asking question:', error);
      return null;
    }
  }

  static async answerQuestion(
    userId: string,
    questionId: string,
    answerText: string
  ): Promise<ContentQAAnswer | null> {
    try {
      const { data, error } = await supabase
        .from('content_qa_answers')
        .insert({
          question_id: questionId,
          user_id: userId,
          answer_text: answerText,
          likes_count: 0,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error answering question:', error);
      return null;
    }
  }

  static async getContentQuestions(
    contentId: string,
    limit: number = 10
  ): Promise<(ContentQA & { user: any; answers: (ContentQAAnswer & { user: any })[] })[]> {
    try {
      const { data, error } = await supabase
        .from('content_qa')
        .select(`
          *,
          user:users(*),
          answers:content_qa_answers(
            *,
            user:users(*)
          )
        `)
        .eq('content_id', contentId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching content questions:', error);
      return [];
    }
  }

  // Content Moderation
  static async approveContent(contentId: string, adminId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_content')
        .update({
          status: 'approved',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', contentId);

      if (error) throw error;

      // Notify content creator
      const content = await this.getContent(contentId);
      if (content?.teacher) {
        await supabase
          .from('notifications')
          .insert({
            recipient_id: content.teacher.id,
            notification_type: 'content_status_update',
            message: `Your content "${content.title}" has been approved!`,
            is_read: false,
            created_at: new Date().toISOString(),
          });
      }

      return true;
    } catch (error) {
      console.error('Error approving content:', error);
      return false;
    }
  }

  static async rejectContent(
    contentId: string,
    adminId: string,
    rejectionReason: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_content')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contentId);

      if (error) throw error;

      // Notify content creator
      const content = await this.getContent(contentId);
      if (content?.teacher) {
        await supabase
          .from('notifications')
          .insert({
            recipient_id: content.teacher.id,
            notification_type: 'content_status_update',
            message: `Your content "${content.title}" was rejected. Reason: ${rejectionReason}`,
            is_read: false,
            created_at: new Date().toISOString(),
          });
      }

      return true;
    } catch (error) {
      console.error('Error rejecting content:', error);
      return false;
    }
  }

  static async getContentForModeration(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<LearningContentWithDetails>> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('learning_content')
        .select(`
          *,
          skill:skills(*),
          sub_skill:sub_skills(*),
          teacher:users(*)
        `, { count: 'exact' })
        .eq('status', 'pending_review')
        .order('created_at', { ascending: true })
        .range(from, to);

      if (error) throw error;

      return {
        data: (data as LearningContentWithDetails[]) || [],
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Error fetching content for moderation:', error);
      return { data: [], count: 0, page: 1, limit: 20, total_pages: 0 };
    }
  }

  // Content Analytics
  static async getContentAnalytics(contentId: string): Promise<{
    views: number;
    likes: number;
    saves: number;
    questions: number;
    rating: number;
    engagement_rate: number;
  }> {
    try {
      const [content, likes, saves, questions] = await Promise.all([
        this.getContent(contentId),
        this.getContentLikesCount(contentId),
        this.getContentSavesCount(contentId),
        this.getContentQuestionsCount(contentId),
      ]);

      const views = content?.views_count || 0;
      const rating = content?.rating_avg || 0;
      const engagement_rate = views > 0 ? ((likes + saves + questions) / views) * 100 : 0;

      return {
        views,
        likes,
        saves,
        questions,
        rating,
        engagement_rate: Math.round(engagement_rate * 100) / 100,
      };
    } catch (error) {
      console.error('Error fetching content analytics:', error);
      return { views: 0, likes: 0, saves: 0, questions: 0, rating: 0, engagement_rate: 0 };
    }
  }

  private static async getContentLikesCount(contentId: string): Promise<number> {
    const { count } = await supabase
      .from('user_likes_content')
      .select('*', { count: 'exact', head: true })
      .eq('content_id', contentId);
    return count || 0;
  }

  private static async getContentSavesCount(contentId: string): Promise<number> {
    const { count } = await supabase
      .from('user_saved_content')
      .select('*', { count: 'exact', head: true })
      .eq('content_id', contentId);
    return count || 0;
  }

  private static async getContentQuestionsCount(contentId: string): Promise<number> {
    const { count } = await supabase
      .from('content_qa')
      .select('*', { count: 'exact', head: true })
      .eq('content_id', contentId);
    return count || 0;
  }
}
