import { CourseCard } from '@/src/components/course/CourseCard';
import { CourseProgress } from '@/src/components/course/CourseProgress';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { useAuth } from '@/src/hooks/useAuth';
import { useEnrollments } from '@/src/hooks/useCourses';
import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyCoursesScreen() {
  const { profile } = useAuth();
  const { enrollments, loading, refresh } = useEnrollments(profile?.id || '');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your courses..." />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: '#1C1C1E',
              marginBottom: 8,
            }}
          >
            My Courses
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#8E8E93',
            }}
          >
            {enrollments.length} {enrollments.length === 1 ? 'course' : 'courses'} enrolled
          </Text>
        </View>

        {/* Courses */}
        <View style={{ paddingHorizontal: 20 }}>
          {enrollments.length === 0 ? (
            <EmptyState
              icon="book-outline"
              title="No courses yet"
              description="Start learning by enrolling in a course"
              actionLabel="Explore Courses"
              onAction={() => router.push('/(student)/explore')}
            />
          ) : (
            enrollments.map((enrollment) => (
              <View key={enrollment.id} style={{ marginBottom: 24 }}>
                <CourseCard
                  course={enrollment.courses}
                  onPress={() => router.push('/(student)/my-courses')}
                />
                <View style={{ marginTop: 12 }}>
                  <CourseProgress
                    completedLessons={enrollment.completed_lessons}
                    totalLessons={enrollment.total_lessons}
                  />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
