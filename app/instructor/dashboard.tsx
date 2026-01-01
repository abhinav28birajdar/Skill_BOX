/**
 * Instructor Dashboard
 * Features: Revenue, students, courses, analytics overview
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const INSTRUCTOR_STATS = [
  { icon: 'cash-outline', label: 'Revenue', value: '$12,450', change: '+15%', color: '#10B981' },
  { icon: 'people-outline', label: 'Students', value: '2,345', change: '+8%', color: '#3B82F6' },
  { icon: 'book-outline', label: 'Courses', value: '12', change: '+2', color: '#8B5CF6' },
  { icon: 'star-outline', label: 'Avg Rating', value: '4.8', change: '+0.2', color: '#F59E0B' },
];

const RECENT_ENROLLMENTS = [
  { student: 'Sarah Chen', course: 'React Native Masterclass', date: '2 hours ago', avatar: 'https://i.pravatar.cc/150?img=1' },
  { student: 'Marcus Johnson', course: 'Advanced TypeScript', date: '5 hours ago', avatar: 'https://i.pravatar.cc/150?img=2' },
  { student: 'Emma Wilson', course: 'React Native Masterclass', date: '1 day ago', avatar: 'https://i.pravatar.cc/150?img=3' },
];

export default function InstructorDashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>Dr. John Smith</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {INSTRUCTOR_STATS.map((stat, index) => (
            <Animated.View key={index} entering={FadeInDown.delay(index * 100)} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={[styles.statChange, { color: stat.color }]}>{stat.change}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.actionGradient}>
                <Ionicons name="add-circle-outline" size={32} color="#fff" />
                <Text style={styles.actionText}>Create Course</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient colors={['#10B981', '#059669']} style={styles.actionGradient}>
                <Ionicons name="videocam-outline" size={32} color="#fff" />
                <Text style={styles.actionText}>Go Live</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.actionGradient}>
                <Ionicons name="chatbubbles-outline" size={32} color="#fff" />
                <Text style={styles.actionText}>Q&A Forum</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.actionGradient}>
                <Ionicons name="bar-chart-outline" size={32} color="#fff" />
                <Text style={styles.actionText}>Analytics</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Recent Enrollments */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Enrollments</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.enrollmentsList}>
            {RECENT_ENROLLMENTS.map((enrollment, index) => (
              <View key={index} style={styles.enrollmentCard}>
                <View style={styles.enrollmentLeft}>
                  <View style={styles.avatar} />
                  <View style={styles.enrollmentInfo}>
                    <Text style={styles.studentName}>{enrollment.student}</Text>
                    <Text style={styles.courseName}>{enrollment.course}</Text>
                  </View>
                </View>
                <Text style={styles.enrollmentDate}>{enrollment.date}</Text>
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
  header: { paddingHorizontal: 20, paddingVertical: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
  name: { fontSize: 24, fontWeight: '800', color: '#fff' },
  content: { flex: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 20, gap: 12 },
  statCard: { width: '48%', padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  statIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statChange: { fontSize: 12, fontWeight: '700' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  viewAll: { fontSize: 14, fontWeight: '600', color: '#6366F1' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '48%', borderRadius: 16, overflow: 'hidden' },
  actionGradient: { padding: 20, alignItems: 'center', gap: 8 },
  actionText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  enrollmentsList: { gap: 12 },
  enrollmentCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12 },
  enrollmentLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E5E7EB' },
  enrollmentInfo: { flex: 1 },
  studentName: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  courseName: { fontSize: 13, color: '#6B7280' },
  enrollmentDate: { fontSize: 12, color: '#9CA3AF' },
  bottomSpacing: { height: 40 },
});
