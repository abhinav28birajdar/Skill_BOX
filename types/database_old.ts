export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          full_name: string | null;
          bio: string | null;
          profile_image_url: string | null;
          role: 'learner' | 'creator' | 'admin';
          creator_status: 'not_creator' | 'pending_review' | 'approved' | 'rejected';
          external_links: Json | null;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username?: string | null;
          full_name?: string | null;
          bio?: string | null;
          profile_image_url?: string | null;
          role?: 'learner' | 'creator' | 'admin';
          creator_status?: 'not_creator' | 'pending_review' | 'approved' | 'rejected';
          external_links?: Json | null;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          full_name?: string | null;
          bio?: string | null;
          profile_image_url?: string | null;
          role?: 'learner' | 'creator' | 'admin';
          creator_status?: 'not_creator' | 'pending_review' | 'approved' | 'rejected';
          external_links?: Json | null;
          is_featured?: boolean;
          created_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      learning_content: {
        Row: {
          id: string;
          skill_id: string;
          creator_id: string | null;
          type: 'video' | 'documentation' | 'project_resource';
          title: string;
          description: string | null;
          content_url: string;
          thumbnail_url: string | null;
          status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'inactive';
          is_curated: boolean;
          skill_level: 'beginner' | 'intermediate' | 'advanced' | null;
          tags: string[] | null;
          views_count: number;
          uploaded_at: string;
          approved_at: string | null;
          rejection_reason: string | null;
        };
        Insert: {
          id?: string;
          skill_id: string;
          creator_id?: string | null;
          type: 'video' | 'documentation' | 'project_resource';
          title: string;
          description?: string | null;
          content_url: string;
          thumbnail_url?: string | null;
          status?: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'inactive';
          is_curated?: boolean;
          skill_level?: 'beginner' | 'intermediate' | 'advanced' | null;
          tags?: string[] | null;
          views_count?: number;
          uploaded_at?: string;
          approved_at?: string | null;
          rejection_reason?: string | null;
        };
        Update: {
          id?: string;
          skill_id?: string;
          creator_id?: string | null;
          type?: 'video' | 'documentation' | 'project_resource';
          title?: string;
          description?: string | null;
          content_url?: string;
          thumbnail_url?: string | null;
          status?: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'inactive';
          is_curated?: boolean;
          skill_level?: 'beginner' | 'intermediate' | 'advanced' | null;
          tags?: string[] | null;
          views_count?: number;
          uploaded_at?: string;
          approved_at?: string | null;
          rejection_reason?: string | null;
        };
      };
      demo_requests: {
        Row: {
          id: string;
          user_id: string | null;
          guest_name: string | null;
          guest_email: string | null;
          phone_number: string | null;
          skill_id: string;
          preferred_date_time: string | null;
          message: string | null;
          status: 'pending' | 'contacted' | 'completed';
          requested_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          guest_name?: string | null;
          guest_email?: string | null;
          phone_number?: string | null;
          skill_id: string;
          preferred_date_time?: string | null;
          message?: string | null;
          status?: 'pending' | 'contacted' | 'completed';
          requested_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          guest_name?: string | null;
          guest_email?: string | null;
          phone_number?: string | null;
          skill_id?: string;
          preferred_date_time?: string | null;
          message?: string | null;
          status?: 'pending' | 'contacted' | 'completed';
          requested_at?: string;
        };
      };
      user_follows_creator: {
        Row: {
          follower_id: string;
          creator_id: string;
          followed_at: string;
        };
        Insert: {
          follower_id: string;
          creator_id: string;
          followed_at?: string;
        };
        Update: {
          follower_id?: string;
          creator_id?: string;
          followed_at?: string;
        };
      };
      user_saved_content: {
        Row: {
          user_id: string;
          content_id: string;
          saved_at: string;
        };
        Insert: {
          user_id: string;
          content_id: string;
          saved_at?: string;
        };
        Update: {
          user_id?: string;
          content_id?: string;
          saved_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface User {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  bio: string | null;
  profile_image_url: string | null;
  role: 'learner' | 'creator' | 'admin';
  creator_status: 'not_creator' | 'pending_review' | 'approved' | 'rejected';
  external_links: Json | null;
  is_featured: boolean;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface LearningContent {
  id: string;
  skill_id: string;
  creator_id: string | null;
  type: 'video' | 'documentation' | 'project_resource';
  title: string;
  description: string | null;
  content_url: string;
  thumbnail_url: string | null;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'inactive';
  is_curated: boolean;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | null;
  tags: string[] | null;
  views_count: number;
  uploaded_at: string;
  approved_at: string | null;
  rejection_reason: string | null;
  skills?: {
    name: string;
  };
  creator?: {
    username: string | null;
    full_name: string | null;
    profile_image_url: string | null;
  };
}
