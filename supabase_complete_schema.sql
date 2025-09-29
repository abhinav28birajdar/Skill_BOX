-- SkillBox Complete Database Schema
-- Production-ready PostgreSQL schema for learning management system
-- Compatible with Supabase

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Custom types and enums
CREATE TYPE user_role AS ENUM (
  'student',
  'creator', 
  'teacher_approved',
  'teacher_pending',
  'admin_content',
  'admin_teacher_ops',
  'admin_super',
  'learner'
);

CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'pro');
CREATE TYPE skill_category AS ENUM (
  'design',
  'development', 
  'business',
  'marketing',
  'photography',
  'music',
  'health',
  'language',
  'other'
);
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE content_type AS ENUM ('video', 'text', 'audio', 'interactive', 'project');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('stripe', 'paypal', 'razorpay', 'google_pay', 'apple_pay');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'expired', 'refunded');
CREATE TYPE notification_type AS ENUM (
  'learning_reminder',
  'assignment_due', 
  'live_class',
  'achievement',
  'system',
  'marketing'
);

-- User Profiles Table (Primary user data)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  role user_role DEFAULT 'student',
  bio TEXT,
  location TEXT,
  website TEXT,
  linkedin TEXT,
  twitter TEXT,
  github TEXT,
  profile_image_url TEXT,
  banner_image_url TEXT,
  skills TEXT[],
  interests TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  agreed_to_terms BOOLEAN DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_completed_at TIMESTAMP WITH TIME ZONE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  marketing_notifications BOOLEAN DEFAULT FALSE,
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Categories Table
CREATE TABLE skill_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category skill_category NOT NULL,
  description TEXT,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Skills Junction Table
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skill_categories(id) ON DELETE CASCADE,
  proficiency_level skill_level DEFAULT 'beginner',
  is_teaching BOOLEAN DEFAULT FALSE,
  years_of_experience INTEGER,
  certifications TEXT[],
  portfolio_links TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Courses Table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  skill_category_id UUID REFERENCES skill_categories(id),
  level skill_level DEFAULT 'beginner',
  price DECIMAL(10,2) DEFAULT 0,
  is_free BOOLEAN DEFAULT TRUE,
  currency TEXT DEFAULT 'USD',
  thumbnail_url TEXT,
  preview_video_url TEXT,
  duration_hours INTEGER DEFAULT 0,
  language TEXT DEFAULT 'en',
  tags TEXT[],
  requirements TEXT[],
  what_you_learn TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  enrollment_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Lessons Table
CREATE TABLE course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  content_type content_type DEFAULT 'video',
  content_data JSONB,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Enrollments Table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  current_lesson_id UUID REFERENCES course_lessons(id),
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_url TEXT,
  payment_id UUID,
  access_expires_at TIMESTAMP WITH TIME ZONE,
  status enrollment_status DEFAULT 'active',
  UNIQUE(student_id, course_id)
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  subscription_type TEXT CHECK (subscription_type IN ('course', 'premium', 'pro')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method payment_method NOT NULL,
  payment_intent_id TEXT,
  status payment_status DEFAULT 'pending',
  refund_amount DECIMAL(10,2),
  refunded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Analytics Table
CREATE TABLE learning_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  session_duration_minutes INTEGER DEFAULT 0,
  focus_score INTEGER DEFAULT 0 CHECK (focus_score >= 0 AND focus_score <= 100),
  comprehension_score INTEGER DEFAULT 0 CHECK (comprehension_score >= 0 AND comprehension_score <= 100),
  engagement_level INTEGER DEFAULT 0 CHECK (engagement_level >= 0 AND engagement_level <= 100),
  preferred_learning_times TEXT[],
  learning_streak_days INTEGER DEFAULT 0,
  average_focus_score INTEGER DEFAULT 0 CHECK (average_focus_score >= 0 AND average_focus_score <= 100),
  preferred_difficulty skill_level DEFAULT 'beginner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Tutor Profiles Table
CREATE TABLE ai_tutor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  personality_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User Devices for Push Notifications
CREATE TABLE user_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  push_token TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('ios', 'android', 'windows', 'macos', 'web')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, push_token)
);

-- Notification Preferences
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  push_enabled BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  learning_reminders BOOLEAN DEFAULT TRUE,
  assignment_deadlines BOOLEAN DEFAULT TRUE,
  live_class_alerts BOOLEAN DEFAULT TRUE,
  achievement_notifications BOOLEAN DEFAULT TRUE,
  marketing_communications BOOLEAN DEFAULT FALSE,
  quiet_hours JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Notification Logs
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE
);

-- Notification Analytics
CREATE TABLE notification_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_sent INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2) DEFAULT 0,
  most_effective_times TEXT[],
  preferred_types TEXT[],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Learning Content Table
CREATE TABLE learning_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  skill_id UUID REFERENCES skill_categories(id),
  creator_id UUID REFERENCES user_profiles(id),
  type content_type NOT NULL,
  content_url TEXT,
  thumbnail_url TEXT,
  skill_level skill_level DEFAULT 'beginner',
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suggestion Interactions Table
CREATE TABLE suggestion_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  suggestion_id UUID NOT NULL,
  action TEXT NOT NULL,
  reason TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  context JSONB
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  reviewed_entity_id UUID NOT NULL,
  entity_type TEXT CHECK (entity_type IN ('teacher', 'course', 'content', 'class')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  flagged_reason TEXT,
  teacher_response_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_skill_category ON courses(skill_category_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_learning_analytics_user ON learning_analytics(user_id);
CREATE INDEX idx_course_lessons_course ON course_lessons(course_id);
CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_notification_logs_user ON notification_logs(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies for courses
CREATE POLICY "Published courses are viewable by everyone" ON courses
  FOR SELECT USING (status = 'published');

CREATE POLICY "Instructors can manage their own courses" ON courses
  FOR ALL USING (auth.uid()::text = instructor_id::text);

-- RLS Policies for enrollments
CREATE POLICY "Students can view their own enrollments" ON enrollments
  FOR SELECT USING (auth.uid()::text = student_id::text);

CREATE POLICY "Instructors can view enrollments for their courses" ON enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = enrollments.course_id 
      AND courses.instructor_id::text = auth.uid()::text
    )
  );

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- RLS Policies for learning_analytics
CREATE POLICY "Users can view their own analytics" ON learning_analytics
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Functions for business logic
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skill_categories_updated_at BEFORE UPDATE ON skill_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data for skill categories
INSERT INTO skill_categories (name, category, description) VALUES
-- Design Skills
('Graphic Design', 'design', 'Visual communication through typography, imagery, and layout'),
('UI/UX Design', 'design', 'User interface and user experience design for digital products'),
('Web Design', 'design', 'Design and layout of websites and web applications'),
('Logo Design', 'design', 'Creating brand identities and logo designs'),
('Print Design', 'design', 'Design for printed materials like brochures, posters, and books'),
('3D Design', 'design', '3D modeling, rendering, and animation'),
('Motion Graphics', 'design', 'Animated graphics and visual effects'),
('Photography', 'photography', 'Digital and film photography techniques'),
('Photo Editing', 'photography', 'Post-processing and retouching digital images'),
('Video Editing', 'photography', 'Video post-production and editing'),

-- Development Skills  
('JavaScript', 'development', 'Programming language for web and mobile development'),
('Python', 'development', 'Versatile programming language for web, data science, and automation'),
('React', 'development', 'JavaScript library for building user interfaces'),
('React Native', 'development', 'Framework for building native mobile apps'),
('Node.js', 'development', 'JavaScript runtime for server-side development'),
('HTML/CSS', 'development', 'Markup and styling languages for web development'),
('Database Design', 'development', 'Designing and optimizing database structures'),
('DevOps', 'development', 'Development operations and deployment automation'),
('Mobile App Development', 'development', 'Creating applications for mobile devices'),
('Full Stack Development', 'development', 'End-to-end web application development'),

-- Business Skills
('Project Management', 'business', 'Planning, executing, and managing projects effectively'),
('Business Strategy', 'business', 'Strategic planning and business development'),
('Financial Analysis', 'business', 'Analyzing financial data and making business decisions'),
('Leadership', 'business', 'Leading teams and organizations effectively'),
('Entrepreneurship', 'business', 'Starting and running successful businesses'),
('Sales', 'business', 'Selling products and services effectively'),
('Customer Service', 'business', 'Providing excellent customer support and experience'),
('Human Resources', 'business', 'Managing people and organizational culture'),
('Operations Management', 'business', 'Managing business operations and processes'),
('Supply Chain Management', 'business', 'Managing supply chain and logistics'),

-- Marketing Skills
('Digital Marketing', 'marketing', 'Online marketing strategies and tactics'),
('Social Media Marketing', 'marketing', 'Marketing through social media platforms'),
('Content Marketing', 'marketing', 'Creating and distributing valuable content'),
('Email Marketing', 'marketing', 'Marketing through email campaigns'),
('SEO', 'marketing', 'Search engine optimization for better visibility'),
('PPC Advertising', 'marketing', 'Pay-per-click advertising and campaign management'),
('Brand Marketing', 'marketing', 'Building and managing brand identity'),
('Marketing Analytics', 'marketing', 'Analyzing marketing data and performance'),
('Copywriting', 'marketing', 'Writing compelling marketing and sales copy'),
('Influencer Marketing', 'marketing', 'Marketing through influencer partnerships'),

-- Health & Wellness
('Fitness Training', 'health', 'Physical fitness and exercise instruction'),
('Nutrition', 'health', 'Nutritional science and healthy eating'),
('Mental Health', 'health', 'Mental wellness and psychological well-being'),
('Yoga', 'health', 'Yoga practice and instruction'),
('Meditation', 'health', 'Mindfulness and meditation techniques')
ON CONFLICT (name) DO NOTHING;

-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_profiles (
    id,
    email,
    first_name,
    last_name,
    display_name,
    role,
    is_verified,
    is_active,
    onboarding_completed,
    subscription_tier
  ) VALUES (
    uuid_generate_v4(),
    'admin@skillbox.com',
    'Admin',
    'User',
    'SkillBox Admin',
    'admin_super',
    TRUE,
    TRUE,
    TRUE,
    'pro'
  ) ON CONFLICT (email) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Execute admin user creation
SELECT create_admin_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

COMMENT ON DATABASE postgres IS 'SkillBox Learning Management System Database';