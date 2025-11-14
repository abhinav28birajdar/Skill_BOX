# SkillBox Mobile - 30-Minute Quickstart Guide ⚡

Get your SkillBox mobile app running in 30 minutes!

---

## ✅ Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **npm** or **yarn** package manager
- [ ] **Git** installed
- [ ] **Android Studio** (for Android development) or **Xcode** (for iOS)
- [ ] **Expo account** (free) at [expo.dev](https://expo.dev)
- [ ] **Supabase account** (free) at [supabase.com](https://supabase.com)
- [ ] **Text editor** (VS Code recommended)

---

## 📥 Step 1: Clone & Install (5 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/skillbox-mobile.git
cd skillbox-mobile

# Install dependencies
npm install

# This will install 50+ packages including:
# - React Native & Expo
# - Supabase client
# - Navigation libraries
# - NativeWind (Tailwind CSS)
# - Video/file handling libraries
```

**Expected output**: No errors, ~2-3 minutes install time

---

## 🗄️ Step 2: Set Up Supabase Backend (10 minutes)

### 2.1 Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Project name**: `skillbox-mobile`
   - **Database password**: (save this securely!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### 2.2 Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy entire contents of `supabase/001_schema.sql`
4. Paste into SQL editor
5. Click **"Run"** (bottom right)
6. Wait for success message ✅

7. Click **"New Query"** again
8. Copy entire contents of `supabase/002_storage.sql`
9. Paste into SQL editor
10. Click **"Run"**
11. Verify success ✅

### 2.3 Verify Tables Created

1. Go to **Table Editor** (left sidebar)
2. You should see 12 tables:
   - users
   - profiles
   - categories
   - courses
   - lessons
   - enrollments
   - messages
   - threads
   - notifications
   - live_sessions
   - reviews
   - showcases

### 2.4 Verify Storage Buckets

1. Go to **Storage** (left sidebar)
2. You should see 6 buckets:
   - avatars (public)
   - course-covers (public)
   - course-videos (private)
   - course-documents (private)
   - chat-attachments (private)
   - showcases (public)

### 2.5 Enable Email Authentication

1. Go to **Authentication** → **Providers** (left sidebar)
2. Find **Email** provider
3. Toggle **"Enable Email provider"** to ON
4. Click **"Save"**

---

## ⚙️ Step 3: Configure Environment Variables (2 minutes)

### 3.1 Get Supabase Credentials

1. In Supabase dashboard, go to **Project Settings** → **API**
2. Copy:
   - **Project URL** (starts with `https://...supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 3.2 Create .env File

```bash
# Copy the example file
cp .env.example .env

# Open .env in your text editor
# Paste your credentials:
```

**Edit `.env`:**
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_JITSI_DOMAIN=meet.jit.si
```

**Important**: Never commit `.env` to Git! (It's already in `.gitignore`)

---

## 🚀 Step 4: Start the App (3 minutes)

### 4.1 Start Expo Development Server

```bash
npm start
```

You should see:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor
```

### 4.2 Run on Android

**Option A: Physical Device**
1. Install **Expo Go** app from Google Play Store
2. Scan the QR code with Expo Go app
3. Wait for app to load (~30 seconds first time)

**Option B: Android Emulator**
1. Open Android Studio
2. Start an emulator (AVD Manager)
3. In terminal, press `a` to open Android
4. Wait for app to build and launch

**Option C: Development Build**
```bash
npm run android
```

### 4.3 Verify App Loads

You should see the **SkillBox splash screen** followed by:
- Tab navigation at the bottom
- Expo Router welcome screen

**If you see errors**: Check Step 6 (Troubleshooting)

---

## 🧪 Step 5: Test Core Features (5 minutes)

### 5.1 Test Sign Up

1. Navigate to `/auth/signup` (if not redirected automatically)
2. Fill in:
   - **Name**: Test Student
   - **Email**: student@test.com
   - **Password**: Test123!
   - **Role**: Student
3. Tap **"Sign Up"**
4. Check for success message
5. Should redirect to Student tabs

### 5.2 Verify Database Entry

1. Go back to Supabase dashboard
2. **Table Editor** → **users** table
3. You should see your test user with `role = 'student'`
4. **Table Editor** → **profiles** table
5. You should see profile with name "Test Student"

### 5.3 Test Sign Out & Sign In

1. In app, go to **Profile** tab
2. Tap **"Sign Out"**
3. Go to `/auth/login`
4. Enter credentials:
   - **Email**: student@test.com
   - **Password**: Test123!
5. Tap **"Sign In"**
6. Verify redirect to Student tabs

### 5.4 Create Teacher Account

1. Sign out
2. Sign up with:
   - **Name**: Test Teacher
   - **Email**: teacher@test.com
   - **Password**: Test123!
   - **Role**: Teacher
3. Verify redirect to **Teacher tabs** (different navigation!)

---

## 🎉 Step 6: Next Steps (5 minutes)

### Congratulations! 🎊 Your SkillBox foundation is ready!

### What's Working Now:
✅ Expo React Native app running
✅ Supabase backend connected
✅ Database with 12 tables + RLS policies
✅ Storage buckets for files
✅ Authentication system (sign up, sign in, sign out)
✅ Role-based user system (student/teacher)
✅ TypeScript configuration
✅ NativeWind (Tailwind CSS) styling
✅ Navigation structure

### What to Build Next:

Refer to **[MASTER_IMPLEMENTATION_GUIDE.md](./MASTER_IMPLEMENTATION_GUIDE.md)** for detailed implementation steps.

**Priority Order:**

1. **Services** (src/services/)
   - [ ] `courses.ts` - Course CRUD operations
   - [ ] `lessons.ts` - Lesson management
   - [ ] `enrollments.ts` - Student enrollments
   - [ ] `chat.ts` - Real-time messaging
   - [ ] `notifications.ts` - Real-time notifications
   - [ ] `upload.ts` - File uploads

2. **UI Components** (src/components/)
   - [ ] Base components (Button, Input, Card, Avatar, etc.)
   - [ ] Course components (CourseCard, VideoPlayer, etc.)
   - [ ] Chat components (MessageBubble, ChatList, etc.)

3. **Screens** (app/)
   - [ ] Student screens (home, explore, my-courses, etc.)
   - [ ] Teacher screens (dashboard, courses, create-course, etc.)
   - [ ] Shared screens (course detail, lesson viewer, chat, etc.)

4. **Hooks** (src/hooks/)
   - [ ] `useAuth` - Authentication state
   - [ ] `useCourses` - Fetch courses with filters
   - [ ] `useChat` - Real-time chat
   - [ ] `useNotifications` - Real-time notifications

5. **Advanced Features**
   - [ ] Video player with progress tracking
   - [ ] File upload with progress bars
   - [ ] Jitsi Meet live class integration
   - [ ] Real-time presence indicators
   - [ ] Push notifications

---

## 🐛 Step 7: Troubleshooting

### Issue: `npm install` fails

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules

# Reinstall
npm install
```

### Issue: "Cannot connect to Supabase"

**Check:**
1. `.env` file exists in project root
2. Credentials are correct (no extra spaces)
3. Project URL starts with `https://`
4. Anon key is the **public** anon key (not service role)

**Test connection:**
```bash
# Open your browser
https://your-project.supabase.co/rest/v1/
# Should show Supabase API response
```

### Issue: "SQL migration fails"

**Common causes:**
- Already ran migration (tables exist) → OK, skip
- Syntax error in copy/paste → Copy again carefully
- Missing permissions → Use admin account

**Fix:**
1. Go to **SQL Editor**
2. Run this to see tables:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
3. If tables exist, you're good!

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear Metro bundler cache
npm start -- --clear

# Or
npx expo start -c
```

### Issue: Android build fails

**Check:**
1. Android Studio is installed
2. Android SDK is configured
3. Emulator is running (or device connected)

**Fix:**
```bash
# Check ADB devices
adb devices

# Should show at least one device

# Restart Metro bundler
npm start -- --reset-cache
```

### Issue: "Network request failed"

**Check:**
1. Your device/emulator has internet access
2. Firewall isn't blocking Expo
3. Supabase project is active (not paused)

**Test:**
```bash
# Ping Supabase
curl https://your-project.supabase.co

# Should return HTML response
```

---

## 📖 Additional Resources

### Documentation
- **Master Implementation Guide**: `MASTER_IMPLEMENTATION_GUIDE.md`
- **README**: `README.md`
- **Database Schema**: `supabase/001_schema.sql`
- **Storage Setup**: `supabase/002_storage.sql`

### External Docs
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

### Community
- [Expo Discord](https://chat.expo.dev)
- [Supabase Discord](https://discord.supabase.com)
- [React Native Community](https://www.reactnative.directory/)

---

## ✅ Verification Checklist

Before moving to Phase 2 implementation, verify:

- [ ] `npm install` completed without errors
- [ ] Supabase project is created and active
- [ ] All 12 database tables exist
- [ ] All 6 storage buckets exist
- [ ] Email authentication is enabled
- [ ] `.env` file has correct credentials
- [ ] App starts with `npm start`
- [ ] App loads on Android device/emulator
- [ ] Can create student account
- [ ] Can create teacher account
- [ ] Can sign in and sign out
- [ ] No console errors
- [ ] Navigation tabs appear at bottom

**All checked?** 🎉 You're ready to build features!

---

## 🚀 Quick Commands Reference

```bash
# Development
npm start                   # Start Expo dev server
npm run android             # Build and run on Android
npm run ios                 # Build and run on iOS (macOS only)
npm run web                 # Run on web browser

# Utilities
npm start -- --clear        # Clear Metro cache
npm run type-check          # Check TypeScript errors
npm run lint                # Run ESLint

# Building
npx expo install            # Fix dependency versions
npx expo doctor             # Check for issues
eas build:configure         # Configure EAS builds
eas build --platform android --profile preview  # Build APK
```

---

**Need help?** Check `MASTER_IMPLEMENTATION_GUIDE.md` for detailed code examples!

**Happy coding! 🎉**
