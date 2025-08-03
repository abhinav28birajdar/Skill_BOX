import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="sign-in"
          options={{
            title: 'Sign In',
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            title: 'Sign Up',
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            title: 'Forgot Password',
            presentation: 'modal',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
