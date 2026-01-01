/**
 * Live Sessions List
 * Features: Upcoming sessions, live now, recordings
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const LIVE_SESSIONS = [
  {
    id: 1,
    title: 'React Native Performance Optimization',
    instructor: 'John Smith',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isLive: true,
    viewers: 234,
    startTime: 'Now',
    duration: '2h',
    thumbnail: 'https://picsum.photos/seed/live1/400/200',
  },
  {
    id: 2,
    title: 'TypeScript Advanced Patterns',
    instructor: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isLive: false,
    viewers: 0,
    startTime: 'Today at 3:00 PM',
    duration: '1.5h',
    thumbnail: 'https://picsum.photos/seed/live2/400/200',
  },
  {
    id: 3,
    title: 'Building Scalable APIs',
    instructor: 'Mike Johnson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isLive: false,
    viewers: 0,
    startTime: 'Tomorrow at 10:00 AM',
    duration: '2h',
    thumbnail: 'https://picsum.photos/seed/live3/400/200',
  },
];

export default function LiveSessionsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'live' | 'recordings'>('live');

  const tabs = [
    { key: 'live', label: 'Live Now', count: 1 },
    { key: 'upcoming', label: 'Upcoming', count: 2 },
    { key: 'recordings', label: 'Recordings', count: 12 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Sessions</Text>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.tabActive]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Text style={[styles.tabText, selectedTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View style={[styles.badge, selectedTab === tab.key && styles.badgeActive]}>
                <Text style={[styles.badgeText, selectedTab === tab.key && styles.badgeTextActive]}>
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {LIVE_SESSIONS.map((session, index) => (
          <Animated.View key={session.id} entering={FadeInDown.delay(index * 100)} style={styles.sessionCard}>
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: session.thumbnail }} style={styles.thumbnail} />
              {session.isLive && (
                <>
                  <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent']}
                    style={styles.thumbnailOverlay}
                  />
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                  <View style={styles.viewersCount}>
                    <Ionicons name="eye" size={14} color="#fff" />
                    <Text style={styles.viewersText}>{session.viewers}</Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.sessionContent}>
              <Text style={styles.sessionTitle}>{session.title}</Text>
              
              <View style={styles.instructorRow}>
                <Image source={{ uri: session.avatar }} style={styles.instructorAvatar} />
                <Text style={styles.instructorName}>{session.instructor}</Text>
              </View>

              <View style={styles.sessionMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text style={styles.metaText}>{session.startTime}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="hourglass-outline" size={16} color="#6B7280" />
                  <Text style={styles.metaText}>{session.duration}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.joinButton}>
                <LinearGradient
                  colors={session.isLive ? ['#EF4444', '#DC2626'] : ['#6366F1', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.joinGradient}
                >
                  <Ionicons name={session.isLive ? 'videocam' : 'calendar'} size={18} color="#fff" />
                  <Text style={styles.joinButtonText}>
                    {session.isLive ? 'Join Now' : 'Set Reminder'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', gap: 8 },
  tab: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 8, gap: 6 },
  tabActive: { backgroundColor: '#EEF2FF' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#6366F1' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#F3F4F6', borderRadius: 10 },
  badgeActive: { backgroundColor: '#6366F1' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  badgeTextActive: { color: '#fff' },
  content: { flex: 1 },
  sessionCard: { margin: 20, marginBottom: 0, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  thumbnailContainer: { position: 'relative', width: '100%', height: 180 },
  thumbnail: { width: '100%', height: '100%' },
  thumbnailOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 80 },
  liveBadge: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#EF4444', borderRadius: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  liveText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  viewersCount: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 6 },
  viewersText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  sessionContent: { padding: 16 },
  sessionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 12 },
  instructorRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  instructorAvatar: { width: 32, height: 32, borderRadius: 16 },
  instructorName: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  sessionMeta: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, color: '#6B7280' },
  joinButton: { borderRadius: 12, overflow: 'hidden' },
  joinGradient: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 14 },
  joinButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  bottomSpacing: { height: 20 },
});
