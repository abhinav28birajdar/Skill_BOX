import { supabase } from '../lib/supabase';

export interface LearningMetrics {
  completion_rate: number;
  quiz_average: number;
  time_spent_learning: number;
  preferred_learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  struggle_areas: string[];
  strength_areas: string[];
  last_updated: string;
}

export interface AdaptiveRecommendation {
  content_id: string;
  content_type: 'course' | 'lesson' | 'quiz' | 'review';
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimated_time: number;
}

export interface AIInsight {
  type: 'achievement' | 'warning' | 'suggestion' | 'milestone';
  title: string;
  description: string;
  action_items: string[];
  confidence_score: number;
}

export class AIService {
  // Adaptive Learning Engine
  static async getPersonalizedRecommendations(
    userId: string,
    context?: {
      current_course_id?: string;
      learning_goal?: string;
      time_available?: number;
    }
  ): Promise<AdaptiveRecommendation[]> {
    try {
      const { data, error } = await supabase.functions.invoke('adaptive-learning-engine', {
        body: {
          user_id: userId,
          action: 'get_recommendations',
          context,
        },
      });

      if (error) throw error;
      return data.recommendations || [];
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      return [];
    }
  }

  static async updateLearningMetrics(
    userId: string,
    metrics: Partial<LearningMetrics>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learner_profiles')
        .upsert({
          user_id: userId,
          learning_metrics: metrics,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Trigger adaptive learning analysis
      await this.triggerAdaptiveLearning(userId);
      return true;
    } catch (error) {
      console.error('Error updating learning metrics:', error);
      return false;
    }
  }

  static async triggerAdaptiveLearning(userId: string): Promise<void> {
    try {
      await supabase.functions.invoke('adaptive-learning-engine', {
        body: {
          user_id: userId,
          action: 'analyze_progress',
        },
      });
    } catch (error) {
      console.error('Error triggering adaptive learning:', error);
    }
  }

  // Content Generation
  static async generateQuizQuestions(
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    count: number = 5
  ): Promise<any[]> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: {
          type: 'quiz_generation',
          topic,
          difficulty,
          question_count: count,
        },
      });

      if (error) throw error;
      return data.questions || [];
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      return [];
    }
  }

  static async summarizeContent(
    content: string,
    type: 'lesson' | 'article' | 'video_transcript'
  ): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: {
          type: 'content_summary',
          content,
          content_type: type,
        },
      });

      if (error) throw error;
      return data.summary || '';
    } catch (error) {
      console.error('Error summarizing content:', error);
      return '';
    }
  }

  // Assignment Grading
  static async getAIFeedback(
    submissionId: string,
    submissionType: 'code' | 'essay' | 'design' | 'audio',
    content: string | File
  ): Promise<{
    feedback: string;
    score: number;
    suggestions: string[];
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-submission-grader', {
        body: {
          submission_id: submissionId,
          submission_type: submissionType,
          content,
        },
      });

      if (error) throw error;
      return {
        feedback: data.feedback || '',
        score: data.score || 0,
        suggestions: data.suggestions || [],
      };
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      return {
        feedback: 'Unable to generate feedback at this time.',
        score: 0,
        suggestions: [],
      };
    }
  }

  // Learning Analytics
  static async getLearningInsights(userId: string): Promise<AIInsight[]> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-learning-insights', {
        body: {
          user_id: userId,
        },
      });

      if (error) throw error;
      return data.insights || [];
    } catch (error) {
      console.error('Error getting learning insights:', error);
      return [];
    }
  }

  // Teacher Coaching
  static async getTeacherInsights(teacherId: string): Promise<{
    business_insights: AIInsight[];
    content_suggestions: string[];
    student_engagement_tips: string[];
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('teacher-ai-insights', {
        body: {
          teacher_id: teacherId,
        },
      });

      if (error) throw error;
      return {
        business_insights: data.business_insights || [],
        content_suggestions: data.content_suggestions || [],
        student_engagement_tips: data.student_engagement_tips || [],
      };
    } catch (error) {
      console.error('Error getting teacher insights:', error);
      return {
        business_insights: [],
        content_suggestions: [],
        student_engagement_tips: [],
      };
    }
  }

  // Semantic Search
  static async semanticSearch(
    query: string,
    filters?: {
      content_type?: string[];
      skill_level?: string;
      duration?: { min: number; max: number };
    }
  ): Promise<any[]> {
    try {
      const { data, error } = await supabase.functions.invoke('semantic-search-parser', {
        body: {
          query,
          filters,
        },
      });

      if (error) throw error;
      return data.results || [];
    } catch (error) {
      console.error('Error performing semantic search:', error);
      return [];
    }
  }

  // Course Auto-Organization
  static async autoOrganizeCourse(
    teacherId: string,
    rawContent: {
      title: string;
      description: string;
      materials: Array<{
        type: 'video' | 'document' | 'audio';
        url: string;
        title: string;
      }>;
    }
  ): Promise<{
    suggested_structure: any;
    generated_quizzes: any[];
    learning_objectives: string[];
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-course-mapper', {
        body: {
          teacher_id: teacherId,
          content: rawContent,
        },
      });

      if (error) throw error;
      return {
        suggested_structure: data.structure || {},
        generated_quizzes: data.quizzes || [],
        learning_objectives: data.objectives || [],
      };
    } catch (error) {
      console.error('Error auto-organizing course:', error);
      return {
        suggested_structure: {},
        generated_quizzes: [],
        learning_objectives: [],
      };
    }
  }

  // Real-time Learning Assistance
  static async getLiveHint(
    userId: string,
    context: {
      current_lesson_id: string;
      question: string;
      user_progress: any;
    }
  ): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-live-assistant', {
        body: {
          user_id: userId,
          context,
          type: 'hint_request',
        },
      });

      if (error) throw error;
      return data.hint || 'Keep practicing! You\'re on the right track.';
    } catch (error) {
      console.error('Error getting live hint:', error);
      return 'Keep practicing! You\'re on the right track.';
    }
  }

  // Learning Path Optimization
  static async optimizeLearningPath(
    userId: string,
    goalSkills: string[],
    timeConstraints: {
      hours_per_week: number;
      target_completion_date?: string;
    }
  ): Promise<{
    optimized_path: Array<{
      content_id: string;
      estimated_duration: number;
      prerequisite_ids: string[];
      importance_score: number;
    }>;
    total_estimated_time: number;
    success_probability: number;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('learning-path-optimizer', {
        body: {
          user_id: userId,
          goal_skills: goalSkills,
          time_constraints: timeConstraints,
        },
      });

      if (error) throw error;
      return {
        optimized_path: data.path || [],
        total_estimated_time: data.total_time || 0,
        success_probability: data.success_probability || 0,
      };
    } catch (error) {
      console.error('Error optimizing learning path:', error);
      return {
        optimized_path: [],
        total_estimated_time: 0,
        success_probability: 0,
      };
    }
  }
}
