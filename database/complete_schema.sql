-- SkillBox Complete Database Schema
-- This file contains the complete database structure for the SkillBox learning platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'creator', 'admin_content', 'admin_teacher_ops', 'admin_super');
CREATE TYPE content_type AS ENUM ('video', 'audio', 'document', 'quiz', 'assignment', 'live_stream', 'article', 'workshop');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'cancelled');
CREATE TYPE notification_type AS ENUM ('class_reminder', 'new_message', 'course_update', 'achievement', 'payment', 'system');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'paused');

-- Users table (Auth handled by Supabase Auth)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}',
    role user_role DEFAULT 'student',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill categories
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#3B82F6',
    parent_id UUID REFERENCES skill_categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    category_id UUID REFERENCES skill_categories(id),
    level skill_level DEFAULT 'beginner',
    icon TEXT,
    prerequisites UUID[] DEFAULT '{}',
    estimated_hours INTEGER DEFAULT 0,
    is_trending BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    thumbnail_url TEXT,
    trailer_url TEXT,
    instructor_id UUID REFERENCES user_profiles(id),
    skill_id UUID REFERENCES skills(id),
    level skill_level DEFAULT 'beginner',
    duration_hours INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    language TEXT DEFAULT 'en',
    prerequisites TEXT[],
    learning_outcomes TEXT[],
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course modules (sections within a course)
CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course lessons
CREATE TABLE IF NOT EXISTS public.course_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_type content_type,
    content_url TEXT,
    content_text TEXT,
    duration_minutes INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_preview BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    resources JSONB DEFAULT '[]',
    quiz_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course enrollments
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    course_id UUID REFERENCES courses(id),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0,
    status progress_status DEFAULT 'not_started',
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, course_id)
);

-- Lesson progress
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    lesson_id UUID REFERENCES course_lessons(id),
    enrollment_id UUID REFERENCES course_enrollments(id),
    status progress_status DEFAULT 'not_started',
    progress_percentage INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    course_id UUID REFERENCES courses(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    course_id UUID REFERENCES courses(id),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT,
    payment_provider TEXT, -- stripe, paypal, razorpay, etc.
    provider_payment_id TEXT,
    status payment_status DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'system',
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skills (tracking user progress in skills)
CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    skill_id UUID REFERENCES skills(id),
    level skill_level DEFAULT 'beginner',
    progress_percentage INTEGER DEFAULT 0,
    experience_points INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_practiced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- Study sessions (for tracking learning time and habits)
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    course_id UUID REFERENCES courses(id),
    lesson_id UUID REFERENCES course_lessons(id),
    session_type TEXT DEFAULT 'lesson', -- lesson, quiz, practice, review
    duration_minutes INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);

-- Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    badge_color TEXT DEFAULT '#3B82F6',
    points INTEGER DEFAULT 0,
    rarity TEXT DEFAULT 'common', -- common, rare, epic, legendary
    criteria JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    achievement_id UUID REFERENCES achievements(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Discussion forums
CREATE TABLE IF NOT EXISTS public.forum_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id),
    lesson_id UUID REFERENCES course_lessons(id),
    user_id UUID REFERENCES user_profiles(id),
    title TEXT NOT NULL,
    content TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum replies
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id),
    content TEXT NOT NULL,
    parent_reply_id UUID REFERENCES forum_replies(id),
    is_solution BOOLEAN DEFAULT FALSE,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes (user personal notes)
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    course_id UUID REFERENCES courses(id),
    lesson_id UUID REFERENCES course_lessons(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_highlighted BOOLEAN DEFAULT FALSE,
    is_shared BOOLEAN DEFAULT FALSE,
    timestamp_seconds INTEGER, -- for video timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study groups
CREATE TABLE IF NOT EXISTS public.study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    course_id UUID REFERENCES courses(id),
    skill_id UUID REFERENCES skills(id),
    created_by UUID REFERENCES user_profiles(id),
    member_limit INTEGER DEFAULT 50,
    is_public BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study group members
CREATE TABLE IF NOT EXISTS public.study_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id),
    role TEXT DEFAULT 'member', -- member, moderator, admin
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Live sessions (for virtual classrooms)
CREATE TABLE IF NOT EXISTS public.live_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id),
    instructor_id UUID REFERENCES user_profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start TIMESTAMP WITH TIME ZONE,
    actual_end TIMESTAMP WITH TIME ZONE,
    max_participants INTEGER DEFAULT 100,
    meeting_url TEXT,
    is_recorded BOOLEAN DEFAULT FALSE,
    recording_url TEXT,
    status TEXT DEFAULT 'scheduled', -- scheduled, live, ended, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live session attendees
CREATE TABLE IF NOT EXISTS public.live_session_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id),
    joined_at TIMESTAMP WITH TIME ZONE,
    left_at TIMESTAMP WITH TIME ZONE,
    attendance_duration_minutes INTEGER DEFAULT 0,
    UNIQUE(session_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_skill_id ON courses(skill_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_topics_updated_at BEFORE UPDATE ON forum_topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON forum_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view public profiles" ON user_profiles FOR SELECT USING (is_active = true);

-- Course policies
CREATE POLICY "Published courses are viewable by everyone" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "Instructors can manage their courses" ON courses FOR ALL USING (auth.uid() = instructor_id);

-- Enrollment policies
CREATE POLICY "Users can view their own enrollments" ON course_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can enroll themselves" ON course_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Progress policies
CREATE POLICY "Users can view their own progress" ON lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON lesson_progress FOR ALL USING (auth.uid() = user_id);

-- Review policies
CREATE POLICY "Users can view public reviews" ON reviews FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage their own reviews" ON reviews FOR ALL USING (auth.uid() = user_id);

-- Payment policies
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

-- Notification policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Notes policies
CREATE POLICY "Users can manage their own notes" ON notes FOR ALL USING (auth.uid() = user_id);

-- Study sessions policies
CREATE POLICY "Users can manage their own study sessions" ON study_sessions FOR ALL USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO skill_categories (name, description, icon, color) VALUES
('Programming', 'Software development and coding skills', 'code-slash', '#3B82F6'),
('Design', 'UI/UX design and creative skills', 'color-palette', '#8B5CF6'),
('Business', 'Business and entrepreneurship skills', 'briefcase', '#10B981'),
('Data Science', 'Data analysis and machine learning', 'analytics', '#F59E0B'),
('Marketing', 'Digital marketing and growth', 'megaphone', '#EF4444'),
('Personal Development', 'Soft skills and productivity', 'person', '#6B7280')
ON CONFLICT (name) DO NOTHING;

INSERT INTO skills (name, description, category_id, level) VALUES
('JavaScript', 'Modern JavaScript programming language', (SELECT id FROM skill_categories WHERE name = 'Programming'), 'beginner'),
('React Native', 'Cross-platform mobile development', (SELECT id FROM skill_categories WHERE name = 'Programming'), 'intermediate'),
('UI/UX Design', 'User interface and experience design', (SELECT id FROM skill_categories WHERE name = 'Design'), 'beginner'),
('Data Analysis', 'Analyzing and interpreting data', (SELECT id FROM skill_categories WHERE name = 'Data Science'), 'intermediate'),
('Digital Marketing', 'Online marketing strategies', (SELECT id FROM skill_categories WHERE name = 'Marketing'), 'beginner'),
('Leadership', 'Team management and leadership', (SELECT id FROM skill_categories WHERE name = 'Personal Development'), 'advanced')
ON CONFLICT (name) DO NOTHING;

INSERT INTO achievements (name, description, icon, points, rarity) VALUES
('First Steps', 'Complete your first lesson', 'footsteps', 50, 'common'),
('Knowledge Seeker', 'Complete 10 lessons', 'book', 100, 'common'),
('Quiz Master', 'Score 100% on 5 quizzes', 'trophy', 200, 'rare'),
('Streak Warrior', 'Maintain a 7-day learning streak', 'flame', 300, 'rare'),
('Course Conqueror', 'Complete 5 entire courses', 'ribbon', 500, 'epic'),
('Learning Legend', 'Reach level 20', 'star', 1000, 'legendary')
ON CONFLICT (name) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;