-- ===================================================================
-- SKILLBOX COMPLETE DATABASE SCHEMA (EDITION HORIZON)
-- Production-Ready Supabase PostgreSQL Schema with AI, AR/VR, and Advanced Features
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

CREATE TYPE user_role AS ENUM ('student', 'teacher', 'creator', 'teacher_approved', 'admin_content', 'admin_teacher_ops', 'admin_super', 'enterprise_admin');
CREATE TYPE content_type AS ENUM ('video', 'audio', 'document', 'quiz', 'assignment', 'live_stream', 'article', 'workshop', 'ar_content', 'vr_content', '3d_model', 'interactive_simulation', 'podcast', 'ebook');
CREATE TYPE class_type AS ENUM ('one_on_one', 'group', 'workshop', 'masterclass', 'webinar', 'ar_session', 'vr_session', 'hybrid');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert', 'master');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'processing', 'disputed', 'cancelled');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'paused', 'trial', 'pending_cancellation');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'paused', 'failed', 'mastered');
CREATE TYPE notification_type AS ENUM ('class_reminder', 'new_message', 'course_update', 'achievement', 'payment', 'system', 'follow_update', 'new_feature', 'ai_insight', 'peer_review', 'assignment_due', 'streak_milestone');
CREATE TYPE report_type AS ENUM ('inappropriate_content', 'spam', 'harassment', 'copyright', 'fake_profile', 'technical_issue', 'billing_dispute', 'other');
CREATE TYPE meeting_platform AS ENUM ('zoom', 'google_meet', 'teams', 'discord', 'custom', 'jitsi', 'agora', 'twilio', 'webrtc_native');
CREATE TYPE content_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected', 'archived', 'flagged', 'under_revision');
CREATE TYPE ai_model_type AS ENUM ('gpt4', 'claude', 'gemini', 'custom', 'vision', 'speech', 'translation');
CREATE TYPE learning_style AS ENUM ('visual', 'auditory', 'kinesthetic', 'reading', 'multimodal');
CREATE TYPE device_type AS ENUM ('mobile', 'tablet', 'desktop', 'ar_headset', 'vr_headset', 'smart_tv');
CREATE TYPE assignment_type AS ENUM ('written', 'video', 'audio', 'project', 'peer_review', 'quiz', 'presentation', 'portfolio');
CREATE TYPE tier_type AS ENUM ('free', 'basic', 'premium', 'enterprise', 'unlimited');
CREATE TYPE currency_code AS ENUM ('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'BRL');

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
    state_province TEXT,
    city TEXT,
    postal_code TEXT,
    location GEOMETRY(POINT, 4326), -- PostGIS for geo-features
    timezone TEXT DEFAULT 'UTC',
    preferred_language TEXT DEFAULT 'en',
    preferred_currency currency_code DEFAULT 'USD',
    learning_style learning_style DEFAULT 'multimodal',
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_online BOOLEAN DEFAULT false,
    last_seen_at TIMESTAMPTZ,
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_data JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false, "in_app": true}',
    privacy_settings JSONB DEFAULT '{"profile_visibility": "public", "activity_visibility": "friends", "location_sharing": false}',
    accessibility_settings JSONB DEFAULT '{}',
    device_info JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Additional fields for teachers/creators
    education JSONB[],
    years_experience INTEGER,
    certifications JSONB[],
    teaching_skills TEXT[],
    intro_video_url TEXT,
    portfolio_url TEXT,
    social_links JSONB DEFAULT '{}',
    verification_documents JSONB DEFAULT '{}',
    
    -- AI & Personalization
    ai_preferences JSONB DEFAULT '{}',
    learning_goals JSONB DEFAULT '{}',
    skill_interests TEXT[],
    learning_path_id UUID,
    
    -- Gamification
    total_points INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    
    -- Statistics
    total_earnings DECIMAL(12,2) DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    total_courses_created INTEGER DEFAULT 0,
    total_content_created INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_hours_taught DECIMAL(8,2) DEFAULT 0,
    
    -- Enterprise features
    enterprise_id UUID,
    department TEXT,
    employee_id TEXT,
    manager_id UUID REFERENCES public.users(id),
    
    -- Security
    two_factor_enabled BOOLEAN DEFAULT false,
    login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMPTZ,
    
    -- Compliance
    data_retention_preference JSONB DEFAULT '{}',
    marketing_consent BOOLEAN DEFAULT false,
    analytics_consent BOOLEAN DEFAULT true,
    terms_accepted_version TEXT,
    terms_accepted_at TIMESTAMPTZ
);

-- Teacher applications
CREATE TABLE public.teacher_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    application_data JSONB NOT NULL,
    status TEXT DEFAULT 'pending_review',
    reviewer_id UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMPTZ,
    interview_scheduled_at TIMESTAMPTZ,
    interview_completed_at TIMESTAMPTZ,
    interview_notes TEXT,
    verification_status TEXT DEFAULT 'pending',
    background_check_status TEXT DEFAULT 'pending',
    notes TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced teacher profiles
CREATE TABLE public.teacher_profiles (
    user_id UUID REFERENCES public.users(id) PRIMARY KEY,
    professional_title TEXT,
    years_of_experience INTEGER DEFAULT 0,
    education TEXT,
    certifications TEXT[],
    specializations TEXT[],
    languages_spoken TEXT[],
    hourly_rate DECIMAL(10,2),
    commission_rate DECIMAL(5,2) DEFAULT 20.00,
    intro_video_url TEXT,
    demo_lesson_url TEXT,
    portfolio_url TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    teaching_style TEXT,
    teaching_methodology TEXT,
    target_audience TEXT[],
    availability_timezone TEXT DEFAULT 'UTC',
    minimum_booking_hours INTEGER DEFAULT 24,
    cancellation_policy TEXT,
    refund_policy TEXT,
    
    -- AI & Analytics
    ai_teaching_score DECIMAL(5,2) DEFAULT 0,
    student_engagement_score DECIMAL(5,2) DEFAULT 0,
    content_quality_score DECIMAL(5,2) DEFAULT 0,
    
    -- Statistics
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0.00,
    total_hours_taught DECIMAL(8,2) DEFAULT 0.00,
    total_courses_created INTEGER DEFAULT 0,
    total_content_pieces INTEGER DEFAULT 0,
    repeat_student_rate DECIMAL(5,2) DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Verification & Compliance
    is_approved BOOLEAN DEFAULT false,
    approval_date TIMESTAMPTZ,
    background_check_completed BOOLEAN DEFAULT false,
    identity_verified BOOLEAN DEFAULT false,
    tax_info_completed BOOLEAN DEFAULT false,
    
    -- Payment & Financial
    stripe_account_id TEXT,
    stripe_account_status TEXT,
    payout_method TEXT DEFAULT 'stripe',
    payout_schedule TEXT DEFAULT 'weekly',
    minimum_payout_amount DECIMAL(10,2) DEFAULT 50.00,
    
    -- Subscription Tiers
    subscription_tiers JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- AI & MACHINE LEARNING TABLES
-- ===================================================================

-- AI Learning Engine Rules
CREATE TABLE public.adaptive_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    rule_name TEXT NOT NULL,
    description TEXT,
    rule_type TEXT NOT NULL, -- 'recommendation', 'difficulty_adjustment', 'content_sequencing'
    conditions JSONB NOT NULL,
    actions JSONB NOT NULL,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User AI Profiles
CREATE TABLE public.user_ai_profiles (
    user_id UUID REFERENCES public.users(id) PRIMARY KEY,
    learning_style_analysis JSONB DEFAULT '{}',
    knowledge_map JSONB DEFAULT '{}',
    difficulty_preferences JSONB DEFAULT '{}',
    engagement_patterns JSONB DEFAULT '{}',
    optimal_study_times JSONB DEFAULT '{}',
    attention_span_minutes INTEGER DEFAULT 30,
    preferred_content_types TEXT[],
    learning_speed_multiplier DECIMAL(3,2) DEFAULT 1.0,
    mastery_threshold DECIMAL(3,2) DEFAULT 0.8,
    
    -- AI Insights
    strengths TEXT[],
    areas_for_improvement TEXT[],
    recommended_next_skills TEXT[],
    personalization_score DECIMAL(5,2) DEFAULT 0,
    
    last_analysis_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Service Usage Tracking
CREATE TABLE public.ai_service_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    service_type ai_model_type NOT NULL,
    endpoint TEXT NOT NULL,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    cost DECIMAL(10,6) DEFAULT 0,
    request_data JSONB,
    response_data JSONB,
    processing_time_ms INTEGER,
    status TEXT DEFAULT 'success',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- INTERNATIONALIZATION & LOCALIZATION
-- ===================================================================

-- Multi-language content
CREATE TABLE public.content_translations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    source_content_id UUID REFERENCES public.learning_content(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL,
    title TEXT,
    description TEXT,
    content_body TEXT,
    subtitle_url TEXT,
    audio_track_url TEXT,
    translated_by UUID REFERENCES public.users(id),
    translation_quality_score DECIMAL(3,2) DEFAULT 0,
    is_ai_generated BOOLEAN DEFAULT false,
    is_human_reviewed BOOLEAN DEFAULT false,
    reviewed_by UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_content_id, language_code)
);

-- Course translations
CREATE TABLE public.course_translations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    source_course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL,
    title TEXT,
    description TEXT,
    learning_objectives TEXT[],
    course_outline TEXT,
    translated_by UUID REFERENCES public.users(id),
    is_ai_generated BOOLEAN DEFAULT false,
    is_human_reviewed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_course_id, language_code)
);

-- ===================================================================
-- ENTERPRISE FEATURES
-- ===================================================================

-- Enterprise organizations
CREATE TABLE public.enterprises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    domain TEXT UNIQUE,
    industry TEXT,
    size_category TEXT, -- 'startup', 'small', 'medium', 'large', 'enterprise'
    billing_address JSONB,
    primary_contact_id UUID REFERENCES public.users(id),
    subscription_tier tier_type DEFAULT 'basic',
    max_users INTEGER DEFAULT 100,
    features_enabled TEXT[],
    branding_config JSONB DEFAULT '{}',
    sso_config JSONB DEFAULT '{}',
    custom_domain TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enterprise user enrollments
CREATE TABLE public.enterprise_enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    enterprise_id UUID REFERENCES public.enterprises(id),
    user_id UUID REFERENCES public.users(id),
    role TEXT DEFAULT 'learner',
    department TEXT,
    cost_center TEXT,
    manager_id UUID REFERENCES public.users(id),
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(enterprise_id, user_id)
);

-- ===================================================================
-- ADVANCED CONTENT FEATURES
-- ===================================================================

-- AR/VR Content specific metadata
CREATE TABLE public.immersive_content_metadata (
    content_id UUID REFERENCES public.learning_content(id) PRIMARY KEY,
    content_format TEXT, -- 'ar_overlay', 'vr_360', 'vr_interactive', '3d_model'
    supported_devices device_type[],
    minimum_space_requirements JSONB, -- for AR
    interaction_types TEXT[], -- 'gaze', 'gesture', 'voice', 'controller'
    
    -- 3D/AR specific
    model_file_url TEXT,
    texture_urls TEXT[],
    animation_urls TEXT[],
    
    -- VR specific  
    scene_file_url TEXT,
    environment_type TEXT,
    movement_type TEXT, -- 'stationary', 'room_scale', 'teleport'
    
    -- Technical requirements
    min_device_specs JSONB,
    file_size_mb DECIMAL(8,2),
    download_size_mb DECIMAL(8,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interactive Content Elements
CREATE TABLE public.interactive_elements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content_id UUID REFERENCES public.learning_content(id),
    element_type TEXT NOT NULL, -- 'hotspot', 'quiz_popup', 'annotation', 'branching_scenario'
    position_data JSONB NOT NULL, -- coordinates, timing, etc.
    content_data JSONB NOT NULL,
    trigger_conditions JSONB DEFAULT '{}',
    is_mandatory BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- ADVANCED ASSESSMENT & ASSIGNMENTS  
-- ===================================================================

-- Assignments
CREATE TABLE public.assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id),
    lesson_id UUID REFERENCES public.course_lessons(id),
    creator_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    assignment_type assignment_type NOT NULL,
    max_points INTEGER DEFAULT 100,
    due_date TIMESTAMPTZ,
    submission_format TEXT[], -- 'text', 'file', 'video', 'audio', 'link'
    max_file_size_mb INTEGER DEFAULT 50,
    allowed_file_types TEXT[],
    is_peer_reviewed BOOLEAN DEFAULT false,
    peer_review_count INTEGER DEFAULT 3,
    auto_grading_enabled BOOLEAN DEFAULT false,
    grading_rubric JSONB,
    late_submission_policy JSONB DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assignment submissions
CREATE TABLE public.assignment_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    assignment_id UUID REFERENCES public.assignments(id),
    student_id UUID REFERENCES public.users(id),
    submission_text TEXT,
    file_urls TEXT[],
    submission_data JSONB, -- flexible field for various submission types
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    is_late BOOLEAN DEFAULT false,
    
    -- Grading
    grade DECIMAL(5,2),
    max_grade DECIMAL(5,2),
    percentage DECIMAL(5,2),
    feedback TEXT,
    graded_by UUID REFERENCES public.users(id),
    graded_at TIMESTAMPTZ,
    
    -- AI Grading
    ai_grade DECIMAL(5,2),
    ai_feedback TEXT,
    ai_confidence_score DECIMAL(3,2),
    human_review_requested BOOLEAN DEFAULT false,
    
    status TEXT DEFAULT 'submitted', -- 'submitted', 'graded', 'returned', 'revision_requested'
    
    UNIQUE(assignment_id, student_id)
);

-- Peer reviews for assignments
CREATE TABLE public.peer_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    submission_id UUID REFERENCES public.assignment_submissions(id),
    reviewer_id UUID REFERENCES public.users(id),
    score DECIMAL(5,2),
    feedback TEXT,
    criteria_scores JSONB, -- scores for individual rubric criteria
    is_helpful BOOLEAN,
    helpful_votes INTEGER DEFAULT 0,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(submission_id, reviewer_id)
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
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ai_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_service_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.immersive_content_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispute_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earned_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_tier_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_announcement_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- USER & PROFILE POLICIES
-- ===================================================================

-- User policies
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public profiles are readable" ON public.users FOR SELECT USING (is_active = true);

-- Teacher application policies
CREATE POLICY "Users can read own applications" ON public.teacher_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own applications" ON public.teacher_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all applications" ON public.teacher_applications FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin_teacher_ops', 'admin_super'))
);

-- Teacher profile policies
CREATE POLICY "Teachers can manage own profile" ON public.teacher_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Approved teacher profiles are public" ON public.teacher_profiles FOR SELECT USING (is_approved = true);

-- AI profile policies
CREATE POLICY "Users can manage own AI profile" ON public.user_ai_profiles FOR ALL USING (auth.uid() = user_id);

-- AI service usage policies (admin only)
CREATE POLICY "Admins can read AI usage" ON public.ai_service_usage FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin_super')
);

-- ===================================================================
-- CONTENT & LEARNING POLICIES
-- ===================================================================

-- Content policies
CREATE POLICY "Published content is readable" ON public.learning_content FOR SELECT USING (is_published = true);
CREATE POLICY "Creators can manage own content" ON public.learning_content FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "Admins can moderate content" ON public.learning_content FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin_content', 'admin_super'))
);

-- Content translation policies
CREATE POLICY "Translators can manage translations" ON public.content_translations FOR ALL USING (auth.uid() = translated_by);
CREATE POLICY "Content translations are publicly readable" ON public.content_translations FOR SELECT USING (true);

-- Interactive elements policies
CREATE POLICY "Content creators can manage interactive elements" ON public.interactive_elements FOR ALL USING (
    EXISTS (SELECT 1 FROM public.learning_content WHERE id = interactive_elements.content_id AND creator_id = auth.uid())
);

-- Course policies
CREATE POLICY "Published courses are readable" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Creators can manage own courses" ON public.courses FOR ALL USING (auth.uid() = creator_id);

-- Course translation policies
CREATE POLICY "Course translations are publicly readable" ON public.course_translations FOR SELECT USING (true);

-- Assignment policies
CREATE POLICY "Assignment creators can manage assignments" ON public.assignments FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "Enrolled students can read course assignments" ON public.assignments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.course_enrollments WHERE course_id = assignments.course_id AND student_id = auth.uid())
);

-- Assignment submission policies
CREATE POLICY "Students can manage own submissions" ON public.assignment_submissions FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Assignment creators can read submissions" ON public.assignment_submissions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.assignments WHERE id = assignment_submissions.assignment_id AND creator_id = auth.uid())
);

-- Peer review policies
CREATE POLICY "Reviewers can manage own reviews" ON public.peer_reviews FOR ALL USING (auth.uid() = reviewer_id);
CREATE POLICY "Submission owners can read their reviews" ON public.peer_reviews FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.assignment_submissions WHERE id = peer_reviews.submission_id AND student_id = auth.uid())
);

-- ===================================================================
-- ENROLLMENT & PROGRESS POLICIES
-- ===================================================================

-- Enrollment policies
CREATE POLICY "Students can read own enrollments" ON public.course_enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can enroll themselves" ON public.course_enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Progress policies
CREATE POLICY "Users can manage own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- Learning path policies
CREATE POLICY "Public learning paths are readable" ON public.learning_paths FOR SELECT USING (is_public = true);
CREATE POLICY "Creators can manage own paths" ON public.learning_paths FOR ALL USING (auth.uid() = created_by);

-- User learning path policies
CREATE POLICY "Users can manage own learning paths" ON public.user_learning_paths FOR ALL USING (auth.uid() = user_id);

-- ===================================================================
-- PORTFOLIO & SHOWCASE POLICIES
-- ===================================================================

-- Portfolio policies
CREATE POLICY "Users can manage own portfolio" ON public.portfolio_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public portfolios are readable" ON public.portfolio_items FOR SELECT USING (is_public = true);

-- Content collection policies
CREATE POLICY "Collection creators can manage collections" ON public.content_collections FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "Public collections are readable" ON public.content_collections FOR SELECT USING (is_public = true);

-- Collection item policies
CREATE POLICY "Collection creators can manage items" ON public.collection_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.content_collections WHERE id = collection_items.collection_id AND creator_id = auth.uid())
);

-- ===================================================================
-- COMMUNITY & SOCIAL POLICIES
-- ===================================================================

-- Study group policies
CREATE POLICY "Study group creators can manage groups" ON public.study_groups FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "Public study groups are readable" ON public.study_groups FOR SELECT USING (is_public = true);

-- Study group member policies
CREATE POLICY "Group members can read membership" ON public.study_group_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can join study groups" ON public.study_group_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Forum policies
CREATE POLICY "Forum categories are publicly readable" ON public.forum_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Forum threads are publicly readable" ON public.forum_threads FOR SELECT USING (true);
CREATE POLICY "Users can create threads" ON public.forum_threads FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Thread creators can update threads" ON public.forum_threads FOR UPDATE USING (auth.uid() = creator_id);

-- Forum post policies
CREATE POLICY "Forum posts are publicly readable" ON public.forum_posts FOR SELECT USING (NOT is_deleted);
CREATE POLICY "Users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Post authors can update posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id);

-- ===================================================================
-- MESSAGING & COMMUNICATION POLICIES
-- ===================================================================

-- Message policies
CREATE POLICY "Users can read conversations they participate in" ON public.conversations FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = id AND user_id = auth.uid()));

CREATE POLICY "Users can read messages in their conversations" ON public.messages FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));

-- Notification policies
CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- ===================================================================
-- FINANCIAL & BUSINESS POLICIES
-- ===================================================================

-- Credit policies
CREATE POLICY "Users can read own credits" ON public.user_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own credit transactions" ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- Payout policies
CREATE POLICY "Teachers can manage own payouts" ON public.payout_requests FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can read own commissions" ON public.earned_commissions FOR SELECT USING (auth.uid() = teacher_id);

-- Teacher tier policies
CREATE POLICY "Teachers can manage own tiers" ON public.teacher_subscription_tiers FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Public tiers are readable" ON public.teacher_subscription_tiers FOR SELECT USING (is_active = true);

-- Tier subscription policies
CREATE POLICY "Users can read own subscriptions" ON public.teacher_tier_subscriptions FOR SELECT USING (auth.uid() = subscriber_id);
CREATE POLICY "Users can subscribe" ON public.teacher_tier_subscriptions FOR INSERT WITH CHECK (auth.uid() = subscriber_id);

-- ===================================================================
-- GAMIFICATION & ANALYTICS POLICIES
-- ===================================================================

-- Streak policies
CREATE POLICY "Users can read own streaks" ON public.user_streaks FOR SELECT USING (auth.uid() = user_id);

-- Skill mastery policies
CREATE POLICY "Users can read own mastery" ON public.skill_mastery FOR SELECT USING (auth.uid() = user_id);

-- Activity log policies (admin readable, user writable)
CREATE POLICY "Users can log own activities" ON public.user_activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can read activity logs" ON public.user_activity_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin_super', 'admin_content'))
);

-- ===================================================================
-- ENTERPRISE POLICIES
-- ===================================================================

-- Enterprise policies
CREATE POLICY "Enterprise contacts can read own enterprise" ON public.enterprises FOR SELECT USING (auth.uid() = primary_contact_id);
CREATE POLICY "Enterprise admins can read enrollments" ON public.enterprise_enrollments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.enterprises WHERE id = enterprise_enrollments.enterprise_id AND primary_contact_id = auth.uid())
);

-- ===================================================================
-- DISPUTE & MODERATION POLICIES
-- ===================================================================

-- Dispute policies
CREATE POLICY "Dispute participants can read disputes" ON public.disputes FOR SELECT USING (
    auth.uid() = complainant_id OR auth.uid() = respondent_id OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin_super', 'admin_teacher_ops'))
);
CREATE POLICY "Users can create disputes" ON public.disputes FOR INSERT WITH CHECK (auth.uid() = complainant_id);

-- Dispute message policies
CREATE POLICY "Dispute participants can read messages" ON public.dispute_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.disputes WHERE id = dispute_messages.dispute_id AND 
            (complainant_id = auth.uid() OR respondent_id = auth.uid() OR assigned_moderator_id = auth.uid()))
);

-- ===================================================================
-- ANNOUNCEMENT POLICIES
-- ===================================================================

-- Announcement policies
CREATE POLICY "Announcements are publicly readable" ON public.announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Users can track own interactions" ON public.user_announcement_interactions FOR ALL USING (auth.uid() = user_id);

-- ===================================================================
-- INDEXES FOR PERFORMANCE
-- ===================================================================

-- User indexes
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_location ON public.users USING GIST(location);
CREATE INDEX idx_users_enterprise ON public.users(enterprise_id);
CREATE INDEX idx_users_learning_style ON public.users(learning_style);

-- AI & Analytics indexes
CREATE INDEX idx_ai_usage_user ON public.ai_service_usage(user_id);
CREATE INDEX idx_ai_usage_created ON public.ai_service_usage(created_at);
CREATE INDEX idx_activity_logs_user ON public.user_activity_logs(user_id);
CREATE INDEX idx_activity_logs_type ON public.user_activity_logs(activity_type);
CREATE INDEX idx_activity_logs_created ON public.user_activity_logs(created_at);

-- Content indexes
CREATE INDEX idx_learning_content_creator ON public.learning_content(creator_id);
CREATE INDEX idx_learning_content_skill ON public.learning_content(skill_id);
CREATE INDEX idx_learning_content_published ON public.learning_content(is_published);
CREATE INDEX idx_learning_content_type ON public.learning_content(content_type);
CREATE INDEX idx_learning_content_status ON public.learning_content(content_status);

-- Course indexes
CREATE INDEX idx_courses_creator ON public.courses(creator_id);
CREATE INDEX idx_courses_skill ON public.courses(skill_id);
CREATE INDEX idx_course_enrollments_student ON public.course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_course ON public.course_enrollments(course_id);

-- Assignment indexes
CREATE INDEX idx_assignments_course ON public.assignments(course_id);
CREATE INDEX idx_assignments_creator ON public.assignments(creator_id);
CREATE INDEX idx_assignment_submissions_student ON public.assignment_submissions(student_id);
CREATE INDEX idx_assignment_submissions_assignment ON public.assignment_submissions(assignment_id);

-- Class indexes
CREATE INDEX idx_live_classes_teacher ON public.live_classes(teacher_id);
CREATE INDEX idx_class_sessions_class ON public.class_sessions(class_id);
CREATE INDEX idx_class_sessions_time ON public.class_sessions(scheduled_start_time);
CREATE INDEX idx_class_bookings_student ON public.class_bookings(student_id);

-- Availability indexes
CREATE INDEX idx_teacher_availability_teacher ON public.teacher_availability_slots(teacher_id);
CREATE INDEX idx_teacher_availability_time ON public.teacher_availability_slots(start_time, end_time);

-- Message indexes
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);

-- Progress indexes
CREATE INDEX idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_content ON public.user_progress(content_id);

-- Financial indexes
CREATE INDEX idx_credit_transactions_user ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created ON public.credit_transactions(created_at);
CREATE INDEX idx_payout_requests_teacher ON public.payout_requests(teacher_id);
CREATE INDEX idx_earned_commissions_teacher ON public.earned_commissions(teacher_id);

-- Forum indexes
CREATE INDEX idx_forum_threads_category ON public.forum_threads(category_id);
CREATE INDEX idx_forum_threads_creator ON public.forum_threads(creator_id);
CREATE INDEX idx_forum_posts_thread ON public.forum_posts(thread_id);
CREATE INDEX idx_forum_posts_author ON public.forum_posts(author_id);

-- Gamification indexes
CREATE INDEX idx_skill_mastery_user ON public.skill_mastery(user_id);
CREATE INDEX idx_skill_mastery_skill ON public.skill_mastery(skill_id);
CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id);

-- Search indexes (Full-text search)
CREATE INDEX idx_learning_content_search ON public.learning_content USING GIN (to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_courses_search ON public.courses USING GIN (to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_users_search ON public.users USING GIN (to_tsvector('english', full_name || ' ' || COALESCE(bio, '')));
CREATE INDEX idx_forum_threads_search ON public.forum_threads USING GIN (to_tsvector('english', title || ' ' || content));

-- Geographic indexes
CREATE INDEX idx_users_country ON public.users(country);
CREATE INDEX idx_users_timezone ON public.users(timezone);

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

-- Apply to relevant tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teacher_applications_updated_at BEFORE UPDATE ON public.teacher_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teacher_profiles_updated_at BEFORE UPDATE ON public.teacher_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_ai_profiles_updated_at BEFORE UPDATE ON public.user_ai_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_translations_updated_at BEFORE UPDATE ON public.content_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_content_updated_at BEFORE UPDATE ON public.learning_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_immersive_content_updated_at BEFORE UPDATE ON public.immersive_content_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_groups_updated_at BEFORE UPDATE ON public.study_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON public.disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON public.learning_paths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON public.user_credits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teacher_tiers_updated_at BEFORE UPDATE ON public.teacher_subscription_tiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tier_subscriptions_updated_at BEFORE UPDATE ON public.teacher_tier_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_streaks_updated_at BEFORE UPDATE ON public.user_streaks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skill_mastery_updated_at BEFORE UPDATE ON public.skill_mastery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_collections_updated_at BEFORE UPDATE ON public.content_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_threads_updated_at BEFORE UPDATE ON public.forum_threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- Function to update user streaks
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
    today_date DATE;
    yesterday_date DATE;
    current_streak_val INTEGER;
    last_activity_date_val DATE;
BEGIN
    today_date := CURRENT_DATE;
    yesterday_date := today_date - INTERVAL '1 day';
    
    -- Get current streak info
    SELECT current_streak, last_activity_date 
    INTO current_streak_val, last_activity_date_val
    FROM public.user_streaks 
    WHERE user_id = NEW.user_id;
    
    -- If no streak record exists, create one
    IF NOT FOUND THEN
        INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_activity_date, total_streak_days)
        VALUES (NEW.user_id, 1, 1, today_date, 1);
        RETURN NEW;
    END IF;
    
    -- Update streak logic
    IF last_activity_date_val = today_date THEN
        -- Already counted today, no change
        RETURN NEW;
    ELSIF last_activity_date_val = yesterday_date THEN
        -- Consecutive day, increment streak
        UPDATE public.user_streaks 
        SET 
            current_streak = current_streak + 1,
            longest_streak = GREATEST(longest_streak, current_streak + 1),
            last_activity_date = today_date,
            total_streak_days = total_streak_days + 1
        WHERE user_id = NEW.user_id;
    ELSE
        -- Streak broken, reset
        UPDATE public.user_streaks 
        SET 
            current_streak = 1,
            last_activity_date = today_date,
            total_streak_days = total_streak_days + 1
        WHERE user_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate skill mastery
CREATE OR REPLACE FUNCTION update_skill_mastery()
RETURNS TRIGGER AS $$
DECLARE
    content_skill_id UUID;
    mastery_progress DECIMAL;
    total_content INTEGER;
    completed_content INTEGER;
BEGIN
    -- Get skill_id from content if available
    SELECT skill_id INTO content_skill_id 
    FROM public.learning_content 
    WHERE id = NEW.content_id;
    
    IF content_skill_id IS NOT NULL AND NEW.progress_status = 'completed' THEN
        -- Count total and completed content for this skill
        SELECT COUNT(*) INTO total_content
        FROM public.learning_content
        WHERE skill_id = content_skill_id AND is_published = true;
        
        SELECT COUNT(*) INTO completed_content
        FROM public.user_progress up
        JOIN public.learning_content lc ON up.content_id = lc.id
        WHERE up.user_id = NEW.user_id 
        AND lc.skill_id = content_skill_id 
        AND up.progress_status = 'completed';
        
        -- Calculate mastery progress
        mastery_progress := (completed_content::DECIMAL / GREATEST(total_content, 1)::DECIMAL) * 100;
        
        -- Update or insert skill mastery
        INSERT INTO public.skill_mastery (user_id, skill_id, progress_percentage, last_practiced_at)
        VALUES (NEW.user_id, content_skill_id, mastery_progress, NOW())
        ON CONFLICT (user_id, skill_id) 
        DO UPDATE SET 
            progress_percentage = mastery_progress,
            last_practiced_at = NOW(),
            mastered_at = CASE 
                WHEN mastery_progress >= 80 AND public.skill_mastery.mastered_at IS NULL 
                THEN NOW() 
                ELSE public.skill_mastery.mastered_at 
            END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update forum counters
CREATE OR REPLACE FUNCTION update_forum_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'forum_threads' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE public.forum_categories 
            SET thread_count = thread_count + 1,
                last_post_at = NEW.created_at
            WHERE id = NEW.category_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE public.forum_categories 
            SET thread_count = thread_count - 1
            WHERE id = OLD.category_id;
        END IF;
    END IF;
    
    IF TG_TABLE_NAME = 'forum_posts' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE public.forum_threads 
            SET reply_count = reply_count + 1,
                last_reply_at = NEW.created_at,
                last_reply_by = NEW.author_id
            WHERE id = NEW.thread_id;
            
            UPDATE public.forum_categories 
            SET post_count = post_count + 1,
                last_post_at = NEW.created_at
            WHERE id = (SELECT category_id FROM public.forum_threads WHERE id = NEW.thread_id);
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE public.forum_threads 
            SET reply_count = reply_count - 1
            WHERE id = OLD.thread_id;
            
            UPDATE public.forum_categories 
            SET post_count = post_count - 1
            WHERE id = (SELECT category_id FROM public.forum_threads WHERE id = OLD.thread_id);
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to handle credit transactions
CREATE OR REPLACE FUNCTION process_credit_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.transaction_type = 'earned' OR NEW.transaction_type = 'purchased' OR NEW.transaction_type = 'gifted' THEN
            -- Add credits
            INSERT INTO public.user_credits (user_id, available_credits, total_earned, last_activity_at)
            VALUES (NEW.user_id, NEW.amount, 
                   CASE WHEN NEW.transaction_type = 'earned' THEN NEW.amount ELSE 0 END,
                   NOW())
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                available_credits = public.user_credits.available_credits + NEW.amount,
                total_earned = public.user_credits.total_earned + 
                              CASE WHEN NEW.transaction_type = 'earned' THEN NEW.amount ELSE 0 END,
                last_activity_at = NOW();
                
        ELSIF NEW.transaction_type = 'spent' OR NEW.transaction_type = 'refunded' THEN
            -- Deduct/refund credits
            UPDATE public.user_credits 
            SET 
                available_credits = available_credits + 
                                  CASE WHEN NEW.transaction_type = 'spent' THEN -NEW.amount ELSE NEW.amount END,
                total_spent = total_spent + 
                             CASE WHEN NEW.transaction_type = 'spent' THEN NEW.amount ELSE -NEW.amount END,
                last_activity_at = NOW()
            WHERE user_id = NEW.user_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_teacher_stats_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_teacher_stats();

CREATE TRIGGER update_user_streak_trigger 
    AFTER INSERT ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION update_user_streak();

CREATE TRIGGER update_skill_mastery_trigger 
    AFTER INSERT OR UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION update_skill_mastery();

CREATE TRIGGER update_forum_counters_threads_trigger 
    AFTER INSERT OR DELETE ON public.forum_threads
    FOR EACH ROW EXECUTE FUNCTION update_forum_counters();

CREATE TRIGGER update_forum_counters_posts_trigger 
    AFTER INSERT OR DELETE ON public.forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_forum_counters();

CREATE TRIGGER process_credit_transaction_trigger 
    AFTER INSERT ON public.credit_transactions
    FOR EACH ROW EXECUTE FUNCTION process_credit_transaction();

-- ===================================================================
-- PORTFOLIO & SHOWCASE FEATURES
-- ===================================================================

-- Student digital portfolios
CREATE TABLE public.portfolio_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    item_type TEXT NOT NULL, -- 'project', 'assignment', 'certificate', 'media'
    content_urls TEXT[],
    thumbnail_url TEXT,
    skills_demonstrated TEXT[],
    course_id UUID REFERENCES public.courses(id),
    assignment_id UUID REFERENCES public.assignments(id),
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- STUDY GROUPS & COLLABORATIVE LEARNING
-- ===================================================================

-- Study groups
CREATE TABLE public.study_groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    skill_id UUID REFERENCES public.skills(id),
    course_id UUID REFERENCES public.courses(id),
    creator_id UUID REFERENCES public.users(id),
    max_members INTEGER DEFAULT 20,
    current_members INTEGER DEFAULT 1,
    is_public BOOLEAN DEFAULT true,
    meeting_schedule JSONB, -- recurring meeting times
    meeting_platform meeting_platform DEFAULT 'discord',
    meeting_link TEXT,
    study_materials JSONB DEFAULT '[]',
    goals TEXT[],
    rules TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study group memberships
CREATE TABLE public.study_group_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.study_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id),
    role TEXT DEFAULT 'member', -- 'creator', 'moderator', 'member'
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    contribution_score DECIMAL(5,2) DEFAULT 0,
    UNIQUE(group_id, user_id)
);

-- ===================================================================
-- DISPUTE RESOLUTION SYSTEM
-- ===================================================================

-- Disputes
CREATE TABLE public.disputes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    complainant_id UUID REFERENCES public.users(id),
    respondent_id UUID REFERENCES public.users(id),
    dispute_type TEXT NOT NULL, -- 'refund', 'content_quality', 'behavior', 'technical'
    related_entity_type TEXT, -- 'course', 'class', 'content', 'message'
    related_entity_id UUID,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence_urls TEXT[],
    status TEXT DEFAULT 'open', -- 'open', 'investigating', 'mediation', 'resolved', 'closed'
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    assigned_moderator_id UUID REFERENCES public.users(id),
    resolution TEXT,
    resolution_date TIMESTAMPTZ,
    refund_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dispute messages/communications
CREATE TABLE public.dispute_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dispute_id UUID REFERENCES public.disputes(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id),
    message_text TEXT NOT NULL,
    attachments TEXT[],
    is_internal BOOLEAN DEFAULT false, -- internal moderator notes
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- ADVANCED ANALYTICS & INSIGHTS
-- ===================================================================

-- Learning path analytics
CREATE TABLE public.learning_paths (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    skill_ids UUID[],
    target_audience TEXT[],
    estimated_duration_hours INTEGER,
    difficulty_progression JSONB, -- how difficulty increases through path
    prerequisite_skills TEXT[],
    learning_outcomes TEXT[],
    content_sequence JSONB, -- ordered list of content/courses
    completion_criteria JSONB,
    is_ai_generated BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.users(id),
    is_public BOOLEAN DEFAULT true,
    enrollment_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User learning path progress
CREATE TABLE public.user_learning_paths (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    learning_path_id UUID REFERENCES public.learning_paths(id),
    current_step INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    estimated_completion_date TIMESTAMPTZ,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, learning_path_id)
);

-- Detailed user activity logs
CREATE TABLE public.user_activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    session_id TEXT,
    activity_type TEXT NOT NULL, -- 'content_view', 'lesson_complete', 'quiz_attempt', 'search', 'bookmark', etc.
    entity_type TEXT, -- 'content', 'course', 'user', 'class'
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    device_info JSONB DEFAULT '{}',
    location_info JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- CREDIT SYSTEM & ALTERNATIVE PAYMENTS
-- ===================================================================

-- User credit accounts
CREATE TABLE public.user_credits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) UNIQUE,
    available_credits DECIMAL(10,2) DEFAULT 0,
    pending_credits DECIMAL(10,2) DEFAULT 0,
    total_earned DECIMAL(10,2) DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    credit_tier TEXT DEFAULT 'basic', -- affects earning rates
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit transactions
CREATE TABLE public.credit_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    transaction_type TEXT NOT NULL, -- 'earned', 'spent', 'purchased', 'gifted', 'refunded'
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    reference_type TEXT, -- what earned/spent credits
    reference_id UUID,
    exchange_rate DECIMAL(8,4), -- credits per USD for purchases
    expires_at TIMESTAMPTZ,
    is_processed BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- ADVANCED SCHEDULING & AVAILABILITY
-- ===================================================================

-- Teacher blocked dates (holidays, unavailable periods)
CREATE TABLE public.teacher_blocked_dates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID REFERENCES public.users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Detailed availability slots
CREATE TABLE public.teacher_availability_slots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID REFERENCES public.users(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_available BOOLEAN DEFAULT true,
    slot_type TEXT DEFAULT 'regular', -- 'regular', 'premium', 'group_only'
    max_bookings INTEGER DEFAULT 1,
    current_bookings INTEGER DEFAULT 0,
    price_override DECIMAL(10,2), -- override default hourly rate
    buffer_before_minutes INTEGER DEFAULT 15,
    buffer_after_minutes INTEGER DEFAULT 15,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- FORUM & COMMUNITY FEATURES  
-- ===================================================================

-- Forum categories
CREATE TABLE public.forum_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    color_code TEXT,
    sort_order INTEGER DEFAULT 0,
    parent_category_id UUID REFERENCES public.forum_categories(id),
    moderator_ids UUID[],
    posting_permission TEXT DEFAULT 'all', -- 'all', 'students', 'teachers', 'verified'
    is_active BOOLEAN DEFAULT true,
    thread_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    last_post_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum threads
CREATE TABLE public.forum_threads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES public.forum_categories(id),
    creator_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    is_solved BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMPTZ,
    last_reply_by UUID REFERENCES public.users(id),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum posts (replies)
CREATE TABLE public.forum_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.users(id),
    content TEXT NOT NULL,
    parent_post_id UUID REFERENCES public.forum_posts(id),
    is_solution BOOLEAN DEFAULT false,
    like_count INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT false,
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- PAYOUT & FINANCIAL MANAGEMENT
-- ===================================================================

-- Teacher payout requests
CREATE TABLE public.payout_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID REFERENCES public.users(id),
    amount_requested DECIMAL(10,2) NOT NULL,
    amount_fee DECIMAL(10,2) DEFAULT 0,
    amount_net DECIMAL(10,2) NOT NULL,
    currency currency_code DEFAULT 'USD',
    payout_method TEXT NOT NULL, -- 'stripe', 'paypal', 'bank_transfer'
    payout_details JSONB, -- account info, encrypted
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
    processed_at TIMESTAMPTZ,
    stripe_transfer_id TEXT,
    failure_reason TEXT,
    notes TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commission tracking
CREATE TABLE public.earned_commissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID REFERENCES public.users(id),
    transaction_id UUID REFERENCES public.transactions(id),
    gross_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    currency currency_code DEFAULT 'USD',
    is_paid_out BOOLEAN DEFAULT false,
    paid_out_at TIMESTAMPTZ,
    payout_request_id UUID REFERENCES public.payout_requests(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- SUBSCRIPTION TIERS & PREMIUM FEATURES
-- ===================================================================

-- Teacher subscription tiers
CREATE TABLE public.teacher_subscription_tiers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID REFERENCES public.users(id),
    tier_name TEXT NOT NULL,
    description TEXT,
    monthly_price DECIMAL(10,2) NOT NULL,
    currency currency_code DEFAULT 'USD',
    benefits TEXT[],
    max_subscribers INTEGER,
    current_subscribers INTEGER DEFAULT 0,
    exclusive_content_ids UUID[],
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User subscription to teacher tiers
CREATE TABLE public.teacher_tier_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subscriber_id UUID REFERENCES public.users(id),
    teacher_id UUID REFERENCES public.users(id),
    tier_id UUID REFERENCES public.teacher_subscription_tiers(id),
    stripe_subscription_id TEXT,
    status subscription_status DEFAULT 'active',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(subscriber_id, tier_id)
);

-- ===================================================================
-- ENHANCED GAMIFICATION
-- ===================================================================

-- User learning streaks
CREATE TABLE public.user_streaks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    streak_multiplier DECIMAL(3,2) DEFAULT 1.0,
    streak_type TEXT DEFAULT 'daily_learning', -- 'daily_learning', 'weekly_goals', 'course_completion'
    total_streak_days INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill mastery tracking
CREATE TABLE public.skill_mastery (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    skill_id UUID REFERENCES public.skills(id),
    mastery_level skill_level DEFAULT 'beginner',
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    total_hours_practiced DECIMAL(8,2) DEFAULT 0,
    assessments_passed INTEGER DEFAULT 0,
    projects_completed INTEGER DEFAULT 0,
    peer_endorsements INTEGER DEFAULT 0,
    teacher_verifications INTEGER DEFAULT 0,
    last_practiced_at TIMESTAMPTZ,
    mastered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- ===================================================================
-- CONTENT CURATION & COLLECTIONS
-- ===================================================================

-- Content collections/playlists
CREATE TABLE public.content_collections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    creator_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    content_count INTEGER DEFAULT 0,
    total_duration_seconds INTEGER DEFAULT 0,
    difficulty_level skill_level,
    tags TEXT[],
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items within collections
CREATE TABLE public.collection_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    collection_id UUID REFERENCES public.content_collections(id) ON DELETE CASCADE,
    content_id UUID REFERENCES public.learning_content(id),
    course_id UUID REFERENCES public.courses(id),
    sort_order INTEGER DEFAULT 0,
    added_by UUID REFERENCES public.users(id),
    notes TEXT,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(collection_id, content_id, course_id)
);

-- ===================================================================
-- ANNOUNCEMENTS & COMMUNICATIONS
-- ===================================================================

-- Platform announcements
CREATE TABLE public.announcements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    announcement_type TEXT DEFAULT 'general', -- 'general', 'maintenance', 'feature', 'urgent'
    target_audience TEXT[] DEFAULT '{"all"}', -- 'all', 'students', 'teachers', 'enterprise'
    priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high'
    display_locations TEXT[] DEFAULT '{"dashboard"}', -- 'dashboard', 'banner', 'notification'
    is_dismissible BOOLEAN DEFAULT true,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    created_by UUID REFERENCES public.users(id),
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User announcement interactions
CREATE TABLE public.user_announcement_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    announcement_id UUID REFERENCES public.announcements(id),
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    dismissed_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    UNIQUE(user_id, announcement_id)
);

-- ===================================================================
-- INITIAL DATA
-- ===================================================================

-- Insert skill categories with enhanced data
INSERT INTO public.skill_categories (name, description, icon_url, color_code, sort_order) VALUES
('Technology', 'Programming, Web Development, Data Science, AI/ML', 'tech-icon.png', '#3B82F6', 1),
('Design', 'UI/UX, Graphic Design, Animation, 3D Design', 'design-icon.png', '#8B5CF6', 2),
('Business', 'Marketing, Management, Finance, Entrepreneurship', 'business-icon.png', '#10B981', 3),
('Languages', 'English, Spanish, French, Mandarin, Communication', 'language-icon.png', '#F59E0B', 4),
('Arts', 'Music, Photography, Writing, Digital Art', 'arts-icon.png', '#EF4444', 5),
('Health', 'Fitness, Nutrition, Mental Health, Wellness', 'health-icon.png', '#06B6D4', 6),
('Science', 'Physics, Chemistry, Biology, Environmental Science', 'science-icon.png', '#84CC16', 7),
('Personal Development', 'Leadership, Communication, Time Management, Productivity', 'personal-icon.png', '#F97316', 8),
('Education', 'Teaching Methods, Curriculum Design, Educational Technology', 'education-icon.png', '#EC4899', 9),
('Creative Industries', 'Film, Gaming, Content Creation, Social Media', 'creative-icon.png', '#14B8A6', 10);

-- Insert comprehensive skills
INSERT INTO public.skills (category_id, name, description, icon_url) 
SELECT 
    sc.id,
    skill_name,
    skill_description,
    skill_icon
FROM public.skill_categories sc
CROSS JOIN (VALUES 
    -- Technology Skills
    ('JavaScript', 'Master modern JavaScript for web development', 'js-icon.png'),
    ('Python', 'Learn Python for data science and web development', 'python-icon.png'),
    ('React', 'Build modern web applications with React', 'react-icon.png'),
    ('Node.js', 'Server-side JavaScript development', 'nodejs-icon.png'),
    ('SQL', 'Database management and data analysis', 'sql-icon.png'),
    ('Machine Learning', 'AI and ML algorithms and applications', 'ml-icon.png'),
    ('Mobile Development', 'iOS and Android app development', 'mobile-icon.png'),
    ('Cloud Computing', 'AWS, Azure, and cloud architecture', 'cloud-icon.png'),
    ('Cybersecurity', 'Information security and ethical hacking', 'security-icon.png'),
    ('DevOps', 'CI/CD, containerization, and automation', 'devops-icon.png'),
    
    -- Design Skills
    ('UI/UX Design', 'User interface and experience design', 'ux-icon.png'),
    ('Photoshop', 'Image editing and digital art creation', 'photoshop-icon.png'),
    ('Figma', 'Collaborative design and prototyping', 'figma-icon.png'),
    ('Illustrator', 'Vector graphics and logo design', 'illustrator-icon.png'),
    ('After Effects', 'Motion graphics and video effects', 'ae-icon.png'),
    ('3D Modeling', 'Blender and 3D design fundamentals', '3d-icon.png'),
    ('Typography', 'Font design and text composition', 'typography-icon.png'),
    ('Brand Design', 'Logo design and brand identity', 'brand-icon.png'),
    
    -- Business Skills
    ('Digital Marketing', 'SEO, SEM, and social media marketing', 'marketing-icon.png'),
    ('Project Management', 'Agile, Scrum, and project coordination', 'pm-icon.png'),
    ('Excel', 'Advanced spreadsheet analysis and automation', 'excel-icon.png'),
    ('PowerPoint', 'Presentation design and storytelling', 'ppt-icon.png'),
    ('Business Strategy', 'Strategic planning and market analysis', 'strategy-icon.png'),
    ('Financial Analysis', 'Investment analysis and financial modeling', 'finance-icon.png'),
    ('Sales', 'Sales techniques and customer relationship management', 'sales-icon.png'),
    ('Entrepreneurship', 'Startup creation and business development', 'startup-icon.png'),
    
    -- Language Skills
    ('English', 'English language proficiency and communication', 'english-icon.png'),
    ('Spanish', 'Spanish language learning and conversation', 'spanish-icon.png'),
    ('French', 'French language and culture', 'french-icon.png'),
    ('Mandarin', 'Mandarin Chinese language and characters', 'mandarin-icon.png'),
    ('German', 'German language and grammar', 'german-icon.png'),
    ('Japanese', 'Japanese language and cultural context', 'japanese-icon.png'),
    ('Public Speaking', 'Presentation skills and confidence building', 'speaking-icon.png'),
    ('Writing', 'Creative and technical writing skills', 'writing-icon.png'),
    
    -- Arts Skills
    ('Guitar', 'Acoustic and electric guitar techniques', 'guitar-icon.png'),
    ('Piano', 'Piano playing and music theory', 'piano-icon.png'),
    ('Photography', 'Digital photography and photo editing', 'photo-icon.png'),
    ('Creative Writing', 'Fiction, poetry, and storytelling', 'writing-icon.png'),
    ('Singing', 'Vocal techniques and performance', 'singing-icon.png'),
    ('Drawing', 'Traditional and digital illustration', 'drawing-icon.png'),
    ('Music Production', 'Audio engineering and beat making', 'music-icon.png'),
    ('Video Editing', 'Video production and post-processing', 'video-icon.png'),
    
    -- Health Skills
    ('Yoga', 'Yoga practice and mindfulness', 'yoga-icon.png'),
    ('Meditation', 'Mindfulness and stress reduction', 'meditation-icon.png'),
    ('Nutrition', 'Healthy eating and meal planning', 'nutrition-icon.png'),
    ('Personal Training', 'Fitness coaching and exercise science', 'fitness-icon.png'),
    ('Mental Health', 'Psychology and emotional wellness', 'mental-icon.png'),
    ('Cooking', 'Culinary skills and food preparation', 'cooking-icon.png'),
    
    -- Science Skills
    ('Physics', 'Fundamental physics concepts and applications', 'physics-icon.png'),
    ('Chemistry', 'Chemical principles and laboratory techniques', 'chemistry-icon.png'),
    ('Biology', 'Life sciences and biological systems', 'biology-icon.png'),
    ('Mathematics', 'Advanced math and problem-solving', 'math-icon.png'),
    ('Data Science', 'Statistical analysis and data visualization', 'data-icon.png'),
    ('Environmental Science', 'Sustainability and climate studies', 'env-icon.png'),
    
    -- Personal Development Skills
    ('Leadership', 'Team management and leadership skills', 'leadership-icon.png'),
    ('Time Management', 'Productivity and organizational skills', 'time-icon.png'),
    ('Negotiation', 'Conflict resolution and deal making', 'negotiation-icon.png'),
    ('Critical Thinking', 'Problem-solving and analytical skills', 'thinking-icon.png'),
    ('Emotional Intelligence', 'Self-awareness and empathy', 'eq-icon.png'),
    ('Productivity', 'Efficiency systems and habit formation', 'productivity-icon.png')
) AS skills(skill_name, skill_description, skill_icon)
WHERE sc.name = CASE 
    WHEN skill_name IN ('JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Mobile Development', 'Cloud Computing', 'Cybersecurity', 'DevOps') THEN 'Technology'
    WHEN skill_name IN ('UI/UX Design', 'Photoshop', 'Figma', 'Illustrator', 'After Effects', '3D Modeling', 'Typography', 'Brand Design') THEN 'Design'
    WHEN skill_name IN ('Digital Marketing', 'Project Management', 'Excel', 'PowerPoint', 'Business Strategy', 'Financial Analysis', 'Sales', 'Entrepreneurship') THEN 'Business'
    WHEN skill_name IN ('English', 'Spanish', 'French', 'Mandarin', 'German', 'Japanese', 'Public Speaking', 'Writing') THEN 'Languages'
    WHEN skill_name IN ('Guitar', 'Piano', 'Photography', 'Creative Writing', 'Singing', 'Drawing', 'Music Production', 'Video Editing') THEN 'Arts'
    WHEN skill_name IN ('Yoga', 'Meditation', 'Nutrition', 'Personal Training', 'Mental Health', 'Cooking') THEN 'Health'
    WHEN skill_name IN ('Physics', 'Chemistry', 'Biology', 'Mathematics', 'Data Science', 'Environmental Science') THEN 'Science'
    WHEN skill_name IN ('Leadership', 'Time Management', 'Negotiation', 'Critical Thinking', 'Emotional Intelligence', 'Productivity') THEN 'Personal Development'
END;

-- Insert comprehensive achievements
INSERT INTO public.achievements (name, description, icon_url, points, criteria) VALUES
-- Learning Milestones
('First Steps', 'Complete your first lesson', 'first-steps.png', 10, '{"lessons_completed": 1}'),
('Quick Learner', 'Complete 5 lessons in one day', 'quick-learner.png', 25, '{"lessons_per_day": 5}'),
('Dedicated Student', 'Study for 7 consecutive days', 'dedicated.png', 50, '{"consecutive_days": 7}'),
('Course Completionist', 'Complete your first course', 'course-complete.png', 100, '{"courses_completed": 1}'),
('Speed Demon', 'Complete a course in under 7 days', 'speed.png', 75, '{"course_completion_days": 7}'),
('Marathon Learner', 'Study for 30 consecutive days', 'marathon.png', 200, '{"consecutive_days": 30}'),

-- Social Achievements
('Review Master', 'Leave 10 helpful reviews', 'reviewer.png', 75, '{"reviews_given": 10}'),
('Social Butterfly', 'Follow 20 instructors', 'social.png', 30, '{"instructors_followed": 20}'),
('Community Helper', 'Answer 50 questions in forums', 'helper.png', 100, '{"forum_answers": 50}'),
('Mentor', 'Help 100 fellow students', 'mentor.png', 150, '{"students_helped": 100}'),

-- Content Engagement
('Knowledge Seeker', 'Bookmark 50 pieces of content', 'bookmarks.png', 40, '{"bookmarks_created": 50}'),
('Explorer', 'Try content from 10 different categories', 'explorer.png', 60, '{"categories_explored": 10}'),
('Night Owl', 'Study after 10 PM for 10 sessions', 'night-owl.png', 25, '{"late_night_sessions": 10}'),
('Early Bird', 'Join a class at 6 AM', 'early-bird.png', 20, '{"early_morning_classes": 1}'),

-- Skill Mastery
('Skill Sampler', 'Start learning 5 different skills', 'sampler.png', 30, '{"skills_started": 5}'),
('Jack of All Trades', 'Reach intermediate level in 10 skills', 'jack-trades.png', 150, '{"intermediate_skills": 10}'),
('Master Craftsperson', 'Master 3 skills completely', 'master.png', 300, '{"mastered_skills": 3}'),
('Polyglot', 'Learn 3 different languages', 'polyglot.png', 200, '{"languages_learned": 3}'),

-- Teaching & Creation
('Content Creator', 'Upload your first piece of content', 'creator.png', 50, '{"content_uploaded": 1}'),
('Popular Teacher', 'Get 100 students enrolled', 'popular.png', 200, '{"students_enrolled": 100}'),
('Five Star Educator', 'Maintain 5-star rating with 50+ reviews', 'five-star.png', 300, '{"avg_rating": 5, "min_reviews": 50}'),

-- Engagement & Consistency
('Forum Regular', 'Post in forums for 30 days', 'forum-regular.png', 80, '{"forum_activity_days": 30}'),
('Assignment Ace', 'Submit 20 assignments on time', 'assignment-ace.png', 100, '{"on_time_assignments": 20}'),
('Peer Reviewer', 'Complete 25 peer reviews', 'peer-reviewer.png', 75, '{"peer_reviews_completed": 25}'),

-- Special Achievements
('Beta Tester', 'Try new features before official release', 'beta.png', 50, '{"beta_features_tried": 5}'),
('Anniversary Learner', 'Active for one full year', 'anniversary.png', 500, '{"days_active": 365}'),
('Global Citizen', 'Learn with students from 20+ countries', 'global.png', 100, '{"countries_interacted": 20}');

-- Insert forum categories
INSERT INTO public.forum_categories (name, description, icon_url, color_code, sort_order, posting_permission) VALUES
('General Discussion', 'General chat and introductions', 'chat-icon.png', '#6B7280', 1, 'all'),
('Study Groups', 'Find and create study groups', 'group-icon.png', '#10B981', 2, 'all'),
('Q&A', 'Ask questions and get help', 'question-icon.png', '#3B82F6', 3, 'all'),
('Course Reviews', 'Share your thoughts on courses', 'review-icon.png', '#F59E0B', 4, 'students'),
('Teacher Lounge', 'For instructors to connect and share', 'teacher-icon.png', '#8B5CF6', 5, 'teachers'),
('Technical Support', 'Platform issues and technical help', 'support-icon.png', '#EF4444', 6, 'all'),
('Feature Requests', 'Suggest new features and improvements', 'feature-icon.png', '#EC4899', 7, 'all'),
('Success Stories', 'Share your learning achievements', 'success-icon.png', '#14B8A6', 8, 'all'),
('Career Advice', 'Professional development discussions', 'career-icon.png', '#F97316', 9, 'all'),
('Marketplace', 'Buy, sell, and trade learning resources', 'marketplace-icon.png', '#84CC16', 10, 'verified');

-- Insert adaptive AI rules for personalization
INSERT INTO public.adaptive_rules (rule_name, description, rule_type, conditions, actions, priority, is_active) VALUES
('Beginner Content Boost', 'Show more beginner content to new users', 'recommendation', 
 '{"user_level": "beginner", "days_since_signup": {"<=": 30}}', 
 '{"boost_difficulty": "beginner", "boost_factor": 1.5}', 10, true),

('Visual Learner Preference', 'Recommend video content to visual learners', 'recommendation',
 '{"learning_style": "visual"}',
 '{"content_types": ["video", "interactive"], "boost_factor": 2.0}', 8, true),

('Difficulty Adjustment', 'Adjust content difficulty based on quiz performance', 'difficulty_adjustment',
 '{"quiz_avg_score": {"<": 60}, "attempts": {">": 3}}',
 '{"decrease_difficulty": true, "suggest_review": true}', 9, true),

('Engagement Recovery', 'Re-engage users with declining activity', 'recommendation',
 '{"days_since_last_activity": {">": 7}, "total_courses": {">": 0}}',
 '{"send_notification": true, "recommend_similar": true}', 7, true),

('Advanced User Push', 'Challenge advanced users with harder content', 'recommendation',
 '{"skill_mastery_avg": {">": 80}, "completion_rate": {">": 90}}',
 '{"boost_difficulty": "advanced", "suggest_challenges": true}', 6, true);

-- Insert sample learning paths
INSERT INTO public.learning_paths (name, description, target_audience, estimated_duration_hours, learning_outcomes, is_public) VALUES
('Full Stack Web Developer', 'Complete journey from beginner to full-stack developer', 
 ARRAY['beginners', 'career-changers'], 200, 
 ARRAY['Build responsive websites', 'Create REST APIs', 'Deploy applications', 'Work with databases'], true),

('Digital Marketing Mastery', 'Comprehensive digital marketing skills for modern businesses',
 ARRAY['entrepreneurs', 'marketing-professionals'], 120,
 ARRAY['Create effective ad campaigns', 'Analyze marketing data', 'Build brand presence', 'Generate leads'], true),

('Data Science Fundamentals', 'Introduction to data science and machine learning',
 ARRAY['analysts', 'students', 'professionals'], 150,
 ARRAY['Analyze datasets', 'Build predictive models', 'Visualize data insights', 'Present findings'], true),

('Creative Professional', 'Design and multimedia skills for creative careers',
 ARRAY['designers', 'artists', 'content-creators'], 100,
 ARRAY['Master design tools', 'Create compelling visuals', 'Develop personal style', 'Build portfolio'], true),

('Business Leadership', 'Essential skills for modern business leaders',
 ARRAY['managers', 'executives', 'entrepreneurs'], 80,
 ARRAY['Lead effective teams', 'Make strategic decisions', 'Communicate vision', 'Drive innovation'], true);

-- Insert platform announcements
INSERT INTO public.announcements (title, content, announcement_type, target_audience, priority, display_locations, start_date, end_date, is_active) VALUES
('Welcome to SkillBox!', 'Welcome to the future of learning! Explore our AI-powered personalized courses, connect with expert instructors, and join a global community of learners.', 'feature', ARRAY['all'], 'high', ARRAY['dashboard', 'banner'], NOW(), NOW() + INTERVAL '30 days', true),

('New AR/VR Learning Experience', 'Experience immersive learning with our new AR and VR content. Compatible with popular headsets and mobile devices.', 'feature', ARRAY['students'], 'normal', ARRAY['dashboard', 'notification'], NOW(), NOW() + INTERVAL '14 days', true),

('Teacher Application Now Open', 'Share your expertise with learners worldwide. Apply to become a verified instructor and start earning from your knowledge.', 'general', ARRAY['teachers'], 'normal', ARRAY['dashboard'], NOW(), NOW() + INTERVAL '60 days', true),

('Mobile App Update Available', 'New features: Offline learning, improved video player, and enhanced accessibility options. Update now!', 'feature', ARRAY['all'], 'high', ARRAY['notification'], NOW(), NOW() + INTERVAL '7 days', true);

-- ===================================================================
-- STORAGE BUCKETS (for Supabase)
-- ===================================================================

-- These would be created in Supabase dashboard or via API
-- INSERT INTO storage.buckets (id, name, public) VALUES
-- ('avatars', 'avatars', true),
-- ('content-media', 'content-media', true),
-- ('course-thumbnails', 'course-thumbnails', true),
-- ('documents', 'documents', false),
-- ('certificates', 'certificates', false),
-- ('portfolio-items', 'portfolio-items', true),
-- ('assignment-submissions', 'assignment-submissions', false),
-- ('3d-models', '3d-models', true),
-- ('ar-assets', 'ar-assets', true),
-- ('vr-content', 'vr-content', true),
-- ('interactive-content', 'interactive-content', true);

-- ===================================================================
-- SAMPLE EDGE FUNCTIONS (Documentation)
-- ===================================================================

-- The following Edge Functions should be implemented in Supabase:
--
-- 1. adaptive-learning-engine: AI-powered content recommendations
-- 2. ai-content-generator: Generate learning content using AI
-- 3. ai-submission-grader: Automated assignment grading
-- 4. handle-file-upload: Secure file upload with validation
-- 5. payment-processor: Stripe integration for payments
-- 6. notification-dispatcher: Smart notification routing
-- 7. realtime-classroom: WebRTC signaling for live classes
-- 8. translation-service: AI-powered content translation
-- 9. analytics-processor: Learning analytics and insights
-- 10. content-moderator: AI-powered content moderation

-- ===================================================================
-- INTERNATIONALIZATION SETUP
-- ===================================================================

-- Language codes supported (ISO 639-1)
-- 'en' - English (default)
-- 'es' - Spanish
-- 'fr' - French  
-- 'de' - German
-- 'it' - Italian
-- 'pt' - Portuguese
-- 'ru' - Russian
-- 'ja' - Japanese
-- 'ko' - Korean
-- 'zh' - Chinese (Simplified)
-- 'ar' - Arabic
-- 'hi' - Hindi

-- RTL (Right-to-Left) languages: 'ar', 'he', 'fa'
-- Requires special UI handling in React Native

-- ===================================================================
-- SCHEMA COMPLETE - SKILLBOX EDITION HORIZON
-- ===================================================================

-- This schema provides:
-- ✅ Advanced AI & ML integration
-- ✅ AR/VR content support  
-- ✅ Enterprise features
-- ✅ Comprehensive internationalization
-- ✅ Advanced gamification
-- ✅ Portfolio & showcase features
-- ✅ Dispute resolution system
-- ✅ Credit system & alternative payments
-- ✅ Advanced analytics & insights
-- ✅ Forum & community features
-- ✅ Assignment & peer review system
-- ✅ Study groups & collaboration
-- ✅ Teacher subscription tiers
-- ✅ Comprehensive RLS policies
-- ✅ Performance-optimized indexes
-- ✅ Automated triggers & functions
-- ✅ Rich sample data
