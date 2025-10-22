# 🚀 Quick Setup Guide for SkillBox

## Prerequisites
- Node.js installed
- Expo CLI (`npm install -g @expo/cli`)
- Mobile device with Expo Go app OR iOS/Android simulator

## 5-Minute Setup

### 1. Clone & Install
```bash
git clone <your-repo>
cd SkillBox
npm install
```

### 2. Setup Supabase (Free)
1. Go to [supabase.com](https://supabase.com) → Create new project
2. Wait for setup to complete (2-3 minutes)
3. Go to Settings → API → Copy your URL and anon key
4. Go to SQL Editor → Run the schema from `database/complete_schema.sql`

### 3. Configure Environment
```bash
# Copy example file
cp .env.example .env

# Edit .env file with your Supabase credentials:
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Optional: Add AI Features
Get OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
```bash
# Add to .env file:
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-openai-key-here
```

### 5. Start Development
```bash
npm run dev
# or
npx expo start
```

### 6. Test Features
- Scan QR code with Expo Go app
- Create an account
- Explore the 5 new features in the dashboard!

## 🎯 What You'll Have

✅ **Complete Learning Management System**
- Course management and enrollment
- Video lessons and quizzes
- Progress tracking and analytics

✅ **AI-Powered Features**
- Study assistant for instant help
- Smart notes with auto-summarization
- Personalized recommendations

✅ **Gamification System**
- Achievements and badges
- XP points and levels
- Learning streaks

✅ **Productivity Tools**
- Pomodoro focus timer
- Goal setting and tracking
- Study analytics

✅ **Social Learning**
- Study groups and forums
- Peer reviews and mentorship
- Community features

## 🔧 Troubleshooting

**TypeScript Errors?**
- Normal until Supabase is configured
- Will resolve automatically once connected

**Build Errors?**
- Run `npm install` again
- Clear cache: `npx expo start --clear`

**Supabase Connection Issues?**
- Double-check URL and anon key
- Ensure database schema is applied
- Check .env file formatting

## 📱 Testing Checklist

- [ ] App starts without errors
- [ ] User registration works
- [ ] Dashboard loads with new features
- [ ] AI Study Assistant opens
- [ ] Gamification dashboard shows
- [ ] Smart Notes interface works
- [ ] Pomodoro timer functions
- [ ] Social Hub loads

## 🎉 You're Ready!

Your SkillBox learning platform is now ready for development and testing. The app includes all modern features expected in a competitive learning management system.

**Happy coding! 🚀**