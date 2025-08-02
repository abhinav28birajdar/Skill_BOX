// Comprehensive Database Types for SkillBox Application

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Partial<User>;
        Update: Partial<User>;
      };
      skills: {
        Row: Skill;
        Insert: Partial<Skill>;
        Update: Partial<Skill>;
      };
      sub_skills: {
        Row: SubSkill;
        Insert: Partial<SubSkill>;
        Update: Partial<SubSkill>;
      };
      learning_content: {
        Row: LearningContent;
        Insert: Partial<LearningContent>;
        Update: Partial<LearningContent>;
      };
      courses: {
        Row: Course;
        Insert: Partial<Course>;
        Update: Partial<Course>;
      };
      modules: {
        Row: Module;
        Insert: Partial<Module>;
        Update: Partial<Module>;
      };
      lessons: {
        Row: Lesson;
        Insert: Partial<Lesson>;
        Update: Partial<Lesson>;
      };
      classes: {
        Row: Class;
        Insert: Partial<Class>;
        Update: Partial<Class>;
      };
      class_bookings: {
        Row: ClassBooking;
        Insert: Partial<ClassBooking>;
        Update: Partial<ClassBooking>;
      };
      course_enrollments: {
        Row: CourseEnrollment;
        Insert: Partial<CourseEnrollment>;
        Update: Partial<CourseEnrollment>;
      };
      reviews: {
        Row: Review;
        Insert: Partial<Review>;
        Update: Partial<Review>;
      };
      messages: {
        Row: Message;
        Insert: Partial<Message>;
        Update: Partial<Message>;
      };
      notifications: {
        Row: Notification;
        Insert: Partial<Notification>;
        Update: Partial<Notification>;
      };
      forum_categories: {
        Row: ForumCategory;
        Insert: Partial<ForumCategory>;
        Update: Partial<ForumCategory>;
      };
      forum_threads: {
        Row: ForumThread;
        Insert: Partial<ForumThread>;
        Update: Partial<ForumThread>;
      };
      forum_posts: {
        Row: ForumPost;
        Insert: Partial<ForumPost>;
        Update: Partial<ForumPost>;
      };
      teacher_applications: {
        Row: TeacherApplication;
        Insert: Partial<TeacherApplication>;
        Update: Partial<TeacherApplication>;
      };
      payouts: {
        Row: Payout;
        Insert: Partial<Payout>;
        Update: Partial<Payout>;
      };
      earned_commissions: {
        Row: EarnedCommission;
        Insert: Partial<EarnedCommission>;
        Update: Partial<EarnedCommission>;
      };
    };
  };
}

// Core Entity Interfaces
export interface User {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  profile_image_url: string | null;
  bio: string | null;
  role: 'student' | 'teacher_pending' | 'teacher_approved' | 'admin_content' | 'admin_teacherops' | 'admin_super' | 'creator' | 'learner' | 'admin';
  creator_status?: 'not_creator' | 'pending_review' | 'approved' | 'rejected';
  teacher_status_notes: string | null;
  education: Json[] | null; // JSONB array
  experience_years: number | null;
  certifications: Json[] | null; // JSONB array
  teaching_skills: string[] | null;
  intro_video_url: string | null;
  social_links: Json | null; // JSONB object
  is_active: boolean;
  is_featured: boolean;
  preferences: Json | null; // JSONB object
  created_at: string;
  last_login_at: string | null;
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

export interface SubSkill {
  id: string;
  skill_id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  created_at: string;
  skill?: Skill;
}

export interface LearningContent {
  id: string;
  title: string;
  description: string | null;
  content_type: 'video' | 'document' | 'quiz' | 'resource';
  type: 'video' | 'documentation' | 'project'; // Legacy compatibility
  content_url: string | null;
  thumbnail_url: string | null;
  teacher_id: string | null;
  skill_id: string | null;
  sub_skill_id: string | null;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
  tags: string[] | null;
  duration_minutes: number | null;
  is_curated_by_skillbox: boolean;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived';
  rejection_reason: string | null;
  views_count: number;
  rating_avg: number | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  // Joined fields
  skill?: Skill;
  skills?: Skill; // Legacy compatibility - same as skill
  sub_skill?: SubSkill;
  teacher?: User;
}

export interface Course {
  id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  course_thumbnail_url: string | null;
  skill_id: string | null;
  sub_skill_id: string | null;
  price: number;
  language_taught: string | null;
  prerequisites: string[] | null;
  what_you_will_learn: string[] | null;
  target_audience: string | null;
  status: 'draft' | 'pending_review' | 'published' | 'archived' | 'private';
  average_rating: number | null;
  total_students_enrolled: number;
  created_at: string;
  published_at: string | null;
  updated_at: string;
  // Joined fields
  teacher?: User;
  skill?: Skill;
  sub_skill?: SubSkill;
  modules?: Module[];
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  learning_content_id: string;
  lesson_title: string | null;
  order_index: number;
  is_free_preview: boolean;
  created_at: string;
  learning_content?: LearningContent;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: Json[] | null; // JSONB array
  correct_answer: Json | null; // JSONB
  explanation: string | null;
  created_at: string;
}

export interface Class {
  id: string;
  teacher_id: string;
  skill_id: string | null;
  sub_skill_id: string | null;
  title: string;
  description: string | null;
  class_type: 'one_on_one' | 'group' | 'workshop' | 'event';
  base_price: number;
  duration_minutes: number;
  language_of_instruction: string | null;
  class_thumbnail_url: string | null;
  meeting_platform: 'Zoom' | 'Google Meet' | 'SkillBox Virtual Room' | null;
  meeting_link: string | null;
  meeting_password: string | null;
  status: 'draft' | 'pending_review' | 'active' | 'archived' | 'private';
  max_students: number | null;
  currently_enrolled: number;
  average_rating: number | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  teacher?: User;
  skill?: Skill;
  sub_skill?: SubSkill;
}

export interface TeacherAvailabilitySlot {
  id: string;
  teacher_id: string;
  day_of_week: number; // 0-6 for Sun-Sat
  start_time_local: string; // time without timezone
  end_time_local: string;
  timezone_offset_minutes: number;
  created_at: string;
}

export interface TeacherBlockedDate {
  id: string;
  teacher_id: string;
  block_date: string; // date
  reason: string | null;
  created_at: string;
}

export interface ClassSession {
  id: string;
  class_id: string;
  scheduled_start_time: string; // timestamp with timezone
  scheduled_end_time: string;
  actual_start_time: string | null;
  actual_end_time: string | null;
  meeting_url_instance: string | null;
  capacity_limit: number | null;
  students_booked: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'canceled' | 'rescheduled';
  is_recorded: boolean;
  created_at: string;
  updated_at: string;
  class?: Class;
}

export interface ClassBooking {
  id: string;
  student_id: string;
  class_id: string;
  class_session_id: string | null;
  booking_price_at_time: number;
  booking_date: string;
  status: 'pending_payment' | 'confirmed' | 'attended' | 'not_attended' | 'cancelled_by_student' | 'cancelled_by_teacher' | 'refunded';
  refund_amount: number | null;
  is_demo_class: boolean;
  attendance_marked: boolean;
  created_at: string;
  // Joined fields
  student?: User;
  class?: Class;
  class_session?: ClassSession;
}

export interface CourseEnrollment {
  student_id: string;
  course_id: string;
  enrollment_date: string;
  progress_percentage: number;
  completion_date: string | null;
  status: 'in_progress' | 'completed' | 'paused' | 'withdrawn';
  course?: Course;
  student?: User;
}

export interface UserProgress {
  id: string;
  user_id: string;
  entity_id: string; // learning_content.id, module.id, quiz.id, class_sessions.id
  entity_type: 'lesson' | 'module' | 'quiz' | 'class_session';
  progress_status: 'started' | 'completed' | 'passed' | 'failed';
  score: number | null;
  last_accessed_at: string;
  created_at: string;
}

export interface Assignment {
  id: string;
  course_id: string | null;
  module_id: string | null;
  lesson_id: string | null;
  teacher_id: string;
  title: string;
  instructions: string | null;
  max_score: number | null;
  due_date: string | null;
  created_at: string;
}

export interface StudentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  submission_url: string | null;
  submission_text: string | null;
  submitted_at: string;
  teacher_grade: number | null;
  teacher_feedback: string | null;
  status: 'submitted' | 'graded' | 'resubmitted';
  assignment?: Assignment;
  student?: User;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewed_entity_id: string; // teacher_id OR class_id OR course_id
  entity_type: 'teacher' | 'class' | 'course';
  rating: number; // 1-5 stars
  review_text: string | null;
  is_published: boolean;
  flagged_reason: string | null;
  teacher_response_text: string | null;
  created_at: string;
  // Joined fields
  reviewer?: User;
  reviewed_entity?: User | Class | Course;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  thread_id: string | null;
  related_booking_id: string | null;
  message_text: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
  receiver?: User;
}

export interface Notification {
  id: string;
  recipient_id: string;
  notification_type: 'new_message' | 'class_reminder' | 'booking_update' | 'content_status_update' | 'review_received' | 'assignment_graded' | 'admin_announcement' | 'follow';
  message: string;
  link_to: string | null;
  is_read: boolean;
  created_at: string;
}

export interface UserActivityLog {
  id: string;
  user_id: string;
  action: string; // e.g., 'view_content', 'booked_class', 'uploaded_video'
  related_id: string | null; // e.g., content_id, class_id
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface Payout {
  id: string;
  teacher_id: string;
  amount: number;
  currency: string;
  status: 'pending_request' | 'processing' | 'completed' | 'failed';
  request_type: 'manual' | 'automated_threshold';
  requested_at: string;
  processed_at: string | null;
  transaction_id_external: string | null;
  teacher?: User;
}

export interface EarnedCommission {
  id: string;
  teacher_id: string;
  booking_id: string | null;
  course_enrollment_id: string | null;
  amount_earned_teacher: number;
  platform_commission_amount: number;
  final_net_teacher_earning: number;
  status: 'unpaid' | 'paid';
  transaction_date: string;
  teacher?: User;
}

// Forum System
export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ForumThread {
  id: string;
  category_id: string;
  author_id: string;
  title: string;
  body: string;
  status: 'open' | 'closed' | 'pinned';
  post_count: number;
  last_post_at: string | null;
  created_at: string;
  updated_at: string;
  category?: ForumCategory;
  author?: User;
}

export interface ForumPost {
  id: string;
  thread_id: string;
  parent_post_id: string | null;
  author_id: string;
  body: string;
  likes_count: number;
  created_at: string;
  thread?: ForumThread;
  author?: User;
  parent_post?: ForumPost;
}

// User Interactions
export interface UserFollowsTeacher {
  follower_id: string;
  teacher_id: string;
  followed_at: string;
  teacher?: User;
  follower?: User;
}

export interface UserSavedContent {
  user_id: string;
  content_id: string;
  saved_at: string;
  content?: LearningContent;
  user?: User;
}

export interface UserLikesContent {
  user_id: string;
  content_id: string;
  created_at: string;
  content?: LearningContent;
  user?: User;
}

// Q&A System
export interface ContentQA {
  id: string;
  content_id: string;
  user_id: string;
  question_text: string;
  created_at: string;
  content?: LearningContent;
  user?: User;
  answers?: ContentQAAnswer[];
}

export interface ContentQAAnswer {
  id: string;
  question_id: string;
  user_id: string;
  answer_text: string;
  likes_count: number;
  created_at: string;
  question?: ContentQA;
  user?: User;
}

// Teacher Application
export interface TeacherApplication {
  id: string;
  user_id: string;
  application_data: Json; // JSONB
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  user?: User;
}

// Platform Settings
export interface PlatformSetting {
  id: string;
  key: string;
  value: Json; // JSONB
  description: string | null;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
  target_roles: string[] | null;
  created_at: string;
  updated_at: string;
}

// Disputes
export interface Dispute {
  id: string;
  type: 'class_booking' | 'course_enrollment' | 'content_issue' | 'payment_issue';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  related_entity_id: string;
  involved_parties: string[]; // array of user IDs
  description: string;
  resolution: string | null;
  created_at: string;
  resolved_at: string | null;
}

// Extended types for joined queries
export type LearningContentWithDetails = LearningContent & {
  skill?: Skill;
  sub_skill?: SubSkill;
  teacher?: User;
};

export type CourseWithDetails = Course & {
  teacher?: User;
  skill?: Skill;
  sub_skill?: SubSkill;
  modules?: Module[];
  enrollments_count?: number;
};

export type ClassWithDetails = Class & {
  teacher?: User;
  skill?: Skill;
  sub_skill?: SubSkill;
  sessions?: ClassSession[];
};

export type UserWithStats = User & {
  follower_count?: number;
  following_count?: number;
  total_content?: number;
  total_courses?: number;
  total_classes?: number;
  average_rating?: number;
  total_earnings?: number;
};

// Database response types
export interface DatabaseResponse<T> {
  data: T | null;
  error: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  skill_id?: string;
  sub_skill_id?: string;
  skill_level?: string;
  content_type?: string;
  class_type?: string;
  price_range?: [number, number];
  rating_min?: number;
  language?: string;
  sort_by?: 'created_at' | 'rating' | 'price' | 'popularity';
  sort_order?: 'asc' | 'desc';
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  url: string;
  key: string;
  size: number;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: any;
  app_metadata?: any;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

// Component prop types
export interface BaseCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  onPress?: () => void;
}

export interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// Form types
export interface TeacherApplicationFormData {
  personal_info: {
    full_name: string;
    bio: string;
    phone: string;
    location: string;
  };
  experience: {
    years_teaching: number;
    years_professional: number;
    previous_experience: string;
  };
  qualifications: {
    education: Array<{
      institution: string;
      degree: string;
      start_year: number;
      end_year: number;
    }>;
    certifications: Array<{
      name: string;
      issuing_body: string;
      credential_id?: string;
      date_issued: string;
      document_url?: string;
    }>;
  };
  teaching_info: {
    skills_to_teach: string[];
    teaching_philosophy: string;
    sample_lesson_plan?: string;
  };
  media: {
    intro_video_url?: string;
    portfolio_items: Array<{
      type: 'image' | 'video' | 'document';
      url: string;
      title: string;
      description?: string;
    }>;
  };
  social_links: {
    linkedin?: string;
    youtube?: string;
    website?: string;
    portfolio?: string;
  };
}

// Course Creation Form
export interface CourseFormData {
  basic_info: {
    title: string;
    description: string;
    skill_id: string;
    sub_skill_id?: string;
    language_taught: string;
    target_audience: string;
  };
  pricing: {
    price: number;
    currency: string;
  };
  content: {
    what_you_will_learn: string[];
    prerequisites: string[];
    course_thumbnail_url?: string;
  };
  modules: Array<{
    title: string;
    description: string;
    order_index: number;
    lessons: Array<{
      learning_content_id: string;
      lesson_title: string;
      order_index: number;
      is_free_preview: boolean;
    }>;
  }>;
}

// Class Creation Form
export interface ClassFormData {
  basic_info: {
    title: string;
    description: string;
    skill_id: string;
    sub_skill_id?: string;
    class_type: 'one_on_one' | 'group' | 'workshop' | 'event';
  };
  scheduling: {
    duration_minutes: number;
    language_of_instruction: string;
    max_students?: number;
  };
  pricing: {
    base_price: number;
    currency: string;
  };
  meeting: {
    meeting_platform: 'Zoom' | 'Google Meet' | 'SkillBox Virtual Room';
    meeting_link?: string;
    meeting_password?: string;
  };
  media: {
    class_thumbnail_url?: string;
  };
}

// Content Upload Form
export interface ContentUploadFormData {
  basic_info: {
    title: string;
    description: string;
    content_type: 'video' | 'document' | 'quiz' | 'resource';
    skill_id: string;
    sub_skill_id?: string;
    skill_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  content: {
    content_url?: string;
    thumbnail_url?: string;
    duration_minutes?: number;
    tags: string[];
  };
  quiz_data?: {
    questions: Array<{
      question_text: string;
      question_type: 'multiple_choice' | 'true_false' | 'short_answer';
      options?: Array<{id: string; text: string}>;
      correct_answer: any;
      explanation?: string;
    }>;
  };
}
