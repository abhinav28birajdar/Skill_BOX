/**
 * Community Forums
 * Features: Discussion topics, threads, replies
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const FORUM_CATEGORIES = [
  { id: 1, name: 'General Discussion', threads: 1234, icon: 'chatbubbles-outline', color: '#6366F1' },
  { id: 2, name: 'Technical Help', threads: 567, icon: 'code-slash-outline', color: '#8B5CF6' },
  { id: 3, name: 'Course Reviews', threads: 890, icon: 'star-outline', color: '#F59E0B' },
  { id: 4, name: 'Study Groups', threads: 345, icon: 'people-outline', color: '#10B981' },
];

const RECENT_THREADS = [
  {
    id: 1,
    title: 'Best practices for React Native performance?',
    author: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
    category: 'Technical Help',
    replies: 23,
    views: 456,
    lastActivity: '2m ago',
    isPinned: true,
  },
  {
    id: 2,
    title: 'Looking for study partners for TypeScript course',
    author: 'Marcus Johnson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    category: 'Study Groups',
    replies: 12,
    views: 189,
    lastActivity: '1h ago',
    isPinned: false,
  },
  {
    id: 3,
    title: 'React Native Masterclass - Worth it?',
    author: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    category: 'Course Reviews',
    replies: 45,
    views: 678,
    lastActivity: '3h ago',
    isPinned: false,
  },
];

export default function ForumsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community Forums</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search forums..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {FORUM_CATEGORIES.map((category, index) => (
              <Animated.View key={category.id} entering={FadeInDown.delay(index * 100)} style={styles.categoryCard}>
                <TouchableOpacity style={styles.categoryContent}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                    <Ionicons name={category.icon as any} size={28} color={category.color} />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryThreads}>{category.threads} threads</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Recent Threads */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Discussions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.threadsList}>
            {RECENT_THREADS.map((thread, index) => (
              <Animated.View key={thread.id} entering={FadeInDown.delay(index * 100)}>
                <TouchableOpacity style={styles.threadCard}>
                  {thread.isPinned && (
                    <View style={styles.pinnedBadge}>
                      <Ionicons name="pin" size={12} color="#6366F1" />
                      <Text style={styles.pinnedText}>Pinned</Text>
                    </View>
                  )}

                  <View style={styles.threadHeader}>
                    <Image source={{ uri: thread.avatar }} style={styles.avatar} />
                    <View style={styles.threadHeaderInfo}>
                      <Text style={styles.threadAuthor}>{thread.author}</Text>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{thread.category}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.threadTitle}>{thread.title}</Text>

                  <View style={styles.threadFooter}>
                    <View style={styles.threadStats}>
                      <View style={styles.statItem}>
                        <Ionicons name="chatbubble-outline" size={14} color="#6B7280" />
                        <Text style={styles.statText}>{thread.replies}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Ionicons name="eye-outline" size={14} color="#6B7280" />
                        <Text style={styles.statText}>{thread.views}</Text>
                      </View>
                    </View>
                    <Text style={styles.lastActivity}>{thread.lastActivity}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Create Thread FAB */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', margin: 20, padding: 12, backgroundColor: '#fff', borderRadius: 12, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#1F2937' },
  content: { flex: 1 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  viewAll: { fontSize: 14, fontWeight: '600', color: '#6366F1' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: { width: '48%' },
  categoryContent: { padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  categoryIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  categoryName: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 4, textAlign: 'center' },
  categoryThreads: { fontSize: 12, color: '#6B7280' },
  threadsList: { gap: 16 },
  threadCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  pinnedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#EEF2FF', borderRadius: 6, marginBottom: 12 },
  pinnedText: { fontSize: 11, fontWeight: '700', color: '#6366F1' },
  threadHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  threadHeaderInfo: { flex: 1 },
  threadAuthor: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#F3F4F6', borderRadius: 4, alignSelf: 'flex-start' },
  categoryBadgeText: { fontSize: 11, fontWeight: '600', color: '#6B7280' },
  threadTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12, lineHeight: 24 },
  threadFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  threadStats: { flexDirection: 'row', gap: 16 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  lastActivity: { fontSize: 12, color: '#9CA3AF' },
  bottomSpacing: { height: 80 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#6366F1', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
});
