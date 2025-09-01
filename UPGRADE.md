# SkillBox Upgrade & Migration Guide

## Overview
This guide provides step-by-step instructions to upgrade SkillBox from Expo SDK 49 to SDK 52+ and modernize the application architecture.

## Pre-Upgrade Checklist

### 1. Prerequisites
- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Git repository backed up
- [ ] EAS CLI installed: `npm install -g @expo/cli eas-cli`
- [ ] Supabase account and project set up

### 2. Environment Setup
```bash
# Check Node version
node --version  # Should be 18+

# Install/update Expo CLI
npm install -g @expo/cli@latest

# Install EAS CLI
npm install -g eas-cli@latest

# Verify installations
expo --version
eas --version
```

### 3. Project Backup
```bash
# Create backup branch
git checkout -b backup/pre-upgrade
git push origin backup/pre-upgrade

# Create working branch
git checkout -b feature/expo-sdk-upgrade
```

## Upgrade Process

### Step 1: Clean Current State
```bash
# Remove node_modules and lockfiles
rm -rf node_modules
rm package-lock.json  # or yarn.lock

# Clear Expo cache
npx expo start --clear
```

### Step 2: Update Dependencies
The updated `package.json` includes:
- Expo SDK 52 (latest stable)
- React 18.3.1 
- React Native 0.75.3
- Compatible native modules
- Missing dependencies added (expo-brightness, expo-gl, etc.)

```bash
# Install updated dependencies
npm install

# Fix any remaining compatibility issues
npx expo install --fix
```

### Step 3: Update Configuration Files

#### Updated `app.json`:
- Added proper bundle identifiers
- Enhanced plugin configuration  
- EAS build configuration
- Camera and notification permissions

#### Updated `tsconfig.json`:
- Modern TypeScript configuration
- Fixed deprecated moduleResolution
- Better path resolution

### Step 4: Fix Breaking Changes

#### 1. Audio API Updates (lib/ImmersiveContentManager.ts)
```typescript
// OLD (deprecated)
interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX

// NEW (compatible)
// Removed deprecated interruption modes for compatibility
```

#### 2. Notifications API (services/notificationService.ts)
```typescript
// OLD
type: Notifications.SchedulableTriggerInputTypes.DATE

// NEW  
type: 'date' as const
```

#### 3. Blur Component (components/ui/TabBarBackground.ios.tsx)
```typescript
// OLD
tint="systemChromeMaterial"

// NEW
tint="default"
```

### Step 5: Run Diagnostics
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Run Expo doctor
npx expo-doctor

# Check for any remaining issues
npx expo install --fix
```

## Testing Locally

### 1. Start Development Server
```bash
# Start with cache clearing
npx expo start --clear

# Or start specific platforms
npx expo start --ios
npx expo start --android
```

### 2. Test Core Features
- [ ] Authentication flow (sign up/sign in)
- [ ] Course browsing and enrollment
- [ ] Video/content playback
- [ ] Real-time features (if implemented)
- [ ] Camera functionality (biometric features)
- [ ] Notifications
- [ ] Offline capabilities

### 3. Device Testing
```bash
# Test on iOS Simulator
npx expo start --ios

# Test on Android Emulator  
npx expo start --android

# Test on physical device
# Scan QR code with Expo Go app
```

## EAS Build Configuration

### 1. Initialize EAS
```bash
# Initialize EAS in your project
eas init

# Configure build profiles
eas build:configure
```

### 2. Build Profiles (eas.json)
```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### 3. Run Builds
```bash
# Development build
eas build --platform ios --profile development
eas build --platform android --profile development

# Production build
eas build --platform all --profile production
```

## Database Migration

### Current Status: ✅ NO MIGRATION REQUIRED
The existing database schema is production-ready and supports all current and planned features.

### Schema Verification
```sql
-- Verify core tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS policies
SELECT * FROM pg_policies;
```

## Real-time Features Implementation

### 1. Supabase Real-time Setup
```typescript
// Example: Real-time course progress
const subscription = supabase
  .channel('course-progress')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'user_progress',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Handle real-time progress updates
    updateProgressUI(payload.new);
  })
  .subscribe();
```

### 2. WebSocket Integration
```typescript
// lib/websocketService.ts
export class WebSocketService {
  private ws: WebSocket | null = null;
  
  connect(userId: string) {
    this.ws = new WebSocket(`wss://your-api.com/ws?user=${userId}`);
    this.ws.onmessage = this.handleMessage;
  }
  
  private handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    // Handle real-time notifications, class updates, etc.
  };
}
```

## Modern UI Updates

### 1. Design System Implementation
- Consistent color palette using React Native Paper
- Typography scale with proper accessibility
- Spacing system (4px grid)
- Component standardization

### 2. Accessibility Improvements
```typescript
// Example accessible component
<TouchableOpacity
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Enroll in course"
  accessibilityHint="Double tap to enroll in this course"
>
  <Text>Enroll Now</Text>
</TouchableOpacity>
```

### 3. Animation Enhancements
```typescript
// Using react-native-reanimated 3.x
const opacity = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => {
  return {
    opacity: withTiming(opacity.value, { duration: 300 }),
  };
});
```

## Testing Implementation

### 1. Unit Tests Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

### 2. Integration Tests
```typescript
// __tests__/AuthFlow.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInScreen } from '../app/(auth)/signin';

describe('Authentication Flow', () => {
  it('should sign in user with valid credentials', async () => {
    const { getByTestId } = render(<SignInScreen />);
    
    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByTestId('signin-button'));
    
    await waitFor(() => {
      expect(getByTestId('success-message')).toBeTruthy();
    });
  });
});
```

### 3. E2E Tests
```bash
# Install Detox for E2E testing
npm install --save-dev detox
npx detox init
```

## Performance Optimization

### 1. Bundle Analysis
```bash
# Analyze bundle size
npx expo export --dump-sourcemap
npx react-native-bundle-visualizer
```

### 2. Image Optimization
```typescript
// Use expo-image for better performance
import { Image } from 'expo-image';

<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  cachePolicy="memory-disk"
  transition={200}
/>
```

### 3. Code Splitting
```typescript
// Lazy load heavy components
const BiometricComponents = React.lazy(() => import('./BiometricComponents'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <BiometricComponents />
</Suspense>
```

## Security Enhancements

### 1. Environment Variables
```bash
# .env.example
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. API Rate Limiting
```typescript
// Add rate limiting to API calls
const rateLimiter = new Map();

export const apiCall = async (endpoint: string) => {
  const now = Date.now();
  const lastCall = rateLimiter.get(endpoint) || 0;
  
  if (now - lastCall < 1000) { // 1 second limit
    throw new Error('Rate limit exceeded');
  }
  
  rateLimiter.set(endpoint, now);
  return fetch(endpoint);
};
```

## Production Deployment

### 1. Environment Setup
```bash
# Production environment variables
export EXPO_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export EXPO_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 2. Build and Submit
```bash
# Build for production
eas build --platform all --profile production

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

### 3. OTA Updates
```bash
# Push over-the-air update
eas update --branch production --message "Bug fixes and improvements"
```

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Issues
```bash
npx expo start --clear
rm -rf node_modules && npm install
```

#### 2. iOS Build Failures
```bash
cd ios && pod install
npx expo run:ios --device
```

#### 3. Android Build Issues
```bash
cd android && ./gradlew clean
npx expo run:android
```

#### 4. TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit

# Update type definitions
npm update @types/react @types/react-native
```

### Support Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)
- [Supabase Documentation](https://supabase.com/docs)

## Post-Upgrade Verification

### 1. Functionality Checklist
- [ ] App launches successfully
- [ ] Authentication works
- [ ] Navigation flows correctly
- [ ] Camera/biometric features functional
- [ ] Real-time features working
- [ ] Push notifications delivered
- [ ] In-app purchases (if applicable)

### 2. Performance Metrics
- [ ] App startup time < 3 seconds
- [ ] Smooth scrolling and navigation
- [ ] Memory usage within acceptable limits
- [ ] Battery usage optimized

### 3. Store Submission
- [ ] App Store Connect configured
- [ ] Google Play Console set up
- [ ] Screenshots and metadata updated
- [ ] Privacy policy and terms updated

## Next Steps

1. **Monitor Analytics**: Implement crash reporting and user analytics
2. **User Feedback**: Collect feedback on new features and performance
3. **Iterative Improvements**: Plan next feature releases based on user data
4. **Security Audits**: Regular security reviews and updates

## Changelog

### Version 4.0.0 - Major Upgrade
- ✅ Upgraded to Expo SDK 52
- ✅ Updated React Native to 0.75.3
- ✅ Fixed all TypeScript compilation errors
- ✅ Added missing dependencies
- ✅ Modernized UI components
- ✅ Enhanced security configuration
- ✅ Improved build process
- ⏳ Real-time features implementation
- ⏳ Comprehensive testing suite
- ⏳ Performance optimizations
