// Merged database type definitions from database.ts and supabase.ts
import type { Database as SupabaseDB } from './supabase';
import type { Database as ProjectDB } from './database';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Merging Supabase table definitions with our project types
export interface Database {
  public: {
    Tables: {
      // Core tables from both database.ts and supabase.ts
      users: SupabaseDB['public']['Tables']['users'],
      user_profiles: SupabaseDB['public']['Tables']['user_profiles'],
      courses: SupabaseDB['public']['Tables']['courses'],
      course_lessons: SupabaseDB['public']['Tables']['course_lessons'],
      enrollments: SupabaseDB['public']['Tables']['enrollments'],
      reviews: SupabaseDB['public']['Tables']['reviews'],
      learning_content: SupabaseDB['public']['Tables']['learning_content'],
      skill_categories: SupabaseDB['public']['Tables']['skill_categories'],
      payments: SupabaseDB['public']['Tables']['payments'],
      user_skills: SupabaseDB['public']['Tables']['user_skills'],
      
      // Additional tables from services
      teacher_applications: {
        Row: {
          id: string
          user_id: string
          application_data: Json
          status: 'pending' | 'approved' | 'rejected'
          submitted_at: string
          reviewed_at?: string
          reviewed_by?: string
          notes?: string
        }
        Insert: {
          id?: string
          user_id: string
          application_data: Json
          status?: 'pending' | 'approved' | 'rejected'
          submitted_at: string
          reviewed_at?: string
          reviewed_by?: string
          notes?: string
        }
        Update: {
          id?: string
          user_id?: string
          application_data?: Json
          status?: 'pending' | 'approved' | 'rejected'
          submitted_at?: string
          reviewed_at?: string
          reviewed_by?: string
          notes?: string
        }
      },
      user_follows_teacher: {
        Row: {
          id: string
          follower_id: string
          teacher_id: string
          followed_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          teacher_id: string
          followed_at: string
        }
        Update: {
          id?: string
          follower_id?: string
          teacher_id?: string
          followed_at?: string
        }
      },
      notifications: {
        Row: {
          id: string
          recipient_id: string
          notification_type: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          recipient_id: string
          notification_type: string
          message: string
          is_read?: boolean
          created_at: string
        }
        Update: {
          id?: string
          recipient_id?: string
          notification_type?: string
          message?: string
          is_read?: boolean
          created_at?: string
        }
      },
      user_activity_log: {
        Row: {
          id: string
          user_id: string
          action: string
          related_id: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          related_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          related_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      },
      classroom_polls: {
        Row: {
          id: string
          classroom_id: string
          created_by: string
          question: string
          options: string[]
          duration: number
          anonymous: boolean
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          classroom_id: string
          created_by: string
          question: string
          options: string[]
          duration: number
          anonymous: boolean
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          classroom_id?: string
          created_by?: string
          question?: string
          options?: string[]
          duration?: number
          anonymous?: boolean
          status?: string
          created_at?: string
        }
      },
      poll_responses: {
        Row: {
          id: string
          poll_id: string
          user_id: string
          selected_option: number
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          user_id: string
          selected_option: number
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          user_id?: string
          selected_option?: number
          created_at?: string
        }
      },
      breakout_room_participants: {
        Row: {
          id: string
          room_id: string
          user_id: string
          joined_at: string
          left_at: string | null
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          joined_at: string
          left_at?: string | null
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          joined_at?: string
          left_at?: string | null
        }
      },
      classroom_recordings: {
        Row: {
          id: string
          classroom_id: string
          started_by: string
          recording_url: string | null
          duration: number
          peak_participants: number
          average_participants: number
          engagement_score: number
          chat_messages_count: number
          polls_created: number
          questions_asked: number
          status: string
          started_at: string
          ended_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          classroom_id: string
          started_by: string
          recording_url?: string | null
          duration?: number
          peak_participants?: number
          average_participants?: number
          engagement_score?: number
          chat_messages_count?: number
          polls_created?: number
          questions_asked?: number
          status: string
          started_at?: string
          ended_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          classroom_id?: string
          started_by?: string
          recording_url?: string | null
          duration?: number
          peak_participants?: number
          average_participants?: number
          engagement_score?: number
          chat_messages_count?: number
          polls_created?: number
          questions_asked?: number
          status?: string
          started_at?: string
          ended_at?: string | null
          created_at?: string
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

// Re-export types with resolved ambiguities
import * as DB from './database';
import * as Supabase from './supabase';

// Re-export types that don't conflict
export * from './database';

// Explicitly re-export types from Supabase with different names to avoid conflicts
export type {
  User as SupabaseUser,
  UserProfileUpdate as SupabaseUserProfileUpdate,
  UserRole as SupabaseUserRole,
} from './supabase';

export { getFullName } from './supabase';

// Export other non-conflicting types from supabase
export type { SubscriptionTier } from './supabase';
