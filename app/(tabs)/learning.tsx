import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import { Button } from '@/components/ui/Button.fixed';
import { Card, TouchableCard } from '@/components/ui/Card.enhanced';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Text } from '@/components/ui/Text.enhanced';
import { useAuth } from '@/context/AuthContext.enhanced';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

interface ProgressCardProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    thumbnail: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    lastAccessed: string;
    estimatedTimeLeft: string;
    category: string;
  };
}

const ProgressCard: React.FC<ProgressCardProps> = ({ course }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableCard
      variant="outlined"
      padding="md"
      onPress={() => Alert.alert('Course Details', `Continue learning: ${course.title}`)}
      style={styles.progressCard}
    >
      <View style={styles.courseContent}>
        {/* Thumbnail */}
        <View style={[styles.courseThumbnail, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <IconSymbol name="play.rectangle.fill" size={32} color={theme.colors.primary} />
        </View>

        {/* Course Info */}
        <View style={styles.courseInfo}>
          <Text variant="body1" weight="semibold" numberOfLines={2}>
            {course.title}
          </Text>
          
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            by {course.instructor}
          </Text>
          
          <View style={styles.progressInfo}>
            <Text variant="caption" color="textSecondary">
              {course.completedLessons} of {course.totalLessons} lessons
            </Text>
            <Text variant="caption" color="textSecondary">
              {course.estimatedTimeLeft} left
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.backgroundSecondary }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${course.progress}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
            <Text variant="caption" color="primary" weight="medium">
              {course.progress}%
            </Text>
          </View>
        </View>
      </View>
    </TouchableCard>
  );
};

interface AchievementBadgeProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    earnedAt: string;
    category: string;
  };
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const { theme } = useTheme();
  
  return (
    <Card variant="outlined" padding="md" style={styles.achievementCard}>
      <View style={[styles.achievementIcon, { backgroundColor: `${achievement.color}20` }]}>
        <IconSymbol name={achievement.icon} size={24} color={achievement.color} />
      </View>
      
      <Text variant="caption" weight="semibold" numberOfLines={2} style={styles.achievementTitle}>
        {achievement.title}
      </Text>
      
      <Text variant="caption" color="textSecondary" numberOfLines={2}>
        {achievement.description}
      </Text>
    </Card>
  );
};

interface QuickActionProps {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, subtitle, icon, color, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableCard
      variant="outlined"
      padding="md"
      onPress={onPress}
      style={styles.quickActionCard}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>
        <IconSymbol name={icon} size={24} color={color} />
      </View>
      
      <Text variant="body2" weight="semibold" numberOfLines={1}>
        {title}
      </Text>
      
      <Text variant="caption" color="textSecondary" numberOfLines={2}>
        {subtitle}
      </Text>
    </TouchableCard>
  );
};

export default function LearningScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'in-progress' | 'completed' | 'bookmarked'>('in-progress');

  // Mock data - in real app, this would come from API
  const [inProgressCourses] = useState([
    {
      id: '1',
      title: 'Advanced React Patterns',
      instructor: 'John Doe',
      thumbnail: '',
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      lastAccessed: '2 hours ago',
      estimatedTimeLeft: '2h 15m',
      category: 'Technology',
    },
    {
      id: '2',
      title: 'UI/UX Design Fundamentals',
      instructor: 'Sarah Smith',
      thumbnail: '',
      progress: 30,
      totalLessons: 18,
      completedLessons: 5,
      lastAccessed: '1 day ago',
      estimatedTimeLeft: '4h 30m',
      category: 'Creative',
    },
    {
      id: '3',
      title: 'Digital Marketing Strategy',
      instructor: 'Mike Johnson',
      thumbnail: '',
      progress: 85,
      totalLessons: 12,
      completedLessons: 10,
      lastAccessed: '3 hours ago',
      estimatedTimeLeft: '45m',
      category: 'Business',
    },
  ]);

  const [completedCourses] = useState([
    {
      id: '4',
      title: 'JavaScript Fundamentals',
      instructor: 'Alex Wilson',
      thumbnail: '',
      progress: 100,
      totalLessons: 32,
      completedLessons: 32,
      lastAccessed: '1 week ago',
      estimatedTimeLeft: 'Completed',
      category: 'Technology',
    },
    {
      id: '5',
      title: 'Photography Basics',
      instructor: 'Emma Davis',
      thumbnail: '',
      progress: 100,
      totalLessons: 15,
      completedLessons: 15,
      lastAccessed: '2 weeks ago',
      estimatedTimeLeft: 'Completed',
      category: 'Creative',
    },
  ]);

  const [bookmarkedCourses] = useState([
    {
      id: '6',
      title: 'Machine Learning with Python',
      instructor: 'Dr. Robert Chen',
      thumbnail: '',
      progress: 0,
      totalLessons: 40,
      completedLessons: 0,
      lastAccessed: 'Never',
      estimatedTimeLeft: '8h 30m',
      category: 'Technology',
    },
  ]);

  const [achievements] = useState([
    {
      id: '1',
      title: 'First Course',
      description: 'Completed your first course',
      icon: 'star.fill',
      color: '#F59E0B',
      earnedAt: '2024-01-15',
      category: 'milestone',
    },
    {
      id: '2',
      title: 'Tech Explorer',
      description: 'Completed 3 technology courses',
      icon: 'laptopcomputer',
      color: '#3B82F6',
      earnedAt: '2024-01-20',
      category: 'category',
    },
    {
      id: '3',
      title: 'Speed Learner',
      description: 'Completed a course in under 2 days',
      icon: 'bolt.fill',
      color: '#EF4444',
      earnedAt: '2024-01-18',
      category: 'speed',
    },
  ]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getCurrentCourses = () => {
    switch (selectedTab) {
      case 'completed':
        return completedCourses;
      case 'bookmarked':
        return bookmarkedCourses;
      default:
        return inProgressCourses;
    }
  };

  const learningStats = {
    totalCourses: inProgressCourses.length + completedCourses.length,
    completedCourses: completedCourses.length,
    hoursLearned: 45.5,
    currentStreak: 7,
  };

  const quickActions = [
    {
      title: 'Browse Courses',
      subtitle: 'Discover new learning opportunities',
      icon: 'magnifyingglass',
      color: theme.colors.primary,
      onPress: () => Alert.alert('Navigation', 'Exploring courses...'),
    },
    {
      title: 'Live Classes',
      subtitle: 'Join interactive sessions',
      icon: 'video.fill',
      color: theme.colors.secondary,
      onPress: () => Alert.alert('Live Classes', 'Joining live classes...'),
    },
    {
      title: 'Study Groups',
      subtitle: 'Learn with other students',
      icon: 'person.3.fill',
      color: '#8B5CF6',
      onPress: () => Alert.alert('Study Groups', 'Study groups feature coming soon!'),
    },
    {
      title: 'Certificates',
      subtitle: 'View your achievements',
      icon: 'doc.badge.plus',
      color: '#10B981',
      onPress: () => Alert.alert('Certificates', 'Certificates feature coming soon!'),
    },
  ];

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
            My Learning
          </Text>
          <Text variant="body2" color="textSecondary">
            Continue your learning journey
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => Alert.alert('Profile', 'Viewing profile...')}
          style={[styles.avatarButton, { backgroundColor: theme.colors.primary }]}
        >
          <Text variant="body1" color="white" weight="bold">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Learning Stats */}
      <View style={styles.statsContainer}>
        <Card variant="outlined" padding="md" style={styles.statCard}>
          <Text variant="h5" weight="bold">
            {learningStats.totalCourses}
          </Text>
          <Text variant="caption" color="textSecondary">
            Enrolled Courses
          </Text>
        </Card>
        
        <Card variant="outlined" padding="md" style={styles.statCard}>
          <Text variant="h5" weight="bold">
            {learningStats.completedCourses}
          </Text>
          <Text variant="caption" color="textSecondary">
            Completed
          </Text>
        </Card>
        
        <Card variant="outlined" padding="md" style={styles.statCard}>
          <Text variant="h5" weight="bold">
            {learningStats.hoursLearned}h
          </Text>
          <Text variant="caption" color="textSecondary">
            Hours Learned
          </Text>
        </Card>
        
        <Card variant="outlined" padding="md" style={styles.statCard}>
          <Text variant="h5" weight="bold">
            {learningStats.currentStreak}
          </Text>
          <Text variant="caption" color="textSecondary">
            Day Streak
          </Text>
        </Card>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
          Quick Actions
        </Text>
        
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              title={action.title}
              subtitle={action.subtitle}
              icon={action.icon}
              color={action.color}
              onPress={action.onPress}
            />
          ))}
        </View>
      </View>

      {/* Course Tabs */}
      <View style={styles.section}>
        <View style={styles.tabsContainer}>
          {[
            { key: 'in-progress', label: 'In Progress', count: inProgressCourses.length },
            { key: 'completed', label: 'Completed', count: completedCourses.length },
            { key: 'bookmarked', label: 'Bookmarked', count: bookmarkedCourses.length },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                {
                  backgroundColor: selectedTab === tab.key 
                    ? theme.colors.primary 
                    : theme.colors.backgroundSecondary,
                },
              ]}
              onPress={() => setSelectedTab(tab.key as any)}
            >
              <Text
                variant="caption"
                weight="medium"
                style={{
                  color: selectedTab === tab.key 
                    ? 'white' 
                    : theme.colors.textPrimary,
                }}
              >
                {tab.label} ({tab.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Courses List */}
        <View style={styles.coursesContainer}>
          {getCurrentCourses().length > 0 ? (
            getCurrentCourses().map((course) => (
              <ProgressCard key={course.id} course={course} />
            ))
          ) : (
            <Card variant="outlined" padding="xl" style={styles.emptyState}>
              <View style={styles.emptyStateContent}>
                <View style={[styles.emptyStateIcon, { backgroundColor: theme.colors.backgroundSecondary }]}>
                  <IconSymbol 
                    name={selectedTab === 'bookmarked' ? 'bookmark' : 'book'} 
                    size={48} 
                    color={theme.colors.textSecondary} 
                  />
                </View>
                
                <Text variant="h6" weight="semibold" style={styles.emptyStateTitle}>
                  {selectedTab === 'in-progress' && 'No courses in progress'}
                  {selectedTab === 'completed' && 'No completed courses yet'}
                  {selectedTab === 'bookmarked' && 'No bookmarked courses'}
                </Text>
                
                <Text variant="body2" color="textSecondary" style={styles.emptyStateDescription}>
                  {selectedTab === 'in-progress' && 'Start learning by enrolling in a course from our extensive catalog.'}
                  {selectedTab === 'completed' && 'Complete your first course to see it here and earn achievements.'}
                  {selectedTab === 'bookmarked' && 'Save interesting courses to your bookmarks for later.'}
                </Text>
                
                <Button
                  variant="primary"
                  size="lg"
                  onPress={() => Alert.alert('Navigation', 'Exploring more courses...')}
                  style={styles.emptyStateButton}
                >
                  Explore Courses
                </Button>
              </View>
            </Card>
          )}
        </View>
      </View>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h6" weight="semibold">
              Recent Achievements
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => Alert.alert('Achievements', 'Full achievements page coming soon!')}
            >
              View All
            </Button>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.achievementsContainer}>
              {achievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Learning Recommendations */}
      <View style={styles.section}>
        <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
          Recommended for You
        </Text>
        
        <Card variant="outlined" padding="lg">
          <View style={styles.recommendationItem}>
            <View style={[styles.recommendationIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
              <IconSymbol name="lightbulb.fill" size={20} color={theme.colors.primary} />
            </View>
            
            <View style={styles.recommendationContent}>
              <Text variant="body2" weight="medium">
                Complete "Advanced React Patterns"
              </Text>
              <Text variant="caption" color="textSecondary">
                You're 65% done! Just 2 hours left to complete this course.
              </Text>
            </View>
            
            <Button variant="outline" size="sm">
              Continue
            </Button>
          </View>
          
          <View style={styles.recommendationDivider} />
          
          <View style={styles.recommendationItem}>
            <View style={[styles.recommendationIcon, { backgroundColor: '#F59E0B20' }]}>
              <IconSymbol name="star.fill" size={20} color="#F59E0B" />
            </View>
            
            <View style={styles.recommendationContent}>
              <Text variant="body2" weight="medium">
                Try "Machine Learning Basics"
              </Text>
              <Text variant="caption" color="textSecondary">
                Based on your interest in technology courses.
              </Text>
            </View>
            
            <Button variant="outline" size="sm">
              Explore
            </Button>
          </View>
        </Card>
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
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 44) / 2,
    alignItems: 'center',
    minHeight: 100,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  coursesContainer: {
    gap: 12,
  },
  progressCard: {
    marginBottom: 4,
  },
  courseContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  courseThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  achievementsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  achievementCard: {
    width: 120,
    alignItems: 'center',
    minHeight: 120,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  recommendationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
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
