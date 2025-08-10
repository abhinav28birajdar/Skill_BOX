// ===================================================================
// LEARNING SCREEN - ENHANCED VERSION
// ===================================================================

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { AuthService } from '../../services/authService';
import { ContentService } from '../../services/contentService';
import {
    Achievement,
    Course,
    LearningContent,
    LearningPath,
    UserProgress
} from '../../types/models';

const { width: screenWidth } = Dimensions.get('window');

// ===================================================================
// TYPES
// ===================================================================

interface LearningSection {
  title: string;
  data: any[];
  type: 'continue' | 'recommended' | 'courses' | 'paths' | 'achievements';
}

interface ProgressStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalHours: number;
  streakDays: number;
  achievementsCount: number;
}

// ===================================================================
// LEARNING SCREEN COMPONENT
// ===================================================================

export default function LearningScreenEnhanced() {
  const { theme, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'paths' | 'achievements'>('overview');
  
  // Data states
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0,
    streakDays: 0,
    achievementsCount: 0,
  });
  
  const [continueWatching, setContinueWatching] = useState<LearningContent[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<LearningContent[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);

  // ===================================================================
  // DATA LOADING
  // ===================================================================

  const loadLearningData = useCallback(async () => {
    try {
      setLoading(true);

      // Get current user
      const userResult = await AuthService.getCurrentUser();
      if (!userResult.success || !userResult.data) return;

      const userId = userResult.data.id;

      // Load all learning data in parallel
      const [
        progressResult,
        continueResult,
        recommendedResult,
        coursesResult,
        pathsResult,
        achievementsResult,
      ] = await Promise.all([
        ContentService.getUserProgress(userId),
        ContentService.getUserContinueWatching(userId),
        ContentService.getRecommendedContent(userId),
        ContentService.getUserEnrolledCourses(userId),
        ContentService.getUserLearningPaths(userId),
        ContentService.getUserAchievements(userId),
      ]);

      // Process progress data
      if (progressResult.success && progressResult.data) {
        setUserProgress(progressResult.data);
        
        // Calculate stats
        const progress = progressResult.data;
        const completed = progress.filter(p => p.completion_percentage === 100);
        const inProgress = progress.filter(p => p.completion_percentage > 0 && p.completion_percentage < 100);
        const totalHours = progress.reduce((sum, p) => sum + (p.time_spent_seconds / 3600), 0);
        
        setProgressStats({
          totalCourses: progress.length,
          completedCourses: completed.length,
          inProgressCourses: inProgress.length,
          totalHours: Math.round(totalHours * 10) / 10,
          streakDays: 7, // This would come from a separate streak calculation
          achievementsCount: 0, // Will be updated below
        });
      }

      // Set other data
      if (continueResult.success && continueResult.data) {
        setContinueWatching(continueResult.data);
      }

      if (recommendedResult.success && recommendedResult.data) {
        setRecommendedContent(recommendedResult.data);
      }

      if (coursesResult.success && coursesResult.data) {
        setEnrolledCourses(coursesResult.data);
      }

      if (pathsResult.success && pathsResult.data) {
        setLearningPaths(pathsResult.data);
      }

      if (achievementsResult.success && achievementsResult.data) {
        setAchievements(achievementsResult.data);
        setProgressStats(prev => ({
          ...prev,
          achievementsCount: achievementsResult.data!.length,
        }));
      }

    } catch (error) {
      console.error('Error loading learning data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLearningData();
  }, [loadLearningData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLearningData();
    setRefreshing(false);
  };

  // ===================================================================
  // RENDER FUNCTIONS
  // ===================================================================

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          My Learning
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Continue your learning journey
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.streakContainer, { backgroundColor: theme.colors.primary + '20' }]}
      >
        <Ionicons name="flame" size={20} color={theme.colors.primary} />
        <Text style={[styles.streakText, { color: theme.colors.primary }]}>
          {progressStats.streakDays} day streak
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStats = () => (
    <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
          {progressStats.totalCourses}
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          Total Courses
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: theme.colors.success }]}>
          {progressStats.completedCourses}
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          Completed
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: theme.colors.warning }]}>
          {progressStats.totalHours}h
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          Learning Time
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: theme.colors.secondary }]}>
          {progressStats.achievementsCount}
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          Achievements
        </Text>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={[styles.tabsContainer, { backgroundColor: theme.colors.surface }]}>
      {[
        { key: 'overview', label: 'Overview', icon: 'home' },
        { key: 'courses', label: 'Courses', icon: 'school' },
        { key: 'paths', label: 'Paths', icon: 'trail-sign' },
        { key: 'achievements', label: 'Achievements', icon: 'trophy' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === tab.key
                ? theme.colors.primary
                : 'transparent',
            }
          ]}
          onPress={() => setActiveTab(tab.key as any)}
        >
          <Ionicons
            name={tab.icon as any}
            size={18}
            color={activeTab === tab.key ? 'white' : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === tab.key ? 'white' : theme.colors.textSecondary,
              }
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContinueWatching = () => {
    if (continueWatching.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Continue Watching
          </Text>
          <TouchableOpacity onPress={() => router.push('/courses')}>
            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {continueWatching.map((content) => (
            <TouchableOpacity
              key={content.id}
              style={[styles.continueCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push(`/content/${content.id}`)}
            >
              <View style={[styles.continueCardThumbnail, { backgroundColor: theme.colors.background }]}>
                <Ionicons name="play-circle" size={32} color={theme.colors.primary} />
              </View>
              <View style={styles.continueCardContent}>
                <Text style={[styles.continueCardTitle, { color: theme.colors.text }]} numberOfLines={2}>
                  {content.title}
                </Text>
                <Text style={[styles.continueCardSubtitle, { color: theme.colors.textSecondary }]}>
                  {content.creator?.display_name || 'SkillBox'}
                </Text>
                {/* Progress bar would be calculated from userProgress */}
                <View style={[styles.progressBar, { backgroundColor: theme.colors.background }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: theme.colors.primary,
                        width: '65%', // This would be dynamic
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                  65% complete
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderRecommended = () => {
    if (recommendedContent.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recommended for You
          </Text>
          <TouchableOpacity onPress={() => router.push('/explore')}>
            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {recommendedContent.map((content) => (
            <TouchableOpacity
              key={content.id}
              style={[styles.recommendedCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push(`/content/${content.id}`)}
            >
              <View style={[styles.recommendedCardThumbnail, { backgroundColor: theme.colors.background }]}>
                <Ionicons name="play-circle" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.recommendedCardContent}>
                <Text style={[styles.recommendedCardTitle, { color: theme.colors.text }]} numberOfLines={2}>
                  {content.title}
                </Text>
                <Text style={[styles.recommendedCardCreator, { color: theme.colors.textSecondary }]}>
                  {content.creator?.display_name || 'SkillBox'}
                </Text>
                <View style={styles.cardMeta}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color={theme.colors.warning} />
                    <Text style={[styles.rating, { color: theme.colors.textSecondary }]}>
                      {content.average_rating.toFixed(1)}
                    </Text>
                  </View>
                  {content.is_free ? (
                    <Text style={[styles.freeText, { color: theme.colors.success }]}>
                      Free
                    </Text>
                  ) : (
                    <Text style={[styles.price, { color: theme.colors.primary }]}>
                      ${content.price}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderCoursesList = () => (
    <FlatList
      data={enrolledCourses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.courseItem, { backgroundColor: theme.colors.surface }]}
          onPress={() => router.push(`/courses/${item.id}`)}
        >
          <View style={[styles.courseThumbnail, { backgroundColor: theme.colors.background }]}>
            <Ionicons name="school" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.courseDetails}>
            <Text style={[styles.courseTitle, { color: theme.colors.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.courseInstructor, { color: theme.colors.textSecondary }]}>
              by {item.instructor?.display_name || 'SkillBox'}
            </Text>
            <View style={styles.courseMeta}>
              <View style={[styles.difficultyBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                <Text style={[styles.difficultyText, { color: theme.colors.primary }]}>
                  {item.difficulty_level}
                </Text>
              </View>
              <Text style={[styles.lessonCount, { color: theme.colors.textSecondary }]}>
                {item.total_lessons} lessons
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.background }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.colors.primary,
                    width: '45%', // Would be dynamic based on actual progress
                  }
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
              45% complete
            </Text>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.coursesList}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderPathsList = () => (
    <FlatList
      data={learningPaths}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.pathItem, { backgroundColor: theme.colors.surface }]}
          onPress={() => router.push(`/paths/${item.id}`)}
        >
          <View style={[styles.pathIcon, { backgroundColor: theme.colors.primary + '20' }]}>
            <Ionicons name="trail-sign" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.pathDetails}>
            <Text style={[styles.pathTitle, { color: theme.colors.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.pathDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.pathMeta}>
              <Text style={[styles.pathCourses, { color: theme.colors.textSecondary }]}>
                {item.total_courses} courses
              </Text>
              <Text style={[styles.pathDuration, { color: theme.colors.textSecondary }]}>
                • {Math.floor(item.estimated_duration_hours)}h
              </Text>
              <View style={[styles.difficultyBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                <Text style={[styles.difficultyText, { color: theme.colors.primary }]}>
                  {item.difficulty_level}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.pathsList}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderAchievementsList = () => (
    <FlatList
      data={achievements}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={[styles.achievementItem, { backgroundColor: theme.colors.surface }]}>
          <View style={[
            styles.achievementIcon,
            {
              backgroundColor: item.unlocked_at
                ? theme.colors.warning + '20'
                : theme.colors.textTertiary + '20',
            }
          ]}>
            <Ionicons
              name="trophy"
              size={24}
              color={item.unlocked_at ? theme.colors.warning : theme.colors.textTertiary}
            />
          </View>
          <View style={styles.achievementDetails}>
            <Text style={[
              styles.achievementTitle,
              {
                color: item.unlocked_at ? theme.colors.text : theme.colors.textSecondary,
              }
            ]}>
              {item.title}
            </Text>
            <Text style={[styles.achievementDescription, { color: theme.colors.textSecondary }]}>
              {item.description}
            </Text>
            {item.unlocked_at && (
              <Text style={[styles.achievementDate, { color: theme.colors.primary }]}>
                Earned {new Date(item.unlocked_at).toLocaleDateString()}
              </Text>
            )}
          </View>
          {item.unlocked_at && (
            <View style={styles.achievementBadge}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            </View>
          )}
        </View>
      )}
      contentContainerStyle={styles.achievementsList}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderOverview = () => (
    <ScrollView
      style={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {renderContinueWatching()}
      {renderRecommended()}
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'courses':
        return renderCoursesList();
      case 'paths':
        return renderPathsList();
      case 'achievements':
        return renderAchievementsList();
      default:
        return renderOverview();
    }
  };

  // ===================================================================
  // MAIN RENDER
  // ===================================================================

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      {renderStats()}
      {renderTabs()}
      {renderContent()}
    </SafeAreaView>
  );
}

// ===================================================================
// STYLES
// ===================================================================

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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 2,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingHorizontal: 20,
  },
  continueCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueCardThumbnail: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueCardContent: {
    padding: 12,
  },
  continueCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  continueCardSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  recommendedCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  recommendedCardThumbnail: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedCardContent: {
    padding: 12,
  },
  recommendedCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  recommendedCardCreator: {
    fontSize: 12,
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    marginLeft: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
  },
  freeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  coursesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  courseItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  courseThumbnail: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseDetails: {
    flex: 1,
    padding: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  courseInstructor: {
    fontSize: 14,
    marginBottom: 6,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  lessonCount: {
    fontSize: 12,
  },
  pathsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  pathItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  pathIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pathDetails: {
    flex: 1,
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  pathDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  pathMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathCourses: {
    fontSize: 12,
  },
  pathDuration: {
    fontSize: 12,
    marginRight: 8,
  },
  achievementsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  achievementDate: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  achievementBadge: {
    marginLeft: 8,
  },
});
