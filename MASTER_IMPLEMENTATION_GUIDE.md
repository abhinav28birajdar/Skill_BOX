# SkillBox Mobile App - Complete Implementation Guide

## 🎯 Project Overview

**SkillBox** is a production-ready React Native Expo Android application connecting Teachers and Students for skill-based learning (Photography, Video Editing, Design, Dance, etc.).

### Tech Stack
- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Navigation**: React Navigation v7
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand
- **Video**: Expo Video, Jitsi Meet
- **File Handling**: Expo Image Picker, Document Picker, File System

---

## 📁 Complete Project Structure

```
SkillBox/
├── app/                          # Expo Router (App Directory)
│   ├── (auth)/                   # Auth flow screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── forgot-password.tsx
│   │   └── role-select.tsx
│   ├── (student)/                # Student tab screens
│   │   ├── _layout.tsx           # Student tabs layout
│   │   ├── home.tsx
│   │   ├── explore.tsx
│   │   ├── my-courses.tsx
│   │   ├── messages.tsx
│   │   └── profile.tsx
│   ├── (teacher)/                # Teacher tab screens
│   │   ├── _layout.tsx           # Teacher tabs layout
│   │   ├── dashboard.tsx
│   │   ├── courses.tsx
│   │   ├── create-course.tsx
│   │   ├── messages.tsx
│   │   └── profile.tsx
│   ├── course/
│   │   ├── [id].tsx              # Course detail screen
│   │   └── lesson/[lessonId].tsx # Lesson viewer
│   ├── chat/[threadId].tsx       # Chat conversation
│   ├── live-session/[id].tsx     # Live class room
│   ├── notifications.tsx
│   ├── settings.tsx
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # App entry point
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── BottomSheet.tsx
│   │   ├── course/               # Course-related components
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseGrid.tsx
│   │   │   ├── LessonCard.tsx
│   │   │   ├── LessonList.tsx
│   │   │   ├── CourseProgress.tsx
│   │   │   └── VideoPlayer.tsx
│   │   ├── chat/                 # Chat components
│   │   │   ├── ChatList.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── FileAttachment.tsx
│   │   ├── teacher/              # Teacher components
│   │   │   ├── TeacherCard.tsx
│   │   │   ├── StudentList.tsx
│   │   │   └── CourseForm.tsx
│   │   └── layout/               # Layout components
│   │       ├── SafeContainer.tsx
│   │       ├── Header.tsx
│   │       └── TabBar.tsx
│   ├── services/                 # API services
│   │   ├── supabase.ts          ✅ CREATED
│   │   ├── auth.ts              ✅ CREATED
│   │   ├── courses.ts
│   │   ├── lessons.ts
│   │   ├── enrollments.ts
│   │   ├── chat.ts
│   │   ├── notifications.ts
│   │   ├── live-sessions.ts
│   │   ├── reviews.ts
│   │   ├── showcases.ts
│   │   └── upload.ts
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCourses.ts
│   │   ├── useChat.ts
│   │   ├── useNotifications.ts
│   │   ├── useUpload.ts
│   │   └── useRealtime.ts
│   ├── contexts/                 # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── navigation/               # Navigation setup
│   │   ├── types.ts
│   │   └── linking.ts
│   ├── utils/                    # Utility functions
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── helpers.ts
│   ├── theme/                    # Theme configuration
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   ├── types/                    # TypeScript types
│   │   └── database.ts          ✅ CREATED
│   └── config/                   # App configuration
│       └── constants.ts         ✅ CREATED
├── assets/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── supabase/                     # Database migrations
│   ├── 001_schema.sql           ✅ CREATED
│   └── 002_storage.sql          ✅ CREATED
├── package.json                  ✅ UPDATED
├── tsconfig.json                 ✅ UPDATED
├── tailwind.config.js            ✅ CREATED
├── babel.config.js               ✅ UPDATED
├── metro.config.js               ✅ CREATED
├── global.css                    ✅ CREATED
├── app.json                      ✅ EXISTS
├── .env.example                  ✅ CREATED
└── README.md
```

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a Supabase project at https://supabase.com
2. Go to SQL Editor and run:
   - `supabase/001_schema.sql`
   - `supabase/002_storage.sql`
3. Copy your Supabase URL and Anon Key

### 3. Configure Environment Variables

Create `.env` file:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_JITSI_DOMAIN=meet.jit.si
```

### 4. Run the App

```bash
npm run android     # For Android
npm start           # For all platforms
```

---

## 📝 Implementation Checklist

### ✅ Phase 1: Project Setup (COMPLETED)
- [x] Initialize Expo project
- [x] Configure TypeScript paths
- [x] Set up NativeWind/Tailwind
- [x] Create database schema
- [x] Set up Supabase client
- [x] Create authentication service
- [x] Configure storage buckets

### 🔨 Phase 2: Core Services (TO BUILD)

Create these service files:

#### **src/services/courses.ts**
```typescript
import supabase from './supabase';
import { Course, CourseWithDetails } from '@types/database';

class CourseService {
  async getAllCourses(filters?: {
    category?: number;
    skill_level?: string;
    search?: string;
  }): Promise<CourseWithDetails[]> {
    let query = supabase
      .from('courses')
      .select(`
        *,
        profiles (*),
        categories (*),
        lessons (count)
      `)
      .eq('is_published', true);

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }
    if (filters?.skill_level) {
      query = query.eq('skill_level', filters.skill_level);
    }
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getCourseById(id: string): Promise<CourseWithDetails | null> {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        profiles (*),
        categories (*),
        lessons (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createCourse(courseData: any): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCourse(id: string, updates: any): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  }

  async deleteCourse(id: string): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getTeacherCourses(teacherId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('teacher_id', teacherId);

    if (error) throw error;
    return data || [];
  }
}

export default new CourseService();
```

#### **src/services/chat.ts** (Real-time messaging)
```typescript
import supabase from './supabase';
import { Message, Thread } from '@types/database';
import { RealtimeChannel } from '@supabase/supabase-js';

class ChatService {
  private channels: Map<string, RealtimeChannel> = new Map();

  async getThreads(userId: string): Promise<Thread[]> {
    const { data, error } = await supabase
      .from('threads')
      .select('*')
      .contains('participants', [userId])
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getMessages(threadId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles (*)
      `)
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async sendMessage(threadId: string, senderId: string, body: string, attachmentUrl?: string): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        thread_id: threadId,
        sender_id: senderId,
        body,
        attachment_url: attachmentUrl,
      })
      .select()
      .single();

    if (error) throw error;

    // Update thread's last message
    await supabase
      .from('threads')
      .update({
        last_message: body,
        last_message_at: new Date().toISOString(),
      })
      .eq('id', threadId);

    return data;
  }

  subscribeToMessages(threadId: string, callback: (message: Message) => void): RealtimeChannel {
    const channel = supabase
      .channel(`messages:${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => callback(payload.new as Message)
      )
      .subscribe();

    this.channels.set(threadId, channel);
    return channel;
  }

  unsubscribeFromMessages(threadId: string): void {
    const channel = this.channels.get(threadId);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(threadId);
    }
  }
}

export default new ChatService();
```

### 🎨 Phase 3: UI Components (TO BUILD)

Key components to implement:

#### **src/components/ui/Button.tsx**
```typescript
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}) => {
  const baseClass = 'py-3 px-6 rounded-lg items-center justify-center';
  const variantClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    outline: 'border-2 border-primary-600',
  };

  return (
    <TouchableOpacity
      className={`${baseClass} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={`font-semibold ${variant === 'outline' ? 'text-primary-600' : 'text-white'}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
```

#### **src/components/course/CourseCard.tsx**
```typescript
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Course } from '@types/database';
import { useRouter } from 'expo-router';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="bg-white dark:bg-dark-800 rounded-lg shadow-md mb-4"
      onPress={() => router.push(`/course/${course.id}`)}
    >
      <Image
        source={{ uri: course.cover_url || 'https://via.placeholder.com/400x200' }}
        className="w-full h-48 rounded-t-lg"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-lg font-bold text-dark-900 dark:text-white mb-2">
          {course.title}
        </Text>
        <Text className="text-dark-600 dark:text-dark-300 mb-2" numberOfLines={2}>
          {course.description}
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-yellow-500 mr-1">⭐</Text>
            <Text className="text-dark-700 dark:text-dark-400">
              {course.rating.toFixed(1)}
            </Text>
          </View>
          <Text className="text-primary-600 font-semibold">
            {course.price > 0 ? `$${course.price}` : 'Free'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
```

### 📱 Phase 4: Screens Implementation

#### Student Screens

**app/(student)/home.tsx** - Student dashboard
**app/(student)/explore.tsx** - Browse courses and teachers
**app/(student)/my-courses.tsx** - Enrolled courses list
**app/(student)/messages.tsx** - Chat inbox
**app/(student)/profile.tsx** - Student profile

#### Teacher Screens

**app/(teacher)/dashboard.tsx** - Teacher analytics
**app/(teacher)/courses.tsx** - Teacher's courses
**app/(teacher)/create-course.tsx** - Course creation form
**app/(teacher)/messages.tsx** - Teacher chat
**app/(teacher)/profile.tsx** - Teacher profile with portfolio

#### Shared Screens

**app/course/[id].tsx** - Course detail page
**app/course/lesson/[lessonId].tsx** - Video/document lesson viewer
**app/chat/[threadId].tsx** - Chat conversation
**app/live-session/[id].tsx** - Jitsi live class embed

### 🪝 Phase 5: Custom Hooks

#### **src/hooks/useAuth.ts**
```typescript
import { useState, useEffect } from 'react';
import { User, Profile } from '@types/database';
import authService from '@services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial user
    loadUser();

    // Subscribe to auth changes
    const { data: subscription } = authService.onAuthStateChange((user) => {
      setUser(user);
      if (user) {
        loadProfile(user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const loadUser = async () => {
    const user = await authService.getCurrentUser();
    setUser(user);
    if (user) {
      await loadProfile(user.id);
    }
    setLoading(false);
  };

  const loadProfile = async (userId: string) => {
    const profile = await authService.getCurrentProfile();
    setProfile(profile);
  };

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
  };
};
```

### 🎯 Phase 6: Navigation Setup

The app uses **Expo Router** with file-based routing. Key layouts:

- **(auth)**: Login, signup, role selection
- **(student)**: Student tab navigation
- **(teacher)**: Teacher tab navigation
- **Modal routes**: Course detail, lesson viewer, chat

### 🔔 Phase 7: Real-time Features

Implement using Supabase Realtime:
- Live chat messages
- Notifications
- Course updates
- Student progress tracking

### 📤 Phase 8: File Uploads

Use Expo Image Picker + Supabase Storage for:
- Profile avatars
- Course covers
- Video lessons
- PDF documents
- Chat attachments
- Student showcases

---

## 🎨 Theme System

Create **src/contexts/ThemeContext.tsx**:

```typescript
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}>({
  theme: 'system',
  setTheme: () => {},
  isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const savedTheme = await AsyncStorage.getItem('theme');
    if (savedTheme) {
      setThemeState(savedTheme as Theme);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

---

## 🧪 Testing

Run tests with:
```bash
npm test                  # Unit tests
npm run test:e2e          # E2E tests
```

---

## 📦 Build for Production

```bash
# Android APK
eas build --platform android --profile preview

# Android AAB (Play Store)
eas build --platform android --profile production
```

---

## 🔐 Security Best Practices

1. **Row Level Security**: All Supabase tables have RLS policies
2. **Secure Storage**: Use expo-secure-store for sensitive data
3. **Input Validation**: Validate all user inputs
4. **File Upload Limits**: Restrict file sizes and types
5. **Rate Limiting**: Implement API rate limiting

---

## 🎉 Features Summary

### Student Features
✅ Browse categories and courses
✅ Search and filter courses
✅ Enroll in courses
✅ Watch video lessons
✅ Download PDF materials
✅ Track learning progress
✅ Join live classes
✅ Chat with teachers
✅ Submit work showcases
✅ Leave course reviews
✅ Real-time notifications

### Teacher Features
✅ Create and manage courses
✅ Upload videos and documents
✅ Organize lessons
✅ Schedule live sessions
✅ Chat with students
✅ View student progress
✅ Manage enrollments
✅ Portfolio showcase
✅ Analytics dashboard

### Common Features
✅ Role-based authentication
✅ Profile management
✅ Dark/light theme
✅ Real-time chat
✅ Push notifications
✅ File uploads
✅ Search functionality

---

## 📚 Next Steps

1. **Create remaining service files** (courses, lessons, enrollments, etc.)
2. **Build UI component library** (Button, Input, Card, etc.)
3. **Implement all screens** using Expo Router
4. **Add custom hooks** for data fetching
5. **Integrate real-time features** with Supabase
6. **Add file upload handlers**
7. **Implement Jitsi Meet integration**
8. **Test thoroughly** on Android devices
9. **Build production APK**
10. **Deploy to Google Play Store**

---

## 💡 Development Tips

- Use **hot reload** for fast development
- Test on **real Android devices** when possible
- Use **Flipper** for debugging
- Keep components **small and focused**
- Follow **TypeScript** best practices
- Use **Zustand** for global state when needed
- Leverage **Supabase Realtime** for live features
- Optimize **images and videos** for mobile

---

## 🐛 Common Issues & Solutions

### Issue: Supabase connection fails
**Solution**: Check `.env` file has correct credentials

### Issue: File uploads fail
**Solution**: Verify storage bucket policies in Supabase dashboard

### Issue: Navigation not working
**Solution**: Ensure Expo Router is properly configured in `app.json`

### Issue: Dark mode not applying
**Solution**: Check ThemeProvider is wrapping the app

---

## 📞 Support

For issues or questions:
- GitHub Issues
- Email: support@skillbox.com
- Discord Community

---

**Happy Coding! 🚀**
