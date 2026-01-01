import { Stack } from 'expo-router';

export default function LessonDetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="video" />
      <Stack.Screen name="notes" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="resources" />
    </Stack>
  );
}
