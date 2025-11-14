# Quick Command Reference

## Development Commands

### Start Development Server
```bash
npx expo start
```

### Run on Android
```bash
npx expo start --android
```

### Run on iOS (Mac only)
```bash
npx expo start --ios
```

### Clear Cache
```bash
npx expo start --clear
```

### TypeScript Check
```bash
npx tsc --noEmit
```

### Build for Production
```bash
# Android
eas build --platform android --profile production

# iOS (Mac only)
eas build --platform ios --profile production
```

## Database Commands

### Run Migrations
1. Go to Supabase SQL Editor
2. Execute `supabase/001_schema.sql`
3. Execute `supabase/002_storage.sql`

### View Database
```bash
# Open Supabase Dashboard
# Go to Table Editor
```

### Backup Database
```bash
# In Supabase Dashboard
# Settings > Backups > Create Backup
```

## Useful Expo Commands

### Install Dependencies
```bash
npm install
```

### Update Dependencies
```bash
npx expo install --fix
```

### Check for Updates
```bash
npx expo-doctor
```

### Generate App Icons
```bash
npx expo-asset-generator icon.png
```

## Git Commands

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit - SkillBox mobile app foundation"
```

### Create Branch for Teacher Screens
```bash
git checkout -b feature/teacher-screens
```

### Commit Progress
```bash
git add .
git commit -m "Add teacher dashboard and course management"
git push origin feature/teacher-screens
```

## Testing Commands

### Run on Physical Device
1. Install "Expo Go" app on Android
2. Scan QR code from terminal
3. App will load on your device

### Debug Menu
- Shake device or press `Ctrl+M` (Android)
- Enable "Debug Remote JS"
- Open Chrome DevTools

## Environment Setup

### Create .env file
```bash
cp .env.example .env
```

### Edit .env
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_JITSI_DOMAIN=meet.jit.si
```

## Common Issues & Fixes

### Metro Bundler Issues
```bash
npx expo start --clear
# or
rm -rf node_modules
npm install
```

### Type Errors
```bash
npx tsc --noEmit
# Fix errors one by one
```

### Module Not Found
```bash
npx expo install [package-name]
```

### Android Build Fails
```bash
cd android
./gradlew clean
cd ..
npx expo start --android
```

## Next Development Tasks

### 1. Teacher Screens (Priority 1)
```bash
# Create files:
mkdir -p app/\(teacher\)
# - _layout.tsx
# - index.tsx (dashboard)
# - courses.tsx
# - create-course.tsx
# - messages.tsx
# - profile.tsx
```

### 2. Shared Screens (Priority 2)
```bash
# Create files:
mkdir -p app/course app/chat app/live-session
# - app/course/[id].tsx
# - app/course/lesson/[lessonId].tsx
# - app/chat/[threadId].tsx
# - app/live-session/[id].tsx
# - app/notifications.tsx
# - app/settings.tsx
```

### 3. Deploy to Expo
```bash
# Login to Expo
npx expo login

# Build and submit
eas build --platform android --profile production
eas submit --platform android
```

## File Structure Reference

```
app/
  ├── _layout.tsx          # Root navigation
  ├── login.tsx            # ✅ Login screen
  ├── signup.tsx           # ✅ Signup screen
  ├── (student)/
  │   ├── _layout.tsx      # ✅ Tab navigation
  │   ├── index.tsx        # ✅ Home
  │   ├── explore.tsx      # ✅ Browse courses
  │   ├── my-courses.tsx   # ✅ Enrolled courses
  │   ├── messages.tsx     # ✅ Chat list
  │   └── profile.tsx      # ✅ Profile
  ├── (teacher)/           # ⏳ To be created
  ├── course/              # ⏳ To be created
  ├── chat/                # ⏳ To be created
  └── live-session/        # ⏳ To be created

src/
  ├── services/            # ✅ All 11 services complete
  ├── components/          # ✅ 27 components complete
  ├── hooks/               # ✅ 4 hooks complete
  ├── types/               # ✅ Complete
  ├── config/              # ✅ Complete
  └── utils/               # ⏳ To be created

supabase/
  ├── 001_schema.sql       # ✅ Database schema
  └── 002_storage.sql      # ✅ Storage buckets
```

## Helpful Resources

- **Expo Docs:** https://docs.expo.dev
- **Supabase Docs:** https://supabase.com/docs
- **React Navigation:** https://reactnavigation.org
- **NativeWind:** https://www.nativewind.dev
- **TypeScript:** https://www.typescriptlang.org/docs

## Development Workflow

1. **Start Development:**
   ```bash
   npx expo start
   ```

2. **Make Changes:**
   - Edit files in `app/` or `src/`
   - Hot reload happens automatically

3. **Test:**
   - Check on physical device or emulator
   - Use Chrome DevTools for debugging

4. **Commit:**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

5. **Build:**
   ```bash
   eas build --platform android
   ```

## Status Check

✅ **Completed:** 56 files
⏳ **Remaining:** ~22 files
📊 **Progress:** ~72% complete

**You're ready to continue development!**
