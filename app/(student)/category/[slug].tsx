/**
 * Category Detail Page
 * Dynamic route for each category with subcategories and course filtering
 */

import { CourseCard } from '@/components/student/CourseCard';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORY_DATA: any = {
  programming: {
    name: 'Programming & Development',
    description: 'Master programming languages and build real-world applications',
    icon: 'code-slash',
    color: ['#667eea', '#764ba2'],
    subcategories: ['Web Development', 'Mobile Development', 'Backend', 'DevOps', 'Game Development'],
    courses: [
      { id: '1', title: 'Complete React Native', instructor: 'Sarah Wilson', rating: 4.9, students: 25000, price: '$89.99', thumbnail: 'https://via.placeholder.com/400x225/667eea/ffffff?text=React', category: 'Programming', duration: '32h' },
      { id: '2', title: 'Node.js Masterclass', instructor: 'John Doe', rating: 4.8, students: 18000, price: '$79.99', thumbnail: 'https://via.placeholder.com/400x225/667eea/ffffff?text=Node.js', category: 'Programming', duration: '28h' },
    ],
  },
  design: {
    name: 'Graphic Design',
    description: 'Learn design principles and create stunning visual content',
    icon: 'color-palette',
    color: ['#f093fb', '#f5576c'],
    subcategories: ['UI/UX Design', 'Logo Design', 'Branding', 'Illustration', 'Typography'],
    courses: [
      { id: '3', title: 'UI/UX Design Mastery', instructor: 'Michael Chen', rating: 4.8, students: 18000, price: '$79.99', thumbnail: 'https://via.placeholder.com/400x225/f093fb/ffffff?text=UI/UX', category: 'Design', duration: '24h' },
    ],
  },
};

export default function CategoryDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('popular');

  const category = CATEGORY_DATA[slug as string] || CATEGORY_DATA.programming;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header with Gradient */}
      <LinearGradient colors={category.color} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <Ionicons name={category.icon as any} size={48} color="#fff" />
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subcategories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subcategories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
            {category.subcategories.map((sub: string) => (
              <TouchableOpacity
                key={sub}
                style={[styles.chip, selectedSubcategory === sub && styles.chipActive]}
                onPress={() => setSelectedSubcategory(selectedSubcategory === sub ? null : sub)}
              >
                <Text style={[styles.chipText, selectedSubcategory === sub && styles.chipTextActive]}>{sub}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filters */}
        <View style={styles.filtersRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter-outline" size={18} color="#6366F1" />
              <Text style={styles.filterText}>All Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Level</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Duration</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Price</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Rating</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Courses */}
        <View style={styles.coursesSection}>
          <View style={styles.coursesHeader}>
            <Text style={styles.coursesCount}>{category.courses.length} Courses</Text>
            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortText}>Sort by: Popular</Text>
              <Ionicons name="chevron-down" size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>

          {category.courses.map((course: any, index: number) => (
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
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  searchButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerContent: { alignItems: 'center', paddingHorizontal: 20 },
  categoryName: { fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 12, textAlign: 'center' },
  categoryDescription: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 8, textAlign: 'center' },
  content: { flex: 1 },
  section: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  chipsContainer: { gap: 8, paddingBottom: 4 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E5E7EB' },
  chipActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  chipTextActive: { color: '#fff' },
  filtersRow: { marginTop: 16, paddingVertical: 12, backgroundColor: '#fff', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  filtersContainer: { paddingHorizontal: 20, gap: 8 },
  filterButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', gap: 6 },
  filterText: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  coursesSection: { marginTop: 20, paddingHorizontal: 20 },
  coursesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  coursesCount: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  sortButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortText: { fontSize: 14, fontWeight: '600', color: '#6366F1' },
  bottomSpacing: { height: 40 },
});
