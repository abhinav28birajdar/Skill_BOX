/**
 * Progress Tracking Page
 * Features: Course progress, completion stats, learning paths
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const PROGRESS_DATA = {
  totalCourses: 12,
  completedCourses: 3,
  inProgress: 9,
  totalLessons: 234,
  completedLessons: 89,
  totalHours: 45.5,
  completedHours: 18.2,
};

const COURSE_PROGRESS = [
  { id: 1, title: 'React Native Masterclass', progress: 78, lessonsCompleted: 23, totalLessons: 30, hoursLeft: 3.5, status: 'in-progress' },
  { id: 2, title: 'Advanced TypeScript', progress: 45, lessonsCompleted: 12, totalLessons: 25, hoursLeft: 8.2, status: 'in-progress' },
  { id: 3, title: 'UI/UX Design Basics', progress: 100, lessonsCompleted: 18, totalLessons: 18, hoursLeft: 0, status: 'completed' },
];

const WEEKLY_ACTIVITY = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 1.8 },
  { day: 'Wed', hours: 3.2 },
  { day: 'Thu', hours: 2.1 },
  { day: 'Fri', hours: 1.5 },
  { day: 'Sat', hours: 0.8 },
  { day: 'Sun', hours: 1.2 },
];

export default function ProgressScreen() {
  const router = useRouter();
  const maxHours = Math.max(...WEEKLY_ACTIVITY.map(d => d.hours));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Progress</Text>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Stats */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="book-outline" size={24} color="#6366F1" />
            </View>
            <Text style={styles.statValue}>{PROGRESS_DATA.completedCourses}/{PROGRESS_DATA.totalCourses}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{PROGRESS_DATA.completedLessons}/{PROGRESS_DATA.totalLessons}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="time-outline" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{PROGRESS_DATA.completedHours}h</Text>
            <Text style={styles.statLabel}>Study Time</Text>
          </Animated.View>
        </View>

        {/* Weekly Activity */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityChart}>
              {WEEKLY_ACTIVITY.map((day, index) => {
                const barHeight = (day.hours / maxHours) * 100;
                return (
                  <View key={index} style={styles.activityBar}>
                    <Text style={styles.activityHours}>{day.hours}h</Text>
                    <View style={styles.barContainer}>
                      <View style={[styles.bar, { height: `${barHeight}%` }]} />
                    </View>
                    <Text style={styles.activityDay}>{day.day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* Course Progress */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Course Progress</Text>
          <View style={styles.coursesList}>
            {COURSE_PROGRESS.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <View style={styles.courseHeader}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  {course.status === 'completed' && (
                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={styles.completedText}>Completed</Text>
                    </View>
                  )}
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={course.status === 'completed' ? ['#10B981', '#059669'] : ['#6366F1', '#8B5CF6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressFill, { width: `${course.progress}%` }]}
                    />
                  </View>
                  <Text style={styles.progressText}>{course.progress}%</Text>
                </View>

                <View style={styles.courseStats}>
                  <View style={styles.courseStat}>
                    <Ionicons name="checkmark-circle-outline" size={16} color="#6B7280" />
                    <Text style={styles.courseStatText}>
                      {course.lessonsCompleted}/{course.totalLessons} lessons
                    </Text>
                  </View>
                  {course.hoursLeft > 0 && (
                    <View style={styles.courseStat}>
                      <Ionicons name="time-outline" size={16} color="#6B7280" />
                      <Text style={styles.courseStatText}>{course.hoursLeft}h left</Text>
                    </View>
                  )}
                </View>

                {course.status === 'in-progress' && (
                  <TouchableOpacity style={styles.continueButton}>
                    <Text style={styles.continueButtonText}>Continue Learning</Text>
                    <Ionicons name="arrow-forward" size={16} color="#6366F1" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  content: { flex: 1 },
  statsGrid: { flexDirection: 'row', padding: 20, gap: 12 },
  statCard: { flex: 1, padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  statIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  activityCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  activityChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150 },
  activityBar: { flex: 1, alignItems: 'center', gap: 8 },
  activityHours: { fontSize: 11, fontWeight: '700', color: '#6366F1' },
  barContainer: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', backgroundColor: '#6366F1', borderRadius: 4 },
  activityDay: { fontSize: 11, fontWeight: '600', color: '#6B7280' },
  coursesList: { gap: 16 },
  courseCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  courseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  courseTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#1F2937' },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  completedText: { fontSize: 12, fontWeight: '700', color: '#10B981' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  progressBar: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%' },
  progressText: { fontSize: 14, fontWeight: '700', color: '#6366F1', width: 45, textAlign: 'right' },
  courseStats: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  courseStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  courseStatText: { fontSize: 13, color: '#6B7280' },
  continueButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 12, backgroundColor: '#EEF2FF', borderRadius: 8 },
  continueButtonText: { fontSize: 14, fontWeight: '700', color: '#6366F1' },
  bottomSpacing: { height: 40 },
});
