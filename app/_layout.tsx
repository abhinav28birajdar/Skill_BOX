<<<<<<< HEAD
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import '../global.css';
import { useAuth } from '../src/hooks/useAuth';
import { useActualColorScheme, useThemeStore } from '../src/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, loading, isStudent, isTeacher } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { initialize } = useThemeStore();
  const actualColorScheme = useActualColorScheme();

  // Initialize theme on mount
  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inStudentGroup = segments[0] === '(student)';
    const inTeacherGroup = segments[0] === '(teacher)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect authenticated users away from auth screens
      if (isStudent) {
        router.replace('/(student)');
      } else if (isTeacher) {
        router.replace('/(teacher)');
      }
    } else if (isAuthenticated && isStudent && inTeacherGroup) {
      // Students can't access teacher routes
      router.replace('/(student)');
    } else if (isAuthenticated && isTeacher && inStudentGroup) {
      // Teachers can't access student routes
      router.replace('/(teacher)');
    }

    SplashScreen.hideAsync();
  }, [isAuthenticated, loading, segments]);

  if (loading) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(student)" />
        <Stack.Screen name="(teacher)" />
      </Stack>
      <StatusBar style={actualColorScheme === 'dark' ? 'light' : 'dark'} />
    </>
=======
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AIModelProvider } from '@/context/AIModelContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider as EnhancedThemeProvider } from '@/context/ThemeContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LoadingScreen } from '@/components/common/LoadingScreen';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {user ? (
          // Authenticated routes
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(creator)" options={{ headerShown: false }} />
            <Stack.Screen name="(admin)" options={{ headerShown: false }} />
            <Stack.Screen name="skills/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="content/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="creator/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="classes/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="courses/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="community" options={{ headerShown: false }} />
            <Stack.Screen name="profile/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="messages" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
            <Stack.Screen name="support" options={{ headerShown: false }} />
            <Stack.Screen name="feedback" options={{ headerShown: false }} />
          </>
        ) : (
          // Public/Auth routes
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return <LoadingScreen />;
  }

  return (
    <EnhancedThemeProvider>
      <AuthProvider>
        <AIModelProvider>
          <RootLayoutNav />
        </AIModelProvider>
      </AuthProvider>
    </EnhancedThemeProvider>
>>>>>>> 663af87f49b6c2063bb6ee3bd31fe3f2cfba9260
  );
}
