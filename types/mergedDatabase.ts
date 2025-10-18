import { Database as SupabaseDatabase } from './supabase';
import * as OldDatabase from './database';

// Re-export all types from the old database.ts file
export * from './database';

// Merge database interfaces
export interface MergedDatabase extends OldDatabase.Database {
  public: {
    Tables: {
      // Original tables
      users: SupabaseDatabase['public']['Tables']['users'];
      teacher_profiles: OldDatabase.Database['public']['Tables']['teacher_profiles'];
      skills: OldDatabase.Database['public']['Tables']['skills'];
      learning_content: OldDatabase.Database['public']['Tables']['learning_content'];
      courses: OldDatabase.Database['public']['Tables']['courses'];
      course_modules: OldDatabase.Database['public']['Tables']['course_modules'];
      course_lessons: OldDatabase.Database['public']['Tables']['course_lessons'];
      course_enrollments: OldDatabase.Database['public']['Tables']['course_enrollments'];
      user_progress: OldDatabase.Database['public']['Tables']['user_progress'];
      user_follows: OldDatabase.Database['public']['Tables']['user_follows'];
      comments: OldDatabase.Database['public']['Tables']['comments'];
      reviews: OldDatabase.Database['public']['Tables']['reviews'];
      notifications: OldDatabase.Database['public']['Tables']['notifications'];
      transactions: OldDatabase.Database['public']['Tables']['transactions'];
      
      // New tables from Supabase database
      user_profiles: SupabaseDatabase['public']['Tables']['user_profiles'];
      skill_categories: SupabaseDatabase['public']['Tables']['skill_categories'];
      enrollments: SupabaseDatabase['public']['Tables']['enrollments'];
      payments: SupabaseDatabase['public']['Tables']['payments'];
      learning_analytics: SupabaseDatabase['public']['Tables']['learning_analytics'];
      ai_tutor_profiles: SupabaseDatabase['public']['Tables']['ai_tutor_profiles'];
      notification_preferences: SupabaseDatabase['public']['Tables']['notification_preferences'];
      notification_logs: SupabaseDatabase['public']['Tables']['notification_logs'];
      notification_analytics: SupabaseDatabase['public']['Tables']['notification_analytics'];
      user_devices: SupabaseDatabase['public']['Tables']['user_devices'];
      suggestion_interactions: SupabaseDatabase['public']['Tables']['suggestion_interactions'];
      user_skills: SupabaseDatabase['public']['Tables']['user_skills'];
    }
  }
}

// Extended type for Review with more compatibility
export interface ExtendedReview extends OldDatabase.Review {
  reviewer_id: string;
  reviewed_entity_id: string;
  is_published: boolean;
  flagged_reason?: string | null;
  teacher_response_text?: string | null;
}

// Helper types for database operations
export type SupabaseQueryResult<T> = {
  data: T | null;
  error: any;
  count?: number;
};

// Define user table compatibility types
export type UserProfileTable = SupabaseDatabase['public']['Tables']['user_profiles'];
export type UserTable = SupabaseDatabase['public']['Tables']['users'];

// Define reviews table compatibility types
export interface ReviewTable {
  Row: ExtendedReview;
  Insert: Omit<ExtendedReview, 'id' | 'created_at'>;
  Update: Partial<Omit<ExtendedReview, 'id' | 'created_at'>>;
}

// Helper function to convert between user representations
export const convertUserProfileToUser = (profile: UserProfileTable['Row']): OldDatabase.User => {
  return {
    id: profile.id,
    email: profile.email,
    full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || null,
    username: profile.display_name,
    profile_image_url: profile.profile_image_url,
    bio: profile.bio,
    role: profile.role,
    creator_status: profile.role.includes('teacher') 
      ? (profile.role === 'teacher_approved' ? 'approved' : 'pending_review') 
      : 'not_creator',
    phone_number: null, // Not in user_profiles
    country: profile.location,
    timezone: '', // Not in user_profiles
    preferred_language: '', // Not in user_profiles
    is_verified: profile.is_verified,
    is_active: profile.is_active,
    last_seen_at: profile.last_login_at,
    preferences: profile.interests || {},
    notification_settings: {
      email: profile.email_notifications,
      push: profile.push_notifications,
      marketing: profile.marketing_notifications
    },
    privacy_settings: {},
    total_points: 0,
    current_streak: 0,
    longest_streak: 0,
    created_at: profile.created_at,
    updated_at: profile.updated_at
  };
};

// Helper function to convert review formats
export const adaptReview = (review: any): ExtendedReview => {
  return {
    ...review,
    reviewer_id: review.user_id || review.reviewer_id,
    reviewed_entity_id: review.course_id || review.content_id || review.reviewed_entity_id,
    entity_type: review.entity_type || 'course',
    is_published: review.is_published !== undefined ? review.is_published : true
  };
};