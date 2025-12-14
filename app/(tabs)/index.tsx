import { useTheme } from '@/context/EnhancedThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// Mock data for offline demo
const POPULAR_COURSES = [
  {
    id: '1',
    title: 'React Native Mastery',
    instructor: 'John Doe',
    rating: 4.8,
    students: 12500,
    price: '$49.99',
    thumbnail: 'https://via.placeholder.com/300x200/667eea/ffffff?text=React+Native',
    category: 'Development'
  },
  {
    id: '2',
    title: 'UI/UX Design Fundamentals',
    instructor: 'Sarah Smith',
    rating: 4.9,
    students: 8300,
    price: '$39.99',
    thumbnail: 'https://via.placeholder.com/300x200/f093fb/ffffff?text=UI/UX+Design',
    category: 'Design'
  },
  {
    id: '3',
    title: 'Full Stack JavaScript',
    instructor: 'Mike Johnson',
    rating: 4.7,
    students: 15200,
    price: '$59.99',
    thumbnail: 'https://via.placeholder.com/300x200/4facfe/ffffff?text=JavaScript',
    category: 'Development'
  },
  {
    id: '4',
    title: 'Digital Marketing 2025',
    instructor: 'Emily Brown',
    rating: 4.6,
    students: 9800,
    price: '$44.99',
    thumbnail: 'https://via.placeholder.com/300x200/43e97b/ffffff?text=Marketing',
    category: 'Marketing'
  },
];

const CATEGORIES = [
  { id: '1', name: 'Development', icon: 'code-slash', color: '#667eea' },
  { id: '2', name: 'Design', icon: 'color-palette', color: '#f093fb' },
  { id: '3', name: 'Business', icon: 'briefcase', color: '#4facfe' },
  { id: '4', name: 'Marketing', icon: 'megaphone', color: '#43e97b' },
  { id: '5', name: 'Photography', icon: 'camera', color: '#fa709a' },
  { id: '6', name: 'Music', icon: 'musical-notes', color: '#a8edea' },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const renderCourseCard = (course: typeof POPULAR_COURSES[0]) => (
    <TouchableOpacity
      key={course.id}
      style={[styles.courseCard, { backgroundColor: theme.colors.card }]}
      onPress={() => router.push(`/courses/${course.id}`)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: course.thumbnail }} style={styles.courseThumbnail} />
      <View style={styles.courseInfo}>
        <Text style={[styles.courseTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={[styles.courseInstructor, { color: theme.colors.textSecondary }]}>
          {course.instructor}
        </Text>
        <View style={styles.courseStats}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.ratingText, { color: theme.colors.text }]}>{course.rating}</Text>
          </View>
          <Text style={[styles.students, { color: theme.colors.textSecondary }]}>
            {course.students.toLocaleString()} students
          </Text>
        </View>
        <Text style={[styles.coursePrice, { color: theme.colors.primary }]}>{course.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryChip = (category: typeof CATEGORIES[0]) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryChip, { backgroundColor: theme.colors.card }]}
      onPress={() => router.push('/explore')}
      activeOpacity={0.7}
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
        <Ionicons name={category.icon as any} size={24} color={category.color} />
      </View>
      <Text style={[styles.categoryName, { color: theme.colors.text }]}>{category.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <View>
          <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>Hello! 👋</Text>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Ready to learn?</Text>
        </View>
        <TouchableOpacity
          style={[styles.notificationButton, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push('/notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push('/explore')}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.searchPlaceholder, { color: theme.colors.textSecondary }]}>
            Search for courses, instructors...
          </Text>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Categories</Text>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesRow}
          >
            {CATEGORIES.map(renderCategoryChip)}
          </ScrollView>
        </View>

        {/* Featured Banner */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredBanner}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>🎉 New Year Sale!</Text>
            <Text style={styles.bannerSubtitle}>Get up to 70% off on selected courses</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Browse Deals</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Popular Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Popular Courses</Text>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.coursesRow}
          >
            {POPULAR_COURSES.map(renderCourseCard)}
          </ScrollView>
        </View>

        {/* Continue Learning */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Continue Learning</Text>
          </View>
          <View style={[styles.continueCard, { backgroundColor: theme.colors.card }]}>
            <Image
              source={{ uri: 'https://via.placeholder.com/80x80/667eea/ffffff?text=RN' }}
              style={styles.continueImage}
            />
            <View style={styles.continueInfo}>
              <Text style={[styles.continueTitle, { color: theme.colors.text }]}>
                React Native Mastery
              </Text>
              <Text style={[styles.continueLesson, { color: theme.colors.textSecondary }]}>
                Lesson 5: Navigation
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { backgroundColor: theme.colors.primary, width: '65%' }]} />
              </View>
              <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>65% Complete</Text>
            </View>
          </View>
        </View>

        {/* Trending Instructors */}
        <View style={[styles.section, { marginBottom: 32 }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Trending Instructors</Text>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.instructorsRow}
          >
            {['John Doe', 'Sarah Smith', 'Mike Johnson', 'Emily Brown'].map((name, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.instructorCard, { backgroundColor: theme.colors.card }]}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: `https://i.pravatar.cc/100?img=${index + 1}` }}
                  style={styles.instructorAvatar}
                />
                <Text style={[styles.instructorName, { color: theme.colors.text }]} numberOfLines={1}>
                  {name}
                </Text>
                <Text style={[styles.instructorCourses, { color: theme.colors.textSecondary }]}>
                  {Math.floor(Math.random() * 20 + 5)} courses
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 15,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesRow: {
    paddingLeft: 20,
    gap: 12,
  },
  categoryChip: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    minWidth: 120,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
  },
  featuredBanner: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  bannerContent: {
    gap: 8,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 6,
  },
  bannerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  coursesRow: {
    paddingLeft: 20,
    gap: 16,
  },
  courseCard: {
    width: CARD_WIDTH + 40,
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
    height: 140,
    backgroundColor: '#f0f0f0',
  },
  courseInfo: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 13,
    marginBottom: 8,
  },
  courseStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  students: {
    fontSize: 12,
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  continueCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
  },
  continueImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  continueInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  continueLesson: {
    fontSize: 13,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
  },
  instructorsRow: {
    paddingLeft: 20,
    gap: 16,
  },
  instructorCard: {
    width: 120,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  instructorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
  },
  instructorName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  instructorCourses: {
    fontSize: 12,
    textAlign: 'center',
  },
});
