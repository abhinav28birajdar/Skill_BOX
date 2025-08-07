// Enhanced Database Types for SkillBox Platform
export type UserRole = 'student' | 'creator' | 'learner' | 'teacher_approved' | 'teacher_pending' | 'admin_content' | 'admin_teacher_ops' | 'admin_super';

export type TeacherApplicationStatus = 'pending_review' | 'approved' | 'rejected';

export type ContentType = 'video' | 'documentation' | 'quiz' | 'resource_file' | 'live_session' | 'workshop';

export type ContentStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived';

export type ClassType = 'one_on_one' | 'group' | 'workshop' | 'event' | 'masterclass';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';

export type NotificationType = 'new_message' | 'class_reminder' | 'booking_update' | 'content_status_update' | 'review_received' | 'assignment_graded' | 'admin_announcement' | 'follow_update' | 'new_feature';

// Additional types for services
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface TeacherApplication {
  id: string;
  user_id: string;
  status: TeacherApplicationStatus;
  application_data: {
    teaching_experience: string;
    subjects_to_teach: string[];
    motivation: string;
    portfolio_links?: string[];
    certifications?: string[];
  };
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  review_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          full_name: string | null;
          profile_image_url: string | null;
          bio: string | null;
          role: UserRole;
          creator_status: string | null;
          education: any[] | null;
          years_experience: number | null;
          certifications: any[] | null;
          teaching_skills: string[] | null;
          intro_video_url: string | null;
          social_links: any | null;
          is_active: boolean;
          is_featured: boolean;
          onboarding_data: any | null;
          notification_settings: any;
          created_at: string;
          updated_at: string | null;
          timezone: string | null;
          preferred_language: string | null;
          total_earnings: number | null;
          total_students: number | null;
          average_rating: number | null;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          full_name?: string | null;
          profile_image_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          creator_status?: string | null;
          education?: any[] | null;
          years_experience?: number | null;
          certifications?: any[] | null;
          teaching_skills?: string[] | null;
          intro_video_url?: string | null;
          social_links?: any | null;
          is_active?: boolean;
          is_featured?: boolean;
          onboarding_data?: any | null;
          notification_settings?: any;
          created_at?: string;
          updated_at?: string | null;
          timezone?: string | null;
          preferred_language?: string | null;
          total_earnings?: number | null;
          total_students?: number | null;
          average_rating?: number | null;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          full_name?: string | null;
          profile_image_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          creator_status?: string | null;
          education?: any[] | null;
          years_experience?: number | null;
          certifications?: any[] | null;
          teaching_skills?: string[] | null;
          intro_video_url?: string | null;
          social_links?: any | null;
          is_active?: boolean;
          is_featured?: boolean;
          onboarding_data?: any | null;
          notification_settings?: any;
          created_at?: string;
          updated_at?: string | null;
          timezone?: string | null;
          preferred_language?: string | null;
          total_earnings?: number | null;
          total_students?: number | null;
          average_rating?: number | null;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          icon_url: string | null;
          category: string;
          is_active: boolean;
          total_content: number | null;
          total_creators: number | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          icon_url?: string | null;
          category: string;
          is_active?: boolean;
          total_content?: number | null;
          total_creators?: number | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          icon_url?: string | null;
          category?: string;
          is_active?: boolean;
          total_content?: number | null;
          total_creators?: number | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      sub_skills: {
        Row: {
          id: string;
          skill_id: string;
          name: string;
          slug: string;
          description: string | null;
          icon_url: string | null;
          difficulty_level: SkillLevel;
          prerequisites: string[] | null;
          estimated_hours: number | null;
          total_content: number | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          skill_id: string;
          name: string;
          slug: string;
          description?: string | null;
          icon_url?: string | null;
          difficulty_level?: SkillLevel;
          prerequisites?: string[] | null;
          estimated_hours?: number | null;
          total_content?: number | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          skill_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon_url?: string | null;
          difficulty_level?: SkillLevel;
          prerequisites?: string[] | null;
          estimated_hours?: number | null;
          total_content?: number | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      learning_content: {
        Row: {
          id: string;
          title: string;
          description: string;
          content_type: ContentType;
          type: ContentType;
          content_url: string | null;
          thumbnail_url: string | null;
          creator_id: string | null;
          skill_id: string | null;
          sub_skill_id: string | null;
          skill_level: SkillLevel;
          tags: string[] | null;
          duration_minutes: number | null;
          is_free: boolean;
          price: number | null;
          is_curated_by_skillbox: boolean;
          status: ContentStatus;
          rejection_reason: string | null;
          views_count: number;
          likes_count: number | null;
          average_rating: number | null;
          total_reviews: number | null;
          featured_at: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          content_type: ContentType;
          type?: ContentType;
          content_url?: string | null;
          thumbnail_url?: string | null;
          creator_id?: string | null;
          skill_id?: string | null;
          sub_skill_id?: string | null;
          skill_level?: SkillLevel;
          tags?: string[] | null;
          duration_minutes?: number | null;
          is_free?: boolean;
          price?: number | null;
          is_curated_by_skillbox?: boolean;
          status?: ContentStatus;
          rejection_reason?: string | null;
          views_count?: number;
          likes_count?: number | null;
          average_rating?: number | null;
          total_reviews?: number | null;
          featured_at?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          content_type?: ContentType;
          type?: ContentType;
          content_url?: string | null;
          thumbnail_url?: string | null;
          creator_id?: string | null;
          skill_id?: string | null;
          sub_skill_id?: string | null;
          skill_level?: SkillLevel;
          tags?: string[] | null;
          duration_minutes?: number | null;
          is_free?: boolean;
          price?: number | null;
          is_curated_by_skillbox?: boolean;
          status?: ContentStatus;
          rejection_reason?: string | null;
          views_count?: number;
          likes_count?: number | null;
          average_rating?: number | null;
          total_reviews?: number | null;
          featured_at?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      courses: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string;
          course_thumbnail_url: string | null;
          skill_id: string | null;
          sub_skill_id: string | null;
          price: number;
          currency: string | null;
          language_taught: string;
          prerequisites: string[] | null;
          what_you_will_learn: string[] | null;
          target_audience: string | null;
          difficulty_level: SkillLevel;
          estimated_duration_hours: number | null;
          status: ContentStatus;
          average_rating: number | null;
          total_students_enrolled: number;
          total_lessons: number | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description: string;
          course_thumbnail_url?: string | null;
          skill_id?: string | null;
          sub_skill_id?: string | null;
          price?: number;
          currency?: string | null;
          language_taught?: string;
          prerequisites?: string[] | null;
          what_you_will_learn?: string[] | null;
          target_audience?: string | null;
          difficulty_level?: SkillLevel;
          estimated_duration_hours?: number | null;
          status?: ContentStatus;
          average_rating?: number | null;
          total_students_enrolled?: number;
          total_lessons?: number | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          description?: string;
          course_thumbnail_url?: string | null;
          skill_id?: string | null;
          sub_skill_id?: string | null;
          price?: number;
          currency?: string | null;
          language_taught?: string;
          prerequisites?: string[] | null;
          what_you_will_learn?: string[] | null;
          target_audience?: string | null;
          difficulty_level?: SkillLevel;
          estimated_duration_hours?: number | null;
          status?: ContentStatus;
          average_rating?: number | null;
          total_students_enrolled?: number;
          total_lessons?: number | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      classes: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string;
          class_type: ClassType;
          price: number;
          currency: string | null;
          duration_minutes: number;
          language_of_instruction: string;
          class_thumbnail_url: string | null;
          meeting_platform: string | null;
          base_meeting_link: string | null;
          skill_id: string | null;
          sub_skill_id: string | null;
          difficulty_level: SkillLevel;
          max_students: number | null;
          status: ContentStatus;
          average_rating: number | null;
          total_bookings: number | null;
          prerequisites: string[] | null;
          materials_provided: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description: string;
          class_type: ClassType;
          price: number;
          currency?: string | null;
          duration_minutes: number;
          language_of_instruction?: string;
          class_thumbnail_url?: string | null;
          meeting_platform?: string | null;
          base_meeting_link?: string | null;
          skill_id?: string | null;
          sub_skill_id?: string | null;
          difficulty_level?: SkillLevel;
          max_students?: number | null;
          status?: ContentStatus;
          average_rating?: number | null;
          total_bookings?: number | null;
          prerequisites?: string[] | null;
          materials_provided?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          description?: string;
          class_type?: ClassType;
          price?: number;
          currency?: string | null;
          duration_minutes?: number;
          language_of_instruction?: string;
          class_thumbnail_url?: string | null;
          meeting_platform?: string | null;
          base_meeting_link?: string | null;
          skill_id?: string | null;
          sub_skill_id?: string | null;
          difficulty_level?: SkillLevel;
          max_students?: number | null;
          status?: ContentStatus;
          average_rating?: number | null;
          total_bookings?: number | null;
          prerequisites?: string[] | null;
          materials_provided?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          recipient_id: string;
          type: NotificationType;
          title: string;
          message: string;
          data: any | null;
          link_to: string | null;
          related_entity_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_id: string;
          type: NotificationType;
          title: string;
          message: string;
          data?: any | null;
          link_to?: string | null;
          related_entity_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient_id?: string;
          type?: NotificationType;
          title?: string;
          message?: string;
          data?: any | null;
          link_to?: string | null;
          related_entity_id?: string | null;
          is_read?: boolean;
          created_at?: string;
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
      user_role: UserRole;
      content_type: ContentType;
      content_status: ContentStatus;
      class_type: ClassType;
      skill_level: SkillLevel;
      notification_type: NotificationType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Utility types for common operations
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Skill = Database['public']['Tables']['skills']['Row'];
export type SubSkill = Database['public']['Tables']['sub_skills']['Row'];

export type LearningContent = Database['public']['Tables']['learning_content']['Row'];
export type Course = Database['public']['Tables']['courses']['Row'];
export type Class = Database['public']['Tables']['classes']['Row'];

export type Notification = Database['public']['Tables']['notifications']['Row'];

// Extended types for UI components
export interface CreatorProfile extends User {
  skills?: Skill[];
  content_count?: number;
  student_count?: number;
  monthly_earnings?: number;
}

export interface LearningProgress {
  user_id: string;
  content_id: string;
  progress_percentage: number;
  completed_at?: string;
  started_at: string;
  last_accessed_at: string;
}

export interface EnrollmentData {
  course: Course;
  progress: LearningProgress;
  creator: CreatorProfile;
}

// Skill categories with comprehensive list
export const SKILL_CATEGORIES = {
  TECHNOLOGY: {
    name: 'Technology & Programming',
    icon: '💻',
    color: '#3B82F6',
    skills: [
      'Web Development', 'Mobile Development', 'AI & Machine Learning',
      'Data Science', 'Cybersecurity', 'Cloud Computing', 'DevOps',
      'Game Development', 'Blockchain', 'UI/UX Design'
    ]
  },
  BUSINESS: {
    name: 'Business & Entrepreneurship',
    icon: '💼',
    color: '#10B981',
    skills: [
      'Digital Marketing', 'Project Management', 'Sales', 'Leadership',
      'Finance & Accounting', 'E-commerce', 'Startup Building',
      'Business Strategy', 'HR Management', 'Operations'
    ]
  },
  CREATIVE: {
    name: 'Creative Arts & Design',
    icon: '🎨',
    color: '#F59E0B',
    skills: [
      'Graphic Design', 'Photography', 'Video Editing', 'Animation',
      'Music Production', 'Writing & Content', 'Interior Design',
      'Fashion Design', 'Digital Art', 'Illustration'
    ]
  },
  HEALTH: {
    name: 'Health & Wellness',
    icon: '🏥',
    color: '#EF4444',
    skills: [
      'Nutrition', 'Fitness Training', 'Yoga & Meditation', 'Mental Health',
      'Physiotherapy', 'Nursing', 'Alternative Medicine', 'Sports Medicine',
      'Health Coaching', 'Wellness Programs'
    ]
  },
  EDUCATION: {
    name: 'Education & Teaching',
    icon: '📚',
    color: '#8B5CF6',
    skills: [
      'Online Teaching', 'Curriculum Development', 'Educational Technology',
      'Language Teaching', 'Early Childhood Education', 'Special Education',
      'Training & Development', 'Academic Writing', 'Research Methods'
    ]
  },
  LIFESTYLE: {
    name: 'Lifestyle & Personal',
    icon: '🌟',
    color: '#EC4899',
    skills: [
      'Cooking & Culinary', 'Personal Development', 'Communication',
      'Time Management', 'Relationship Building', 'Public Speaking',
      'Hobby Crafts', 'Gardening', 'Home Organization', 'Travel Planning'
    ]
  },
  TRADES: {
    name: 'Trades & Manual Skills',
    icon: '🔧',
    color: '#F97316',
    skills: [
      'Carpentry', 'Plumbing', 'Electrical Work', 'Automotive Repair',
      'Welding', 'HVAC', 'Masonry', 'Painting & Decorating',
      'Landscaping', 'Equipment Maintenance'
    ]
  },
  LANGUAGES: {
    name: 'Languages & Communication',
    icon: '🌍',
    color: '#06B6D4',
    skills: [
      'English', 'Spanish', 'French', 'German', 'Mandarin Chinese',
      'Japanese', 'Arabic', 'Portuguese', 'Russian', 'Italian',
      'Sign Language', 'Translation', 'Interpretation'
    ]
  }
} as const;

export type SkillCategory = keyof typeof SKILL_CATEGORIES;
