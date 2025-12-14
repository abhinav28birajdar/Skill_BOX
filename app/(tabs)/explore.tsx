import { useTheme } from '@/context/EnhancedThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

// Mock data
const ALL_COURSES = [
  {
    id: '1',
    title: 'React Native Mastery',
    instructor: 'John Doe',
    rating: 4.8,
    students: 12500,
    price: '$49.99',
    thumbnail: 'https://via.placeholder.com/300x200/667eea/ffffff?text=React+Native',
    category: 'Development',
    level: 'Intermediate'
  },
  {
    id: '2',
    title: 'UI/UX Design Fundamentals',
    instructor: 'Sarah Smith',
    rating: 4.9,
    students: 8300,
    price: '$39.99',
    thumbnail: 'https://via.placeholder.com/300x200/f093fb/ffffff?text=UI/UX+Design',
    category: 'Design',
    level: 'Beginner'
  },
  {
    id: '3',
    title: 'Full Stack JavaScript',
    instructor: 'Mike Johnson',
    rating: 4.7,
    students: 15200,
    price: '$59.99',
    thumbnail: 'https://via.placeholder.com/300x200/4facfe/ffffff?text=JavaScript',
    category: 'Development',
    level: 'Advanced'
  },
  {
    id: '4',
    title: 'Digital Marketing 2025',
    instructor: 'Emily Brown',
    rating: 4.6,
    students: 9800,
    price: '$44.99',
    thumbnail: 'https://via.placeholder.com/300x200/43e97b/ffffff?text=Marketing',
    category: 'Marketing',
    level: 'Beginner'
  },
  {
    id: '5',
    title: 'Python for Data Science',
    instructor: 'David Lee',
    rating: 4.8,
    students: 18500,
    price: '$54.99',
    thumbnail: 'https://via.placeholder.com/300x200/fa709a/ffffff?text=Python',
    category: 'Development',
    level: 'Intermediate'
  },
  {
    id: '6',
    title: 'Photography Masterclass',
    instructor: 'Lisa Chen',
    rating: 4.9,
    students: 7200,
    price: '$69.99',
    thumbnail: 'https://via.placeholder.com/300x200/a8edea/ffffff?text=Photography',
    category: 'Photography',
    level: 'All Levels'
  },
];

const CATEGORIES = ['All', 'Development', 'Design', 'Business', 'Marketing', 'Photography', 'Music'];
const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function ExploreScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  const filteredCourses = ALL_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const renderCourseCard = ({ item }: { item: typeof ALL_COURSES[0] }) => (
    <TouchableOpacity
      style={[styles.courseCard, { backgroundColor: theme.colors.card }]}
      onPress={() => router.push(`/courses/${item.id}`)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.courseThumbnail} />
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>{item.level}</Text>
      </View>
      <View style={styles.courseInfo}>
        <Text style={[styles.courseTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.courseInstructor, { color: theme.colors.textSecondary }]}>
          {item.instructor}
        </Text>
        <View style={styles.courseFooter}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.ratingText, { color: theme.colors.text }]}>{item.rating}</Text>
            <Text style={[styles.students, { color: theme.colors.textSecondary }]}>
              ({item.students.toLocaleString()})
            </Text>
          </View>
          <Text style={[styles.coursePrice, { color: theme.colors.primary }]}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Explore Courses</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.colors.card }]}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search courses..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterLabel, { color: theme.colors.textSecondary }]}>Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedCategory === category 
                    ? theme.colors.primary 
                    : theme.colors.card
                }
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: selectedCategory === category 
                      ? '#fff' 
                      : theme.colors.text
                  }
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Level Filter */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterLabel, { color: theme.colors.textSecondary }]}>Level</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {LEVELS.map(level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedLevel === level 
                    ? theme.colors.primary 
                    : theme.colors.card
                }
              ]}
              onPress={() => setSelectedLevel(level)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: selectedLevel === level 
                      ? '#fff' 
                      : theme.colors.text
                  }
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsText, { color: theme.colors.textSecondary }]}>
          {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="filter" size={18} color={theme.colors.text} />
          <Text style={[styles.sortText, { color: theme.colors.text }]}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Courses Grid */}
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.coursesList}
        columnWrapperStyle={styles.courseRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No courses found
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
              Try adjusting your filters
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterRow: {
    paddingLeft: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
  },
  coursesList: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  courseRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  courseCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseThumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  levelBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  courseInfo: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    height: 36,
  },
  courseInstructor: {
    fontSize: 12,
    marginBottom: 8,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  students: {
    fontSize: 11,
  },
  coursePrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
});
