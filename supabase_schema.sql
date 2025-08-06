-- ===================================================================
-- SKILLBOX COMPLETE DATABASE SCHEMA
-- Production-Ready Supabase PostgreSQL Schema with Performance Optimizations
-- ===================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For better indexing

-- ===================================================================
-- CUSTOM TYPES AND ENUMS
-- ===================================================================

CREATE TYPE user_role AS ENUM ('student', 'teacher', 'creator', 'teacher_approved', 'admin_content', 'admin_teacher_ops', 'admin_super');
CREATE TYPE content_type AS ENUM ('video', 'audio', 'document', 'quiz', 'assignment', 'live_stream', 'article', 'workshop');
CREATE TYPE class_type AS ENUM ('one_on_one', 'group', 'workshop', 'masterclass', 'webinar');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert', 'master');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'processing');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'paused', 'trial');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'paused', 'failed');
CREATE TYPE notification_type AS ENUM ('class_reminder', 'new_message', 'course_update', 'achievement', 'payment', 'system', 'follow_update', 'new_feature');
CREATE TYPE report_type AS ENUM ('inappropriate_content', 'spam', 'harassment', 'copyright', 'fake_profile', 'other');
CREATE TYPE meeting_platform AS ENUM ('zoom', 'google_meet', 'teams', 'discord', 'custom', 'jitsi');
CREATE TYPE content_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected', 'archived');

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
    creator_status TEXT,
    date_of_birth DATE,
    phone_number TEXT,
    country TEXT,
    timezone TEXT DEFAULT 'UTC',
    preferred_language TEXT DEFAULT 'en',
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    last_seen_at TIMESTAMPTZ,
    onboarding_data JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Additional fields for teachers/creators
    education JSONB[],
    years_experience INTEGER,
    certifications JSONB[],
    teaching_skills TEXT[],
    intro_video_url TEXT,
    social_links JSONB DEFAULT '{}',
    
    -- Statistics
    total_earnings DECIMAL(10,2) DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0
);

-- Teacher applications
CREATE TABLE public.teacher_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    application_data JSONB NOT NULL,
    status TEXT DEFAULT 'pending_review',
    reviewer_id UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE public.teacher_profiles (
    user_id UUID REFERENCES public.users(id) PRIMARY KEY,
    professional_title TEXT,
    years_of_experience INTEGER DEFAULT 0,
    education TEXT,
    certifications TEXT[],
    specializations TEXT[],
    hourly_rate DECIMAL(10,2),
    commission_rate DECIMAL(5,2) DEFAULT 20.00,
    intro_video_url TEXT,
    portfolio_url TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    teaching_style TEXT,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0.00,
    is_approved BOOLEAN DEFAULT false,
    approval_date TIMESTAMPTZ,
    stripe_account_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- SKILLS AND CATEGORIES
-- ===================================================================

CREATE TABLE public.skill_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    color_code TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES public.skill_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.user_skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    skill_id UUID REFERENCES public.skills(id),
    proficiency_level skill_level DEFAULT 'beginner',
    is_teaching BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- ===================================================================
-- LEARNING CONTENT
-- ===================================================================

CREATE TABLE public.learning_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    creator_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    content_type content_type NOT NULL,
    content_url TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    file_size_bytes BIGINT,
    skill_id UUID REFERENCES public.skills(id),
    difficulty_level skill_level DEFAULT 'beginner',
    tags TEXT[],
    is_free BOOLEAN DEFAULT true,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz questions for content
CREATE TABLE public.quiz_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content_id UUID REFERENCES public.learning_content(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'multiple_choice',
    options JSONB,
    correct_answer TEXT,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- COURSES AND MODULES
-- ===================================================================

CREATE TABLE public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    creator_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    course_thumbnail_url TEXT,
    skill_id UUID REFERENCES public.skills(id),
    difficulty_level skill_level DEFAULT 'beginner',
    estimated_duration_hours INTEGER,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    enrollment_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.course_modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.course_lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
    content_id UUID REFERENCES public.learning_content(id),
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.course_enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.users(id),
    course_id UUID REFERENCES public.courses(id),
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,
    UNIQUE(student_id, course_id)
);

-- ===================================================================
-- LIVE CLASSES
-- ===================================================================

CREATE TABLE public.live_classes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    skill_id UUID REFERENCES public.skills(id),
    class_type class_type DEFAULT 'group',
    difficulty_level skill_level DEFAULT 'beginner',
    duration_minutes INTEGER NOT NULL,
    max_students INTEGER DEFAULT 1,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    meeting_platform meeting_platform DEFAULT 'zoom',
    meeting_url TEXT,
    meeting_id TEXT,
    meeting_password TEXT,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSONB,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.class_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    class_id UUID REFERENCES public.live_classes(id),
    scheduled_start_time TIMESTAMPTZ NOT NULL,
    scheduled_end_time TIMESTAMPTZ NOT NULL,
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    max_students INTEGER,
    enrolled_students INTEGER DEFAULT 0,
    meeting_url TEXT,
    recording_url TEXT,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.class_bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.class_sessions(id),
    student_id UUID REFERENCES public.users(id),
    booking_time TIMESTAMPTZ DEFAULT NOW(),
    payment_status payment_status DEFAULT 'pending',
    payment_id TEXT,
    amount_paid DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    attended BOOLEAN DEFAULT false,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, student_id)
);

-- ===================================================================
-- TEACHER AVAILABILITY
-- ===================================================================

CREATE TABLE public.teacher_availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID REFERENCES public.users(id),
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone TEXT DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(teacher_id, day_of_week, start_time)
);

CREATE TABLE public.teacher_time_blocks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID REFERENCES public.users(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_available BOOLEAN DEFAULT true,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- PROGRESS TRACKING
-- ===================================================================

CREATE TABLE public.user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    content_id UUID REFERENCES public.learning_content(id),
    progress_status progress_status DEFAULT 'not_started',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    time_spent_seconds INTEGER DEFAULT 0,
    last_position_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    first_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_id)
);

CREATE TABLE public.quiz_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    content_id UUID REFERENCES public.learning_content(id),
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 0,
    percentage DECIMAL(5,2),
    answers JSONB,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    time_taken_seconds INTEGER
);

-- ===================================================================
-- SOCIAL FEATURES
-- ===================================================================

CREATE TABLE public.user_follows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES public.users(id),
    following_id UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reviewer_id UUID REFERENCES public.users(id),
    reviewee_id UUID REFERENCES public.users(id),
    content_id UUID REFERENCES public.learning_content(id),
    course_id UUID REFERENCES public.courses(id),
    class_id UUID REFERENCES public.live_classes(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    content_id UUID REFERENCES public.learning_content(id),
    parent_comment_id UUID REFERENCES public.comments(id),
    comment_text TEXT NOT NULL,
    timestamp_seconds INTEGER,
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- MESSAGING SYSTEM
-- ===================================================================

CREATE TABLE public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT,
    is_group BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.users(id),
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.conversation_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    role TEXT DEFAULT 'member',
    UNIQUE(conversation_id, user_id)
);

CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id),
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    file_url TEXT,
    reply_to_id UUID REFERENCES public.messages(id),
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    read_by JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- NOTIFICATIONS
-- ===================================================================

CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type notification_type NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.push_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    token TEXT NOT NULL,
    platform TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, token)
);

-- ===================================================================
-- GAMIFICATION
-- ===================================================================

CREATE TABLE public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    badge_color TEXT,
    points INTEGER DEFAULT 0,
    criteria JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    achievement_id UUID REFERENCES public.achievements(id),
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    progress_data JSONB,
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE public.user_points (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    points INTEGER NOT NULL,
    source TEXT NOT NULL,
    description TEXT,
    reference_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- PAYMENTS AND SUBSCRIPTIONS
-- ===================================================================

CREATE TABLE public.payment_methods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    stripe_payment_method_id TEXT NOT NULL,
    type TEXT NOT NULL,
    brand TEXT,
    last_four TEXT,
    exp_month INTEGER,
    exp_year INTEGER,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    stripe_payment_intent_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status payment_status DEFAULT 'pending',
    description TEXT,
    item_type TEXT,
    item_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    teacher_id UUID REFERENCES public.users(id),
    stripe_subscription_id TEXT,
    plan_name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status subscription_status DEFAULT 'active',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- CONTENT MODERATION
-- ===================================================================

CREATE TABLE public.reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reporter_id UUID REFERENCES public.users(id),
    reported_user_id UUID REFERENCES public.users(id),
    reported_content_id UUID,
    report_type report_type NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    moderator_id UUID REFERENCES public.users(id),
    moderator_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- BOOKMARKS AND FAVORITES
-- ===================================================================

CREATE TABLE public.user_bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    content_id UUID REFERENCES public.learning_content(id),
    course_id UUID REFERENCES public.courses(id),
    teacher_id UUID REFERENCES public.users(id),
    bookmark_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_id, course_id, teacher_id, bookmark_type)
);

-- ===================================================================
-- ANALYTICS AND METRICS
-- ===================================================================

CREATE TABLE public.user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    session_start TIMESTAMPTZ DEFAULT NOW(),
    session_end TIMESTAMPTZ,
    pages_visited INTEGER DEFAULT 0,
    device_info JSONB,
    location_info JSONB
);

CREATE TABLE public.content_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content_id UUID REFERENCES public.learning_content(id),
    user_id UUID REFERENCES public.users(id),
    event_type TEXT NOT NULL,
    event_data JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- SEARCH AND RECOMMENDATIONS
-- ===================================================================

CREATE TABLE public.search_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    search_query TEXT NOT NULL,
    filters JSONB,
    results_count INTEGER,
    clicked_result_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- RLS POLICIES
-- ===================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public profiles are readable" ON public.users FOR SELECT USING (is_active = true);

-- Teacher profile policies
CREATE POLICY "Teachers can manage own profile" ON public.teacher_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Approved teacher profiles are public" ON public.teacher_profiles FOR SELECT USING (is_approved = true);

-- Content policies
CREATE POLICY "Published content is readable" ON public.learning_content FOR SELECT USING (is_published = true);
CREATE POLICY "Creators can manage own content" ON public.learning_content FOR ALL USING (auth.uid() = creator_id);

-- Course policies
CREATE POLICY "Published courses are readable" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Creators can manage own courses" ON public.courses FOR ALL USING (auth.uid() = creator_id);

-- Enrollment policies
CREATE POLICY "Students can read own enrollments" ON public.course_enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can enroll themselves" ON public.course_enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Progress policies
CREATE POLICY "Users can manage own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- Message policies
CREATE POLICY "Users can read conversations they participate in" ON public.conversations FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = id AND user_id = auth.uid()));

CREATE POLICY "Users can read messages in their conversations" ON public.messages FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));

-- Notification policies
CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

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
CREATE INDEX idx_learning_content_published ON public.learning_content(is_published);
CREATE INDEX idx_learning_content_type ON public.learning_content(content_type);

-- Course indexes
CREATE INDEX idx_courses_creator ON public.courses(creator_id);
CREATE INDEX idx_courses_skill ON public.courses(skill_id);
CREATE INDEX idx_course_enrollments_student ON public.course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_course ON public.course_enrollments(course_id);

-- Class indexes
CREATE INDEX idx_live_classes_teacher ON public.live_classes(teacher_id);
CREATE INDEX idx_class_sessions_class ON public.class_sessions(class_id);
CREATE INDEX idx_class_sessions_time ON public.class_sessions(scheduled_start_time);
CREATE INDEX idx_class_bookings_student ON public.class_bookings(student_id);

-- Message indexes
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);

-- Progress indexes
CREATE INDEX idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_content ON public.user_progress(content_id);

-- Search indexes
CREATE INDEX idx_learning_content_search ON public.learning_content USING GIN (to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_courses_search ON public.courses USING GIN (to_tsvector('english', title || ' ' || description));

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

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teacher_profiles_updated_at BEFORE UPDATE ON public.teacher_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_content_updated_at BEFORE UPDATE ON public.learning_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate course progress
CREATE OR REPLACE FUNCTION calculate_course_progress(course_id UUID, user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    progress DECIMAL;
BEGIN
    -- Count total lessons in course
    SELECT COUNT(*) INTO total_lessons
    FROM public.course_lessons cl
    JOIN public.course_modules cm ON cl.module_id = cm.id
    WHERE cm.course_id = calculate_course_progress.course_id;
    
    -- Count completed lessons
    SELECT COUNT(*) INTO completed_lessons
    FROM public.user_progress up
    JOIN public.course_lessons cl ON up.content_id = cl.content_id
    JOIN public.course_modules cm ON cl.module_id = cm.id
    WHERE cm.course_id = calculate_course_progress.course_id
    AND up.user_id = calculate_course_progress.user_id
    AND up.progress_status = 'completed';
    
    -- Calculate progress percentage
    IF total_lessons > 0 THEN
        progress := (completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100;
    ELSE
        progress := 0;
    END IF;
    
    RETURN ROUND(progress, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to update teacher stats
CREATE OR REPLACE FUNCTION update_teacher_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Update teacher's average rating and review count
        UPDATE public.teacher_profiles 
        SET 
            average_rating = (
                SELECT AVG(rating)::DECIMAL(3,2) 
                FROM public.reviews 
                WHERE reviewee_id = NEW.reviewee_id
            ),
            total_reviews = (
                SELECT COUNT(*) 
                FROM public.reviews 
                WHERE reviewee_id = NEW.reviewee_id
            )
        WHERE user_id = NEW.reviewee_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_teacher_stats_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_teacher_stats();

-- ===================================================================
-- INITIAL DATA
-- ===================================================================

-- Insert skill categories
INSERT INTO public.skill_categories (name, description, icon_url, color_code) VALUES
('Technology', 'Programming, Web Development, Data Science', 'tech-icon.png', '#3B82F6'),
('Design', 'UI/UX, Graphic Design, Animation', 'design-icon.png', '#8B5CF6'),
('Business', 'Marketing, Management, Finance', 'business-icon.png', '#10B981'),
('Languages', 'English, Spanish, French, Mandarin', 'language-icon.png', '#F59E0B'),
('Arts', 'Music, Photography, Writing', 'arts-icon.png', '#EF4444'),
('Health', 'Fitness, Nutrition, Mental Health', 'health-icon.png', '#06B6D4'),
('Science', 'Physics, Chemistry, Biology', 'science-icon.png', '#84CC16'),
('Personal Development', 'Leadership, Communication, Time Management', 'personal-icon.png', '#F97316');

-- Insert sample skills
INSERT INTO public.skills (category_id, name, description) 
SELECT 
    sc.id,
    skill_name,
    'Learn ' || skill_name || ' with expert instructors'
FROM public.skill_categories sc
CROSS JOIN (VALUES 
    ('JavaScript'), ('Python'), ('React'), ('Node.js'), ('SQL'),
    ('Photoshop'), ('Figma'), ('Illustrator'), ('After Effects'),
    ('Digital Marketing'), ('Project Management'), ('Excel'), ('PowerPoint'),
    ('English'), ('Spanish'), ('French'), ('Mandarin'), ('German'),
    ('Guitar'), ('Piano'), ('Photography'), ('Creative Writing'),
    ('Yoga'), ('Meditation'), ('Nutrition'), ('Personal Training'),
    ('Physics'), ('Chemistry'), ('Biology'), ('Mathematics'),
    ('Leadership'), ('Public Speaking'), ('Time Management'), ('Negotiation')
) AS skills(skill_name)
WHERE sc.name = CASE 
    WHEN skill_name IN ('JavaScript', 'Python', 'React', 'Node.js', 'SQL') THEN 'Technology'
    WHEN skill_name IN ('Photoshop', 'Figma', 'Illustrator', 'After Effects') THEN 'Design'
    WHEN skill_name IN ('Digital Marketing', 'Project Management', 'Excel', 'PowerPoint') THEN 'Business'
    WHEN skill_name IN ('English', 'Spanish', 'French', 'Mandarin', 'German') THEN 'Languages'
    WHEN skill_name IN ('Guitar', 'Piano', 'Photography', 'Creative Writing') THEN 'Arts'
    WHEN skill_name IN ('Yoga', 'Meditation', 'Nutrition', 'Personal Training') THEN 'Health'
    WHEN skill_name IN ('Physics', 'Chemistry', 'Biology', 'Mathematics') THEN 'Science'
    WHEN skill_name IN ('Leadership', 'Public Speaking', 'Time Management', 'Negotiation') THEN 'Personal Development'
END;

-- Insert achievements
INSERT INTO public.achievements (name, description, icon_url, points) VALUES
('First Steps', 'Complete your first lesson', 'first-steps.png', 10),
('Quick Learner', 'Complete 5 lessons in one day', 'quick-learner.png', 25),
('Dedicated Student', 'Study for 7 consecutive days', 'dedicated.png', 50),
('Course Completionist', 'Complete your first course', 'course-complete.png', 100),
('Review Master', 'Leave 10 helpful reviews', 'reviewer.png', 75),
('Social Butterfly', 'Follow 20 instructors', 'social.png', 30),
('Knowledge Seeker', 'Bookmark 50 pieces of content', 'bookmarks.png', 40),
('Early Bird', 'Join a class at 6 AM', 'early-bird.png', 20);

-- ===================================================================
-- STORAGE BUCKETS (for Supabase)
-- ===================================================================

-- These would be created in Supabase dashboard or via API
-- INSERT INTO storage.buckets (id, name, public) VALUES
-- ('avatars', 'avatars', true),
-- ('content-media', 'content-media', true),
-- ('course-thumbnails', 'course-thumbnails', true),
-- ('documents', 'documents', false),
-- ('certificates', 'certificates', false);

-- ===================================================================
-- SCHEMA COMPLETE
-- ===================================================================
