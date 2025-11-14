// ===================================================================
// CORE DATABASE MODEL TYPE DEFINITIONS
// ===================================================================

export type ClassType = 
  | 'one_on_one' 
  | 'group' 
  | 'workshop' 
  | 'masterclass' 
  | 'webinar'
  | 'ar_session'
  | 'vr_session'
  | 'hybrid';

export type SkillLevel = 
  | 'beginner' 
  | 'intermediate' 
  | 'advanced' 
  | 'expert' 
  | 'master';

export type PaymentStatus = 
  | 'pending' 
  | 'completed' 
  | 'failed' 
  | 'refunded' 
  | 'processing'
  | 'disputed'
  | 'cancelled';

export type SubscriptionStatus = 
  | 'active' 
  | 'cancelled' 
  | 'expired' 
  | 'paused' 
  | 'trial'
  | 'pending_cancellation';

export type ProgressStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'completed' 
  | 'paused' 
  | 'failed'
  | 'mastered';

export type ContentStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'approved' 
  | 'rejected' 
  | 'archived'
  | 'flagged'
  | 'under_revision';

export type MeetingPlatform = 
  | 'zoom' 
  | 'google_meet' 
  | 'teams' 
  | 'discord' 
  | 'custom' 
  | 'jitsi'
  | 'agora'
  | 'twilio'
  | 'webrtc_native';

export type DeviceType = 
  | 'mobile' 
  | 'tablet' 
  | 'desktop' 
  | 'ar_headset' 
  | 'vr_headset' 
  | 'smart_tv';

export type AssignmentType = 
  | 'written' 
  | 'video' 
  | 'audio' 
  | 'project' 
  | 'peer_review' 
  | 'quiz' 
  | 'presentation'
  | 'portfolio';

export type TierType = 
  | 'free' 
  | 'basic' 
  | 'premium' 
  | 'enterprise' 
  | 'unlimited';

// ===================================================================
// SKILLS & CATEGORIES
// ===================================================================


export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
  icon_url?: string;
  color_code?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Skill {
  id: string;
  category_id: string;
  category?: SkillCategory;
  name: string;
  description?: string;
  icon_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  skill?: Skill;
  proficiency_level: SkillLevel;
  is_teaching: boolean;
  verified_at?: string;
  created_at: string;
}

export interface SkillMastery {
  id: string;
  user_id: string;
  skill_id: string;
  skill?: Skill;
  mastery_level: SkillLevel;
  progress_percentage: number;
  total_hours_practiced: number;
  assessments_passed: number;
  projects_completed: number;
  peer_endorsements: number;
  teacher_verifications: number;
  last_practiced_at?: string;
  mastered_at?: string;
  created_at: string;
  updated_at: string;
}

// ===================================================================
// LEARNING CONTENT
// ===================================================================

export interface LearningContent {
  id: string;
  creator_id: string;
  creator?: UserProfile;
  title: string;
  description?: string;
  content_type: ContentType;
  content_url?: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  file_size_bytes?: number;
  skill_id?: string;
  skill?: Skill;
  difficulty_level: SkillLevel;
  tags: string[];
  is_free: boolean;
  price: number;
  currency: string;
  is_published: boolean;
  content_status: ContentStatus;
  published_at?: string;
  views_count: number;
  likes_count: number;
  downloads_count: number;
  average_rating: number;
  
  // Related data
  quiz_questions?: QuizQuestion[];
  translations?: ContentTranslation[];
  interactive_elements?: InteractiveElement[];
  immersive_metadata?: ImmersiveContentMetadata;
  
  created_at: string;
  updated_at: string;
}

export interface ContentTranslation {
  id: string;
  source_content_id: string;
  language_code: string;
  title?: string;
  description?: string;
  content_body?: string;
  subtitle_url?: string;
  audio_track_url?: string;
  translated_by?: string;
  translation_quality_score: number;
  is_ai_generated: boolean;
  is_human_reviewed: boolean;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  content_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'matching' | 'fill_blank';
  options?: Array<{
    id: string;
    text: string;
    is_correct?: boolean;
    explanation?: string;
  }>;
  correct_answer: string;
  explanation?: string;
  points: number;
  sort_order: number;
  created_at: string;
}

export interface ImmersiveContentMetadata {
  content_id: string;
  content_format: 'ar_overlay' | 'vr_360' | 'vr_interactive' | '3d_model';
  supported_devices: DeviceType[];
  minimum_space_requirements?: Record<string, any>;
  interaction_types: ('gaze' | 'gesture' | 'voice' | 'controller')[];
  
  // 3D/AR specific
  model_file_url?: string;
  texture_urls?: string[];
  animation_urls?: string[];
  
  // VR specific
  scene_file_url?: string;
  environment_type?: string;
  movement_type?: 'stationary' | 'room_scale' | 'teleport';
  
  // Technical requirements
  min_device_specs?: Record<string, any>;
  file_size_mb: number;
  download_size_mb: number;
  
  created_at: string;
  updated_at: string;
}

export interface InteractiveElement {
  id: string;
  content_id: string;
  element_type: 'hotspot' | 'quiz_popup' | 'annotation' | 'branching_scenario';
  position_data: Record<string, any>; // coordinates, timing, etc.
  content_data: Record<string, any>;
  trigger_conditions: Record<string, any>;
  is_mandatory: boolean;
  sort_order: number;
  created_at: string;
}

// ===================================================================
// COURSES & MODULES
// ===================================================================

export interface Course {
  id: string;
  creator_id: string;
  creator?: UserProfile;
  title: string;
  description?: string;
  course_thumbnail_url?: string;
  skill_id?: string;
  skill?: Skill;
  difficulty_level: SkillLevel;
  estimated_duration_hours?: number;
  price: number;
  currency: string;
  is_published: boolean;
  published_at?: string;
  enrollment_count: number;
  completion_rate: number;
  average_rating: number;
  
  // Related data
  modules?: CourseModule[];
  enrollments?: CourseEnrollment[];
  translations?: CourseTranslation[];
  assignments?: Assignment[];
  
  created_at: string;
  updated_at: string;
}

export interface CourseTranslation {
  id: string;
  source_course_id: string;
  language_code: string;
  title?: string;
  description?: string;
  learning_objectives?: string[];
  course_outline?: string;
  translated_by?: string;
  is_ai_generated: boolean;
  is_human_reviewed: boolean;
  created_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  sort_order: number;
  is_published: boolean;
  lessons?: CourseLesson[];
  created_at: string;
}

export interface CourseLesson {
  id: string;
  module_id: string;
  content_id?: string;
  content?: LearningContent;
  title: string;
  description?: string;
  sort_order: number;
  is_preview: boolean;
  created_at: string;
}

export interface CourseEnrollment {
  id: string;
  student_id: string;
  student?: UserProfile;
  course_id: string;
  course?: Course;
  enrolled_at: string;
  progress_percentage: number;
  completed_at?: string;
  last_accessed_at?: string;
  certificate_earned?: boolean;
  certificate_url?: string;
}

// ===================================================================
// ASSIGNMENTS & ASSESSMENTS
// ===================================================================

export interface Assignment {
  id: string;
  course_id?: string;
  lesson_id?: string;
  creator_id: string;
  creator?: UserProfile;
  title: string;
  description?: string;
  instructions?: string;
  assignment_type: AssignmentType;
  max_points: number;
  due_date?: string;
  submission_format: ('text' | 'file' | 'video' | 'audio' | 'link')[];
  max_file_size_mb: number;
  allowed_file_types?: string[];
  is_peer_reviewed: boolean;
  peer_review_count: number;
  auto_grading_enabled: boolean;
  grading_rubric?: Record<string, any>;
  late_submission_policy: Record<string, any>;
  is_published: boolean;
  
  submissions?: AssignmentSubmission[];
  
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  assignment?: Assignment;
  student_id: string;
  student?: UserProfile;
  submission_text?: string;
  file_urls?: string[];
  submission_data?: Record<string, any>;
  submitted_at: string;
  is_late: boolean;
  
  // Grading
  grade?: number;
  max_grade?: number;
  percentage?: number;
  feedback?: string;
  graded_by?: string;
  grader?: UserProfile;
  graded_at?: string;
  
  // AI Grading
  ai_grade?: number;
  ai_feedback?: string;
  ai_confidence_score?: number;
  human_review_requested: boolean;
  
  status: 'submitted' | 'graded' | 'returned' | 'revision_requested';
  
  peer_reviews?: PeerReview[];
}

export interface PeerReview {
  id: string;
  submission_id: string;
  submission?: AssignmentSubmission;
  reviewer_id: string;
  reviewer?: UserProfile;
  score: number;
  feedback?: string;
  criteria_scores?: Record<string, number>;
  is_helpful?: boolean;
  helpful_votes: number;
  submitted_at: string;
}

// ===================================================================
// LIVE CLASSES
// ===================================================================

export interface LiveClass {
  id: string;
  teacher_id: string;
  teacher?: UserProfile;
  title: string;
  description?: string;
  skill_id?: string;
  skill?: Skill;
  class_type: ClassType;
  difficulty_level: SkillLevel;
  duration_minutes: number;
  max_students: number;
  price: number;
  currency: string;
  meeting_platform: MeetingPlatform;
  meeting_url?: string;
  meeting_id?: string;
  meeting_password?: string;
  is_recurring: boolean;
  recurrence_pattern?: Record<string, any>;
  is_published: boolean;
  
  sessions?: ClassSession[];
  
  created_at: string;
  updated_at: string;
}

export interface ClassSession {
  id: string;
  class_id: string;
  class?: LiveClass;
  scheduled_start_time: string;
  scheduled_end_time: string;
  actual_start_time?: string;
  actual_end_time?: string;
  max_students?: number;
  enrolled_students: number;
  meeting_url?: string;
  recording_url?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  
  bookings?: ClassBooking[];
  
  created_at: string;
}

export interface ClassBooking {
  id: string;
  session_id: string;
  session?: ClassSession;
  student_id: string;
  student?: UserProfile;
  booking_time: string;
  payment_status: PaymentStatus;
  payment_id?: string;
  amount_paid: number;
  currency: string;
  attended: boolean;
  rating?: number;
  feedback?: string;
  created_at: string;
}

// ===================================================================
// USER PROGRESS & ANALYTICS
// ===================================================================

export interface UserProgress {
  id: string;
  user_id: string;
  content_id: string;
  content?: LearningContent;
  progress_status: ProgressStatus;
  progress_percentage: number;
  time_spent_seconds: number;
  last_position_seconds: number;
  completed_at?: string;
  first_accessed_at: string;
  last_accessed_at: string;
  
  // Learning insights
  engagement_score?: number;
  difficulty_rating?: number;
  notes?: string;
  bookmarked_at?: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  content_id: string;
  content?: LearningContent;
  score: number;
  max_score: number;
  percentage: number;
  answers: Record<string, any>;
  completed_at: string;
  time_taken_seconds: number;
  
  // Analytics
  question_analytics?: Array<{
    question_id: string;
    correct: boolean;
    time_spent: number;
    attempts: number;
  }>;
}

// ===================================================================
// SOCIAL & COMMUNITY FEATURES
// ===================================================================

export interface UserFollow {
  id: string;
  follower_id: string;
  follower?: UserProfile;
  following_id: string;
  following?: UserProfile;
  created_at: string;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewer?: UserProfile;
  reviewee_id?: string;
  reviewee?: UserProfile;
  content_id?: string;
  content?: LearningContent;
  course_id?: string;
  course?: Course;
  class_id?: string;
  class?: LiveClass;
  rating: number;
  review_text?: string;
  is_verified: boolean;
  is_published: boolean;
  helpful_count: number;
  
  // Review metadata
  verified_purchase?: boolean;
  completion_status?: ProgressStatus;
  
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  user?: UserProfile;
  content_id: string;
  content?: LearningContent;
  parent_comment_id?: string;
  parent_comment?: Comment;
  comment_text: string;
  timestamp_seconds?: number;
  likes_count: number;
  replies_count: number;
  is_pinned: boolean;
  replies?: Comment[];
  created_at: string;
  updated_at: string;
}

// ===================================================================
// PORTFOLIO & SHOWCASE
// ===================================================================

export interface PortfolioItem {
  id: string;
  user_id: string;
  user?: UserProfile;
  title: string;
  description?: string;
  item_type: 'project' | 'assignment' | 'certificate' | 'media';
  content_urls: string[];
  thumbnail_url?: string;
  skills_demonstrated: string[];
  course_id?: string;
  course?: Course;
  assignment_id?: string;
  assignment?: Assignment;
  is_featured: boolean;
  is_public: boolean;
  display_order: number;
  metadata: Record<string, any>;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}

export interface ContentCollection {
  id: string;
  creator_id: string;
  creator?: UserProfile;
  title: string;
  description?: string;
  thumbnail_url?: string;
  is_public: boolean;
  is_featured: boolean;
  content_count: number;
  total_duration_seconds: number;
  difficulty_level?: SkillLevel;
  tags: string[];
  view_count: number;
  like_count: number;
  bookmark_count: number;
  
  items?: CollectionItem[];
  
  created_at: string;
  updated_at: string;
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  content_id?: string;
  content?: LearningContent;
  course_id?: string;
  course?: Course;
  sort_order: number;
  added_by: string;
  notes?: string;
  added_at: string;
}

// ===================================================================
// MESSAGING & NOTIFICATIONS
// ===================================================================

export interface Conversation {
  id: string;
  title?: string;
  is_group: boolean;
  created_by: string;
  creator?: UserProfile;
  last_message_at: string;
  last_message?: Message;
  participants?: ConversationParticipant[];
  unread_count?: number;
  created_at: string;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  user?: UserProfile;
  joined_at: string;
  left_at?: string;
  role: 'admin' | 'moderator' | 'member';
  last_read_message_id?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  conversation?: Conversation;
  sender_id: string;
  sender?: UserProfile;
  content: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'system';
  file_url?: string;
  reply_to_id?: string;
  reply_to?: Message;
  is_edited: boolean;
  is_deleted: boolean;
  read_by: Record<string, string>; // user_id -> timestamp
  reactions?: Record<string, string[]>; // emoji -> user_ids
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  data?: Record<string, any>;
  is_read: boolean;
  is_deleted: boolean;
  action_url?: string;
  image_url?: string;
  created_at: string;
}

// ===================================================================
// SEARCH & FILTERS
// ===================================================================

export interface SearchFilters {
  query?: string;
  content_types?: ContentType[];
  skill_categories?: string[];
  skills?: string[];
  difficulty_levels?: SkillLevel[];
  price_range?: {
    min: number;
    max: number;
  };
  duration_range?: {
    min_minutes: number;
    max_minutes: number;
  };
  language?: string;
  rating_min?: number;
  is_free?: boolean;
  has_certificate?: boolean;
  created_after?: string;
  created_before?: string;
  sort_by?: 'relevance' | 'rating' | 'popularity' | 'newest' | 'price_low' | 'price_high';
  sort_order?: 'asc' | 'desc';
}

export interface SearchResult<T = any> {
  items: T[];
  total_count: number;
  page: number;
  page_size: number;
  has_more: boolean;
  filters_applied: SearchFilters;
  suggestions?: string[];
  facets?: Record<string, Array<{ value: string; count: number }>>;
}

// ===================================================================
// UTILITY TYPES
// ===================================================================

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_previous: boolean;
  has_next: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    request_id: string;
    [key: string]: any;
  };
}

export interface FileUpload {
  id: string;
  file: File | any; // React Native compatible
  name: string;
  size: number;
  type: string;
  url?: string;
  upload_progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

export interface MediaAsset {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document' | '3d_model';
  filename: string;
  file_size: number;
  mime_type: string;
  duration_seconds?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  thumbnail_url?: string;
  alt_text?: string;
  created_at: string;
}

// ===================================================================
// MISSING TYPE DEFINITIONS FOR ENHANCED SCREENS
// ===================================================================

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  date_of_birth?: string;
  phone?: string;
  is_creator: boolean;
  is_verified: boolean;
  is_premium: boolean;
  display_name?: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

export interface User extends UserProfile {}

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'link' | 'poll' | 'question' | 'resource';
  images?: string[];
  video_url?: string;
  link_url?: string;
  link_title?: string;
  link_description?: string;
  link_image?: string;
  poll_options?: string[];
  poll_votes?: { [option: string]: number };
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked?: boolean;
  is_liked_by_user?: boolean;
  is_bookmarked?: boolean;
  tags?: string[];
  location?: string;
  visibility: 'public' | 'followers' | 'private';
  created_at: string;
  updated_at: string;
  user?: UserProfile;
  author?: UserProfile;
}

export interface Achievement {
  id: string;
  name: string;
  title?: string;
  description: string;
  icon_url?: string;
  badge_url?: string;
  category: 'learning' | 'social' | 'teaching' | 'milestone' | 'special';
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlock_criteria: {
    type: string;
    target: number;
    current?: number;
  };
  is_unlocked?: boolean;
  unlocked_at?: string;
  progress_percentage?: number;
  created_at: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  category_id: string;
  category?: SkillCategory;
  difficulty_level: SkillLevel;
  estimated_duration_hours: number;
  course_ids: string[];
  courses?: Course[];
  prerequisites?: string[];
  learning_objectives: string[];
  completion_criteria: {
    min_course_completion: number;
    min_quiz_score?: number;
    assignments_required?: boolean;
  };
  enrollment_count: number;
  completion_count: number;
  rating: number;
  reviews_count: number;
  is_premium: boolean;
  price?: number;
  currency?: string;
  created_by: string;
  creator?: UserProfile;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  total_courses?: number;
}

export interface SearchFilters {
  category?: string;
  skill_level?: SkillLevel;
  content_type?: ContentType;
  price_range?: {
    min: number;
    max: number;
  };
  rating_min?: number;
  duration_range?: {
    min: number;
    max: number;
  };
  language?: string;
  has_certification?: boolean;
  is_live?: boolean;
  sort_by?: 'relevance' | 'rating' | 'popularity' | 'newest' | 'price_low' | 'price_high';
}
