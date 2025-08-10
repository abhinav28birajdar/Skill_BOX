import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

import { Button } from '@/components/ui/Button.fixed';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/context/AuthContext.enhanced';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    enrolled_students: number;
    rating: number;
    total_lessons: number;
    duration_minutes: number;
    status: 'draft' | 'published' | 'under_review';
    category: string;
    created_at: string;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { theme } = useTheme();
  
  const getStatusColor = () => {
    switch (course.status) {
      case 'published':
        return '#10B981';
      case 'under_review':
        return '#F59E0B';
      case 'draft':
        return theme.colors.textSecondary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (course.status) {
      case 'published':
        return 'Published';
      case 'under_review':
        return 'Under Review';
      case 'draft':
        return 'Draft';
      default:
        return course.status;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  return (
    <TouchableCard
      variant="outlined"
      padding="md"
      onPress={() => {
        // TODO: Navigate to course details
        console.log('Navigate to course:', course.id);
      }}
      style={styles.courseCard}
    >
      {/* Course Thumbnail */}
      <View style={[styles.courseThumbnail, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <IconSymbol name="play.rectangle.fill" size={32} color={theme.colors.textSecondary} />
      </View>

      {/* Course Info */}
      <View style={styles.courseInfo}>
        <View style={styles.courseHeader}>
          <Text variant="body1" weight="semibold" numberOfLines={1}>
            {course.title}
          </Text>
          
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
            <Text variant="caption" style={{ color: getStatusColor() }}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        <Text variant="caption" color="textSecondary" numberOfLines={2} style={styles.courseDescription}>
          {course.description}
        </Text>

        <View style={styles.courseStats}>
          <View style={styles.courseStat}>
            <IconSymbol name="person.2.fill" size={14} color={theme.colors.textSecondary} />
            <Text variant="caption" color="textSecondary">
              {course.enrolled_students} students
            </Text>
          </View>
          
          <View style={styles.courseStat}>
            <IconSymbol name="star.fill" size={14} color="#F59E0B" />
            <Text variant="caption" color="textSecondary">
              {course.rating.toFixed(1)}
            </Text>
          </View>
          
          <View style={styles.courseStat}>
            <IconSymbol name="clock.fill" size={14} color={theme.colors.textSecondary} />
            <Text variant="caption" color="textSecondary">
              {formatDuration(course.duration_minutes)}
            </Text>
          </View>
        </View>

        <View style={styles.courseFooter}>
          <Text variant="body2" weight="semibold" color="primary">
            ${course.price}
          </Text>
          
          <Text variant="caption" color="textSecondary">
            {course.total_lessons} lessons
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.courseActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.backgroundSecondary }]}
          onPress={() => {
            Alert.alert('Edit Course', `Edit ${course.title}`);
          }}
        >
          <IconSymbol name="pencil" size={16} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.backgroundSecondary }]}
          onPress={() => {
            Alert.alert('Course Analytics', `View analytics for ${course.title}`);
          }}
        >
          <IconSymbol name="chart.bar.fill" size={16} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </TouchableCard>
  );
};

export default function CreatorCoursesScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'published' | 'draft' | 'under_review'>('all');
  
  // Mock data - in real app, this would come from API
  const [courses] = useState([
    {
      id: '1',
      title: 'Advanced React Patterns',
      description: 'Learn advanced React patterns including hooks, context, and performance optimization techniques.',
      thumbnail: '',
      price: 99.99,
      enrolled_students: 234,
      rating: 4.8,
      total_lessons: 24,
      duration_minutes: 480,
      status: 'published' as const,
      category: 'Technology',
      created_at: '2024-01-15',
    },
    {
      id: '2',
      title: 'JavaScript Fundamentals',
      description: 'Complete guide to JavaScript from basics to advanced concepts.',
      thumbnail: '',
      price: 79.99,
      enrolled_students: 456,
      rating: 4.9,
      total_lessons: 32,
      duration_minutes: 640,
      status: 'published' as const,
      category: 'Technology',
      created_at: '2023-12-01',
    },
    {
      id: '3',
      title: 'CSS Grid & Flexbox Mastery',
      description: 'Master modern CSS layout techniques with practical examples.',
      thumbnail: '',
      price: 59.99,
      enrolled_students: 0,
      rating: 0,
      total_lessons: 18,
      duration_minutes: 360,
      status: 'draft' as const,
      category: 'Technology',
      created_at: '2024-01-20',
    },
    {
      id: '4',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js and Express.',
      thumbnail: '',
      price: 89.99,
      enrolled_students: 0,
      rating: 0,
      total_lessons: 28,
      duration_minutes: 560,
      status: 'under_review' as const,
      category: 'Technology',
      created_at: '2024-01-18',
    },
  ]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const filteredCourses = courses.filter(course => {
    if (selectedFilter === 'all') return true;
    return course.status === selectedFilter;
  });

  const filters = [
    { key: 'all', label: 'All Courses', count: courses.length },
    { key: 'published', label: 'Published', count: courses.filter(c => c.status === 'published').length },
    { key: 'draft', label: 'Drafts', count: courses.filter(c => c.status === 'draft').length },
    { key: 'under_review', label: 'Under Review', count: courses.filter(c => c.status === 'under_review').length },
  ] as const;

  const totalEarnings = courses
    .filter(c => c.status === 'published')
    .reduce((sum, course) => sum + (course.price * course.enrolled_students), 0);

  const totalStudents = courses
    .filter(c => c.status === 'published')
    .reduce((sum, course) => sum + course.enrolled_students, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="h4" weight="bold">
            My Courses
          </Text>
          <Text variant="body2" color="textSecondary">
            Manage your course content and track performance
          </Text>
        </View>
        
        <Button
          variant="primary"
          size="sm"
          onPress={() => {
            Alert.alert('Create Course', 'Course creation feature coming soon!');
          }}
          leftIcon={<IconSymbol name="plus" size={16} color="white" />}
        >
          Create Course
        </Button>
      </View>

      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <Card variant="outlined" padding="md" style={styles.statCard}>
          <Text variant="h5" weight="bold">
            {courses.filter(c => c.status === 'published').length}
          </Text>
          <Text variant="caption" color="textSecondary">
            Published Courses
          </Text>
        </Card>
        
        <Card variant="outlined" padding="md" style={styles.statCard}>
          <Text variant="h5" weight="bold">
            {totalStudents}
          </Text>
          <Text variant="caption" color="textSecondary">
            Total Students
          </Text>
        </Card>
        
        <Card variant="outlined" padding="md" style={styles.statCard}>
          <Text variant="h5" weight="bold">
            ${totalEarnings.toFixed(0)}
          </Text>
          <Text variant="caption" color="textSecondary">
            Total Earnings
          </Text>
        </Card>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: selectedFilter === filter.key 
                      ? theme.colors.primary 
                      : theme.colors.backgroundSecondary,
                  },
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text
                  variant="caption"
                  weight="medium"
                  style={{
                    color: selectedFilter === filter.key 
                      ? 'white' 
                      : theme.colors.textPrimary,
                  }}
                >
                  {filter.label} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Courses List */}
      <View style={styles.coursesContainer}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <Card variant="outlined" padding="xl" style={styles.emptyState}>
            <View style={styles.emptyStateContent}>
              <View style={[styles.emptyStateIcon, { backgroundColor: theme.colors.backgroundSecondary }]}>
                <IconSymbol name="play.rectangle" size={48} color={theme.colors.textSecondary} />
              </View>
              
              <Text variant="h6" weight="semibold" style={styles.emptyStateTitle}>
                No courses found
              </Text>
              
              <Text variant="body2" color="textSecondary" style={styles.emptyStateDescription}>
                {selectedFilter === 'all' 
                  ? "You haven't created any courses yet. Start sharing your knowledge!"
                  : `No ${selectedFilter} courses found. Try a different filter.`
                }
              </Text>
              
              {selectedFilter === 'all' && (
                <Button
                  variant="primary"
                  size="lg"
                  onPress={() => {
                    Alert.alert('Create Course', 'Course creation feature coming soon!');
                  }}
                  style={styles.emptyStateButton}
                >
                  Create Your First Course
                </Button>
              )}
            </View>
          </Card>
        )}
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingTop: 60,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  coursesContainer: {
    padding: 16,
    gap: 16,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  courseThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  courseDescription: {
    marginBottom: 8,
  },
  courseStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  courseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseActions: {
    flexDirection: 'column',
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyStateContent: {
    alignItems: 'center',
    maxWidth: 280,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateDescription: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyStateButton: {
    minWidth: 200,
  },
  bottomSpacing: {
    height: 100,
  },
});
