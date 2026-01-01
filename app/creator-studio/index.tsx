/**
 * Creator Studio Dashboard
 * Features: Content creation hub, video upload, analytics
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const STUDIO_STATS = [
  { id: 1, label: 'Total Views', value: '125.4K', icon: 'eye-outline', color: '#6366F1', change: '+12.5%' },
  { id: 2, label: 'Total Revenue', value: '$8,450', icon: 'cash-outline', color: '#10B981', change: '+8.2%' },
  { id: 3, label: 'Active Courses', value: '15', icon: 'book-outline', color: '#F59E0B', change: '+2' },
  { id: 4, label: 'Students', value: '2.3K', icon: 'people-outline', color: '#8B5CF6', change: '+145' },
];

const QUICK_ACTIONS = [
  { id: 1, title: 'Upload Video', subtitle: 'Add new content', icon: 'cloud-upload-outline', color: '#6366F1' },
  { id: 2, title: 'Create Course', subtitle: 'Start a new course', icon: 'add-circle-outline', color: '#10B981' },
  { id: 3, title: 'Edit Content', subtitle: 'Manage existing', icon: 'create-outline', color: '#F59E0B' },
  { id: 4, title: 'Analytics', subtitle: 'View performance', icon: 'bar-chart-outline', color: '#8B5CF6' },
];

const RECENT_UPLOADS = [
  {
    id: 1,
    title: 'Advanced React Hooks',
    thumbnail: 'https://picsum.photos/400/225?random=1',
    views: 1234,
    likes: 89,
    status: 'published',
    uploadedAt: '2 days ago',
  },
  {
    id: 2,
    title: 'TypeScript Best Practices',
    thumbnail: 'https://picsum.photos/400/225?random=2',
    views: 856,
    likes: 67,
    status: 'processing',
    uploadedAt: '5 hours ago',
  },
];

export default function CreatorStudioScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Creator Studio</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STUDIO_STATS.map((stat, index) => (
            <Animated.View key={stat.id} entering={FadeInDown.delay(index * 100)} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <View style={styles.statChange}>
                <Ionicons name="trending-up" size={12} color="#10B981" />
                <Text style={styles.statChangeText}>{stat.change}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action, index) => (
              <Animated.View key={action.id} entering={FadeInDown.delay(index * 100)} style={styles.actionCard}>
                <TouchableOpacity style={styles.actionContent}>
                  <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                    <Ionicons name={action.icon as any} size={32} color={action.color} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Recent Uploads */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Uploads</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.uploadsList}>
            {RECENT_UPLOADS.map((video, index) => (
              <Animated.View key={video.id} entering={FadeInDown.delay(index * 100)} style={styles.videoCard}>
                <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} />
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <Text style={styles.videoTime}>{video.uploadedAt}</Text>
                  <View style={styles.videoStats}>
                    <View style={styles.videoStat}>
                      <Ionicons name="eye-outline" size={16} color="#6B7280" />
                      <Text style={styles.videoStatText}>{video.views.toLocaleString()}</Text>
                    </View>
                    <View style={styles.videoStat}>
                      <Ionicons name="heart-outline" size={16} color="#6B7280" />
                      <Text style={styles.videoStatText}>{video.likes}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: video.status === 'published' ? '#D1FAE5' : '#FEF3C7',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: video.status === 'published' ? '#10B981' : '#F59E0B',
                          },
                        ]}
                      >
                        {video.status}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.videoMenu}>
                  <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Upload New Content CTA */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.ctaCard}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.ctaGradient}>
            <Ionicons name="videocam" size={48} color="#fff" />
            <Text style={styles.ctaTitle}>Ready to create?</Text>
            <Text style={styles.ctaSubtitle}>Upload your next video and reach thousands of learners</Text>
            <TouchableOpacity style={styles.ctaButton}>
              <View style={styles.ctaButtonContent}>
                <Ionicons name="cloud-upload" size={20} color="#6366F1" />
                <Text style={styles.ctaButtonText}>Upload Video</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
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
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 20, gap: 12 },
  statCard: { width: '48%', padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  statIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', textAlign: 'center', marginBottom: 8 },
  statChange: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statChangeText: { fontSize: 12, fontWeight: '700', color: '#10B981' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  seeAll: { fontSize: 14, fontWeight: '700', color: '#6366F1' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '48%' },
  actionContent: { padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  actionIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', textAlign: 'center', marginBottom: 4 },
  actionSubtitle: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
  uploadsList: { gap: 16 },
  videoCard: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 16, gap: 12 },
  videoThumbnail: { width: 120, height: 68, borderRadius: 8 },
  videoInfo: { flex: 1 },
  videoTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  videoTime: { fontSize: 12, color: '#9CA3AF', marginBottom: 8 },
  videoStats: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  videoStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  videoStatText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  videoMenu: { padding: 8 },
  ctaCard: { marginHorizontal: 20, marginBottom: 20, borderRadius: 20, overflow: 'hidden' },
  ctaGradient: { padding: 32, alignItems: 'center' },
  ctaTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginTop: 16, marginBottom: 8 },
  ctaSubtitle: { fontSize: 14, color: '#E0E7FF', textAlign: 'center', marginBottom: 20 },
  ctaButton: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  ctaButtonContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, gap: 8 },
  ctaButtonText: { fontSize: 15, fontWeight: '700', color: '#6366F1' },
  bottomSpacing: { height: 40 },
});
