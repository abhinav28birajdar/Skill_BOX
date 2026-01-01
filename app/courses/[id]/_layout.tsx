import { Stack } from 'expo-router';

export default function CourseDetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="about" />
      <Stack.Screen name="reviews" />
      <Stack.Screen name="faq" />
      <Stack.Screen name="enroll" />
      <Stack.Screen name="detail-new" />
    </Stack>
  );
}
