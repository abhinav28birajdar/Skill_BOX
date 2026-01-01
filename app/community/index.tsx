/**
 * Community Page
 * Features: User discovery, follow system, activity feed
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const SUGGESTED_USERS = [
  {
    id: 1,
    name: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Full Stack Developer | React Native Enthusiast',
    followers: 1234,
    courses: 12,
    isFollowing: false,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'UI/UX Designer | Creative Mind',
    followers: 856,
    courses: 8,
    isFollowing: false,
  },
  {
    id: 3,
    name: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Data Scientist | ML Engineer',
    followers: 2341,
    courses: 15,
    isFollowing: true,
  },
];

const ACTIVITY_FEED = [
  {
    id: 1,
    user: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
    action: 'completed',
    target: 'React Native Masterclass',
    time: '2h ago',
    type: 'course',
  },
  {
    id: 2,
    user: 'Marcus Johnson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    action: 'earned',
    target: '7-Day Streak badge',
    time: '5h ago',
    type: 'achievement',
  },
  {
    id: 3,
    user: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    action: 'started',
    target: 'Advanced TypeScript course',
    time: '1d ago',
    type: 'course',
  },
];

export default function CommunityScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discover' && styles.tabActive]}
          onPress={() => setActiveTab('discover')}
        >
          <Text style={[styles.tabText, activeTab === 'discover' && styles.tabTextActive]}>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'following' && styles.tabActive]}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[styles.tabText, activeTab === 'following' && styles.tabTextActive]}>Following</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activity' && styles.tabActive]}
          onPress={() => setActiveTab('activity')}
        >
          <Text style={[styles.tabText, activeTab === 'activity' && styles.tabTextActive]}>Activity</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'discover' && (
          <>
            {/* Search */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search users..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Suggested Users */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Suggested for You</Text>
              {SUGGESTED_USERS.map((user, index) => (
                <Animated.View key={user.id} entering={FadeInDown.delay(index * 100)} style={styles.userCard}>
                  <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userBio}>{user.bio}</Text>
                    <View style={styles.userStats}>
                      <View style={styles.userStat}>
                        <Ionicons name="people-outline" size={14} color="#6B7280" />
                        <Text style={styles.userStatText}>{user.followers} followers</Text>
                      </View>
                      <View style={styles.userStat}>
                        <Ionicons name="book-outline" size={14} color="#6B7280" />
                        <Text style={styles.userStatText}>{user.courses} courses</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.followButton, user.isFollowing && styles.followingButton]}
                  >
                    <Text style={[styles.followButtonText, user.isFollowing && styles.followingButtonText]}>
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'activity' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {ACTIVITY_FEED.map((activity, index) => (
              <Animated.View key={activity.id} entering={FadeInDown.delay(index * 100)} style={styles.activityCard}>
                <Image source={{ uri: activity.avatar }} style={styles.activityAvatar} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>
                    <Text style={styles.activityUser}>{activity.user}</Text> {activity.action}{' '}
                    <Text style={styles.activityTarget}>{activity.target}</Text>
                  </Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <View
                  style={[
                    styles.activityIcon,
                    { backgroundColor: activity.type === 'course' ? '#EEF2FF' : '#FEF3C7' },
                  ]}
                >
                  <Ionicons
                    name={activity.type === 'course' ? 'book' : 'trophy'}
                    size={16}
                    color={activity.type === 'course' ? '#6366F1' : '#F59E0B'}
                  />
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        {activeTab === 'following' && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="people-outline" size={64} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>No Following Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start following other learners to see their activity here
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => setActiveTab('discover')}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.emptyButtonGradient}
              >
                <Text style={styles.emptyButtonText}>Discover Users</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  tabs: { flexDirection: 'row', padding: 16, gap: 8 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, backgroundColor: '#fff' },
  tabActive: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  content: { flex: 1 },
  searchContainer: { padding: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 12, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#1F2937' },
  section: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, gap: 12 },
  userAvatar: { width: 60, height: 60, borderRadius: 30 },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  userBio: { fontSize: 13, color: '#6B7280', marginBottom: 8 },
  userStats: { flexDirection: 'row', gap: 12 },
  userStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  userStatText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  followButton: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#6366F1', borderRadius: 20 },
  followingButton: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  followButtonText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  followingButtonText: { color: '#6B7280' },
  activityCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, gap: 12 },
  activityAvatar: { width: 48, height: 48, borderRadius: 24 },
  activityContent: { flex: 1 },
  activityText: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 4 },
  activityUser: { fontWeight: '700', color: '#1F2937' },
  activityTarget: { fontWeight: '600', color: '#6366F1' },
  activityTime: { fontSize: 12, color: '#9CA3AF' },
  activityIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', paddingVertical: 80, paddingHorizontal: 40 },
  emptyIcon: { marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  emptyButton: { borderRadius: 12, overflow: 'hidden' },
  emptyButtonGradient: { paddingHorizontal: 32, paddingVertical: 14 },
  emptyButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  bottomSpacing: { height: 40 },
});
