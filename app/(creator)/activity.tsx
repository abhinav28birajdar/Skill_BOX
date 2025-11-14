import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ActivityItem {
  id: string;
  type: 'course_enrolled' | 'content_published' | 'class_attended' | 'review_received' | 'achievement_earned' | 'message_received';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  actionUrl?: string;
  priority: 'low' | 'normal' | 'high';
}

export default function CreatorActivityScreen() {
  const { theme } = useTheme();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

  // Mock activities data
  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'course_enrolled',
      title: 'New Student Enrolled',
      description: 'Sarah Johnson enrolled in "Advanced React Native Development"',
      timestamp: '2025-01-15T10:30:00Z',
      icon: 'person.badge.plus.fill',
      actionUrl: '/courses/advanced-react-native',
      priority: 'normal',
    },
    {
      id: '2',
      type: 'review_received',
      title: 'New 5-Star Review',
      description: '"Excellent course! Clear explanations and practical examples." - Mike Chen',
      timestamp: '2025-01-15T09:15:00Z',
      icon: 'star.fill',
      priority: 'high',
    },
    {
      id: '3',
      type: 'content_published',
      title: 'Content Published',
      description: 'Your video "React Hooks Deep Dive" has been published successfully',
      timestamp: '2025-01-14T16:45:00Z',
      icon: 'checkmark.circle.fill',
      actionUrl: '/content/react-hooks-deep-dive',
      priority: 'normal',
    },
    {
      id: '4',
      type: 'class_attended',
      title: 'Live Class Completed',
      description: '15 students attended your "JavaScript Fundamentals" live session',
      timestamp: '2025-01-14T14:00:00Z',
      icon: 'video.fill',
      priority: 'normal',
    },
    {
      id: '5',
      type: 'achievement_earned',
      title: 'Achievement Unlocked',
      description: 'You\'ve reached 1000 total students across all courses!',
      timestamp: '2025-01-13T12:30:00Z',
      icon: 'trophy.fill',
      priority: 'high',
    },
    {
      id: '6',
      type: 'message_received',
      title: 'Student Question',
      description: 'Alex Thompson asked a question about your Node.js course',
      timestamp: '2025-01-13T11:20:00Z',
      icon: 'bubble.left.fill',
      actionUrl: '/messages/alex-thompson',
      priority: 'normal',
    },
  ];

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActivities(mockActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActivities();
    setRefreshing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course_enrolled': return 'person.badge.plus.fill';
      case 'content_published': return 'checkmark.circle.fill';
      case 'class_attended': return 'video.fill';
      case 'review_received': return 'star.fill';
      case 'achievement_earned': return 'trophy.fill';
      case 'message_received': return 'bubble.left.fill';
      default: return 'bell.fill';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.colors.error;
      case 'normal': return theme.colors.primary;
      case 'low': return theme.colors.textSecondary;
      default: return theme.colors.primary;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course_enrolled': return theme.colors.primary;
      case 'content_published': return theme.colors.success;
      case 'class_attended': return theme.colors.secondary;
      case 'review_received': return theme.colors.star;
      case 'achievement_earned': return theme.colors.accent;
      case 'message_received': return theme.colors.info;
      default: return theme.colors.primary;
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    
    const activityDate = new Date(activity.timestamp);
    const now = new Date();
    
    if (filter === 'today') {
      return activityDate.toDateString() === now.toDateString();
    }
    
    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return activityDate >= weekAgo;
    }
    
    return true;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleActivityPress = (activity: ActivityItem) => {
    if (activity.actionUrl) {
      // TODO: Navigate to the specific URL
      console.log('Navigate to:', activity.actionUrl);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <IconSymbol name="chevron.left" size={24} color={theme.colors.text} />
          </Button>
          
          <ThemedText type="title" style={styles.headerTitle}>
            Activity
          </ThemedText>
          
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.filterSection}>
          <View style={styles.filterButtons}>
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => setFilter('all')}
              style={styles.filterButton}
            >
              All
            </Button>
            <Button
              variant={filter === 'today' ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => setFilter('today')}
              style={styles.filterButton}
            >
              Today
            </Button>
            <Button
              variant={filter === 'week' ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => setFilter('week')}
              style={styles.filterButton}
            >
              This Week
            </Button>
          </View>
        </View>
      </ThemedView>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ThemedText style={{ color: theme.colors.textSecondary }}>
              Loading activities...
            </ThemedText>
          </View>
        ) : filteredActivities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol 
              name="clock.fill" 
              size={64} 
              color={theme.colors.textTertiary} 
            />
            <ThemedText type="subtitle" style={[styles.emptyTitle, { color: theme.colors.textSecondary }]}>
              No activities yet
            </ThemedText>
            <ThemedText style={[styles.emptyDescription, { color: theme.colors.textTertiary }]}>
              Your creator activities will appear here as you create content and interact with students.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.activitiesList}>
            {filteredActivities.map((activity, index) => (
              <TouchableOpacity
                key={activity.id}
                onPress={() => handleActivityPress(activity)}
                style={styles.activityTouchable}
              >
                <Card style={styles.activityCard}>
                  <View style={styles.activityContent}>
                    <View style={styles.activityHeader}>
                      <View style={[
                        styles.iconContainer,
                        { backgroundColor: getTypeColor(activity.type) + '20' }
                      ]}>
                        <IconSymbol 
                          name={getActivityIcon(activity.type)}
                          size={20} 
                          color={getTypeColor(activity.type)} 
                        />
                      </View>
                      
                      <View style={styles.activityInfo}>
                        <ThemedText style={styles.activityTitle}>
                          {activity.title}
                        </ThemedText>
                        <ThemedText style={[styles.timestamp, { color: theme.colors.textTertiary }]}>
                          {formatTimestamp(activity.timestamp)}
                        </ThemedText>
                      </View>

                      <View style={styles.activityActions}>
                        {activity.priority === 'high' && (
                          <View style={[styles.priorityDot, { backgroundColor: theme.colors.error }]} />
                        )}
                        {activity.actionUrl && (
                          <IconSymbol name="chevron.right" size={16} color={theme.colors.textSecondary} />
                        )}
                      </View>
                    </View>

                    <ThemedText style={[styles.activityDescription, { color: theme.colors.textSecondary }]}>
                      {activity.description}
                    </ThemedText>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 24,
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    lineHeight: 20,
  },
  activitiesList: {
    gap: 12,
    paddingBottom: 20,
  },
  activityTouchable: {
    // No styles needed
  },
  activityCard: {
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  activityContent: {
    gap: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
    gap: 2,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
  },
  activityActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activityDescription: {
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 44,
  },
});
