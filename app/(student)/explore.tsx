/**
 * Explore/Browse Page - Course Discovery
 * 
 * Features:
 * - Tab navigation (All, New, Trending, Top Rated)
 * - 12 main categories with icons
 * - Search bar with voice search
 * - Filter and sort options
 * - Course grid display
 */

import { CourseCard } from '@/components/student/CourseCard';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Categories
const CATEGORIES = [
  { id: 'programming', name: 'Programming & Development', icon: 'code-slash', color: ['#667eea', '#764ba2'] },
  { id: 'design', name: 'Graphic Design', icon: 'color-palette', color: ['#f093fb', '#f5576c'] },
  { id: 'photo', name: 'Photography & Video', icon: 'camera', color: ['#4facfe', '#00f2fe'] },
  { id: 'video-editing', name: 'Video Editing', icon: 'film', color: ['#43e97b', '#38f9d7'] },
  { id: 'business', name: 'Business & Marketing', icon: 'briefcase', color: ['#fa709a', '#fee140'] },
  { id: 'data-science', name: 'Data Science & AI', icon: 'stats-chart', color: ['#30cfd0', '#330867'] },
  { id: 'music', name: 'Music & Audio Production', icon: 'musical-notes', color: ['#a8edea', '#fed6e3'] },
  { id: '3d', name: '3D & Animation', icon: 'cube', color: ['#ff9a9e', '#fecfef'] },
  { id: 'writing', name: 'Writing & Content', icon: 'create', color: ['#ffecd2', '#fcb69f'] },
  { id: 'language', name: 'Language Learning', icon: 'language', color: ['#ff6e7f', '#bfe9ff'] },
  { id: 'personal', name: 'Personal Development', icon: 'person', color: ['#e0c3fc', '#8ec5fc'] },
  { id: 'fitness', name: 'Fitness & Wellness', icon: 'fitness', color: ['#f77062', '#fe5196'] },
];

// Mock courses
const ALL_COURSES = [
  {
    id: '1',
    title: 'Complete React Native Development',
    instructor: 'Sarah Wilson',
    rating: 4.9,
    students: 25000,
    price: '$89.99',
    thumbnail: 'https://via.placeholder.com/400x225/667eea/ffffff?text=React+Native',
    category: 'Programming',
    duration: '32h',
  },
  {
    id: '2',
    title: 'Advanced UI/UX Design Mastery',
    instructor: 'Michael Chen',
    rating: 4.8,
    students: 18000,
    price: '$79.99',
    thumbnail: 'https://via.placeholder.com/400x225/f093fb/ffffff?text=UI/UX+Design',
    category: 'Design',
    duration: '24h',
  },
  {
    id: '3',
    title: 'Machine Learning A-Z',
    instructor: 'Dr. Emily Brown',
    rating: 4.7,
    students: 32000,
    price: '$99.99',
    thumbnail: 'https://via.placeholder.com/400x225/30cfd0/ffffff?text=Machine+Learning',
    category: 'Data Science',
    duration: '40h',
  },
  {
    id: '4',
    title: 'Professional Photography Course',
    instructor: 'David Martinez',
    rating: 4.9,
    students: 15000,
    price: '$69.99',
    thumbnail: 'https://via.placeholder.com/400x225/4facfe/ffffff?text=Photography',
    category: 'Photography',
    duration: '18h',
  },
  {
    id: '5',
    title: 'Digital Marketing Complete Guide',
    instructor: 'Jessica Taylor',
    rating: 4.8,
    students: 22000,
    price: '$74.99',
    thumbnail: 'https://via.placeholder.com/400x225/fa709a/ffffff?text=Marketing',
    category: 'Business',
    duration: '20h',
  },
  {
    id: '6',
    title: '3D Modeling with Blender',
    instructor: 'Alex Johnson',
    rating: 4.7,
    students: 12000,
    price: '$59.99',
    thumbnail: 'https://via.placeholder.com/400x225/ff9a9e/ffffff?text=3D+Blender',
    category: '3D',
    duration: '28h',
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New' },
    { id: 'trending', label: 'Trending' },
    { id: 'top-rated', label: 'Top Rated' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for courses, instructors..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => router.push('/search')}
          />
          <TouchableOpacity>
            <Ionicons name="mic-outline" size={20} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.tabActive,
            ]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((category, index) => (
              <Animated.View
                key={category.id}
                entering={FadeInDown.delay(index * 50).springify()}
              >
                <TouchableOpacity
                  style={styles.categoryCard}
                  onPress={() => router.push(`/(student)/category/${category.id}`)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={category.color}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.categoryGradient}
                  >
                    <Ionicons name={category.icon as any} size={32} color="#fff" />
                    <Text style={styles.categoryName} numberOfLines={2}>
                      {category.name}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* All Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedTab === 'all' && 'All Courses'}
              {selectedTab === 'new' && 'New Courses'}
              {selectedTab === 'trending' && 'Trending Now'}
              {selectedTab === 'top-rated' && 'Top Rated Courses'}
            </Text>
            <TouchableOpacity>
              <View style={styles.sortButton}>
                <Text style={styles.sortText}>Sort</Text>
                <Ionicons name="chevron-down" size={16} color="#6366F1" />
              </View>
            </TouchableOpacity>
          </View>

          {ALL_COURSES.map((course, index) => (
            <CourseCard
              key={course.id}
              {...course}
              index={index}
              onPress={() => router.push(`/courses/${course.id}`)}
            />
          ))}
        </View>

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
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1.2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});
