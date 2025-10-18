import { supabase } from '../lib/supabase';
import { PaginatedResponse } from '../types/database';
import { ExtendedReview as Review, adaptReview } from '../types/mergedDatabase';
import { NotificationService } from './messagingService';

export class ReviewService {
  // Review Creation and Management
  static async createReview(
    reviewerId: string,
    reviewedEntityId: string,
    entityType: Review['entity_type'],
    rating: number,
    reviewText?: string
  ): Promise<Review | null> {
    try {
      // Check if user already reviewed this entity
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('reviewer_id', reviewerId)
        .eq('reviewed_entity_id', reviewedEntityId)
        .eq('entity_type', entityType)
        .single();

      if (existingReview) {
        throw new Error('You have already reviewed this');
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          reviewer_id: reviewerId,
          reviewed_entity_id: reviewedEntityId,
          entity_type: entityType,
          rating,
          review_text: reviewText,
          is_published: true,
          created_at: new Date().toISOString(),
        })
        .select(`
          *,
          reviewer:users!reviewer_id(*)
        `)
        .single();

      if (error) throw error;

      // Update average rating for the reviewed entity
      await this.updateEntityAverageRating(reviewedEntityId, entityType);

      // Create notification if reviewing a teacher
      if (entityType === 'teacher') {
        const reviewer = data.reviewer as any;
        await NotificationService.notifyReviewReceived(
          reviewedEntityId,
          rating,
          reviewer?.full_name || 'Someone'
        );
      }

      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      return null;
    }
  }

  static async updateReview(
    reviewId: string,
    reviewerId: string,
    rating: number,
    reviewText?: string
  ): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating,
          review_text: reviewText,
        })
        .eq('id', reviewId)
        .eq('reviewer_id', reviewerId)
        .select()
        .single();

      if (error) throw error;

      // Update average rating for the reviewed entity
      await this.updateEntityAverageRating(data.reviewed_entity_id, data.entity_type);

      return data;
    } catch (error) {
      console.error('Error updating review:', error);
      return null;
    }
  }

  static async deleteReview(reviewId: string, reviewerId: string): Promise<boolean> {
    try {
      // Get review details before deletion for rating update
      const { data: review } = await supabase
        .from('reviews')
        .select('reviewed_entity_id, entity_type')
        .eq('id', reviewId)
        .eq('reviewer_id', reviewerId)
        .single();

      if (!review) return false;

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('reviewer_id', reviewerId);

      if (error) throw error;

      // Update average rating for the reviewed entity
      await this.updateEntityAverageRating(review.reviewed_entity_id, review.entity_type);

      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      return false;
    }
  }

  // Review Retrieval
  static async getReviews(
    entityId: string,
    entityType: Review['entity_type'],
    page: number = 1,
    limit: number = 20,
    ratingFilter?: number
  ): Promise<PaginatedResponse<Review & { reviewer: any; reviewed_entity?: any }>> {
    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users!reviewer_id(*)
        `, { count: 'exact' })
        .eq('reviewed_entity_id', entityId)
        .eq('entity_type', entityType)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (ratingFilter) {
        query = query.eq('rating', ratingFilter);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return { data: [], count: 0, page: 1, limit: 20, total_pages: 0 };
    }
  }

  static async getReviewsByReviewer(
    reviewerId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Review>> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact' })
        .eq('reviewer_id', reviewerId)
        .order('created_at', { ascending: false })
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
      console.error('Error fetching reviewer reviews:', error);
      return { data: [], count: 0, page: 1, limit: 20, total_pages: 0 };
    }
  }

  static async getUserReview(
    reviewerId: string,
    entityId: string,
    entityType: Review['entity_type']
  ): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewer_id', reviewerId)
        .eq('reviewed_entity_id', entityId)
        .eq('entity_type', entityType)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching user review:', error);
      return null;
    }
  }

  // Review Statistics
  static async getReviewStats(
    entityId: string,
    entityType: Review['entity_type']
  ): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
    recentReviews: (Review & { reviewer: any })[];
  }> {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users!reviewer_id(*)
        `)
        .eq('reviewed_entity_id', entityId)
        .eq('entity_type', entityType)
        .eq('is_published', true);

      if (error) throw error;

      const totalReviews = reviews?.length || 0;
      let averageRating = 0;
      const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      if (reviews && reviews.length > 0) {
        const totalRatingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = Math.round((totalRatingSum / totalReviews) * 10) / 10;

        reviews.forEach(review => {
          ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
        });
      }

      // Get recent reviews (last 5)
      const recentReviews = reviews
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5) || [];

      return {
        averageRating,
        totalReviews,
        ratingDistribution,
        recentReviews,
      };
    } catch (error) {
      console.error('Error fetching review stats:', error);
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        recentReviews: [],
      };
    }
  }

  static async getTeacherOverallRating(teacherId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    classRating: number;
    courseRating: number;
    teacherRating: number;
  }> {
    try {
      // Get all reviews for teacher (direct teacher reviews, class reviews, course reviews)
      const [teacherReviews, classReviews, courseReviews] = await Promise.all([
        this.getReviewStats(teacherId, 'teacher'),
        this.getTeacherClassReviews(teacherId),
        this.getTeacherCourseReviews(teacherId),
      ]);

      const allRatings = [
        ...Array(teacherReviews.totalReviews).fill(teacherReviews.averageRating),
        ...classReviews.ratings,
        ...courseReviews.ratings,
      ].filter(rating => rating > 0);

      const totalReviews = allRatings.length;
      const averageRating = totalReviews > 0 
        ? Math.round((allRatings.reduce((sum, rating) => sum + rating, 0) / totalReviews) * 10) / 10
        : 0;

      return {
        averageRating,
        totalReviews,
        classRating: classReviews.average,
        courseRating: courseReviews.average,
        teacherRating: teacherReviews.averageRating,
      };
    } catch (error) {
      console.error('Error fetching teacher overall rating:', error);
      return {
        averageRating: 0,
        totalReviews: 0,
        classRating: 0,
        courseRating: 0,
        teacherRating: 0,
      };
    }
  }

  private static async getTeacherClassReviews(teacherId: string): Promise<{
    ratings: number[];
    average: number;
  }> {
    try {
      // Get class IDs for this teacher
      const { data: classes } = await supabase
        .from('classes')
        .select('id')
        .eq('teacher_id', teacherId);

      if (!classes || classes.length === 0) {
        return { ratings: [], average: 0 };
      }

      const classIds = classes.map(c => c.id);

      // Get reviews for these classes
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .in('reviewed_entity_id', classIds)
        .eq('entity_type', 'class')
        .eq('is_published', true);

      const ratings = reviews?.map(r => r.rating) || [];
      const average = ratings.length > 0
        ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10
        : 0;

      return { ratings, average };
    } catch (error) {
      console.error('Error fetching teacher class reviews:', error);
      return { ratings: [], average: 0 };
    }
  }

  private static async getTeacherCourseReviews(teacherId: string): Promise<{
    ratings: number[];
    average: number;
  }> {
    try {
      // Get course IDs for this teacher
      const { data: courses } = await supabase
        .from('courses')
        .select('id')
        .eq('teacher_id', teacherId);

      if (!courses || courses.length === 0) {
        return { ratings: [], average: 0 };
      }

      const courseIds = courses.map(c => c.id);

      // Get reviews for these courses
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .in('reviewed_entity_id', courseIds)
        .eq('entity_type', 'course')
        .eq('is_published', true);

      const ratings = reviews?.map(r => r.rating) || [];
      const average = ratings.length > 0
        ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10
        : 0;

      return { ratings, average };
    } catch (error) {
      console.error('Error fetching teacher course reviews:', error);
      return { ratings: [], average: 0 };
    }
  }

  // Teacher Response to Reviews
  static async addTeacherResponse(
    reviewId: string,
    teacherId: string,
    responseText: string
  ): Promise<Review | null> {
    try {
      // Verify the teacher owns the reviewed entity
      const { data: review } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewed_entity:users!reviewed_entity_id(*)
        `)
        .eq('id', reviewId)
        .single();

      if (!review) return null;

      // Check if teacher owns the reviewed entity
      let isAuthorized = false;
      if (review.entity_type === 'teacher' && review.reviewed_entity_id === teacherId) {
        isAuthorized = true;
      } else if (review.entity_type === 'class') {
        const { data: classData } = await supabase
          .from('classes')
          .select('teacher_id')
          .eq('id', review.reviewed_entity_id)
          .single();
        isAuthorized = classData?.teacher_id === teacherId;
      } else if (review.entity_type === 'course') {
        const { data: courseData } = await supabase
          .from('courses')
          .select('teacher_id')
          .eq('id', review.reviewed_entity_id)
          .single();
        isAuthorized = courseData?.teacher_id === teacherId;
      }

      if (!isAuthorized) {
        throw new Error('Unauthorized');
      }

      const { data, error } = await supabase
        .from('reviews')
        .update({ teacher_response_text: responseText })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding teacher response:', error);
      return null;
    }
  }

  // Review Moderation
  static async flagReview(
    reviewId: string,
    reason: string,
    flaggedByUserId: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          flagged_reason: reason,
          is_published: false // Hide the review pending moderation
        })
        .eq('id', reviewId);

      if (error) throw error;

      // Log the flag action (you might want to create a separate flags table)
      // For now, we'll just log it in user activity
      await supabase
        .from('user_activity_log')
        .insert({
          user_id: flaggedByUserId,
          action: 'flag_review',
          related_id: reviewId,
          created_at: new Date().toISOString(),
        });

      return true;
    } catch (error) {
      console.error('Error flagging review:', error);
      return false;
    }
  }

  static async moderateReview(
    reviewId: string,
    adminId: string,
    action: 'approve' | 'reject',
    moderationNotes?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          is_published: action === 'approve',
          flagged_reason: action === 'approve' ? null : moderationNotes || 'Rejected by admin',
        })
        .eq('id', reviewId);

      if (error) throw error;

      // Log moderation action
      await supabase
        .from('user_activity_log')
        .insert({
          user_id: adminId,
          action: `moderate_review_${action}`,
          related_id: reviewId,
          created_at: new Date().toISOString(),
        });

      return true;
    } catch (error) {
      console.error('Error moderating review:', error);
      return false;
    }
  }

  static async getFlaggedReviews(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Review & { reviewer: any }>> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users!reviewer_id(*)
        `, { count: 'exact' })
        .not('flagged_reason', 'is', null)
        .order('created_at', { ascending: false })
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
      console.error('Error fetching flagged reviews:', error);
      return { data: [], count: 0, page: 1, limit: 20, total_pages: 0 };
    }
  }

  // Helper Methods
  private static async updateEntityAverageRating(
    entityId: string,
    entityType: Review['entity_type']
  ): Promise<void> {
    try {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewed_entity_id', entityId)
        .eq('entity_type', entityType)
        .eq('is_published', true);

      if (!reviews || reviews.length === 0) return;

      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      const roundedRating = Math.round(averageRating * 10) / 10;

      // Update the appropriate table based on entity type
      if (entityType === 'teacher') {
        // For teachers, we might want to calculate an overall rating
        // but we don't have a direct rating field in users table
        // This could be handled by a database function or computed field
      } else if (entityType === 'class') {
        await supabase
          .from('classes')
          .update({ average_rating: roundedRating })
          .eq('id', entityId);
      } else if (entityType === 'course') {
        await supabase
          .from('courses')
          .update({ average_rating: roundedRating })
          .eq('id', entityId);
      }
    } catch (error) {
      console.error('Error updating entity average rating:', error);
    }
  }

  // Analytics
  static async getReviewAnalytics(
    entityId: string,
    entityType: Review['entity_type'],
    period: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ): Promise<{
    periodRating: number;
    previousPeriodRating: number;
    ratingTrend: 'up' | 'down' | 'stable';
    reviewCount: number;
    ratingByPeriod: { period: string; rating: number; count: number }[];
  }> {
    try {
      const now = new Date();
      let periodStart: Date;
      let previousPeriodStart: Date;

      switch (period) {
        case 'week':
          periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          previousPeriodStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
          previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          break;
        case 'quarter':
          const quarterStart = Math.floor(now.getMonth() / 3) * 3;
          periodStart = new Date(now.getFullYear(), quarterStart, 1);
          previousPeriodStart = new Date(now.getFullYear(), quarterStart - 3, 1);
          break;
        case 'year':
          periodStart = new Date(now.getFullYear(), 0, 1);
          previousPeriodStart = new Date(now.getFullYear() - 1, 0, 1);
          break;
      }

      // Get current period reviews
      const { data: currentReviews } = await supabase
        .from('reviews')
        .select('rating, created_at')
        .eq('reviewed_entity_id', entityId)
        .eq('entity_type', entityType)
        .eq('is_published', true)
        .gte('created_at', periodStart.toISOString());

      // Get previous period reviews
      const { data: previousReviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewed_entity_id', entityId)
        .eq('entity_type', entityType)
        .eq('is_published', true)
        .gte('created_at', previousPeriodStart.toISOString())
        .lt('created_at', periodStart.toISOString());

      const periodRating = currentReviews && currentReviews.length > 0
        ? currentReviews.reduce((sum, r) => sum + r.rating, 0) / currentReviews.length
        : 0;

      const previousPeriodRating = previousReviews && previousReviews.length > 0
        ? previousReviews.reduce((sum, r) => sum + r.rating, 0) / previousReviews.length
        : 0;

      let ratingTrend: 'up' | 'down' | 'stable' = 'stable';
      if (periodRating > previousPeriodRating) ratingTrend = 'up';
      else if (periodRating < previousPeriodRating) ratingTrend = 'down';

      // Generate rating by period data (simplified)
      const ratingByPeriod = [
        {
          period: 'Previous',
          rating: Math.round(previousPeriodRating * 10) / 10,
          count: previousReviews?.length || 0,
        },
        {
          period: 'Current',
          rating: Math.round(periodRating * 10) / 10,
          count: currentReviews?.length || 0,
        },
      ];

      return {
        periodRating: Math.round(periodRating * 10) / 10,
        previousPeriodRating: Math.round(previousPeriodRating * 10) / 10,
        ratingTrend,
        reviewCount: currentReviews?.length || 0,
        ratingByPeriod,
      };
    } catch (error) {
      console.error('Error fetching review analytics:', error);
      return {
        periodRating: 0,
        previousPeriodRating: 0,
        ratingTrend: 'stable',
        reviewCount: 0,
        ratingByPeriod: [],
      };
    }
  }
}
