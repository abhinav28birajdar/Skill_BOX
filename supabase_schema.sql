-- SkillBox App - Comprehensive Real-time Database Schema
-- This schema supports AI tutoring, biometric learning, AR/VR, notifications, and user management

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis" CASCADE;
CREATE EXTENSION IF NOT EXISTS "vector" CASCADE;

-- Enable Row Level Security by default
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- =============================================
-- USER MANAGEMENT & AUTHENTICATION
-- =============================================

-- Enhanced user profiles with biometric and learning preferences
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    role TEXT CHECK (role IN ('student', 'creator', 'admin')) DEFAULT 'student',
    
    -- Learning preferences
    learning_style TEXT CHECK (learning_style IN ('visual', 'auditory', 'kinesthetic', 'reading')) DEFAULT 'visual',
    preferred_difficulty TEXT CHECK (preferred_difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    ai_tutor_enabled BOOLEAN DEFAULT true,
    biometric_monitoring_enabled BOOLEAN DEFAULT false,
    ar_vr_enabled BOOLEAN DEFAULT false,
    
    -- Biometric baseline data
    baseline_heart_rate INTEGER,
    baseline_stress_level DECIMAL(3,2),
    cognitive_load_threshold DECIMAL(3,2) DEFAULT 0.7,
    
    -- Social features
    is_public BOOLEAN DEFAULT false,
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions for activity tracking
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    device_info JSONB,
    location_data JSONB,
    learning_context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SKILLS & LEARNING CONTENT
-- =============================================

-- Skills taxonomy
CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    prerequisites TEXT[],
    learning_outcomes TEXT[],
    estimated_duration_hours INTEGER,
    icon_url TEXT,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses with enhanced metadata
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    thumbnail_url TEXT,
    banner_url TEXT,
    instructor_id UUID REFERENCES public.user_profiles(id),
    
    -- Course structure
    skill_ids UUID[],
    learning_path JSONB,
    prerequisites TEXT[],
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    estimated_duration_hours INTEGER,
    
    -- Content flags
    has_ar_content BOOLEAN DEFAULT false,
    has_vr_content BOOLEAN DEFAULT false,
    has_ai_tutor BOOLEAN DEFAULT true,
    has_biometric_feedback BOOLEAN DEFAULT false,
    
    -- Engagement metrics
    enrollment_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    -- Publishing
    is_published BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    price DECIMAL(10,2),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Lessons with multimedia content
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content JSONB, -- Rich content structure
    lesson_order INTEGER NOT NULL,
    
    -- Content types
    content_type TEXT CHECK (content_type IN ('video', 'text', 'interactive', 'ar', 'vr', 'quiz', 'project')) DEFAULT 'text',
    video_url TEXT,
    transcript TEXT,
    slides_url TEXT,
    
    -- AR/VR content
    ar_model_url TEXT,
    vr_scene_url TEXT,
    spatial_anchors JSONB,
    
    -- Learning objectives
    learning_objectives TEXT[],
    estimated_duration_minutes INTEGER,
    
    -- AI features
    ai_summary TEXT,
    difficulty_score DECIMAL(3,2),
    cognitive_load_estimate DECIMAL(3,2),
    
    -- Status
    is_published BOOLEAN DEFAULT false,
    is_free BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AI TUTORING SYSTEM
-- =============================================

-- AI tutor configurations
CREATE TABLE public.ai_tutors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    model_provider TEXT CHECK (model_provider IN ('openai', 'anthropic', 'google', 'local')) DEFAULT 'openai',
    model_name TEXT NOT NULL,
    personality_prompt TEXT,
    system_instructions TEXT,
    specializations TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI chat sessions
CREATE TABLE public.ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES public.ai_tutors(id),
    course_id UUID REFERENCES public.courses(id),
    lesson_id UUID REFERENCES public.lessons(id),
    
    -- Session context
    learning_context JSONB,
    session_metadata JSONB,
    
    -- Performance tracking
    message_count INTEGER DEFAULT 0,
    session_duration_seconds INTEGER,
    learning_effectiveness_score DECIMAL(3,2),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI chat messages
CREATE TABLE public.ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
    sender_type TEXT CHECK (sender_type IN ('user', 'ai')) NOT NULL,
    message_text TEXT NOT NULL,
    message_metadata JSONB,
    
    -- AI analysis
    intent_analysis JSONB,
    sentiment_score DECIMAL(3,2),
    confusion_indicators JSONB,
    
    -- Timing
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_time_ms INTEGER
);

-- =============================================
-- BIOMETRIC & COGNITIVE MONITORING
-- =============================================

-- Real-time biometric data
CREATE TABLE public.biometric_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.user_sessions(id),
    
    -- Biometric measurements
    heart_rate INTEGER,
    heart_rate_variability DECIMAL(6,3),
    stress_level DECIMAL(3,2),
    attention_level DECIMAL(3,2),
    cognitive_load DECIMAL(3,2),
    
    -- EEG data (if available)
    brainwave_data JSONB,
    alpha_waves DECIMAL(6,3),
    beta_waves DECIMAL(6,3),
    gamma_waves DECIMAL(6,3),
    theta_waves DECIMAL(6,3),
    
    -- Environmental context
    ambient_light INTEGER,
    noise_level INTEGER,
    temperature DECIMAL(4,1),
    
    -- Timestamp
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cognitive load assessments
CREATE TABLE public.cognitive_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id),
    
    -- Assessment data
    mental_effort_score DECIMAL(3,2),
    concentration_level DECIMAL(3,2),
    frustration_level DECIMAL(3,2),
    engagement_score DECIMAL(3,2),
    
    -- Learning performance
    comprehension_rate DECIMAL(3,2),
    retention_prediction DECIMAL(3,2),
    optimal_difficulty DECIMAL(3,2),
    
    -- Recommendations
    ai_recommendations JSONB,
    suggested_break_duration INTEGER,
    content_adjustment_needed BOOLEAN DEFAULT false,
    
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AR/VR IMMERSIVE LEARNING
-- =============================================

-- AR experiences
CREATE TABLE public.ar_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    
    -- AR content
    model_url TEXT,
    anchor_type TEXT CHECK (anchor_type IN ('image', 'plane', 'face', 'body', 'location')) DEFAULT 'plane',
    anchor_data JSONB,
    scale_factor DECIMAL(6,3) DEFAULT 1.0,
    
    -- Interaction data
    interactions JSONB,
    success_metrics JSONB,
    
    -- Technical requirements
    min_ios_version TEXT,
    min_android_version TEXT,
    required_features TEXT[],
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VR environments
CREATE TABLE public.vr_environments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    
    -- VR content
    environment_url TEXT,
    environment_type TEXT CHECK (environment_type IN ('360_video', '3d_scene', 'interactive', 'simulation')) DEFAULT '3d_scene',
    spawn_position JSONB,
    
    -- Interaction systems
    hand_tracking_enabled BOOLEAN DEFAULT false,
    eye_tracking_enabled BOOLEAN DEFAULT false,
    spatial_audio_enabled BOOLEAN DEFAULT true,
    
    -- Educational elements
    learning_objectives TEXT[],
    interactive_objects JSONB,
    assessment_points JSONB,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User AR/VR session data
CREATE TABLE public.immersive_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    experience_id UUID, -- Can reference either ar_experiences or vr_environments
    experience_type TEXT CHECK (experience_type IN ('ar', 'vr')) NOT NULL,
    
    -- Session metrics
    session_duration_seconds INTEGER,
    interactions_count INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Performance data
    spatial_tracking_quality DECIMAL(3,2),
    motion_sickness_reported BOOLEAN DEFAULT false,
    user_satisfaction_score DECIMAL(3,2),
    
    -- Technical metrics
    frame_rate_avg DECIMAL(5,2),
    tracking_lost_count INTEGER DEFAULT 0,
    device_model TEXT,
    
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS & MESSAGING
-- =============================================

-- Notification system
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Notification content
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('learning_reminder', 'achievement', 'social', 'system', 'biometric_alert', 'ai_insight')) NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    
    -- Rich content
    image_url TEXT,
    action_url TEXT,
    custom_data JSONB,
    
    -- Delivery settings
    channels TEXT[] DEFAULT ARRAY['in_app'],
    schedule_for TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Status tracking
    is_read BOOLEAN DEFAULT false,
    is_delivered BOOLEAN DEFAULT false,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time messaging for collaborative learning
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id),
    
    -- Message content
    content TEXT NOT NULL,
    message_type TEXT CHECK (message_type IN ('text', 'image', 'video', 'file', 'voice', 'ar_annotation')) DEFAULT 'text',
    file_url TEXT,
    file_type TEXT,
    file_size INTEGER,
    
    -- Message metadata
    reply_to_id UUID REFERENCES public.messages(id),
    thread_id UUID,
    is_edited BOOLEAN DEFAULT false,
    edit_history JSONB,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- LEARNING ANALYTICS & PROGRESS
-- =============================================

-- User progress tracking
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    
    -- Progress metrics
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    attempts_count INTEGER DEFAULT 0,
    last_position JSONB,
    
    -- Performance data
    quiz_scores JSONB,
    skill_assessments JSONB,
    engagement_metrics JSONB,
    
    -- AI insights
    learning_velocity DECIMAL(6,3),
    difficulty_adaptation DECIMAL(3,2),
    predicted_completion_time INTEGER,
    ai_recommendations JSONB,
    
    -- Status
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')) DEFAULT 'not_started',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning analytics aggregations
CREATE TABLE public.learning_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Daily metrics
    total_learning_time_minutes INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    skills_acquired INTEGER DEFAULT 0,
    
    -- Engagement metrics
    session_count INTEGER DEFAULT 0,
    average_session_duration_minutes DECIMAL(6,2),
    focus_score DECIMAL(3,2),
    
    -- Biometric insights
    average_cognitive_load DECIMAL(3,2),
    stress_incidents INTEGER DEFAULT 0,
    optimal_learning_periods JSONB,
    
    -- AI tutor usage
    ai_interactions INTEGER DEFAULT 0,
    ai_effectiveness_score DECIMAL(3,2),
    
    -- Performance trends
    comprehension_rate DECIMAL(3,2),
    retention_score DECIMAL(3,2),
    learning_velocity DECIMAL(6,3),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- REAL-TIME FEATURES & SUBSCRIPTIONS
-- =============================================

-- Real-time learning rooms for collaborative sessions
CREATE TABLE public.learning_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    course_id UUID REFERENCES public.courses(id),
    host_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Room settings
    max_participants INTEGER DEFAULT 10,
    is_public BOOLEAN DEFAULT false,
    requires_approval BOOLEAN DEFAULT false,
    has_biometric_sync BOOLEAN DEFAULT false,
    has_ar_shared BOOLEAN DEFAULT false,
    
    -- Session data
    active_participants JSONB DEFAULT '[]',
    current_lesson_id UUID REFERENCES public.lessons(id),
    shared_state JSONB DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room participants tracking
CREATE TABLE public.room_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.learning_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Participation data
    role TEXT CHECK (role IN ('host', 'moderator', 'participant')) DEFAULT 'participant',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    total_time_minutes INTEGER DEFAULT 0,
    
    -- Interaction metrics
    messages_sent INTEGER DEFAULT 0,
    questions_asked INTEGER DEFAULT 0,
    contributions_made INTEGER DEFAULT 0,
    
    -- Biometric sharing (if enabled)
    biometric_data_shared BOOLEAN DEFAULT false,
    attention_score DECIMAL(3,2),
    
    is_active BOOLEAN DEFAULT true
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- User-related indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_updated_at ON public.user_profiles(updated_at);

-- Content indexes
CREATE INDEX idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX idx_courses_is_published ON public.courses(is_published);
CREATE INDEX idx_courses_difficulty_level ON public.courses(difficulty_level);
CREATE INDEX idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX idx_lessons_lesson_order ON public.lessons(lesson_order);

-- AI tutor indexes
CREATE INDEX idx_ai_chat_sessions_user_id ON public.ai_chat_sessions(user_id);
CREATE INDEX idx_ai_chat_sessions_is_active ON public.ai_chat_sessions(is_active);
CREATE INDEX idx_ai_chat_messages_session_id ON public.ai_chat_messages(session_id);
CREATE INDEX idx_ai_chat_messages_timestamp ON public.ai_chat_messages(timestamp);

-- Biometric data indexes (for real-time queries)
CREATE INDEX idx_biometric_data_user_id_recorded_at ON public.biometric_data(user_id, recorded_at DESC);
CREATE INDEX idx_biometric_data_session_id ON public.biometric_data(session_id);

-- Progress tracking indexes
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_course_id ON public.user_progress(course_id);
CREATE INDEX idx_user_progress_status ON public.user_progress(status);

-- Analytics indexes
CREATE INDEX idx_learning_analytics_user_id_date ON public.learning_analytics(user_id, date DESC);

-- Notification indexes
CREATE INDEX idx_notifications_user_id_created_at ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Real-time features indexes
CREATE INDEX idx_learning_rooms_is_active ON public.learning_rooms(is_active);
CREATE INDEX idx_room_participants_room_id_is_active ON public.room_participants(room_id, is_active);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cognitive_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ar_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vr_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.immersive_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;

-- User profile policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view public profiles" ON public.user_profiles
    FOR SELECT USING (is_public = true);

-- Course policies
CREATE POLICY "Anyone can view published courses" ON public.courses
    FOR SELECT USING (is_published = true);

CREATE POLICY "Instructors can manage their courses" ON public.courses
    FOR ALL USING (auth.uid() = instructor_id);

-- AI chat policies
CREATE POLICY "Users can manage their AI chat sessions" ON public.ai_chat_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their AI chat messages" ON public.ai_chat_messages
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM public.ai_chat_sessions WHERE id = session_id
        )
    );

-- Biometric data policies (highly sensitive)
CREATE POLICY "Users can only access their own biometric data" ON public.biometric_data
    FOR ALL USING (auth.uid() = user_id);

-- Progress tracking policies
CREATE POLICY "Users can view their own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Notification policies
CREATE POLICY "Users can manage their notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- Real-time room policies
CREATE POLICY "Users can view public rooms" ON public.learning_rooms
    FOR SELECT USING (is_public = true OR host_id = auth.uid());

CREATE POLICY "Room hosts can manage their rooms" ON public.learning_rooms
    FOR ALL USING (auth.uid() = host_id);

-- =============================================
-- REAL-TIME SUBSCRIPTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_tutors_updated_at BEFORE UPDATE ON public.ai_tutors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ar_experiences_updated_at BEFORE UPDATE ON public.ar_experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vr_environments_updated_at BEFORE UPDATE ON public.vr_environments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_rooms_updated_at BEFORE UPDATE ON public.learning_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function for real-time biometric alerts
CREATE OR REPLACE FUNCTION public.check_biometric_alerts()
RETURNS TRIGGER AS $$
DECLARE
    user_threshold DECIMAL(3,2);
    alert_data JSONB;
BEGIN
    -- Get user's cognitive load threshold
    SELECT cognitive_load_threshold INTO user_threshold
    FROM public.user_profiles
    WHERE id = NEW.user_id;
    
    -- Check if cognitive load exceeds threshold
    IF NEW.cognitive_load > COALESCE(user_threshold, 0.8) THEN
        alert_data := jsonb_build_object(
            'type', 'high_cognitive_load',
            'value', NEW.cognitive_load,
            'threshold', user_threshold,
            'timestamp', NEW.recorded_at
        );
        
        INSERT INTO public.notifications (
            user_id,
            title,
            message,
            type,
            priority,
            custom_data
        ) VALUES (
            NEW.user_id,
            'High Cognitive Load Detected',
            'Consider taking a break to optimize your learning.',
            'biometric_alert',
            'high',
            alert_data
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for biometric alerts
CREATE TRIGGER biometric_alert_trigger
    AFTER INSERT ON public.biometric_data
    FOR EACH ROW EXECUTE FUNCTION public.check_biometric_alerts();

-- =============================================
-- REAL-TIME PUBLICATIONS FOR SUBSCRIPTIONS
-- =============================================

-- Enable real-time for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.biometric_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.learning_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.immersive_sessions;

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Insert default AI tutor
INSERT INTO public.ai_tutors (
    id,
    name,
    description,
    model_provider,
    model_name,
    personality_prompt,
    system_instructions,
    specializations
) VALUES (
    uuid_generate_v4(),
    'SkillBox AI Tutor',
    'Advanced AI tutor specialized in personalized learning experiences',
    'openai',
    'gpt-4',
    'You are a patient, encouraging, and knowledgeable tutor who adapts to each student''s learning style and pace.',
    'Provide clear explanations, ask probing questions, and offer encouragement. Monitor student engagement and adjust difficulty accordingly.',
    ARRAY['programming', 'mathematics', 'science', 'language learning', 'creative skills']
);

-- Insert sample skills
INSERT INTO public.skills (name, description, category, subcategory, difficulty_level, prerequisites, learning_outcomes, estimated_duration_hours, tags) VALUES
('JavaScript Fundamentals', 'Learn the basics of JavaScript programming', 'Programming', 'Web Development', 'beginner', ARRAY[], ARRAY['Variables and data types', 'Functions', 'Control structures', 'DOM manipulation'], 20, ARRAY['javascript', 'programming', 'web']),
('React Native Development', 'Build mobile apps with React Native', 'Programming', 'Mobile Development', 'intermediate', ARRAY['JavaScript Fundamentals'], ARRAY['Component creation', 'State management', 'Navigation', 'API integration'], 40, ARRAY['react-native', 'mobile', 'cross-platform']),
('Machine Learning Basics', 'Introduction to machine learning concepts', 'Data Science', 'Artificial Intelligence', 'intermediate', ARRAY[], ARRAY['Supervised learning', 'Model evaluation', 'Feature engineering'], 30, ARRAY['ml', 'ai', 'data-science']);

-- Create completion message
SELECT 'SkillBox real-time database schema created successfully! 🚀' as status;
