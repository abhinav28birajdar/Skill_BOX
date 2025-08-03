# SkillBox - Database Setup Instructions

## Quick Setup Guide

### 1. Supabase Project Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Create a new project

2. **Get Your Credentials**
   - Go to Settings > API in your Supabase dashboard
   - Copy your Project URL and anon public key

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Supabase credentials
   ```

### 2. Database Schema Import

1. **Open Supabase SQL Editor**
   - Go to your Supabase project
   - Navigate to SQL Editor

2. **Import Schema**
   - Copy the contents of `database/schema.sql`
   - Paste into SQL Editor
   - Run the query to create all tables

3. **Verify Setup**
   - Check that all tables are created in the Table Editor
   - Ensure Row Level Security policies are enabled

### 3. Run the Application

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

## Database Tables Created

The schema creates the following main tables:

### Core Tables
- `users` - User profiles and authentication
- `creator_profiles` - Additional creator information
- `skills` - Skills taxonomy
- `sub_skills` - Skill subcategories

### Content Tables
- `learning_content` - Videos, articles, tutorials
- `courses` - Structured learning paths
- `course_modules` - Course organization
- `course_lessons` - Individual lessons
- `live_classes` - Real-time sessions

### Learning Tracking
- `course_enrollments` - User course registrations
- `lesson_progress` - Learning progress tracking
- `content_interactions` - User engagement metrics

### Social Features
- `user_follows` - Following relationships
- `comments` - Content comments
- `reviews` - Ratings and reviews

### Gamification
- `achievements` - Available achievements
- `user_achievements` - Earned achievements
- `learning_streaks` - Learning consistency tracking

### Support
- `notifications` - In-app notifications
- `support_tickets` - Help desk system
- `feedback` - User feedback collection
- `transactions` - Payment processing

## Features Enabled

### Row Level Security (RLS)
All tables have appropriate RLS policies for data protection.

### Real-time Subscriptions
Supabase real-time features are enabled for:
- Notifications
- Live class updates
- Comment updates
- Social interactions

### Automated Functions
- Progress calculation
- Streak tracking
- Achievement unlocking
- Notification triggers

## Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Next Steps

1. Import the schema
2. Set up your environment variables
3. Run the application
4. Test user registration and authentication
5. Start exploring the features!

The application is now ready for development and testing with a complete, production-ready database schema.
