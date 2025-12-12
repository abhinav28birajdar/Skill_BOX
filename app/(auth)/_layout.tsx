import { EnhancedThemeProvider } from '@/context/EnhancedThemeContext';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <EnhancedThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    </EnhancedThemeProvider>
  );
}
