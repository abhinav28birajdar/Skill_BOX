# SkillBox Mobile - Learn & Teach Any Skill 📱

**A Production-Ready React Native Expo App for Teaching & Learning**

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0-black)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)

---

## 🌟 Overview

SkillBox is a comprehensive mobile learning platform connecting **Teachers** and **Students** for skill-based education. Built with React Native (Expo), TypeScript, and Supabase, it provides a complete solution for creating, managing, and consuming educational content across categories like Photography, Video Editing, Dance, Design, and more.

### Key Features
- 📚 Course creation and management
- 🎥 Video streaming with progress tracking
- 💬 Real-time chat messaging
- 🎓 Live video classes (Jitsi integration)
- 🔔 Real-time notifications
- 📊 Student progress tracking
- 🏆 Student showcases
- ⭐ Course reviews and ratings
- 🌓 Dark/light theme support

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Supabase account (free tier available)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your Supabase credentials
```

### Database Setup

1. Create a Supabase project at https://supabase.com
2. Go to **SQL Editor** and run:
   - `supabase/001_schema.sql`
   - `supabase/002_storage.sql`
3. Enable Email authentication in **Authentication** → **Providers**

### Run the App

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
```

---

## 📁 Project Structure

```
SkillBox/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Login, signup, role selection
│   ├── (student)/         # Student tab screens
│   ├── (teacher)/         # Teacher tab screens
│   └── course/            # Course detail, lesson viewer
├── src/
│   ├── components/        # Reusable UI components
│   ├── services/          # API services (Supabase)
│   │   ├── supabase.ts   ✅
│   │   └── auth.ts       ✅
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React contexts
│   ├── types/             # TypeScript types ✅
│   ├── config/            # App configuration ✅
│   └── utils/             # Helper functions
├── supabase/              # Database migrations ✅
└── assets/                # Images, icons, fonts
```

See **[MASTER_IMPLEMENTATION_GUIDE.md](./MASTER_IMPLEMENTATION_GUIDE.md)** for complete architecture.

---

## 🛠️ Tech Stack

- **Frontend**: React Native (Expo SDK 54), TypeScript
- **Styling**: NativeWind (Tailwind CSS for RN)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Navigation**: Expo Router (file-based routing)
- **State**: Zustand
- **Video**: Expo Video, Jitsi Meet
- **File Handling**: Expo Image Picker, Document Picker

---

## 📚 Core Services

### Authentication
```typescript
import authService from '@services/auth';

// Sign up
const { user, profile, error } = await authService.signUp({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe',
  role: 'student', // or 'teacher'
});

// Sign in
const { user, profile, error } = await authService.signIn({
  email: 'user@example.com',
  password: 'password123',
});
```

### Courses (To be implemented - see guide)
```typescript
import courseService from '@services/courses';

const courses = await courseService.getAllCourses({
  category: 1,
  skill_level: 'beginner',
});
```

### Real-time Chat (To be implemented - see guide)
```typescript
import chatService from '@services/chat';

const channel = chatService.subscribeToMessages(threadId, (message) => {
  console.log('New message:', message);
});
```

---

## 🗄️ Database Schema

**12 Core Tables** with Row-Level Security:
- `users` - Authentication and roles
- `profiles` - User profiles
- `categories` - 10 pre-populated categories
- `courses` - Course information
- `lessons` - Video/document lessons
- `enrollments` - Student enrollments
- `messages` - Chat messages
- `threads` - Chat conversations
- `notifications` - Real-time notifications
- `live_sessions` - Scheduled live classes
- `reviews` - Course ratings
- `showcases` - Student portfolios

All tables include automatic timestamps, foreign keys, indexes, and RLS policies.

---

## 🎨 Theme System

```typescript
import { useTheme } from '@contexts/ThemeContext';

function MyScreen() {
  const { isDark, setTheme } = useTheme();

  return (
    <View className="bg-white dark:bg-dark-900">
      <Text className="text-dark-900 dark:text-white">
        Theme: {isDark ? 'Dark' : 'Light'}
      </Text>
    </View>
  );
}
```

---

## 📦 Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build Android APK (testing)
eas build --platform android --profile preview

# Build Android AAB (Play Store)
eas build --platform android --profile production
```

---

## 📖 Documentation

- **[MASTER_IMPLEMENTATION_GUIDE.md](./MASTER_IMPLEMENTATION_GUIDE.md)** - Complete implementation guide with code examples for all services, components, screens, and hooks
- **Supabase SQL Scripts** - `supabase/001_schema.sql` and `supabase/002_storage.sql`
- **Environment Variables** - See `.env.example`

---

## 🗺️ Implementation Roadmap

### ✅ Phase 1: Foundation (COMPLETED)
- [x] Project setup with Expo + TypeScript
- [x] Supabase database schema (12 tables)
- [x] Storage buckets with RLS policies
- [x] Authentication service
- [x] TypeScript type definitions
- [x] NativeWind configuration

### 🔨 Phase 2: Core Services (IN PROGRESS)
- [ ] Course service (CRUD operations)
- [ ] Lesson service
- [ ] Enrollment service
- [ ] Chat service with real-time
- [ ] Notification service
- [ ] Live session service
- [ ] Upload service

### 🎨 Phase 3: UI Components (NEXT)
- [ ] Base components (Button, Input, Card, etc.)
- [ ] Course components (CourseCard, VideoPlayer, etc.)
- [ ] Chat components (MessageBubble, ChatList, etc.)
- [ ] Layout components (Header, TabBar, etc.)

### 📱 Phase 4: Screens (NEXT)
- [ ] Authentication screens (login, signup, role select)
- [ ] Student screens (home, explore, courses, messages, profile)
- [ ] Teacher screens (dashboard, courses, create, messages, profile)
- [ ] Shared screens (course detail, lesson viewer, chat, live class)

### 🪝 Phase 5: Hooks & Context (NEXT)
- [ ] useAuth hook
- [ ] useCourses hook
- [ ] useChat hook
- [ ] useNotifications hook
- [ ] ThemeContext
- [ ] AuthContext

### 🚀 Phase 6: Advanced Features
- [ ] File upload with progress
- [ ] Video streaming optimization
- [ ] Real-time presence
- [ ] Push notifications
- [ ] Offline mode
- [ ] Payment integration

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) - React Native framework
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [NativeWind](https://www.nativewind.dev/) - Tailwind for RN
- [Jitsi Meet](https://jitsi.org/) - Video conferencing

---

## 📞 Support

- **Documentation**: [Master Implementation Guide](./MASTER_IMPLEMENTATION_GUIDE.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/skillbox-mobile/issues)
- **Email**: support@skillbox.com

---

**Made with ❤️ for learners and teachers worldwide**
