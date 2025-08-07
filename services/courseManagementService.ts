import { supabase } from '../lib/supabase';
import { AIService } from './aiService';

export interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string;
  thumbnail_url: string;
  category: string;
  subcategory?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: number; // in hours
  price: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR';
  instructor_id: string;
  instructor_name: string;
  instructor_avatar?: string;
  skills_taught: string[];
  prerequisites: string[];
  learning_objectives: string[];
  language: string;
  has_certificate: boolean;
  is_published: boolean;
  is_featured: boolean;
  enrollment_count: number;
  rating_average: number;
  rating_count: number;
  last_updated: string;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content_type: 'video' | 'text' | 'audio' | 'interactive' | 'quiz' | 'assignment';
  content_url?: string;
  content_text?: string;
  duration: number; // in minutes
  order_index: number;
  is_preview: boolean;
  resources: Array<{
    type: 'file' | 'link' | 'image';
    title: string;
    url: string;
  }>;
  quiz_data?: {
    questions: QuizQuestion[];
    passing_score: number;
    max_attempts: number;
  };
  assignment_data?: {
    instructions: string;
    submission_types: ('text' | 'file' | 'code' | 'audio' | 'video')[];
    max_score: number;
    due_date?: string;
    rubric?: RubricCriteria[];
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay' | 'code';
  options?: string[];
  correct_answer: string | number;
  explanation?: string;
  points: number;
}

export interface RubricCriteria {
  criterion: string;
  description: string;
  points: number;
  levels: Array<{
    level: string;
    description: string;
    points: number;
  }>;
}

export interface CourseProgress {
  user_id: string;
  course_id: string;
  enrollment_date: string;
  completion_percentage: number;
  completed_lessons: string[];
  quiz_scores: Record<string, number>;
  assignment_submissions: Record<string, {
    submitted_at: string;
    score?: number;
    feedback?: string;
  }>;
  certificates_earned: string[];
  last_accessed: string;
  total_time_spent: number; // in minutes
}

export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  helpful_votes: number;
  created_at: string;
}

export interface CourseBundle {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  course_ids: string[];
  original_price: number;
  bundle_price: number;
  discount_percentage: number;
  instructor_id: string;
  is_published: boolean;
  enrollment_count: number;
  created_at: string;
}

export class CourseManagementService {
  // Course CRUD Operations
  static async createCourse(courseData: Omit<Course, 'id' | 'enrollment_count' | 'rating_average' | 'rating_count' | 'created_at'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          enrollment_count: 0,
          rating_average: 0,
          rating_count: 0,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) throw error;

      // Generate AI-powered course suggestions
      await this.generateCourseSuggestions(data.id, courseData.title, courseData.description);

      return data.id;
    } catch (error) {
      console.error('Error creating course:', error);
      return null;
    }
  }

  static async getCourse(courseId: string): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting course:', error);
      return null;
    }
  }

  static async updateCourse(courseId: string, updates: Partial<Course>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          ...updates,
          last_updated: new Date().toISOString(),
        })
        .eq('id', courseId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating course:', error);
      return false;
    }
  }

  static async deleteCourse(courseId: string): Promise<boolean> {
    try {
      // Check if course has enrollments
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', courseId)
        .limit(1);

      if (enrollments && enrollments.length > 0) {
        throw new Error('Cannot delete course with active enrollments');
      }

      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      return false;
    }
  }

  // Course Search and Discovery
  static async searchCourses(query: {
    search?: string;
    category?: string;
    difficulty?: string;
    language?: string;
    price_range?: { min: number; max: number };
    duration_range?: { min: number; max: number };
    rating_min?: number;
    has_certificate?: boolean;
    sort_by?: 'popularity' | 'rating' | 'price_low' | 'price_high' | 'newest' | 'duration';
    limit?: number;
    offset?: number;
  }): Promise<{ courses: Course[]; total_count: number }> {
    try {
      let queryBuilder = supabase
        .from('courses')
        .select('*, instructor:users!instructor_id(full_name, avatar_url)', { count: 'exact' })
        .eq('is_published', true);

      // Apply filters
      if (query.search) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query.search}%,description.ilike.%${query.search}%,skills_taught.cs.{${query.search}}`);
      }

      if (query.category) {
        queryBuilder = queryBuilder.eq('category', query.category);
      }

      if (query.difficulty) {
        queryBuilder = queryBuilder.eq('difficulty_level', query.difficulty);
      }

      if (query.language) {
        queryBuilder = queryBuilder.eq('language', query.language);
      }

      if (query.price_range) {
        queryBuilder = queryBuilder
          .gte('price', query.price_range.min)
          .lte('price', query.price_range.max);
      }

      if (query.duration_range) {
        queryBuilder = queryBuilder
          .gte('estimated_duration', query.duration_range.min)
          .lte('estimated_duration', query.duration_range.max);
      }

      if (query.rating_min) {
        queryBuilder = queryBuilder.gte('rating_average', query.rating_min);
      }

      if (query.has_certificate !== undefined) {
        queryBuilder = queryBuilder.eq('has_certificate', query.has_certificate);
      }

      // Apply sorting
      switch (query.sort_by) {
        case 'popularity':
          queryBuilder = queryBuilder.order('enrollment_count', { ascending: false });
          break;
        case 'rating':
          queryBuilder = queryBuilder.order('rating_average', { ascending: false });
          break;
        case 'price_low':
          queryBuilder = queryBuilder.order('price', { ascending: true });
          break;
        case 'price_high':
          queryBuilder = queryBuilder.order('price', { ascending: false });
          break;
        case 'newest':
          queryBuilder = queryBuilder.order('created_at', { ascending: false });
          break;
        case 'duration':
          queryBuilder = queryBuilder.order('estimated_duration', { ascending: true });
          break;
        default:
          queryBuilder = queryBuilder.order('created_at', { ascending: false });
      }

      // Apply pagination
      const limit = query.limit || 20;
      const offset = query.offset || 0;
      queryBuilder = queryBuilder.range(offset, offset + limit - 1);

      const { data, error, count } = await queryBuilder;

      if (error) throw error;

      return {
        courses: data || [],
        total_count: count || 0,
      };
    } catch (error) {
      console.error('Error searching courses:', error);
      return { courses: [], total_count: 0 };
    }
  }

  static async getFeaturedCourses(limit: number = 10): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('rating_average', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting featured courses:', error);
      return [];
    }
  }

  static async getPersonalizedRecommendations(userId: string, limit: number = 10): Promise<Course[]> {
    try {
      // Use AI service for personalized recommendations
      const recommendations = await AIService.getPersonalizedRecommendations(userId, {
        learning_goal: 'course_discovery',
      });

      if (recommendations.length === 0) {
        // Fallback to popular courses in user's interests
        return await this.getPopularCourses(limit);
      }

      const courseIds = recommendations
        .filter(r => r.content_type === 'course')
        .map(r => r.content_id)
        .slice(0, limit);

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .in('id', courseIds);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }

  static async getPopularCourses(limit: number = 10): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('enrollment_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting popular courses:', error);
      return [];
    }
  }

  // Lesson Management
  static async createLesson(lessonData: Omit<Lesson, 'id'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert(lessonData)
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating lesson:', error);
      return null;
    }
  }

  static async getLessons(courseId: string): Promise<Lesson[]> {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting lessons:', error);
      return [];
    }
  }

  static async updateLesson(lessonId: string, updates: Partial<Lesson>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('lessons')
        .update(updates)
        .eq('id', lessonId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating lesson:', error);
      return false;
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

  static async reorderLessons(courseId: string, lessonOrders: Array<{ id: string; order_index: number }>): Promise<boolean> {
    try {
      const updates = lessonOrders.map(lesson => 
        supabase
          .from('lessons')
          .update({ order_index: lesson.order_index })
          .eq('id', lesson.id)
          .eq('course_id', courseId)
      );

      await Promise.all(updates);
      return true;
    } catch (error) {
      console.error('Error reordering lessons:', error);
      return false;
    }
  }

  // Enrollment Management
  static async enrollUser(userId: string, courseId: string): Promise<boolean> {
    try {
      // Check if already enrolled
      const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      if (existing) {
        throw new Error('User already enrolled in this course');
      }

      // Create enrollment
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
          enrollment_date: new Date().toISOString(),
          completion_percentage: 0,
          completed_lessons: [],
          quiz_scores: {},
          assignment_submissions: {},
          certificates_earned: [],
          last_accessed: new Date().toISOString(),
          total_time_spent: 0,
        });

      if (error) throw error;

      // Update course enrollment count
      await supabase.rpc('increment_enrollment_count', { course_id: courseId });

      return true;
    } catch (error) {
      console.error('Error enrolling user:', error);
      return false;
    }
  }

  static async getUserEnrollments(userId: string): Promise<(CourseProgress & { course: Course })[]> {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', userId)
        .order('enrollment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user enrollments:', error);
      return [];
    }
  }

  static async updateProgress(
    userId: string,
    courseId: string,
    updates: Partial<CourseProgress>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({
          ...updates,
          last_accessed: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) throw error;

      // Trigger adaptive learning analysis
      await AIService.triggerAdaptiveLearning(userId);

      return true;
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  }

  // Quiz and Assignment Management
  static async submitQuizAnswer(
    userId: string,
    lessonId: string,
    answers: Record<string, any>
  ): Promise<{ score: number; feedback: string; passed: boolean }> {
    try {
      // Get lesson quiz data
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select('quiz_data')
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;

      if (!lesson.quiz_data) {
        throw new Error('No quiz data found for this lesson');
      }

      // Calculate score
      const questions = lesson.quiz_data.questions;
      let correctAnswers = 0;
      const feedback: string[] = [];

      questions.forEach((question: QuizQuestion) => {
        const userAnswer = answers[question.id];
        const correct = userAnswer === question.correct_answer;
        
        if (correct) {
          correctAnswers++;
        }

        if (question.explanation) {
          feedback.push(`Q: ${question.question}\nYour answer: ${userAnswer}\nCorrect: ${correct ? 'Yes' : 'No'}\n${question.explanation}`);
        }
      });

      const score = Math.round((correctAnswers / questions.length) * 100);
      const passed = score >= lesson.quiz_data.passing_score;

      // Save quiz attempt
      await supabase
        .from('quiz_attempts')
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          score,
          answers,
          passed,
          attempted_at: new Date().toISOString(),
        });

      return {
        score,
        feedback: feedback.join('\n\n'),
        passed,
      };
    } catch (error) {
      console.error('Error submitting quiz answer:', error);
      return { score: 0, feedback: 'Error processing quiz submission', passed: false };
    }
  }

  static async submitAssignment(
    userId: string,
    lessonId: string,
    submission: {
      content?: string;
      file_urls?: string[];
      submission_type: 'text' | 'file' | 'code' | 'audio' | 'video';
    }
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('assignment_submissions')
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          content: submission.content,
          file_urls: submission.file_urls,
          submission_type: submission.submission_type,
          submitted_at: new Date().toISOString(),
          status: 'submitted',
        })
        .select('id')
        .single();

      if (error) throw error;

      // Request AI feedback for automatic grading
      if (submission.content && ['text', 'code'].includes(submission.submission_type)) {
        await this.requestAIGrading(data.id, submission.content, submission.submission_type);
      }

      return data.id;
    } catch (error) {
      console.error('Error submitting assignment:', error);
      return null;
    }
  }

  // Reviews and Ratings
  static async submitReview(review: Omit<CourseReview, 'id' | 'created_at'>): Promise<boolean> {
    try {
      // Check if user has already reviewed this course
      const { data: existing } = await supabase
        .from('course_reviews')
        .select('id')
        .eq('user_id', review.user_id)
        .eq('course_id', review.course_id)
        .single();

      if (existing) {
        throw new Error('User has already reviewed this course');
      }

      const { error } = await supabase
        .from('course_reviews')
        .insert({
          ...review,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Update course rating
      await this.updateCourseRating(review.course_id);

      return true;
    } catch (error) {
      console.error('Error submitting review:', error);
      return false;
    }
  }

  static async getCourseReviews(courseId: string, limit: number = 20): Promise<CourseReview[]> {
    try {
      const { data, error } = await supabase
        .from('course_reviews')
        .select('*')
        .eq('course_id', courseId)
        .order('helpful_votes', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting course reviews:', error);
      return [];
    }
  }

  // Course Analytics
  static async getCourseAnalytics(courseId: string): Promise<{
    total_enrollments: number;
    completion_rate: number;
    average_rating: number;
    revenue: number;
    engagement_metrics: {
      average_time_spent: number;
      most_watched_lessons: Array<{ lesson_id: string; title: string; views: number }>;
      completion_by_lesson: Record<string, number>;
    };
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('course-analytics', {
        body: { course_id: courseId },
      });

      if (error) throw error;
      return data.analytics;
    } catch (error) {
      console.error('Error getting course analytics:', error);
      return {
        total_enrollments: 0,
        completion_rate: 0,
        average_rating: 0,
        revenue: 0,
        engagement_metrics: {
          average_time_spent: 0,
          most_watched_lessons: [],
          completion_by_lesson: {},
        },
      };
    }
  }

  // Helper Methods
  private static async generateCourseSuggestions(courseId: string, title: string, description: string): Promise<void> {
    try {
      const suggestions = await AIService.autoOrganizeCourse('system', {
        title,
        description,
        materials: [],
      });

      if (suggestions.learning_objectives.length > 0) {
        await this.updateCourse(courseId, {
          learning_objectives: suggestions.learning_objectives,
        });
      }
    } catch (error) {
      console.error('Error generating course suggestions:', error);
    }
  }

  private static async updateCourseRating(courseId: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('course_reviews')
        .select('rating')
        .eq('course_id', courseId);

      if (error) throw error;

      if (data && data.length > 0) {
        const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / data.length;

        await this.updateCourse(courseId, {
          rating_average: Math.round(averageRating * 10) / 10,
          rating_count: data.length,
        });
      }
    } catch (error) {
      console.error('Error updating course rating:', error);
    }
  }

  private static async requestAIGrading(submissionId: string, content: string, type: string): Promise<void> {
    try {
      const feedback = await AIService.getAIFeedback(
        submissionId,
        type as any,
        content
      );

      await supabase
        .from('assignment_submissions')
        .update({
          ai_score: feedback.score,
          ai_feedback: feedback.feedback,
          ai_suggestions: feedback.suggestions,
          status: 'ai_graded',
        })
        .eq('id', submissionId);
    } catch (error) {
      console.error('Error requesting AI grading:', error);
    }
  }

  // Course Bundles
  static async createCourseBundle(bundleData: Omit<CourseBundle, 'id' | 'enrollment_count' | 'created_at'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('course_bundles')
        .insert({
          ...bundleData,
          enrollment_count: 0,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating course bundle:', error);
      return null;
    }
  }

  static async getCourseBundles(instructorId?: string): Promise<CourseBundle[]> {
    try {
      let query = supabase
        .from('course_bundles')
        .select('*')
        .eq('is_published', true);

      if (instructorId) {
        query = query.eq('instructor_id', instructorId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting course bundles:', error);
      return [];
    }
  }
}
