# 🚀 SkillBox Testing Guide

## Quick Start Testing

### 1. Start the Development Server

```powershell
# Clear any cached data
npx expo start --clear

# Or just start normally
npx expo start
```

### 2. Testing Options

#### Option A: Physical Device (Recommended)
1. Install **Expo Go** app from Play Store (Android) or App Store (iOS)
2. Scan the QR code from terminal with Expo Go app
3. App will load on your device

#### Option B: Android Emulator
```powershell
# Start Android emulator first from Android Studio
# Then run:
npx expo start --android
```

#### Option C: iOS Simulator (Mac only)
```powershell
npx expo start --ios
```

---

## 🔍 What to Test

### Authentication Flow
1. **Sign Up**
   - Navigate to signup screen
   - Enter email, password, name
   - Select role (Student or Teacher)
   - Verify account creation

2. **Login**
   - Enter credentials
   - Verify role-based redirection
   - Check if session persists

### Theme System
1. **Toggle Dark Mode**
   - Navigate to Profile/Settings
   - Toggle theme switch
   - Verify all screens adapt correctly
   - Check text contrast and readability

### UI Components
1. **Buttons**
   - Test all variants (primary, secondary, outline, ghost, danger, success)
   - Check press animations
   - Verify loading states
   - Test disabled states

2. **Inputs**
   - Test text input
   - Test password toggle
   - Check focus animations
   - Verify error states
   - Test icon positioning

3. **Cards**
   - Check different variants
   - Verify shadows and elevations
   - Test in both themes

### Navigation
1. **Tab Navigation** (Student/Teacher)
   - Test all bottom tabs
   - Verify icons and labels
   - Check active state styling

2. **Screen Transitions**
   - Navigate between screens
   - Test back navigation
   - Verify state persistence

---

## 🐛 Known Issues & Workarounds

### If Expo Won't Start:
```powershell
# Kill processes on port 8081
$port = 8081
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($process) { Stop-Process -Id $process -Force }

# Clear cache and restart
Remove-Item -Recurse -Force .expo
npx expo start --clear
```

### If TypeScript Errors Appear:
These are type-checking warnings and don't affect the app runtime. To suppress them temporarily:
```powershell
# Start without TypeScript checking
npx expo start --no-typescript
```

### If Metro Bundler Fails:
```powershell
# Clear Metro cache
npx expo start --clear

# If that doesn't work, clear everything
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npx expo start
```

---

## 📝 Test Checklist

### Core Functionality
- [ ] App starts without crashes
- [ ] Signup creates new account
- [ ] Login authenticates successfully
- [ ] Role-based routing works (Student vs Teacher)
- [ ] Session persists after app restart

### UI/UX
- [ ] All buttons are clickable and responsive
- [ ] Inputs accept text and show/hide password
- [ ] Cards display content correctly
- [ ] Dark mode toggle works
- [ ] All text is readable in both themes
- [ ] Colors and contrast are good

### Navigation
- [ ] Bottom tabs work
- [ ] Back button functions correctly
- [ ] Deep linking works (if implemented)
- [ ] Stack navigation maintains state

### Performance
- [ ] App loads quickly
- [ ] Animations are smooth (60 FPS)
- [ ] No lag when typing
- [ ] Scrolling is responsive
- [ ] Images load properly

---

## 🎯 Test Scenarios

### Scenario 1: New Student User
1. Open app
2. Click "Sign Up"
3. Fill in details, select "Student"
4. Complete signup
5. Browse courses (if available)
6. Test chat (if available)
7. Update profile
8. Toggle dark mode
9. Log out
10. Log back in

### Scenario 2: New Teacher User
1. Open app
2. Sign up as Teacher
3. Navigate to teacher dashboard
4. Test course creation flow (if available)
5. Check student management features
6. Test messaging
7. Toggle theme
8. Verify all teacher-specific features

### Scenario 3: Theme Testing
1. Start in light mode
2. Navigate through all screens
3. Toggle to dark mode
4. Navigate through same screens
5. Verify all text is readable
6. Check image/icon visibility
7. Test input focus states
8. Verify button hover states

---

## 📊 Expected Behavior

### Login Screen
- Clean, modern design
- Email and password inputs with icons
- "Show/Hide password" toggle works
- "Sign In" button with loading state
- "Sign Up" link navigates correctly

### Home/Dashboard
- Appropriate content for role (Student/Teacher)
- Cards display correctly
- Images load (or placeholders show)
- Scrolling is smooth

### Profile Screen
- User info displays
- Avatar placeholder or image shows
- Edit buttons work
- Settings accessible

---

## 🔧 Debugging Tips

### View React DevTools
```powershell
# Shake device or press Ctrl+M (Android) / Cmd+D (iOS)
# Select "Debug Remote JS"
```

### View Logs
```powershell
# Terminal will show console.log outputs
# Look for errors in red text
```

### Check Network Requests
- Ensure .env file has correct Supabase credentials
- Check if Supabase project is active
- Verify API keys are correct

---

## ✅ Success Criteria

The app is working correctly if:
1. ✅ Builds and starts without errors
2. ✅ No red error screens appear
3. ✅ Authentication flow completes
4. ✅ Navigation works smoothly
5. ✅ UI components render correctly
6. ✅ Dark mode toggles properly
7. ✅ Animations are smooth
8. ✅ No console errors (yellow warnings OK)

---

## 📸 Recommended Screenshots to Take

1. Login screen (light & dark)
2. Sign up screen
3. Home/Dashboard (Student view)
4. Home/Dashboard (Teacher view)
5. Profile screen
6. Course listing (if available)
7. Chat interface (if available)
8. Settings/Theme toggle

---

## 🆘 Getting Help

### If you encounter issues:

1. **Check the terminal output** for error messages
2. **Look at the device/simulator** for red error screens
3. **Check `ENHANCEMENT_SUMMARY.md`** for known issues
4. **Verify environment variables** in `.env` file
5. **Try restarting** Metro bundler

### Common Fixes:
```powershell
# Full reset
Remove-Item -Recurse -Force node_modules, .expo, .git/index.lock -ErrorAction SilentlyContinue
npm install
npx expo start --clear
```

---

## 🎉 After Testing

### Report Results:
- List any bugs found
- Note performance issues
- Suggest UI improvements
- Document missing features

### Next Steps:
1. Fix any critical bugs
2. Implement missing screens
3. Add missing features
4. Optimize performance
5. Prepare for production build

---

**Happy Testing! 🚀**

*Last Updated: November 14, 2025*
