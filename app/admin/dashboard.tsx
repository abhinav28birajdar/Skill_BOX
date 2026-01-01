/**
 * Admin Dashboard
 * Features: User management, content moderation, platform stats
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const PLATFORM_STATS = [
  { id: 1, label: 'Total Users', value: '45.2K', icon: 'people-outline', color: '#6366F1', change: '+2.4K' },
  { id: 2, label: 'Active Courses', value: '1,234', icon: 'book-outline', color: '#10B981', change: '+156' },
  { id: 3, label: 'Revenue', value: '$125K', icon: 'cash-outline', color: '#F59E0B', change: '+15.3%' },
  { id: 4, label: 'Support Tickets', value: '23', icon: 'help-circle-outline', color: '#EF4444', change: '-8' },
];

const ADMIN_TOOLS = [
  { id: 1, title: 'User Management', icon: 'people', color: '#6366F1', route: '/admin/users' },
  { id: 2, title: 'Content Moderation', icon: 'shield-checkmark', color: '#10B981', route: '/admin/moderation' },
  { id: 3, title: 'Analytics', icon: 'stats-chart', color: '#F59E0B', route: '/admin/analytics' },
  { id: 4, title: 'Settings', icon: 'settings', color: '#8B5CF6', route: '/admin/settings' },
  { id: 5, title: 'Reports', icon: 'document-text', color: '#EF4444', route: '/admin/reports' },
  { id: 6, title: 'Payments', icon: 'card', color: '#10B981', route: '/admin/payments' },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    user: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
    action: 'published a new course',
    target: 'React Native Advanced',
    time: '5m ago',
    type: 'course',
  },
  {
    id: 2,
    user: 'Marcus Johnson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    action: 'reported a review',
    target: 'Inappropriate content',
    time: '15m ago',
    type: 'report',
  },
  {
    id: 3,
    user: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    action: 'requested a refund',
    target: 'UI/UX Design Pro - $59.99',
    time: '1h ago',
    type: 'payment',
  },
];

const PENDING_REVIEWS = [
  { id: 1, course: 'React Native Masterclass', instructor: 'John Doe', submitted: '2024-01-15', status: 'pending' },
  { id: 2, course: 'Advanced TypeScript', instructor: 'Jane Smith', submitted: '2024-01-14', status: 'pending' },
];

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'overview' && styles.tabActive]}
          onPress={() => setSelectedTab('overview')}
        >
          <Text style={[styles.tabText, selectedTab === 'overview' && styles.tabTextActive]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'activity' && styles.tabActive]}
          onPress={() => setSelectedTab('activity')}
        >
          <Text style={[styles.tabText, selectedTab === 'activity' && styles.tabTextActive]}>Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'moderation' && styles.tabActive]}
          onPress={() => setSelectedTab('moderation')}
        >
          <Text style={[styles.tabText, selectedTab === 'moderation' && styles.tabTextActive]}>Moderation</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && (
          <>
            {/* Platform Stats */}
            <View style={styles.statsGrid}>
              {PLATFORM_STATS.map((stat, index) => (
                <Animated.View key={stat.id} entering={FadeInDown.delay(index * 100)} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                    <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <View style={styles.statChange}>
                    <Ionicons
                      name={stat.change.startsWith('-') ? 'trending-down' : 'trending-up'}
                      size={12}
                      color={stat.change.startsWith('-') ? '#EF4444' : '#10B981'}
                    />
                    <Text
                      style={[
                        styles.statChangeText,
                        { color: stat.change.startsWith('-') ? '#EF4444' : '#10B981' },
                      ]}
                    >
                      {stat.change}
                    </Text>
                  </View>
                </Animated.View>
              ))}
            </View>

            {/* Admin Tools */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Admin Tools</Text>
              <View style={styles.toolsGrid}>
                {ADMIN_TOOLS.map((tool, index) => (
                  <Animated.View key={tool.id} entering={FadeInDown.delay(index * 100)} style={styles.toolCard}>
                    <TouchableOpacity style={styles.toolContent}>
                      <View style={[styles.toolIcon, { backgroundColor: `${tool.color}15` }]}>
                        <Ionicons name={tool.icon as any} size={28} color={tool.color} />
                      </View>
                      <Text style={styles.toolTitle}>{tool.title}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </View>
          </>
        )}

        {selectedTab === 'activity' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <View style={styles.activitiesList}>
              {RECENT_ACTIVITIES.map((activity, index) => (
                <Animated.View key={activity.id} entering={FadeInDown.delay(index * 100)} style={styles.activityCard}>
                  <Image source={{ uri: activity.avatar }} style={styles.activityAvatar} />
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityText}>
                      <Text style={styles.activityUser}>{activity.user}</Text> {activity.action}
                    </Text>
                    <Text style={styles.activityTarget}>{activity.target}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                  <View
                    style={[
                      styles.activityBadge,
                      {
                        backgroundColor:
                          activity.type === 'course'
                            ? '#EEF2FF'
                            : activity.type === 'report'
                            ? '#FEE2E2'
                            : '#FEF3C7',
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        activity.type === 'course'
                          ? 'book'
                          : activity.type === 'report'
                          ? 'flag'
                          : 'cash'
                      }
                      size={16}
                      color={
                        activity.type === 'course'
                          ? '#6366F1'
                          : activity.type === 'report'
                          ? '#EF4444'
                          : '#F59E0B'
                      }
                    />
                  </View>
                </Animated.View>
              ))}
            </View>
          </View>
        )}

        {selectedTab === 'moderation' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Reviews</Text>
            <View style={styles.reviewsList}>
              {PENDING_REVIEWS.map((review, index) => (
                <Animated.View key={review.id} entering={FadeInDown.delay(index * 100)} style={styles.reviewCard}>
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewCourse}>{review.course}</Text>
                    <Text style={styles.reviewInstructor}>by {review.instructor}</Text>
                    <Text style={styles.reviewDate}>Submitted: {review.submitted}</Text>
                  </View>
                  <View style={styles.reviewActions}>
                    <TouchableOpacity style={styles.approveButton}>
                      <Ionicons name="checkmark-circle" size={20} color="#fff" />
                      <Text style={styles.approveText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectButton}>
                      <Ionicons name="close-circle" size={20} color="#fff" />
                      <Text style={styles.rejectText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  tabs: { flexDirection: 'row', padding: 16, gap: 8 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, backgroundColor: '#fff' },
  tabActive: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  content: { flex: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 20, gap: 12 },
  statCard: { width: '48%', padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  statIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', textAlign: 'center', marginBottom: 8 },
  statChange: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statChangeText: { fontSize: 12, fontWeight: '700' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  toolCard: { width: '31%' },
  toolContent: { padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  toolIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  toolTitle: { fontSize: 12, fontWeight: '700', color: '#1F2937', textAlign: 'center' },
  activitiesList: { gap: 12 },
  activityCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, gap: 12 },
  activityAvatar: { width: 48, height: 48, borderRadius: 24 },
  activityInfo: { flex: 1 },
  activityText: { fontSize: 14, color: '#4B5563', marginBottom: 4 },
  activityUser: { fontWeight: '700', color: '#1F2937' },
  activityTarget: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 4 },
  activityTime: { fontSize: 12, color: '#9CA3AF' },
  activityBadge: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  reviewsList: { gap: 16 },
  reviewCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  reviewInfo: { marginBottom: 16 },
  reviewCourse: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  reviewInstructor: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  reviewDate: { fontSize: 12, color: '#9CA3AF' },
  reviewActions: { flexDirection: 'row', gap: 8 },
  approveButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, backgroundColor: '#10B981', borderRadius: 8, gap: 6 },
  approveText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  rejectButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, backgroundColor: '#EF4444', borderRadius: 8, gap: 6 },
  rejectText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  bottomSpacing: { height: 40 },
});
