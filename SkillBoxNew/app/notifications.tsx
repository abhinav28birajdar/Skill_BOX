import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Notification {
  id: string;
  type: 'course' | 'community' | 'system' | 'achievement' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  icon: string;
  priority: 'low' | 'normal' | 'high';
}

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'course',
      title: 'New Course Available',
      message: 'Advanced React Native Development course is now available in your learning path.',
      timestamp: '2025-01-15T10:30:00Z',
      isRead: false,
      actionUrl: '/courses/advanced-react-native',
      icon: 'book.fill',
      priority: 'normal',
    },
    {
      id: '2',
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'Congratulations! You\'ve completed 5 courses this month.',
      timestamp: '2025-01-14T15:45:00Z',
      isRead: false,
      icon: 'trophy.fill',
      priority: 'high',
    },
    {
      id: '3',
      type: 'community',
      title: 'New Reply in Discussion',
      message: 'Someone replied to your question in "JavaScript Best Practices" forum.',
      timestamp: '2025-01-14T09:20:00Z',
      isRead: true,
      actionUrl: '/community/posts/123',
      icon: 'bubble.left.fill',
      priority: 'normal',
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Class Reminder',
      message: 'Your live class "UI/UX Design Fundamentals" starts in 1 hour.',
      timestamp: '2025-01-13T14:00:00Z',
      isRead: true,
      icon: 'bell.fill',
      priority: 'high',
    },
    {
      id: '5',
      type: 'system',
      title: 'App Update Available',
      message: 'Version 2.1.0 is available with new features and bug fixes.',
      timestamp: '2025-01-12T12:00:00Z',
      isRead: true,
      icon: 'app.badge.fill',
      priority: 'low',
    },
  ];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
    
    // TODO: Call API to mark as read
  };

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    
    // TODO: Call API to mark all as read
  };

  const deleteNotification = async (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev =>
              prev.filter(notification => notification.id !== notificationId)
            );
            // TODO: Call API to delete notification
          },
        },
      ]
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      // TODO: Navigate to the specific URL
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course': return 'book.fill';
      case 'community': return 'bubble.left.fill';
      case 'system': return 'app.badge.fill';
      case 'achievement': return 'trophy.fill';
      case 'reminder': return 'bell.fill';
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

  const filteredNotifications = notifications.filter(notification =>
    filter === 'all' || !notification.isRead
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
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
            Notifications
          </ThemedText>
          
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              Alert.alert('Settings', 'Notification settings coming soon!');
            }}
            style={styles.settingsButton}
          >
            <IconSymbol name="gear" size={24} color={theme.colors.text} />
          </Button>
        </View>

        <View style={styles.filterSection}>
          <View style={styles.filterButtons}>
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => setFilter('all')}
              style={styles.filterButton}
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => setFilter('unread')}
              style={styles.filterButton}
            >
              Unread ({unreadCount})
            </Button>
          </View>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onPress={markAllAsRead}
              style={styles.markAllButton}
            >
              <ThemedText style={{ color: theme.colors.primary, fontSize: 14 }}>
                Mark all read
              </ThemedText>
            </Button>
          )}
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
              Loading notifications...
            </ThemedText>
          </View>
        ) : filteredNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol 
              name="bell.slash.fill" 
              size={64} 
              color={theme.colors.textTertiary} 
            />
            <ThemedText type="subtitle" style={[styles.emptyTitle, { color: theme.colors.textSecondary }]}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </ThemedText>
            <ThemedText style={[styles.emptyDescription, { color: theme.colors.textTertiary }]}>
              {filter === 'unread' 
                ? 'All caught up! You have no unread notifications.'
                : 'You\'ll see notifications here when you have new activity.'
              }
            </ThemedText>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {filteredNotifications.map((notification, index) => (
              <TouchableOpacity
                key={notification.id}
                onPress={() => handleNotificationPress(notification)}
                style={styles.notificationTouchable}
              >
                <Card style={[
                  styles.notificationCard,
                  !notification.isRead && styles.unreadCard,
                  { backgroundColor: notification.isRead ? theme.colors.card : theme.colors.card + 'F0' }
                ]}>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <View style={[
                        styles.iconContainer,
                        { backgroundColor: getPriorityColor(notification.priority) + '20' }
                      ]}>
                        <IconSymbol 
                          name={getNotificationIcon(notification.type) as any}
                          size={20} 
                          color={getPriorityColor(notification.priority)} 
                        />
                      </View>
                      
                      <View style={styles.notificationInfo}>
                        <ThemedText style={[
                          styles.notificationTitle,
                          !notification.isRead && styles.unreadTitle
                        ]}>
                          {notification.title}
                        </ThemedText>
                        <ThemedText style={[styles.timestamp, { color: theme.colors.textTertiary }]}>
                          {formatTimestamp(notification.timestamp)}
                        </ThemedText>
                      </View>

                      <View style={styles.notificationActions}>
                        {!notification.isRead && (
                          <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onPress={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          style={styles.deleteButton}
                        >
                          <IconSymbol name="xmark" size={16} color={theme.colors.textSecondary} />
                        </Button>
                      </View>
                    </View>

                    <ThemedText style={[styles.notificationMessage, { color: theme.colors.textSecondary }]}>
                      {notification.message}
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
  settingsButton: {
    paddingHorizontal: 0,
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
  markAllButton: {
    paddingHorizontal: 0,
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
  notificationsList: {
    gap: 12,
    paddingBottom: 20,
  },
  notificationTouchable: {
    // No styles needed
  },
  notificationCard: {
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  unreadCard: {
    borderLeftColor: '#6366F1',
  },
  notificationContent: {
    gap: 8,
  },
  notificationHeader: {
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
  notificationInfo: {
    flex: 1,
    gap: 2,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 12,
  },
  notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  deleteButton: {
    paddingHorizontal: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 44,
  },
});
