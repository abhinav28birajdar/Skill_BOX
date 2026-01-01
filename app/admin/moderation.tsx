/**
 * Admin Content Moderation Screen
 * Features: Review queue, approve/reject content, flagged items
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const MODERATION_TABS = ['Pending', 'Approved', 'Rejected', 'Flagged'];

const CONTENT_ITEMS = [
  {
    id: 1,
    type: 'course',
    title: 'Complete React Native Development 2024',
    author: 'Mike Chen',
    authorAvatar: 'https://i.pravatar.cc/150?img=2',
    thumbnail: 'https://picsum.photos/seed/course1/400/300',
    status: 'pending',
    submittedAt: '2024-03-15 14:30',
    reason: 'New course submission',
    flags: [],
  },
  {
    id: 2,
    type: 'lesson',
    title: 'Advanced TypeScript Patterns',
    author: 'Sarah Johnson',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    thumbnail: 'https://picsum.photos/seed/lesson1/400/300',
    status: 'pending',
    submittedAt: '2024-03-15 13:15',
    reason: 'New lesson content',
    flags: [],
  },
  {
    id: 3,
    type: 'comment',
    title: 'This course is absolutely terrible...',
    author: 'David Brown',
    authorAvatar: 'https://i.pravatar.cc/150?img=4',
    status: 'flagged',
    submittedAt: '2024-03-15 12:00',
    reason: 'Inappropriate language',
    flags: ['spam', 'offensive'],
  },
  {
    id: 4,
    type: 'course',
    title: 'Python for Data Science',
    author: 'Emma Wilson',
    authorAvatar: 'https://i.pravatar.cc/150?img=3',
    thumbnail: 'https://picsum.photos/seed/course2/400/300',
    status: 'approved',
    submittedAt: '2024-03-14 16:45',
    reason: 'New course submission',
    flags: [],
  },
  {
    id: 5,
    type: 'lesson',
    title: 'Introduction to Machine Learning',
    author: 'Lisa Garcia',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    thumbnail: 'https://picsum.photos/seed/lesson2/400/300',
    status: 'rejected',
    submittedAt: '2024-03-14 10:20',
    reason: 'Low quality content',
    flags: [],
  },
];

export default function AdminModerationScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('Pending');

  const filteredItems = CONTENT_ITEMS.filter((item) =>
    item.status === selectedTab.toLowerCase()
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return 'book';
      case 'lesson': return 'play-circle';
      case 'comment': return 'chatbubble';
      default: return 'document';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return '#6366F1';
      case 'lesson': return '#10B981';
      case 'comment': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Content Moderation</Text>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="time" size={20} color="#F59E0B" />
          </View>
          <Text style={styles.statValue}>
            {CONTENT_ITEMS.filter((i) => i.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(150)} style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="warning" size={20} color="#EF4444" />
          </View>
          <Text style={styles.statValue}>
            {CONTENT_ITEMS.filter((i) => i.status === 'flagged').length}
          </Text>
          <Text style={styles.statLabel}>Flagged</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="checkmark" size={20} color="#10B981" />
          </View>
          <Text style={styles.statValue}>156</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </Animated.View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {MODERATION_TABS.map((tab) => {
            const count = CONTENT_ITEMS.filter((i) => i.status === tab.toLowerCase()).length;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, selectedTab === tab && styles.tabActive]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
                {count > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Content List */}
        <View style={styles.contentList}>
          {filteredItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(250 + index * 100)}
              style={styles.contentCard}
            >
              <View style={styles.contentHeader}>
                <View
                  style={[
                    styles.typeIcon,
                    { backgroundColor: `${getTypeColor(item.type)}20` },
                  ]}
                >
                  <Ionicons
                    name={getTypeIcon(item.type) as any}
                    size={20}
                    color={getTypeColor(item.type)}
                  />
                </View>
                <View style={styles.contentHeaderInfo}>
                  <Text style={styles.contentType}>{item.type.toUpperCase()}</Text>
                  {item.flags.length > 0 && (
                    <View style={styles.flagsContainer}>
                      {item.flags.map((flag) => (
                        <View key={flag} style={styles.flagBadge}>
                          <Text style={styles.flagText}>{flag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {item.thumbnail && (
                <Image source={{ uri: item.thumbnail }} style={styles.contentThumbnail} />
              )}

              <Text style={styles.contentTitle} numberOfLines={2}>
                {item.title}
              </Text>

              <View style={styles.authorContainer}>
                <Image source={{ uri: item.authorAvatar }} style={styles.authorAvatar} />
                <View style={styles.authorInfo}>
                  <Text style={styles.authorName}>{item.author}</Text>
                  <Text style={styles.submittedText}>Submitted {item.submittedAt}</Text>
                </View>
              </View>

              <View style={styles.reasonContainer}>
                <Ionicons name="information-circle" size={14} color="#6B7280" />
                <Text style={styles.reasonText}>{item.reason}</Text>
              </View>

              {item.status === 'pending' || item.status === 'flagged' ? (
                <View style={styles.actionsContainer}>
                  <TouchableOpacity style={styles.rejectButton}>
                    <Ionicons name="close-circle" size={18} color="#EF4444" />
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.approveButton}>
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      style={styles.approveButtonGradient}
                    >
                      <Ionicons name="checkmark-circle" size={18} color="#fff" />
                      <Text style={styles.approveButtonText}>Approve</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        item.status === 'approved' ? '#D1FAE5' : '#FEE2E2',
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      item.status === 'approved'
                        ? 'checkmark-circle'
                        : 'close-circle'
                    }
                    size={16}
                    color={item.status === 'approved' ? '#10B981' : '#EF4444'}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: item.status === 'approved' ? '#10B981' : '#EF4444',
                      },
                    ]}
                  >
                    {item.status === 'approved' ? 'Approved' : 'Rejected'}
                  </Text>
                </View>
              )}
            </Animated.View>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  statsContainer: { flexDirection: 'row', padding: 20, gap: 12, backgroundColor: '#fff' },
  statCard: { flex: 1, alignItems: 'center', gap: 6 },
  statIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
  statLabel: { fontSize: 11, fontWeight: '600', color: '#6B7280' },
  tabsContainer: { backgroundColor: '#fff', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tabsScroll: { paddingHorizontal: 20 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
  tabActive: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  tabBadge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  tabBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  content: { flex: 1 },
  contentList: { padding: 20, gap: 16 },
  contentCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  contentHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  typeIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  contentHeaderInfo: { flex: 1, gap: 6 },
  contentType: { fontSize: 11, fontWeight: '800', color: '#6B7280' },
  flagsContainer: { flexDirection: 'row', gap: 6 },
  flagBadge: { paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#FEE2E2', borderRadius: 6 },
  flagText: { fontSize: 10, fontWeight: '800', color: '#EF4444' },
  contentThumbnail: { width: '100%', height: 160, borderRadius: 12, marginBottom: 12 },
  contentTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937', lineHeight: 22, marginBottom: 12 },
  authorContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  authorAvatar: { width: 40, height: 40, borderRadius: 20 },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  submittedText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  reasonContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 12, backgroundColor: '#F9FAFB', borderRadius: 8, marginBottom: 12 },
  reasonText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#6B7280' },
  actionsContainer: { flexDirection: 'row', gap: 12 },
  rejectButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, backgroundColor: '#FEE2E2', borderRadius: 12 },
  rejectButtonText: { fontSize: 14, fontWeight: '800', color: '#EF4444' },
  approveButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  approveButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  approveButtonText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12 },
  statusText: { fontSize: 14, fontWeight: '800' },
  bottomSpacing: { height: 20 },
});
