// ===================================================================
// MAIN HOME SCREEN - ENHANCED VERSION
// ===================================================================

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { ContentService } from '../../services/contentService';
import { LearningContent } from '../../types/models';

const { width: screenWidth } = Dimensions.get('window');

// ===================================================================
// TYPES
// ===================================================================

interface FeaturedContent {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  duration: string;
  rating: number;
  students: number;
  instructor: {
    name: string;
    avatar: string;
  };
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
}

// ===================================================================
// HOME SCREEN COMPONENT
// ===================================================================

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trendingContent, setTrendingContent] = useState<LearningContent[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<LearningContent[]>([]);

  // ===================================================================
  // DATA LOADING
  // ===================================================================

  const loadContent = async () => {
    try {
      setLoading(true);
      
      // Load trending content
      const trendingResult = await ContentService.getTrendingContent(10);
      if (trendingResult.success && trendingResult.data) {
        setTrendingContent(trendingResult.data);
      }

      // Load recommended content
      const recommendedResult = await ContentService.getRecommendedContent(undefined, 10);
      if (recommendedResult.success && recommendedResult.data) {
        setRecommendedContent(recommendedResult.data);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadContent();
    setRefreshing(false);
  };

  // ===================================================================
  // QUICK ACTIONS DATA
  // ===================================================================

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Browse Courses',
      icon: 'library',
      color: theme.colors.primary,
      route: '/courses',
    },
    {
      id: '2',
      title: 'Live Classes',
      icon: 'videocam',
      color: theme.colors.success,
      route: '/classes',
    },
    {
      id: '3',
      title: 'My Learning',
      icon: 'book',
      color: theme.colors.warning,
      route: '/(tabs)/learning',
    },
    {
      id: '4',
      title: 'Community',
      icon: 'people',
      color: theme.colors.secondary,
      route: '/(tabs)/community',
    },
  ];

  // ===================================================================
  // RENDER FUNCTIONS
  // ===================================================================

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={[styles.profileButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Ionicons name="person" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
            Good morning!
          </Text>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            Ready to learn?
          </Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="search" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => router.push('/notifications')}
        >
          <Ionicons name="notifications" size={20} color={theme.colors.text} />
          <View style={[styles.notificationBadge, { backgroundColor: theme.colors.error }]} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Quick Actions
      </Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.quickActionItem, { backgroundColor: theme.colors.surface }]}
            onPress={() => router.push(action.route as any)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
              <Ionicons name={action.icon as any} size={24} color={action.color} />
            </View>
            <Text style={[styles.quickActionTitle, { color: theme.colors.text }]}>
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderContentCard = ({ item }: { item: LearningContent }) => (
    <TouchableOpacity
      style={[styles.contentCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => router.push(`/content/${item.id}`)}
    >
      <View style={[styles.contentThumbnail, { backgroundColor: theme.colors.background }]}>
        <Ionicons 
          name="play-circle" 
          size={32} 
          color={theme.colors.primary} 
        />
      </View>
      <View style={styles.contentInfo}>
        <Text style={[styles.contentTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.contentCreator, { color: theme.colors.textSecondary }]}>
          {item.creator?.display_name || 'SkillBox'}
        </Text>
        <View style={styles.contentMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color={theme.colors.warning} />
            <Text style={[styles.rating, { color: theme.colors.textSecondary }]}>
              {item.average_rating.toFixed(1)}
            </Text>
          </View>
          <View style={styles.metaDivider} />
          <Text style={[styles.views, { color: theme.colors.textSecondary }]}>
            {item.views_count} views
          </Text>
          {item.duration_seconds && (
            <>
              <View style={styles.metaDivider} />
              <Text style={[styles.duration, { color: theme.colors.textSecondary }]}>
                {Math.floor(item.duration_seconds / 60)}m
              </Text>
            </>
          )}
        </View>
        {!item.is_free && (
          <Text style={[styles.price, { color: theme.colors.primary }]}>
            ${item.price}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderTrendingContent = () => (
    <View style={styles.contentSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Trending Now
        </Text>
        <TouchableOpacity onPress={() => router.push('/courses?filter=trending')}>
          <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={trendingContent}
        renderItem={renderContentCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );

  const renderRecommendedContent = () => (
    <View style={styles.contentSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Recommended for You
        </Text>
        <TouchableOpacity onPress={() => router.push('/courses?filter=recommended')}>
          <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={recommendedContent}
        renderItem={renderContentCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );

  const renderStatsCard = () => (
    <View style={[styles.statsCard, { backgroundColor: theme.colors.primary }]}>
      <Text style={[styles.statsTitle, { color: 'white' }]}>
        Your Progress This Week
      </Text>
      <View style={styles.statsContent}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: 'white' }]}>12</Text>
          <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)' }]}>
            Hours Learned
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: 'white' }]}>3</Text>
          <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)' }]}>
            Courses Completed
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: 'white' }]}>89</Text>
          <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)' }]}>
            Points Earned
          </Text>
        </View>
      </View>
    </View>
  );

  // ===================================================================
  // MAIN RENDER
  // ===================================================================

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
        {renderHeader()}
        {renderQuickActions()}
        {renderStatsCard()}
        {renderTrendingContent()}
        {renderRecommendedContent()}
        
        {/* Additional spacing for bottom tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: (screenWidth - 60) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  contentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalList: {
    paddingLeft: 20,
  },
  contentCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  contentThumbnail: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentInfo: {
    padding: 12,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  contentCreator: {
    fontSize: 14,
    marginBottom: 8,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 8,
  },
  views: {
    fontSize: 12,
  },
  duration: {
    fontSize: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 40,
  },
});
