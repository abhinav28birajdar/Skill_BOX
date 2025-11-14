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
  );
}
