-- ===================================================================
-- SKILLBOX COMPLETE DATABASE SCHEMA (CONSOLIDATED VERSION)
-- Production-Ready Supabase PostgreSQL Schema
-- ===================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For better indexing
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geo-features
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- For international search

-- ===================================================================
-- CUSTOM TYPES AND ENUMS
-- ===================================================================

-- Simplified set of enums that covers all use cases
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'creator', 'teacher_approved', 'admin_content', 'admin_teacher_ops', 'admin_super');
CREATE TYPE content_type AS ENUM ('video', 'audio', 'document', 'quiz', 'assignment', 'live_stream', 'article', 'workshop');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert', 'master');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'processing', 'disputed', 'cancelled');
CREATE TYPE notification_type AS ENUM ('class_reminder', 'new_message', 'course_update', 'achievement', 'payment', 'system');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'paused', 'failed', 'mastered');

-- ===================================================================
-- CORE USER TABLES
-- ===================================================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE,
    profile_image_url TEXT,
    bio TEXT,
    role user_role DEFAULT 'student',
    phone_number TEXT,
    country TEXT,
    timezone TEXT DEFAULT 'UTC',
    preferred_language TEXT DEFAULT 'en',
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_seen_at TIMESTAMPTZ,
    preferences JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "in_app": true}',
    privacy_settings JSONB DEFAULT '{"profile_visibility": "public", "activity_visibility": "friends"}',
    total_points INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teacher profiles
CREATE TABLE public.teacher_profiles (
    user_id UUID REFERENCES public.users(id) PRIMARY KEY,
    professional_title TEXT,
    years_of_experience INTEGER DEFAULT 0,
    education TEXT[],
    certifications TEXT[],
    specializations TEXT[],
    languages_spoken TEXT[],
    hourly_rate DECIMAL(10,2),
    intro_video_url TEXT,
    portfolio_url TEXT,
    social_links JSONB DEFAULT '{}',
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0.00,
    total_hours_taught DECIMAL(8,2) DEFAULT 0.00,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- CONTENT AND COURSES
-- ===================================================================

-- Skills taxonomy
CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    image_url TEXT,
    color_code TEXT,
    difficulty_level skill_level DEFAULT 'beginner',
    popularity_score INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning content
CREATE TABLE public.learning_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    content_type content_type NOT NULL,
    content_url TEXT,
    thumbnail_url TEXT,
    skill_id UUID REFERENCES public.skills(id),
    difficulty_level skill_level DEFAULT 'beginner',
    duration_minutes INTEGER,
    tags TEXT[],
    is_premium BOOLEAN DEFAULT false,
    price DECIMAL(10,2) DEFAULT 0.00,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    course_thumbnail_url TEXT,
    skill_id UUID REFERENCES public.skills(id),
    price DECIMAL(10,2) DEFAULT 0.00,
    difficulty_level skill_level DEFAULT 'beginner',
    estimated_duration_hours INTEGER,
    enrollment_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course modules
CREATE TABLE public.course_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course lessons
CREATE TABLE public.course_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
    content_id UUID REFERENCES public.learning_content(id),
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- PROGRESS TRACKING
-- ===================================================================

-- Course enrollments
CREATE TABLE public.course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.users(id),
    course_id UUID REFERENCES public.courses(id),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

-- Content progress
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    content_id UUID REFERENCES public.learning_content(id),
    progress_status progress_status DEFAULT 'not_started',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    time_spent_seconds INTEGER DEFAULT 0,
    last_position_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_id)
);

-- ===================================================================
-- SOCIAL FEATURES
-- ===================================================================

-- Follows
CREATE TABLE public.user_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES public.users(id),
    following_id UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Comments
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    content_id UUID REFERENCES public.learning_content(id),
    parent_comment_id UUID REFERENCES public.comments(id),
    comment_text TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    course_id UUID REFERENCES public.courses(id),
    content_id UUID REFERENCES public.learning_content(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- NOTIFICATIONS
-- ===================================================================

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- PAYMENTS AND TRANSACTIONS
-- ===================================================================

CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    course_id UUID REFERENCES public.courses(id),
    content_id UUID REFERENCES public.learning_content(id),
    amount DECIMAL(10,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    provider_transaction_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ===================================================================
-- INDEXES FOR PERFORMANCE
-- ===================================================================

-- User indexes
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- Content indexes
CREATE INDEX idx_learning_content_creator ON public.learning_content(creator_id);
CREATE INDEX idx_learning_content_skill ON public.learning_content(skill_id);
CREATE INDEX idx_learning_content_type ON public.learning_content(content_type);

-- Course indexes
CREATE INDEX idx_courses_creator ON public.courses(creator_id);
CREATE INDEX idx_courses_skill ON public.courses(skill_id);
CREATE INDEX idx_course_modules_course ON public.course_modules(course_id);
CREATE INDEX idx_course_lessons_module ON public.course_lessons(module_id);

-- Progress indexes
CREATE INDEX idx_course_enrollments_student ON public.course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_course ON public.course_enrollments(course_id);
CREATE INDEX idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_content ON public.user_progress(content_id);

-- Social indexes
CREATE INDEX idx_user_follows_follower ON public.user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON public.user_follows(following_id);
CREATE INDEX idx_comments_content ON public.comments(content_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);

-- ===================================================================
-- FUNCTIONS AND TRIGGERS
-- ===================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update timestamp triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teacher_profiles_updated_at
    BEFORE UPDATE ON public.teacher_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_content_updated_at
    BEFORE UPDATE ON public.learning_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate course progress
CREATE OR REPLACE FUNCTION calculate_course_progress(p_user_id UUID, p_course_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    progress DECIMAL;
BEGIN
    -- Get total lessons in course
    SELECT COUNT(*) INTO total_lessons
    FROM public.course_lessons cl
    JOIN public.course_modules cm ON cl.module_id = cm.id
    WHERE cm.course_id = p_course_id;
    
    -- Get completed lessons
    SELECT COUNT(*) INTO completed_lessons
    FROM public.user_progress up
    JOIN public.course_lessons cl ON up.content_id = cl.content_id
    JOIN public.course_modules cm ON cl.module_id = cm.id
    WHERE cm.course_id = p_course_id
    AND up.user_id = p_user_id
    AND up.progress_status = 'completed';
    
    -- Calculate percentage
    IF total_lessons > 0 THEN
        progress := (completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100;
    ELSE
        progress := 0;
    END IF;
    
    -- Update enrollment record
    UPDATE public.course_enrollments 
    SET 
        progress_percentage = progress,
        completed_at = CASE 
            WHEN progress = 100 THEN NOW() 
            ELSE NULL 
        END,
        last_accessed_at = NOW()
    WHERE user_id = p_user_id AND course_id = p_course_id;
    
    RETURN ROUND(progress, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id,
        email,
        full_name,
        username,
        role,
        timezone,
        preferred_language,
        is_verified,
        is_active,
        preferences,
        notification_settings,
        privacy_settings,
        total_points,
        current_streak,
        longest_streak
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        'student',
        'UTC',
        'en',
        false,
        true,
        '{}',
        '{"email": true, "push": true, "in_app": true}',
        '{"profile_visibility": "public", "activity_visibility": "friends"}',
        0,
        0,
        0
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===================================================================
-- ROW LEVEL SECURITY POLICIES
-- ===================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can read active users"
    ON public.users FOR SELECT
    USING (is_active = true);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Content policies
CREATE POLICY "Anyone can read published content"
    ON public.learning_content FOR SELECT
    USING (is_published = true);

CREATE POLICY "Creators can manage own content"
    ON public.learning_content FOR ALL
    USING (auth.uid() = creator_id);

-- Course policies
CREATE POLICY "Anyone can read published courses"
    ON public.courses FOR SELECT
    USING (is_published = true);

CREATE POLICY "Creators can manage own courses"
    ON public.courses FOR ALL
    USING (auth.uid() = creator_id);

-- Progress policies
CREATE POLICY "Users can read own progress"
    ON public.user_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON public.user_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- ===================================================================
-- GRANT PERMISSIONS
-- ===================================================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant read permissions to anonymous users
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.learning_content TO anon;
GRANT SELECT ON public.courses TO anon;
GRANT SELECT ON public.skills TO anon;

-- ===================================================================
-- SCHEMA COMPLETE
-- ===================================================================
