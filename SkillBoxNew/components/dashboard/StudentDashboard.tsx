import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { CourseService } from '../../services/courseService';

interface DashboardStats {
  enrolled_courses: number;
  completed_courses: number;
  total_learning_time: number;
  current_streak: number;
}

interface EnrolledCourse {
  id: string;
  course: {
    id: string;
    title: string;
    thumbnail_url: string | null;
    instructor: {
      full_name: string;
    };
  };
  progress_percentage: number;
  last_accessed_at: string | null;
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    enrolled_courses: 0,
    completed_courses: 0,
    total_learning_time: 0,
    current_streak: 0,
  });
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load enrolled courses
      const enrolled = await CourseService.getEnrolledCourses(user.id);
      setEnrolledCourses(enrolled as any);

      // Load recommended courses
      const recommended = await CourseService.getRecommendedCourses(user.id, 6);
      setRecommendedCourses(recommended);

      // Calculate stats
      const completedCount = (enrolled as any).filter((e: any) => e.progress_percentage >= 100).length;
      const totalTime = (enrolled as any).reduce((sum: number, e: any) => sum + (e.time_spent_minutes || 0), 0);

      setStats({
        enrolled_courses: enrolled.length,
        completed_courses: completedCount,
        total_learning_time: totalTime,
        current_streak: 7, // Mock data - would come from analytics service
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Student'}! 👋
        </Text>
        <Text style={styles.subtitle}>Ready to continue learning?</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.enrolled_courses}</Text>
            <Text style={styles.statLabel}>Enrolled Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.completed_courses}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{formatTime(stats.total_learning_time)}</Text>
            <Text style={styles.statLabel}>Learning Time</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.current_streak}</Text>
            <Text style={styles.statLabel}>Day Streak 🔥</Text>
          </View>
        </View>
      </View>

      {/* Continue Learning Section */}
      {enrolledCourses.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {enrolledCourses.slice(0, 5).map((enrollment) => (
              <TouchableOpacity
                key={enrollment.id}
                style={styles.courseCard}
              >
                <Image
                  source={{
                    uri: enrollment.course.thumbnail_url || 'https://via.placeholder.com/300x200'
                  }}
                  style={styles.courseImage}
                />
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle} numberOfLines={2}>
                    {enrollment.course.title}
                  </Text>
                  <Text style={styles.courseInstructor}>
                    {enrollment.course.instructor.full_name}
                  </Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${enrollment.progress_percentage}%` }
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {enrollment.progress_percentage}%
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Recommended Courses */}
      {recommendedCourses.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendedCourses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
              >
                <Image
                  source={{
                    uri: course.thumbnail_url || 'https://via.placeholder.com/300x200'
                  }}
                  style={styles.courseImage}
                />
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle} numberOfLines={2}>
                    {course.title}
                  </Text>
                  <Text style={styles.courseInstructor}>
                    {course.instructor?.full_name}
                  </Text>
                  <View style={styles.courseMeta}>
                    <Text style={styles.coursePrice}>
                      {course.is_free ? 'Free' : `$${course.price}`}
                    </Text>
                    <Text style={styles.courseRating}>
                      ⭐ {course.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Learning Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Learning Goal</Text>
        <View style={styles.goalCard}>
          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>30 minutes of learning</Text>
            <Text style={styles.goalProgress}>15 minutes completed</Text>
          </View>
          <View>
            <View style={styles.goalProgressBar}>
              <View style={[styles.goalProgressFill, { width: '50%' }]} />
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🔍</Text>
            <Text style={styles.actionText}>Browse Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>View Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={styles.actionText}>Set Goals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Community</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  courseCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#e0e0e0',
  },
  courseInfo: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coursePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  courseRating: {
    fontSize: 12,
    color: '#666',
  },
  goalCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  goalInfo: {
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  goalProgress: {
    fontSize: 14,
    color: '#666',
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
});