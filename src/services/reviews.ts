import { Review } from '../types/database';
import supabase from './supabase';

class ReviewService {
  // Create review
  async createReview(reviewData: {
    course_id: string;
    student_id: string;
    rating: number;
    comment?: string;
  }): Promise<Review | null> {
    try {
      // Check if student already reviewed this course
      const { data: existing } = await supabase
        .from('reviews')
        .select('*')
        .eq('course_id', reviewData.course_id)
        .eq('student_id', reviewData.student_id)
        .single();

      if (existing) {
        console.log('Student already reviewed this course');
        return existing;
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();

      if (error) throw error;

      // Update course average rating
      await this.updateCourseRating(reviewData.course_id);

      return data;
    } catch (error: any) {
      console.error('Create review error:', error);
      return null;
    }
  }

  // Get reviews for a course
  async getCourseReviews(courseId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles!reviews_student_id_fkey (
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
      console.error('Get course reviews error:', error);
      return [];
    }
  }

  // Update review
  async updateReview(
    reviewId: string,
    updates: { rating?: number; comment?: string }
  ): Promise<boolean> {
    try {
      const { data: review, error: fetchError } = await supabase
        .from('reviews')
        .select('course_id')
        .eq('id', reviewId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', reviewId);

      if (error) throw error;

      // Update course average rating
      if (review) {
        await this.updateCourseRating(review.course_id);
      }

      return true;
    } catch (error: any) {
      console.error('Update review error:', error);
      return false;
    }
  }

  // Delete review
  async deleteReview(reviewId: string): Promise<boolean> {
    try {
      const { data: review, error: fetchError } = await supabase
        .from('reviews')
        .select('course_id')
        .eq('id', reviewId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      // Update course average rating
      if (review) {
        await this.updateCourseRating(review.course_id);
      }

      return true;
    } catch (error: any) {
      console.error('Delete review error:', error);
      return false;
    }
  }

  // Check if student reviewed course
  async hasReviewed(courseId: string, studentId: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('reviews')
        .select('id')
        .eq('course_id', courseId)
        .eq('student_id', studentId)
        .single();

      return !!data;
    } catch {
      return false;
    }
  }

  // Get student's review for a course
  async getStudentReview(courseId: string, studentId: string): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('course_id', courseId)
        .eq('student_id', studentId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Get student review error:', error);
      return null;
    }
  }

  // Update course average rating
  private async updateCourseRating(courseId: string): Promise<void> {
    try {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('course_id', courseId);

      if (!reviews || reviews.length === 0) {
        await supabase
          .from('courses')
          .update({ average_rating: 0, total_reviews: 0 })
          .eq('id', courseId);
        return;
      }

      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = parseFloat((totalRating / reviews.length).toFixed(2));

      await supabase
        .from('courses')
        .update({
          average_rating: averageRating,
          total_reviews: reviews.length,
        })
        .eq('id', courseId);
    } catch (error: any) {
      console.error('Update course rating error:', error);
    }
  }

  // Get review statistics for a course
  async getReviewStats(courseId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }> {
    try {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('course_id', courseId);

      if (!reviews || reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
      }

      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = parseFloat((totalRating / reviews.length).toFixed(2));

      const ratingDistribution = reviews.reduce((acc, r) => {
        acc[r.rating] = (acc[r.rating] || 0) + 1;
        return acc;
      }, {} as { [key: number]: number });

      // Ensure all ratings 1-5 exist
      for (let i = 1; i <= 5; i++) {
        if (!ratingDistribution[i]) ratingDistribution[i] = 0;
      }

      return {
        averageRating,
        totalReviews: reviews.length,
        ratingDistribution,
      };
    } catch (error: any) {
      console.error('Get review stats error:', error);
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }
  }
}

export default new ReviewService();
