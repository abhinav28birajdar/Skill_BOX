/**
 * Search Results Page
 * Features: Tabbed results (Courses, Instructors, Lessons), advanced filters
 */

import { CourseCard } from '@/components/student/CourseCard';
import { InstructorCard } from '@/components/student/InstructorCard';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_RESULTS = {
  courses: [
    { id: '1', title: 'React Native Complete Course', instructor: 'Sarah Wilson', rating: 4.9, students: 25000, price: '$89.99', thumbnail: 'https://via.placeholder.com/400x225/667eea/ffffff?text=React', category: 'Programming', duration: '32h' },
  ],
  instructors: [
    { id: '1', name: 'Sarah Wilson', title: 'Senior Developer', avatar: 'https://via.placeholder.com/100/667eea/ffffff?text=SW', students: 45000, courses: 12, rating: 4.9, specialization: 'React & Mobile' },
  ],
};

export default function SearchResultsScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState('courses');

  const tabs = [
    { id: 'courses', label: 'Courses', count: MOCK_RESULTS.courses.length },
    { id: 'instructors', label: 'Instructors', count: MOCK_RESULTS.instructors.length },
    { id: 'lessons', label: 'Lessons', count: 0 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')}>
          <Text style={styles.searchText} numberOfLines={1}>{q}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} style={[styles.tab, selectedTab === tab.id && styles.tabActive]} onPress={() => setSelectedTab(tab.id)}>
            <Text style={[styles.tabText, selectedTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
            <View style={[styles.tabBadge, selectedTab === tab.id && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, selectedTab === tab.id && styles.tabBadgeTextActive]}>{tab.count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'courses' && (
          <View style={styles.resultsSection}>
            {MOCK_RESULTS.courses.map((course, index) => (
              <CourseCard key={course.id} {...course} index={index} onPress={() => router.push(`/courses/${course.id}`)} />
            ))}
          </View>
        )}

        {selectedTab === 'instructors' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.instructorsContainer}>
            {MOCK_RESULTS.instructors.map((instructor) => (
              <InstructorCard key={instructor.id} {...instructor} onPress={() => router.push(`/instructors/${instructor.id}`)} />
            ))}
          </ScrollView>
        )}

        {selectedTab === 'lessons' && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No lessons found</Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backButton: { padding: 4 },
  searchBar: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F3F4F6', borderRadius: 12 },
  searchText: { fontSize: 16, color: '#1F2937', fontWeight: '500' },
  filterButton: { padding: 4 },
  tabsContainer: { paddingHorizontal: 20, paddingVertical: 12, gap: 12, backgroundColor: '#fff' },
  tab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#F3F4F6', gap: 8 },
  tabActive: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  tabBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: '#E5E7EB' },
  tabBadgeActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  tabBadgeText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  tabBadgeTextActive: { color: '#fff' },
  content: { flex: 1 },
  resultsSection: { padding: 20 },
  instructorsContainer: { padding: 20 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 },
  emptyText: { fontSize: 16, color: '#9CA3AF', marginTop: 16 },
  bottomSpacing: { height: 40 },
});
