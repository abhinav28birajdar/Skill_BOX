/**
 * Bookmarks Screen
 * Features: Saved courses, lessons, and resources
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const BOOKMARK_TABS = ['All', 'Courses', 'Lessons', 'Resources'];

const BOOKMARKS = [
  {
    id: 1,
    type: 'course',
    title: 'React Native Masterclass',
    description: 'Complete guide to building mobile apps',
    thumbnail: 'https://via.placeholder.com/400x225',
    category: 'Development',
    instructor: 'John Doe',
    progress: 45,
    bookmarkedAt: '2 days ago',
  },
  {
    id: 2,
    type: 'lesson',
    title: 'State Management with Redux',
    description: 'Learn how to manage state effectively',
    thumbnail: 'https://via.placeholder.com/400x225',
    course: 'React Native Masterclass',
    duration: '25 min',
    bookmarkedAt: '5 days ago',
  },
  {
    id: 3,
    type: 'resource',
    title: 'Redux Toolkit Documentation',
    description: 'Official Redux Toolkit guide and API reference',
    fileType: 'PDF',
    fileSize: '2.5 MB',
    course: 'React Native Masterclass',
    bookmarkedAt: '1 week ago',
  },
  {
    id: 4,
    type: 'course',
    title: 'UI/UX Design Fundamentals',
    description: 'Master the basics of user interface design',
    thumbnail: 'https://via.placeholder.com/400x225',
    category: 'Design',
    instructor: 'Jane Smith',
    progress: 15,
    bookmarkedAt: '2 weeks ago',
  },
];

export default function BookmarksScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('All');

  const filteredBookmarks = BOOKMARKS.filter((bookmark) =>
    selectedTab === 'All' ? true : bookmark.type.toLowerCase() === selectedTab.toLowerCase().slice(0, -1)
  );

  const removeBookmark = (id: number) => {
    // Handle bookmark removal
    console.log('Remove bookmark:', id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookmarks</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {BOOKMARK_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.tabActive]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{BOOKMARKS.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {BOOKMARKS.filter((b) => b.type === 'course').length}
            </Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {BOOKMARKS.filter((b) => b.type === 'lesson').length}
            </Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
        </Animated.View>

        {/* Bookmarks List */}
        <View style={styles.bookmarksList}>
          {filteredBookmarks.map((bookmark, index) => (
            <Animated.View
              key={bookmark.id}
              entering={FadeInDown.delay(200 + index * 100)}
              style={styles.bookmarkCard}
            >
              {bookmark.type === 'course' && (
                <View style={styles.courseBookmark}>
                  <Image source={{ uri: bookmark.thumbnail }} style={styles.courseThumbnail} />
                  <View style={styles.courseContent}>
                    <View style={styles.courseHeader}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{bookmark.category}</Text>
                      </View>
                      <TouchableOpacity onPress={() => removeBookmark(bookmark.id)}>
                        <Ionicons name="bookmark" size={20} color="#6366F1" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.courseTitle}>{bookmark.title}</Text>
                    <Text style={styles.courseDescription}>{bookmark.description}</Text>
                    <View style={styles.courseMeta}>
                      <Ionicons name="person-outline" size={14} color="#6B7280" />
                      <Text style={styles.courseMetaText}>{bookmark.instructor}</Text>
                    </View>
                    {bookmark.progress > 0 && (
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View style={[styles.progressFill, { width: `${bookmark.progress}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{bookmark.progress}%</Text>
                      </View>
                    )}
                    <Text style={styles.bookmarkTime}>Saved {bookmark.bookmarkedAt}</Text>
                  </View>
                </View>
              )}

              {bookmark.type === 'lesson' && (
                <View style={styles.lessonBookmark}>
                  <View style={styles.lessonIcon}>
                    <Ionicons name="play-circle" size={28} color="#6366F1" />
                  </View>
                  <View style={styles.lessonContent}>
                    <View style={styles.lessonHeader}>
                      <Text style={styles.lessonTitle}>{bookmark.title}</Text>
                      <TouchableOpacity onPress={() => removeBookmark(bookmark.id)}>
                        <Ionicons name="bookmark" size={20} color="#6366F1" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.lessonDescription}>{bookmark.description}</Text>
                    <View style={styles.lessonMeta}>
                      <Text style={styles.lessonCourse}>{bookmark.course}</Text>
                      <View style={styles.lessonDot} />
                      <Ionicons name="time-outline" size={14} color="#6B7280" />
                      <Text style={styles.lessonDuration}>{bookmark.duration}</Text>
                    </View>
                    <Text style={styles.bookmarkTime}>Saved {bookmark.bookmarkedAt}</Text>
                  </View>
                </View>
              )}

              {bookmark.type === 'resource' && (
                <View style={styles.resourceBookmark}>
                  <View style={styles.resourceIcon}>
                    <Ionicons name="document-text" size={28} color="#F59E0B" />
                  </View>
                  <View style={styles.resourceContent}>
                    <View style={styles.resourceHeader}>
                      <Text style={styles.resourceTitle}>{bookmark.title}</Text>
                      <TouchableOpacity onPress={() => removeBookmark(bookmark.id)}>
                        <Ionicons name="bookmark" size={20} color="#6366F1" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.resourceDescription}>{bookmark.description}</Text>
                    <View style={styles.resourceMeta}>
                      <View style={styles.fileTypeBadge}>
                        <Text style={styles.fileTypeText}>{bookmark.fileType}</Text>
                      </View>
                      <Text style={styles.fileSize}>{bookmark.fileSize}</Text>
                    </View>
                    <Text style={styles.resourceCourse}>{bookmark.course}</Text>
                    <Text style={styles.bookmarkTime}>Saved {bookmark.bookmarkedAt}</Text>
                  </View>
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
  tabsContainer: { backgroundColor: '#fff', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tabsScroll: { paddingHorizontal: 20 },
  tab: { paddingHorizontal: 20, paddingVertical: 8, marginRight: 12, backgroundColor: '#F3F4F6', borderRadius: 20 },
  tabActive: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  content: { flex: 1 },
  statsCard: { flexDirection: 'row', margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  statDivider: { width: 1, backgroundColor: '#E5E7EB', marginHorizontal: 12 },
  bookmarksList: { paddingHorizontal: 20 },
  bookmarkCard: { marginBottom: 16, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  courseBookmark: {},
  courseThumbnail: { width: '100%', height: 180 },
  courseContent: { padding: 16 },
  courseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryBadge: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#EEF2FF', borderRadius: 12 },
  categoryText: { fontSize: 12, fontWeight: '700', color: '#6366F1' },
  courseTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  courseDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 12 },
  courseMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  courseMetaText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#6366F1', borderRadius: 3 },
  progressText: { fontSize: 12, fontWeight: '700', color: '#6366F1' },
  bookmarkTime: { fontSize: 12, color: '#9CA3AF', marginTop: 8 },
  lessonBookmark: { flexDirection: 'row', padding: 16, gap: 12 },
  lessonIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  lessonContent: { flex: 1 },
  lessonHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  lessonTitle: { flex: 1, fontSize: 15, fontWeight: '800', color: '#1F2937', marginRight: 12 },
  lessonDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 8 },
  lessonMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  lessonCourse: { fontSize: 13, fontWeight: '600', color: '#6366F1' },
  lessonDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#D1D5DB' },
  lessonDuration: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  resourceBookmark: { flexDirection: 'row', padding: 16, gap: 12 },
  resourceIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center' },
  resourceContent: { flex: 1 },
  resourceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  resourceTitle: { flex: 1, fontSize: 15, fontWeight: '800', color: '#1F2937', marginRight: 12 },
  resourceDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 8 },
  resourceMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  fileTypeBadge: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#FEF3C7', borderRadius: 6 },
  fileTypeText: { fontSize: 11, fontWeight: '700', color: '#F59E0B' },
  fileSize: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  resourceCourse: { fontSize: 13, fontWeight: '600', color: '#6366F1', marginBottom: 4 },
  bottomSpacing: { height: 20 },
});
