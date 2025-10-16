// ===================================================================
// AUTH & USER TYPE DEFINITIONS
// ===================================================================

import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface AuthUser extends SupabaseUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    [key: string]: any;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  profile_image_url?: string;
  bio?: string;
  role: UserRole;
  creator_status?: string;
  date_of_birth?: string;
  phone_number?: string;
  country?: string;
  state_province?: string;
  city?: string;
  postal_code?: string;
  timezone: string;
  preferred_language: string;
  preferred_currency: CurrencyCode;
  learning_style: LearningStyle;
  is_verified: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_online: boolean;
  last_seen_at?: string;
  onboarding_completed: boolean;
  onboarding_data: Record<string, any>;
  preferences: UserPreferences;
  notification_settings: NotificationSettings;
  privacy_settings: PrivacySettings;
  accessibility_settings: AccessibilitySettings;
  device_info: Record<string, any>;
  
  // AI & Personalization
  ai_preferences: Record<string, any>;
  learning_goals: Record<string, any>;
  skill_interests: string[];
  learning_path_id?: string;
  
  // Gamification
  total_points: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  
  // Statistics
  total_earnings: number;
  total_students: number;
  total_courses_created: number;
  total_content_created: number;
  average_rating: number;
  total_reviews: number;
  total_hours_taught: number;
  
  // Enterprise
  enterprise_id?: string;
  department?: string;
  employee_id?: string;
  manager_id?: string;
  
  // Security
  two_factor_enabled: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export type UserRole = 
  | 'student' 
  | 'teacher' 
  | 'both'
  | 'creator' 
  | 'teacher_approved' 
  | 'admin_content' 
  | 'admin_teacher_ops' 
  | 'admin_super'
  | 'enterprise_admin';

export type LearningStyle = 
  | 'visual' 
  | 'auditory' 
  | 'kinesthetic' 
  | 'reading' 
  | 'multimodal';

export type CurrencyCode = 
  | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' 
  | 'CAD' | 'CHF' | 'CNY' | 'INR' | 'BRL';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: CurrencyCode;
  timezone: string;
  auto_play_videos: boolean;
  download_over_wifi_only: boolean;
  offline_content_quality: 'low' | 'medium' | 'high';
  subtitle_language?: string;
  subtitle_size: 'small' | 'medium' | 'large';
  playback_speed: number;
  email_digest_frequency: 'daily' | 'weekly' | 'monthly' | 'never';
  content_discovery_enabled: boolean;
  ai_recommendations_enabled: boolean;
  social_features_enabled: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  in_app: boolean;
  
  // Specific notification types
  class_reminders: boolean;
  assignment_due: boolean;
  new_courses: boolean;
  achievement_unlocked: boolean;
  social_activity: boolean;
  promotional: boolean;
  system_updates: boolean;
  teacher_updates: boolean;
  
  // Timing preferences
  quiet_hours_start?: string; // HH:MM format
  quiet_hours_end?: string;
  weekend_notifications: boolean;
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'friends' | 'private';
  activity_visibility: 'public' | 'friends' | 'private';
  location_sharing: boolean;
  achievement_sharing: boolean;
  progress_sharing: boolean;
  online_status_visible: boolean;
  allow_friend_requests: boolean;
  allow_messages_from: 'anyone' | 'friends' | 'teachers' | 'none';
  show_in_search: boolean;
  data_sharing_consent: boolean;
  analytics_consent: boolean;
  marketing_consent: boolean;
}

export interface AccessibilitySettings {
  high_contrast: boolean;
  large_text: boolean;
  reduce_motion: boolean;
  screen_reader_enabled: boolean;
  voice_control_enabled: boolean;
  subtitle_always_on: boolean;
  color_blind_friendly: boolean;
  focus_indicators_enhanced: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  
  // OAuth
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  
  // MFA
  enableTwoFactor: () => Promise<string>; // Returns QR code
  verifyTwoFactor: (token: string) => Promise<void>;
  disableTwoFactor: (token: string) => Promise<void>;
  
  // Biometric
  enableBiometric: () => Promise<void>;
  authenticateWithBiometric: () => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface UserOnboardingData {
  bio?: string;
  location?: string;
  skills?: string[];
  teachingSkills?: string[];
  interests?: string[];
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  learningGoals?: string[];
  timeCommitment?: 'casual' | 'regular' | 'intensive';
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  agreedToTerms: boolean;
  marketingConsent?: boolean;
}

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ResetPasswordData {
  email: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface OnboardingData {
  step: number;
  completed_steps: string[];
  user_type: 'student' | 'teacher' | 'both';
  interests: string[];
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  learning_goals: string[];
  preferred_content_types: string[];
  time_commitment: 'casual' | 'regular' | 'intensive';
  notification_preferences: Partial<NotificationSettings>;
  privacy_preferences: Partial<PrivacySettings>;
  accessibility_needs: Partial<AccessibilitySettings>;
}

export interface TeacherApplication {
  id: string;
  user_id: string;
  application_data: {
    teaching_experience: string;
    education_background: string;
    specializations: string[];
    certifications: Array<{
      name: string;
      issuer: string;
      date_earned: string;
      verification_url?: string;
    }>;
    portfolio_url?: string;
    demo_video_url?: string;
    motivation: string;
    sample_lesson_plan?: string;
    references: Array<{
      name: string;
      position: string;
      contact: string;
      relationship: string;
    }>;
  };
  status: 'pending_review' | 'under_review' | 'interview_scheduled' | 'approved' | 'rejected';
  reviewer_id?: string;
  reviewed_at?: string;
  interview_scheduled_at?: string;
  interview_completed_at?: string;
  interview_notes?: string;
  verification_status: 'pending' | 'in_progress' | 'verified' | 'failed';
  background_check_status: 'pending' | 'in_progress' | 'passed' | 'failed';
  notes?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: 'bearer';
  user: AuthUser;
}

// Authentication Errors
export interface AuthError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Security Events
export interface SecurityEvent {
  id: string;
  user_id: string;
  event_type: 'login' | 'logout' | 'password_change' | 'profile_update' | 'failed_login' | 'suspicious_activity';
  ip_address: string;
  user_agent: string;
  location?: {
    country?: string;
    city?: string;
    coordinates?: [number, number];
  };
  metadata: Record<string, any>;
  created_at: string;
}
