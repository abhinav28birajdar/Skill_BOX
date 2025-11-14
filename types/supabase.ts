export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// User type for auth context with computed full_name
export type User = Database['public']['Tables']['user_profiles']['Row'] & {
  full_name?: string;
}

// User roles
export type UserRole = 'student' | 'creator' | 'teacher_approved' | 'admin_content' | 'admin_teacher_ops' | 'admin_super' | 'learner' | 'teacher_pending'

// User profile update type
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

// Helper function to compute full name
export const getFullName = (user: Database['public']['Tables']['user_profiles']['Row']): string => {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  if (user.first_name) return user.first_name;
  if (user.last_name) return user.last_name;
  if (user.display_name) return user.display_name;
  return user.email.split('@')[0];
};

// Subscription tiers
export type SubscriptionTier = 'free' | 'premium' | 'pro'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          username: string | null
          profile_image_url: string | null
          role: 'student' | 'teacher' | 'admin'
          is_verified: boolean
          bio: string | null
          skills: string[] | null
          location: string | null
          social_links: Json | null
          preferences: Json | null
          is_active: boolean
          subscription_tier: 'free' | 'premium' | 'pro' | null
          subscription_expires_at: string | null
          total_learning_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          username?: string | null
          profile_image_url?: string | null
          role?: 'student' | 'teacher' | 'admin'
          is_verified?: boolean
          bio?: string | null
          skills?: string[] | null
          location?: string | null
          social_links?: Json | null
          preferences?: Json | null
          is_active?: boolean
          subscription_tier?: 'free' | 'premium' | 'pro' | null
          subscription_expires_at?: string | null
          total_learning_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          username?: string | null
          profile_image_url?: string | null
          role?: 'student' | 'teacher' | 'admin'
          is_verified?: boolean
          bio?: string | null
          skills?: string[] | null
          location?: string | null
          social_links?: Json | null
          preferences?: Json | null
          is_active?: boolean
          subscription_tier?: 'free' | 'premium' | 'pro' | null
          subscription_expires_at?: string | null
          total_learning_time?: number
          created_at?: string
          updated_at?: string
        }
      }
      skill_categories: {
        Row: {
          id: string
          name: string
          category: 'development' | 'design' | 'business' | 'marketing' | 'photography' | 'music' | 'health' | 'language' | 'other'
          description: string | null
          icon_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: 'development' | 'design' | 'business' | 'marketing' | 'photography' | 'music' | 'health' | 'language' | 'other'
          description?: string | null
          icon_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'development' | 'design' | 'business' | 'marketing' | 'photography' | 'music' | 'health' | 'language' | 'other'
          description?: string | null
          icon_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          instructor_id: string
          skill_category_id: string
          level: 'beginner' | 'intermediate' | 'advanced'
          price: number
          is_free: boolean
          currency: string
          thumbnail_url: string | null
          preview_video_url: string | null
          duration_hours: number
          language: string
          tags: string[] | null
          requirements: string[] | null
          what_you_learn: string[] | null
          status: 'draft' | 'published' | 'archived'
          enrollment_count: number
          rating: number
          review_count: number
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          instructor_id: string
          skill_category_id: string
          level: 'beginner' | 'intermediate' | 'advanced'
          price?: number
          is_free?: boolean
          currency?: string
          thumbnail_url?: string | null
          preview_video_url?: string | null
          duration_hours?: number
          language?: string
          tags?: string[] | null
          requirements?: string[] | null
          what_you_learn?: string[] | null
          status?: 'draft' | 'published' | 'archived'
          enrollment_count?: number
          rating?: number
          review_count?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          instructor_id?: string
          skill_category_id?: string
          level?: 'beginner' | 'intermediate' | 'advanced'
          price?: number
          is_free?: boolean
          currency?: string
          thumbnail_url?: string | null
          preview_video_url?: string | null
          duration_hours?: number
          language?: string
          tags?: string[] | null
          requirements?: string[] | null
          what_you_learn?: string[] | null
          status?: 'draft' | 'published' | 'archived'
          enrollment_count?: number
          rating?: number
          review_count?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      course_lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          video_url: string | null
          content_type: 'video' | 'text' | 'quiz' | 'assignment' | 'live_session'
          content_data: Json | null
          duration_minutes: number
          order_index: number
          is_preview: boolean
          is_locked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          video_url?: string | null
          content_type: 'video' | 'text' | 'quiz' | 'assignment' | 'live_session'
          content_data?: Json | null
          duration_minutes?: number
          order_index: number
          is_preview?: boolean
          is_locked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          video_url?: string | null
          content_type?: 'video' | 'text' | 'quiz' | 'assignment' | 'live_session'
          content_data?: Json | null
          duration_minutes?: number
          order_index?: number
          is_preview?: boolean
          is_locked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          enrolled_at: string
          progress_percentage: number
          completed_at: string | null
          last_accessed_at: string | null
          time_spent_minutes: number
          current_lesson_id: string | null
          certificate_issued: boolean
          certificate_url: string | null
          payment_id: string | null
          access_expires_at: string | null
          status: 'active' | 'completed' | 'expired' | 'refunded'
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          enrolled_at?: string
          progress_percentage?: number
          completed_at?: string | null
          last_accessed_at?: string | null
          time_spent_minutes?: number
          current_lesson_id?: string | null
          certificate_issued?: boolean
          certificate_url?: string | null
          payment_id?: string | null
          access_expires_at?: string | null
          status?: 'active' | 'completed' | 'expired' | 'refunded'
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          enrolled_at?: string
          progress_percentage?: number
          completed_at?: string | null
          last_accessed_at?: string | null
          time_spent_minutes?: number
          current_lesson_id?: string | null
          certificate_issued?: boolean
          certificate_url?: string | null
          payment_id?: string | null
          access_expires_at?: string | null
          status?: 'active' | 'completed' | 'expired' | 'refunded'
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          subscription_type: 'course' | 'premium' | 'pro' | null
          amount: number
          currency: string
          payment_method: 'stripe' | 'paypal' | 'razorpay' | 'google_pay' | 'apple_pay'
          payment_intent_id: string | null
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          refund_amount: number | null
          refunded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id?: string | null
          subscription_type?: 'course' | 'premium' | 'pro' | null
          amount: number
          currency?: string
          payment_method: 'stripe' | 'paypal' | 'razorpay' | 'google_pay' | 'apple_pay'
          payment_intent_id?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          refund_amount?: number | null
          refunded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          subscription_type?: 'course' | 'premium' | 'pro' | null
          amount?: number
          currency?: string
          payment_method?: 'stripe' | 'paypal' | 'razorpay' | 'google_pay' | 'apple_pay'
          payment_intent_id?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          refund_amount?: number | null
          refunded_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      learning_analytics: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          session_duration_minutes: number
          focus_score: number
          comprehension_score: number
          engagement_level: number
          preferred_learning_times: string[] | null
          learning_streak_days: number
          average_focus_score: number
          preferred_difficulty: 'beginner' | 'intermediate' | 'advanced'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id?: string | null
          session_duration_minutes?: number
          focus_score?: number
          comprehension_score?: number
          engagement_level?: number
          preferred_learning_times?: string[] | null
          learning_streak_days?: number
          average_focus_score?: number
          preferred_difficulty?: 'beginner' | 'intermediate' | 'advanced'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          session_duration_minutes?: number
          focus_score?: number
          comprehension_score?: number
          engagement_level?: number
          preferred_learning_times?: string[] | null
          learning_streak_days?: number
          average_focus_score?: number
          preferred_difficulty?: 'beginner' | 'intermediate' | 'advanced'
          created_at?: string
          updated_at?: string
        }
      }
      ai_tutor_profiles: {
        Row: {
          id: string
          user_id: string
          personality_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          personality_data: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          personality_data?: Json
          created_at?: string
          updated_at?: string
        }
      }
      notification_preferences: {
        Row: {
          id: string
          user_id: string
          push_enabled: boolean
          email_enabled: boolean
          sms_enabled: boolean
          learning_reminders: boolean
          assignment_deadlines: boolean
          live_class_alerts: boolean
          achievement_notifications: boolean
          marketing_communications: boolean
          quiet_hours: Json | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          push_enabled?: boolean
          email_enabled?: boolean
          sms_enabled?: boolean
          learning_reminders?: boolean
          assignment_deadlines?: boolean
          live_class_alerts?: boolean
          achievement_notifications?: boolean
          marketing_communications?: boolean
          quiet_hours?: Json | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          push_enabled?: boolean
          email_enabled?: boolean
          sms_enabled?: boolean
          learning_reminders?: boolean
          assignment_deadlines?: boolean
          live_class_alerts?: boolean
          achievement_notifications?: boolean
          marketing_communications?: boolean
          quiet_hours?: Json | null
          updated_at?: string
        }
      }
      notification_logs: {
        Row: {
          id: string
          notification_id: string
          user_id: string
          type: 'learning_reminder' | 'assignment_due' | 'live_class' | 'achievement' | 'system' | 'marketing'
          title: string
          body: string
          scheduled_at: string
          sent_at: string | null
          opened_at: string | null
        }
        Insert: {
          id?: string
          notification_id: string
          user_id: string
          type: 'learning_reminder' | 'assignment_due' | 'live_class' | 'achievement' | 'system' | 'marketing'
          title: string
          body: string
          scheduled_at: string
          sent_at?: string | null
          opened_at?: string | null
        }
        Update: {
          id?: string
          notification_id?: string
          user_id?: string
          type?: 'learning_reminder' | 'assignment_due' | 'live_class' | 'achievement' | 'system' | 'marketing'
          title?: string
          body?: string
          scheduled_at?: string
          sent_at?: string | null
          opened_at?: string | null
        }
      }
      notification_analytics: {
        Row: {
          id: string
          user_id: string
          total_sent: number
          open_rate: number
          most_effective_times: string[]
          preferred_types: string[]
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_sent?: number
          open_rate?: number
          most_effective_times?: string[]
          preferred_types?: string[]
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_sent?: number
          open_rate?: number
          most_effective_times?: string[]
          preferred_types?: string[]
          updated_at?: string
        }
      }
      user_devices: {
        Row: {
          id: string
          user_id: string
          push_token: string
          platform: 'ios' | 'android' | 'windows' | 'macos' | 'web'
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          push_token: string
          platform: 'ios' | 'android' | 'windows' | 'macos' | 'web'
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          push_token?: string
          platform?: 'ios' | 'android' | 'windows' | 'macos' | 'web'
          updated_at?: string
        }
      }
      learning_content: {
        Row: {
          id: string
          title: string
          description: string
          skill_id: string
          creator_id: string
          type: 'video' | 'text' | 'audio' | 'interactive' | 'project'
          content_url: string
          thumbnail_url: string | null
          skill_level: 'beginner' | 'intermediate' | 'advanced'
          tags: string[] | null
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          skill_id: string
          creator_id: string
          type: 'video' | 'text' | 'audio' | 'interactive' | 'project'
          content_url: string
          thumbnail_url?: string | null
          skill_level: 'beginner' | 'intermediate' | 'advanced'
          tags?: string[] | null
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          skill_id?: string
          creator_id?: string
          type?: 'video' | 'text' | 'audio' | 'interactive' | 'project'
          content_url?: string
          thumbnail_url?: string | null
          skill_level?: 'beginner' | 'intermediate' | 'advanced'
          tags?: string[] | null
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      suggestion_interactions: {
        Row: {
          id: string
          user_id: string
          suggestion_id: string
          action: string
          reason: string | null
          timestamp: string
          context: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          suggestion_id: string
          action: string
          reason?: string | null
          timestamp: string
          context?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          suggestion_id?: string
          action?: string
          reason?: string | null
          timestamp?: string
          context?: Json | null
        }
      }
      reviews: {
        Row: {
          id: string
          reviewer_id: string
          reviewed_entity_id: string
          entity_type: 'teacher' | 'course' | 'content' | 'class'
          rating: number
          review_text: string | null
          is_published: boolean
          flagged_reason: string | null
          teacher_response_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reviewer_id: string
          reviewed_entity_id: string
          entity_type: 'teacher' | 'course' | 'content' | 'class'
          rating: number
          review_text?: string | null
          is_published?: boolean
          flagged_reason?: string | null
          teacher_response_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reviewer_id?: string
          reviewed_entity_id?: string
          entity_type?: 'teacher' | 'course' | 'content' | 'class'
          rating?: number
          review_text?: string | null
          is_published?: boolean
          flagged_reason?: string | null
          teacher_response_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          display_name: string | null
          role: 'student' | 'creator' | 'teacher_approved' | 'admin_content' | 'admin_teacher_ops' | 'admin_super' | 'learner' | 'teacher_pending'
          bio: string | null
          location: string | null
          website: string | null
          linkedin: string | null
          twitter: string | null
          github: string | null
          profile_image_url: string | null
          banner_image_url: string | null
          skills: string[] | null
          interests: string[] | null
          is_verified: boolean
          is_active: boolean
          agreed_to_terms: boolean
          marketing_consent: boolean
          onboarding_completed: boolean
          onboarding_completed_at: string | null
          email_notifications: boolean
          push_notifications: boolean
          marketing_notifications: boolean
          subscription_tier: 'free' | 'premium' | 'pro' | null
          subscription_expires_at: string | null
          last_login_at: string | null
          email_verified_at: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          display_name?: string | null
          role?: 'student' | 'creator' | 'teacher_approved' | 'admin_content' | 'admin_teacher_ops' | 'admin_super' | 'learner' | 'teacher_pending'
          bio?: string | null
          location?: string | null
          website?: string | null
          linkedin?: string | null
          twitter?: string | null
          github?: string | null
          profile_image_url?: string | null
          banner_image_url?: string | null
          skills?: string[] | null
          interests?: string[] | null
          is_verified?: boolean
          is_active?: boolean
          agreed_to_terms?: boolean
          marketing_consent?: boolean
          onboarding_completed?: boolean
          onboarding_completed_at?: string | null
          email_notifications?: boolean
          push_notifications?: boolean
          marketing_notifications?: boolean
          subscription_tier?: 'free' | 'premium' | 'pro' | null
          subscription_expires_at?: string | null
          last_login_at?: string | null
          email_verified_at?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          display_name?: string | null
          role?: 'student' | 'creator' | 'teacher_approved' | 'admin_content' | 'admin_teacher_ops' | 'admin_super' | 'learner' | 'teacher_pending'
          bio?: string | null
          location?: string | null
          website?: string | null
          linkedin?: string | null
          twitter?: string | null
          github?: string | null
          profile_image_url?: string | null
          banner_image_url?: string | null
          skills?: string[] | null
          interests?: string[] | null
          is_verified?: boolean
          is_active?: boolean
          agreed_to_terms?: boolean
          marketing_consent?: boolean
          onboarding_completed?: boolean
          onboarding_completed_at?: string | null
          email_notifications?: boolean
          push_notifications?: boolean
          marketing_notifications?: boolean
          subscription_tier?: 'free' | 'premium' | 'pro' | null
          subscription_expires_at?: string | null
          last_login_at?: string | null
          email_verified_at?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_skills: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          proficiency_level: 'beginner' | 'intermediate' | 'advanced'
          is_teaching: boolean
          years_of_experience: number | null
          certifications: string[] | null
          portfolio_links: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          proficiency_level: 'beginner' | 'intermediate' | 'advanced'
          is_teaching?: boolean
          years_of_experience?: number | null
          certifications?: string[] | null
          portfolio_links?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          proficiency_level?: 'beginner' | 'intermediate' | 'advanced'
          is_teaching?: boolean
          years_of_experience?: number | null
          certifications?: string[] | null
          portfolio_links?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}