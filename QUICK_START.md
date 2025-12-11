# 🚀 SkillBox - Quick Start Card

## ⚡ Install & Run (3 Steps)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
expo start

# 3. Choose platform
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Scan QR code for physical device
```

---

## 🔧 Essential Commands

```bash
# Development
npm start              # Start Expo dev server
npm run dev            # Start with cache cleared
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator

# Quality Checks
npm run type-check     # Check TypeScript errors
npm run lint           # Run ESLint

# Production Builds
npm run build:android  # Build for Android
npm run build:ios      # Build for iOS
```

---

## 📦 Supabase Setup (5 Minutes)

1. **Create Project**: Go to [supabase.com](https://supabase.com)
2. **Run Schema**: Copy `database/schema.sql` → Paste in SQL Editor → Run
3. **Get Credentials**: Settings → API → Copy URL + anon key
4. **Configure App**: Launch app → Enter credentials in config screen
5. **Test**: Sign up with new account

---

## 📁 Key Files & Folders

```
app/
  ├── index.tsx           ← Main entry point
  ├── config-setup.tsx    ← API configuration
  ├── welcome.tsx         ← Landing screen
  ├── login.tsx           ← Login screen
  └── settings/           ← Settings screens

database/
  └── schema.sql          ← Complete DB schema (RUN THIS FIRST!)

components/
  ├── ui/                 ← Buttons, inputs, cards
  ├── common/             ← ErrorBoundary, Toast, Loading
  └── ...                 ← Feature components

context/
  ├── AuthContext.tsx              ← User authentication
  └── EnhancedThemeContext.tsx     ← Theme system

lib/
  ├── supabase.ts         ← Supabase client
  ├── configManager.ts    ← Secure storage
  └── validationSchemas.ts ← Form validation
```

---

## 🎨 Using the Theme System

```typescript
import { useTheme } from '@/context/EnhancedThemeContext';

function MyComponent() {
  const { theme, isDark, toggleTheme, setThemeMode } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Hello!</Text>
      <Button onPress={toggleTheme} title="Toggle Theme" />
    </View>
  );
}
```

---

## 🔐 Environment Variables

```bash
# .env (for development only - NOT committed to git)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**For production**: Use the in-app config screen (`/config-setup`)

---

## 🐛 Troubleshooting

### "Cannot find module" error
```bash
rm -rf node_modules
npm install
expo start -c
```

### Type errors
```bash
npm run type-check
```

### Supabase connection failed
1. Check URL format: `https://xxx.supabase.co`
2. Verify anon key is correct (should be long JWT)
3. Ensure schema is deployed
4. Check RLS policies

### App crashes on startup
1. Clear Expo cache: `expo start -c`
2. Check `app/index.tsx` for errors
3. Verify Supabase credentials
4. Check console logs

---

## 📱 Testing Checklist

- [ ] Sign up new user
- [ ] Sign in existing user
- [ ] Toggle dark/light mode
- [ ] Navigate between screens
- [ ] View course list
- [ ] Enroll in course
- [ ] Check settings screen
- [ ] Test logout

---

## 🚀 Deploy to Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Submit to stores (after build)
eas submit --platform ios --latest
eas submit --platform android --latest
```

---

## 📚 Documentation Files

- `README.md` - Main app introduction
- `TRANSFORMATION_COMPLETE.md` - Full transformation details
- `PRODUCTION_READY_SUMMARY.md` - Production overview
- `DEPLOYMENT_CHECKLIST.md` - Pre-launch checklist

---

## 🆘 Need Help?

1. Check documentation files above
2. Review code comments in key files
3. Check Expo docs: [docs.expo.dev](https://docs.expo.dev)
4. Check Supabase docs: [supabase.com/docs](https://supabase.com/docs)

---

## ✅ Quick Verification

Run these to verify everything works:

```bash
# 1. No TypeScript errors
npm run type-check

# 2. No lint errors  
npm run lint

# 3. App starts without crashes
expo start
```

All green? **You're ready to go!** 🎉

---

*SkillBox v5.0.0 - Production Ready*
