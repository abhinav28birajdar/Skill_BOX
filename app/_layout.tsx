import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import ErrorBoundary from '@/components/common/ErrorBoundary';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ToastProvider } from '@/components/common/Toast';
import { AIModelProvider } from '@/context/AIModelContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider as EnhancedThemeProvider } from '@/context/ThemeContext';
import { useColorScheme } from '@/hooks/useColorScheme';

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
    <ErrorBoundary>
      <EnhancedThemeProvider>
        <AuthProvider>
          <AIModelProvider>
            <ToastProvider>
              <RootLayoutNav />
            </ToastProvider>
          </AIModelProvider>
        </AuthProvider>
      </EnhancedThemeProvider>
    </ErrorBoundary>
  );
}
