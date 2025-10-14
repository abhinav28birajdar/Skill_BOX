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

interface TeacherStats {
  total_courses: number;
  published_courses: number;
  total_students: number;
  total_revenue: number;
  monthly_revenue: number;
}

interface TeacherCourse {
  id: string;
  title: string;
  thumbnail_url: string | null;
  status: 'draft' | 'published' | 'archived';
  enrollment_count: number;
  rating: number;
  review_count: number;
  price: number;
  is_free: boolean;
}

export default function TeacherDashboard() {
  const [stats, setStats] = useState<TeacherStats>({
    total_courses: 0,
    published_courses: 0,
    total_students: 0,
    total_revenue: 0,
    monthly_revenue: 0,
  });
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
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

      // Load instructor's courses
      const instructorCourses = await CourseService.getInstructorCourses(user.id);
      setCourses(instructorCourses as any);

      // Calculate stats
      const publishedCount = (instructorCourses as any).filter((c: any) => c.status === 'published').length;
      const totalStudents = (instructorCourses as any).reduce((sum: number, c: any) => sum + c.enrollment_count, 0);
      
      // Mock revenue data - would come from payment service
      const totalRevenue = (instructorCourses as any)
        .filter((c: any) => !c.is_free)
        .reduce((sum: number, c: any) => sum + (c.price * c.enrollment_count), 0);

      setStats({
        total_courses: instructorCourses.length,
        published_courses: publishedCount,
        total_students: totalStudents,
        total_revenue: totalRevenue,
        monthly_revenue: totalRevenue * 0.1, // Mock monthly revenue
      });
    } catch (error) {
      console.error('Error loading teacher dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return '#28a745';
      case 'draft':
        return '#ffc107';
      case 'archived':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'draft':
        return 'Draft';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
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
          {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Teacher'}! 👨‍🏫
        </Text>
        <Text style={styles.subtitle}>Ready to inspire and teach?</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total_courses}</Text>
            <Text style={styles.statLabel}>Total Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.published_courses}</Text>
            <Text style={styles.statLabel}>Published</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total_students}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>${stats.total_revenue.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>
        </View>
        <View style={styles.revenueCard}>
          <Text style={styles.revenueTitle}>This Month</Text>
          <Text style={styles.revenueAmount}>${stats.monthly_revenue.toFixed(2)}</Text>
          <Text style={styles.revenueGrowth}>+12% from last month</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryActionButton}>
            <Text style={styles.primaryActionIcon}>➕</Text>
            <Text style={styles.primaryActionText}>Create New Course</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={styles.actionText}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Students</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Your Courses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Courses</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Manage All</Text>
          </TouchableOpacity>
        </View>
        
        {courses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📚</Text>
            <Text style={styles.emptyStateTitle}>No courses yet</Text>
            <Text style={styles.emptyStateText}>
              Create your first course and start sharing your knowledge with the world!
            </Text>
            <TouchableOpacity style={styles.createCourseButton}>
              <Text style={styles.createCourseButtonText}>Create Your First Course</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {courses.slice(0, 10).map((course) => (
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
                  <View style={styles.courseHeader}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(course.status) }
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusText(course.status)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.courseTitle} numberOfLines={2}>
                    {course.title}
                  </Text>
                  <View style={styles.courseStats}>
                    <Text style={styles.courseStatText}>
                      👥 {course.enrollment_count} students
                    </Text>
                    <Text style={styles.courseStatText}>
                      ⭐ {course.rating.toFixed(1)} ({course.review_count})
                    </Text>
                  </View>
                  <Text style={styles.coursePrice}>
                    {course.is_free ? 'Free' : `$${course.price}`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityContainer}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text>👤</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New student enrollment</Text>
              <Text style={styles.activityText}>
                Sarah Johnson enrolled in "React Native Masterclass"
              </Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text>⭐</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New 5-star review</Text>
              <Text style={styles.activityText}>
                "Excellent course! Very detailed and easy to follow."
              </Text>
              <Text style={styles.activityTime}>5 hours ago</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text>💰</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Course sale</Text>
              <Text style={styles.activityText}>
                You earned $49.99 from "JavaScript Fundamentals"
              </Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Performance Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week's Insights</Text>
        <View style={styles.insightsContainer}>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>📈 Course Views</Text>
            <Text style={styles.insightNumber}>1,234</Text>
            <Text style={styles.insightChange}>+15% from last week</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>⏱️ Watch Time</Text>
            <Text style={styles.insightNumber}>45.2h</Text>
            <Text style={styles.insightChange}>+8% from last week</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>📝 Completion Rate</Text>
            <Text style={styles.insightNumber}>78%</Text>
            <Text style={styles.insightChange}>+3% from last week</Text>
          </View>
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
  revenueCard: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  revenueTitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 8,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  revenueGrowth: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
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
  actionsContainer: {
    gap: 12,
  },
  primaryActionButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  primaryActionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  createCourseButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createCourseButtonText: {
    color: '#fff',
    fontSize: 16,
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
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  courseStats: {
    marginBottom: 8,
  },
  courseStatText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  coursePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  activityContainer: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  activityText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  insightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  insightCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  insightNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  insightChange: {
    fontSize: 10,
    color: '#28a745',
    textAlign: 'center',
  },
});