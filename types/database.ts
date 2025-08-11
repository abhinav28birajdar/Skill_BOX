// Database Types for SkillBox Application - Consolidated Schema

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// Core enums
export type UserRole = 'student' | 'teacher' | 'creator' | 'learner' | 'teacher_approved' | 'teacher_pending' | 'admin_content' | 'admin_teacher_ops' | 'admin_super'
export type ContentType = 'video' | 'audio' | 'document' | 'documentation' | 'quiz' | 'assignment' | 'live_stream' | 'article' | 'workshop'
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'processing' | 'disputed' | 'cancelled'
export type NotificationType = 'class_reminder' | 'new_message' | 'course_update' | 'achievement' | 'payment' | 'system' | 'booking_update' | 'content_status_update' | 'review_received' | 'assignment_graded' | 'admin_announcement'
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'failed' | 'mastered'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      teacher_profiles: {
        Row: TeacherProfile
        Insert: Omit<TeacherProfile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<TeacherProfile, 'user_id' | 'created_at' | 'updated_at'>>
      }
      skills: {
        Row: Skill
        Insert: Omit<Skill, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>
      }
      learning_content: {
        Row: LearningContent
        Insert: Omit<LearningContent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<LearningContent, 'id' | 'created_at' | 'updated_at'>>
      }
      courses: {
        Row: Course
        Insert: Omit<Course, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>
      }
      course_modules: {
        Row: CourseModule
        Insert: Omit<CourseModule, 'id' | 'created_at'>
        Update: Partial<Omit<CourseModule, 'id' | 'created_at'>>
      }
      course_lessons: {
        Row: CourseLesson
        Insert: Omit<CourseLesson, 'id' | 'created_at'>
        Update: Partial<Omit<CourseLesson, 'id' | 'created_at'>>
      }
      course_enrollments: {
        Row: CourseEnrollment
        Insert: Omit<CourseEnrollment, 'id' | 'created_at'>
        Update: Partial<Omit<CourseEnrollment, 'id' | 'created_at'>>
      }
      user_progress: {
        Row: UserProgress
        Insert: Omit<UserProgress, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProgress, 'id' | 'created_at' | 'updated_at'>>
      }
      user_follows: {
        Row: UserFollow
        Insert: Omit<UserFollow, 'id' | 'created_at'>
        Update: Partial<Omit<UserFollow, 'id' | 'created_at'>>
      }
      comments: {
        Row: Comment
        Insert: Omit<Comment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Comment, 'id' | 'created_at' | 'updated_at'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at'>
        Update: Partial<Omit<Review, 'id' | 'created_at'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at'>
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>
      }
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, 'id' | 'created_at'>
        Update: Partial<Omit<Transaction, 'id' | 'created_at'>>
      }
    }
  }
}

// Core entity interfaces matching consolidated schema
export interface User {
  id: string
  email: string
  full_name: string | null
  username: string | null
  profile_image_url: string | null
  bio: string | null
  role: UserRole
  creator_status?: 'pending_review' | 'approved' | 'rejected' | 'not_creator'
  phone_number: string | null
  country: string | null
  timezone: string
  preferred_language: string
  is_verified: boolean
  is_active: boolean
  last_seen_at: string | null
  preferences: Json
  notification_settings: Json
  privacy_settings: Json
  total_points: number
  current_streak: number
  longest_streak: number
  // Additional properties for teacher profiles
  total_students?: number
  average_rating?: number
  years_experience?: number
  teaching_skills?: string[]
  created_at: string
  updated_at: string
}

export interface TeacherProfile {
  user_id: string
  professional_title: string | null
  years_of_experience: number
  education: string[] | null
  certifications: string[] | null
  specializations: string[] | null
  languages_spoken: string[] | null
  hourly_rate: number | null
  intro_video_url: string | null
  portfolio_url: string | null
  social_links: Json
  average_rating: number
  total_reviews: number
  total_students: number
  total_earnings: number
  total_hours_taught: number
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  description: string | null
  category: string | null
  image_url: string | null
  color_code: string | null
  difficulty_level: SkillLevel
  popularity_score: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LearningContent {
  id: string
  creator_id: string | null
  title: string
  description: string | null
  content_type: ContentType
  type: ContentType // Alias for content_type for backward compatibility
  content_url: string | null
  thumbnail_url: string | null
  skill_id: string | null
  difficulty_level: SkillLevel
  duration_minutes: number | null
  tags: string[] | null
  is_premium: boolean
  price: number
  views_count: number
  likes_count: number
  average_rating: number
  is_published: boolean
  status?: 'draft' | 'published' | 'archived' | 'rejected' // Status field for content management
  rejection_reason?: string
  skills?: { name: string, id: string }
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  creator_id: string | null
  title: string
  description: string | null
  course_thumbnail_url: string | null
  skill_id: string | null
  price: number
  difficulty_level: SkillLevel
  estimated_duration_hours: number | null
  enrollment_count: number
  completion_rate: number
  average_rating: number
  is_published: boolean
  status?: 'draft' | 'published' | 'archived' // Status field for course management
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface CourseModule {
  id: string
  course_id: string
  title: string
  description: string | null
  sort_order: number
  is_published: boolean
  created_at: string
}

export interface CourseLesson {
  id: string
  module_id: string
  content_id: string | null
  title: string
  description: string | null
  sort_order: number
  is_preview: boolean
  created_at: string
}

export interface CourseEnrollment {
  id: string
  student_id: string
  course_id: string
  progress_percentage: number
  completed_at: string | null
  last_accessed_at: string | null
  status?: 'active' | 'completed' | 'dropped' // Status field for enrollment management
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  content_id: string
  progress_status: ProgressStatus
  progress_percentage: number
  time_spent_seconds: number
  last_position_seconds: number
  completed_at: string | null
  entity_type?: 'course' | 'content' | 'lesson' // Type of entity being tracked
  created_at: string
  updated_at: string
}

export interface UserFollow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface Comment {
  id: string
  user_id: string
  content_id: string
  parent_comment_id: string | null
  comment_text: string
  likes_count: number
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  user_id: string
  course_id: string | null
  content_id: string | null
  rating: number
  review_text: string | null
  helpful_count: number
  entity_type?: 'course' | 'content' | 'class' | 'teacher' // Type of entity being reviewed
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  notification_type: NotificationType // Alias for type for backward compatibility
  data: Json | null
  is_read: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  course_id: string | null
  content_id: string | null
  amount: number
  status: PaymentStatus
  provider_transaction_id: string | null
  created_at: string
  completed_at: string | null
}

// Extended types with relations
export interface UserWithProfile extends User {
  teacher_profile?: TeacherProfile
}

export interface LearningContentWithDetails extends LearningContent {
  creator?: User
  teacher?: User // Alias for creator for backward compatibility
  skill?: Skill
  rating_avg?: number // For rating display
}

export interface CourseWithDetails extends Course {
  creator?: User
  skill?: Skill
  modules?: CourseModule[]
}

export interface CourseModuleWithLessons extends CourseModule {
  lessons?: CourseLesson[]
}

export interface CourseEnrollmentWithDetails extends CourseEnrollment {
  course?: Course
  student?: User
}

// API Response types
export interface ApiResponse<T = any> {
  data: T | null
  error: any
  count?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

// Form types
export interface SignUpData {
  email: string
  password: string
  username?: string
  full_name?: string
  role?: UserRole
}

export interface SignInData {
  email: string
  password: string
}

export interface UserProfileUpdate {
  full_name?: string
  username?: string
  bio?: string
  profile_image_url?: string
  phone_number?: string
  country?: string
  preferences?: Json
  role?: UserRole
  creator_status?: 'pending_review' | 'approved' | 'rejected' | 'not_creator'
}

export interface TeacherProfileUpdate {
  professional_title?: string
  years_of_experience?: number
  education?: string[]
  certifications?: string[]
  specializations?: string[]
  hourly_rate?: number
  intro_video_url?: string
  portfolio_url?: string
}

// Search and filter types
export interface SearchFilters {
  query?: string
  skill_id?: string
  sub_skill_id?: string // For backward compatibility
  difficulty_level?: SkillLevel
  skill_level?: SkillLevel // Alias for difficulty_level
  content_type?: ContentType
  price_range?: [number, number]
  rating_min?: number
  language?: string // Language filter
  sort_by?: 'created_at' | 'rating' | 'price' | 'views_count' | 'popularity'
  sort_order?: 'asc' | 'desc'
}

// Component prop types
export interface BaseProps {
  className?: string
  children?: React.ReactNode
}

export interface CardProps extends BaseProps {
  title: string
  description?: string
  imageUrl?: string
  onPress?: () => void
}

export interface ButtonProps extends BaseProps {
  title: string
  onPress?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

export interface InputProps extends BaseProps {
  label?: string
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  secureTextEntry?: boolean
  error?: string
  required?: boolean
}

// Auth context types
export interface AuthContextType {
  user: User | null
  isCreator: boolean
  loading: boolean
  signUp: (data: SignUpData) => Promise<{ error?: string }>
  signIn: (data: SignInData) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: UserProfileUpdate) => Promise<{ error?: string }>
}

// Additional missing types for services compatibility
export interface TeacherApplication {
  id: string
  user_id: string
  application_data: Json
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: string
  notes?: string
}

export interface Class {
  id: string
  title: string
  description: string
  teacher_id: string
  skill_id: string
  duration_minutes: number
  price: number
  max_students: number
  status: 'draft' | 'published' | 'cancelled'
  class_type: 'one-on-one' | 'group' | 'workshop' | 'webinar'
  base_price: number
  created_at: string
  updated_at: string
}

export interface ClassBooking {
  id: string
  class_id: string
  student_id: string
  teacher_id: string
  scheduled_at: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
}

export interface ClassSession {
  id: string
  class_booking_id: string
  started_at?: string
  ended_at?: string
  duration_minutes?: number
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
}

export interface ClassWithDetails extends Class {
  teacher: TeacherProfile
  skill: Skill
  bookings?: ClassBooking[]
}

export interface TeacherAvailabilitySlot {
  id: string
  teacher_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
}

export interface TeacherBlockedDate {
  id: string
  teacher_id: string
  blocked_date: string
  reason?: string
}

export interface ContentQA {
  id: string
  content_id: string
  user_id: string
  question: string
  created_at: string
}

export interface ContentQAAnswer {
  id: string
  question_id: string
  user_id: string
  answer: string
  created_at: string
}

export interface Assignment {
  id: string
  course_id: string
  module_id?: string
  lesson_id?: string
  title: string
  description: string
  instructions: string
  due_date?: string
  points: number
  created_at: string
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  description?: string
  content_id?: string
  order_index: number
  created_at: string
}

export interface Module {
  id: string
  course_id: string
  title: string
  description?: string
  order_index: number
  created_at: string
}

export interface StudentSubmission {
  id: string
  assignment_id: string
  student_id: string
  content: string
  submitted_at: string
  grade?: number
  feedback?: string
  graded_at?: string
  graded_by?: string
}

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  message_type: 'text' | 'file' | 'image' | 'video'
  file_url?: string
  read_at?: string
  created_at: string
}
