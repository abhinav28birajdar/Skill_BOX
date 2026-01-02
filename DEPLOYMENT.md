# SkillBox - Deployment Guide

## 🚀 Quick Start

This guide covers deploying SkillBox to production on iOS, Android, and Web.

---

## 📋 Prerequisites

1. **Expo Account**: Sign up at https://expo.dev
2. **Supabase Project**: Set up at https://supabase.com
3. **Apple Developer Account** (for iOS): $99/year
4. **Google Play Console** (for Android): $25 one-time
5. **Domain Name** (optional, for web)

---

## 🗄️ Database Setup

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Create new project
3. Note your Project URL and anon/public API key

### 2. Run Schema

```bash
# Copy database/schema.sql content
# Go to Supabase Dashboard > SQL Editor
# Paste and run the schema
```

### 3. Enable Realtime

```sql
-- Enable realtime for specific tables
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table user_progress;
```

### 4. Configure Storage

1. Go to Storage in Supabase Dashboard
2. Create buckets:
   - `avatars` (public)
   - `course-covers` (public)
   - `course-content` (authenticated)
   - `documents` (authenticated)

### 5. Set Storage Policies

```sql
-- Example policy for avatars bucket
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1] );
```

---

## ⚙️ Environment Configuration

### 1. Create `.env` file

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
EXPO_PUBLIC_APP_ENV=production
EXPO_PUBLIC_API_URL=https://your-api.com

# Optional: Analytics
EXPO_PUBLIC_ANALYTICS_KEY=your-analytics-key
```

### 2. Update `app.json`

```json
{
  "expo": {
    "name": "SkillBox",
    "slug": "skillbox-app",
    "version": "1.0.0",
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

---

## 📱 iOS Deployment

### 1. Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 2. Configure iOS Build

```bash
eas build:configure
```

Create `eas.json`:

```json
{
  "build": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.skillbox.app",
        "buildType": "app-store"
      }
    }
  }
}
```

### 3. Build for iOS

```bash
# Production build
eas build --platform ios --profile production

# After build completes, download .ipa file
```

### 4. Submit to App Store

```bash
eas submit --platform ios --latest
```

Or manually:
1. Open Transporter app (Mac)
2. Upload .ipa file
3. Go to App Store Connect
4. Create new app
5. Fill in metadata
6. Submit for review

---

## 🤖 Android Deployment

### 1. Configure Android Build

Update `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "package": "com.skillbox.app",
        "buildType": "apk"
      }
    }
  }
}
```

### 2. Build for Android

```bash
# Build AAB for Play Store
eas build --platform android --profile production

# Build APK for direct distribution
eas build --platform android --profile production --local
```

### 3. Submit to Play Store

```bash
eas submit --platform android --latest
```

Or manually:
1. Go to Google Play Console
2. Create new app
3. Upload AAB file
4. Fill in store listing
5. Set pricing
6. Submit for review

---

## 🌐 Web Deployment

### 1. Build for Web

```bash
# Create production build
npx expo export --platform web

# Output will be in dist/ folder
```

### 2. Deploy Options

#### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Option B: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option C: Custom Server (Nginx)

```nginx
server {
    listen 80;
    server_name skillbox.app;
    root /var/www/skillbox/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔐 Security Checklist

- [ ] Environment variables set correctly
- [ ] Supabase RLS policies enabled
- [ ] API keys secured (never in git)
- [ ] HTTPS enabled for web
- [ ] App Transport Security configured (iOS)
- [ ] ProGuard enabled (Android release)
- [ ] Code obfuscation enabled
- [ ] Sensitive data encrypted
- [ ] Authentication tokens secured
- [ ] Network security config (Android)

---

## 📊 Monitoring & Analytics

### 1. Set Up Sentry (Optional)

```bash
npm install @sentry/react-native
```

```typescript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "your-dsn",
  enableAutoSessionTracking: true,
  environment: __DEV__ ? "development" : "production",
});
```

### 2. Set Up Analytics

```typescript
// Google Analytics, Mixpanel, or Amplitude
import analytics from '@react-native-firebase/analytics';

analytics().logEvent('course_viewed', {
  course_id: courseId,
  course_name: courseName,
});
```

---

## 🔄 CI/CD (Optional)

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: eas build --platform all --non-interactive
```

---

## 🐛 Common Issues

### Build Failures

**Issue**: Build fails with dependency errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: iOS build fails
```bash
# Solution: Update CocoaPods
cd ios
pod install
cd ..
```

### Supabase Connection Issues

**Issue**: Can't connect to Supabase
- Check URL and API key are correct
- Verify network connectivity
- Check Supabase project status
- Ensure RLS policies allow access

---

## 📝 Pre-Launch Checklist

### Code
- [ ] All console.logs removed
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Input validation complete
- [ ] TypeScript errors fixed
- [ ] Tests passing (if applicable)

### Design
- [ ] All screens responsive
- [ ] Dark mode working
- [ ] Images optimized
- [ ] Animations smooth (60fps)
- [ ] Accessibility labels added

### Content
- [ ] App name finalized
- [ ] App icon created (1024x1024)
- [ ] Screenshots prepared (all sizes)
- [ ] App description written
- [ ] Keywords selected (App Store)
- [ ] Privacy policy created
- [ ] Terms of service created

### Testing
- [ ] Tested on iOS (multiple devices/versions)
- [ ] Tested on Android (multiple devices/versions)
- [ ] Tested on web (multiple browsers)
- [ ] Tested authentication flow
- [ ] Tested payment flow (if applicable)
- [ ] Performance tested
- [ ] Memory leaks checked

### Legal
- [ ] Privacy policy URL added
- [ ] Terms of service URL added
- [ ] Age rating selected
- [ ] Content rating filled
- [ ] Export compliance reviewed

---

## 🎉 Post-Launch

1. **Monitor Crashes**: Check Sentry/Firebase Crashlytics
2. **Track Analytics**: Monitor user behavior
3. **Gather Feedback**: Read reviews and respond
4. **Plan Updates**: Regular feature releases
5. **Marketing**: Social media, blog posts, etc.

---

## 📞 Support

For issues or questions:
- GitHub Issues: [your-repo]/issues
- Email: support@skillbox.app
- Discord: [your-discord-link]

---

## 🔗 Useful Links

- [Expo Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)

---

**Good luck with your launch! 🚀**
