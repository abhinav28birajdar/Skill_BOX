/**
 * Student Dashboard - Main Home Screen
 * 
 * Features:
 * - Personalized greeting with streak counter
 * - Continue learning section
 * - Daily challenges
 * - Recommended courses
 * - Learning path progress
 * - Quick stats (XP, Level, Achievements)
 * - Upcoming live sessions
 * - Featured instructors
 * - Trending courses by category
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import { CourseCard } from '@/components/student/CourseCard';
import { DailyChallenge } from '@/components/student/DailyChallenge';
import { InstructorCard } from '@/components/student/InstructorCard';
import { LiveSessionCard } from '@/components/student/LiveSessionCard';
import { StatsCard } from '@/components/student/StatsCard';
import { StreakCounter } from '@/components/student/StreakCounter';

// Mock Data
const STUDENT_DATA = {
  name: 'Alex Johnson',
  level: 12,
  xp: 2450,
  nextLevelXP: 3000,
  streak: 15,
  coursesCompleted: 8,
  achievements: 24,
  studyHours: 87,
};

const CONTINUE_LEARNING = [
  {
    id: '1',
    title: 'Advanced React Native Development',
    instructor: 'Sarah Wilson',
    rating: 4.9,
    students: 15200,
    thumbnail: 'https://via.placeholder.com/400x225/667eea/ffffff?text=React+Native',
    category: 'Development',
    progress: 65,
    duration: '12h 30m',
  },
  {
    id: '2',
    title: 'UI/UX Design Principles',
    instructor: 'Michael Chen',
    rating: 4.8,
    students: 8900,
    thumbnail: 'https://via.placeholder.com/400x225/f093fb/ffffff?text=UI/UX+Design',
    category: 'Design',
    progress: 40,
    duration: '8h 15m',
  },
];

const RECOMMENDED_COURSES = [
  {
    id: '3',
    title: 'Full Stack JavaScript Bootcamp',
    instructor: 'David Martinez',
    rating: 4.9,
    students: 22100,
    price: '$59.99',
    thumbnail: 'https://via.placeholder.com/400x225/4facfe/ffffff?text=JavaScript',
    category: 'Development',
    duration: '24h',
  },
  {
    id: '4',
    title: 'Machine Learning Fundamentals',
    instructor: 'Dr. Emily Brown',
    rating: 4.7,
    students: 18500,
    price: '$79.99',
    thumbnail: 'https://via.placeholder.com/400x225/43e97b/ffffff?text=Machine+Learning',
    category: 'Data Science',
    duration: '16h',
  },
  {
    id: '5',
    title: 'Digital Marketing Mastery',
    instructor: 'James Anderson',
    rating: 4.8,
    students: 12800,
    price: '$49.99',
    thumbnail: 'https://via.placeholder.com/400x225/fa709a/ffffff?text=Marketing',
    category: 'Marketing',
    duration: '10h',
  },
];

const LIVE_SESSIONS = [
  {
    id: 'live1',
    title: 'Building Scalable React Apps',
    instructor: 'Sarah Wilson',
    instructorAvatar: 'https://via.placeholder.com/100/667eea/ffffff?text=SW',
    startTime: 'Now',
    duration: '2h',
    participants: 156,
    isLive: true,
  },
  {
    id: 'live2',
    title: 'Figma for Beginners Workshop',
    instructor: 'Michael Chen',
    instructorAvatar: 'https://via.placeholder.com/100/f093fb/ffffff?text=MC',
    startTime: 'In 30 min',
    duration: '1h 30m',
    participants: 89,
    isLive: false,
  },
];

const FEATURED_INSTRUCTORS = [
  {
    id: 'inst1',
    name: 'Sarah Wilson',
    title: 'Senior Developer',
    avatar: 'https://via.placeholder.com/100/667eea/ffffff?text=SW',
    students: 45000,
    courses: 12,
    rating: 4.9,
    specialization: 'React & Mobile Dev',
  },
  {
    id: 'inst2',
    name: 'Michael Chen',
    title: 'UX Designer',
    avatar: 'https://via.placeholder.com/100/f093fb/ffffff?text=MC',
    students: 32000,
    courses: 8,
    rating: 4.8,
    specialization: 'UI/UX Design',
  },
  {
    id: 'inst3',
    name: 'Dr. Emily Brown',
    title: 'Data Scientist',
    avatar: 'https://via.placeholder.com/100/43e97b/ffffff?text=EB',
    students: 38000,
    courses: 15,
    rating: 4.9,
    specialization: 'ML & AI',
  },
];

export default function StudentDashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.name}>{STUDENT_DATA.name} 👋</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#1F2937" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Streak Counter */}
        <StreakCounter streak={STUDENT_DATA.streak} />

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatsCard
              icon="flash"
              label="Total XP"
              value={STUDENT_DATA.xp}
              colors={['#6366F1', '#8B5CF6']}
              index={0}
            />
            <StatsCard
              icon="trophy"
              label="Level"
              value={STUDENT_DATA.level}
              colors={['#F59E0B', '#F97316']}
              index={1}
            />
          </View>
          <View style={styles.statsRow}>
            <StatsCard
              icon="ribbon"
              label="Achievements"
              value={STUDENT_DATA.achievements}
              colors={['#10B981', '#059669']}
              index={2}
            />
            <StatsCard
              icon="time"
              label="Study Hours"
              value={STUDENT_DATA.studyHours}
              colors={['#EF4444', '#DC2626']}
              index={3}
            />
          </View>
        </Animated.View>

        {/* Daily Challenge */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <DailyChallenge
            title="Complete 3 Lessons Today"
            description="Finish three lessons from any of your enrolled courses to earn bonus XP"
            xp={150}
            difficulty="medium"
            timeRemaining="18h 24m left"
            onPress={() => router.push('/challenges/daily')}
          />
        </Animated.View>

        {/* Continue Learning */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity onPress={() => router.push('/my-courses')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {CONTINUE_LEARNING.map((course, index) => (
            <CourseCard
              key={course.id}
              {...course}
              index={index}
              onPress={() => router.push(`/courses/${course.id}`)}
            />
          ))}
        </Animated.View>

        {/* Upcoming Live Sessions */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="videocam" size={24} color="#EF4444" />
              <Text style={styles.sectionTitle}>Live Sessions</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/live-sessions')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.liveSessionsContainer}>
            {LIVE_SESSIONS.map((session) => (
              <LiveSessionCard
                key={session.id}
                {...session}
                onPress={() => router.push(`/live-sessions/${session.id}`)}
              />
            ))}
          </View>
        </Animated.View>

        {/* Featured Instructors */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Instructors</Text>
            <TouchableOpacity onPress={() => router.push('/instructors')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {FEATURED_INSTRUCTORS.map((instructor) => (
              <InstructorCard
                key={instructor.id}
                {...instructor}
                onPress={() => router.push(`/instructors/${instructor.id}`)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Recommended Courses */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {RECOMMENDED_COURSES.map((course, index) => (
            <CourseCard
              key={course.id}
              {...course}
              index={index}
              onPress={() => router.push(`/courses/${course.id}`)}
            />
          ))}
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  liveSessionsContainer: {
    gap: 12,
  },
  horizontalList: {
    paddingRight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});
