import { useTheme } from '@/constants/Theme';
import React, { createContext, useCallback, useContext, useState } from 'react';
import {
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

// Notification Types
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'course' | 'class' | 'achievement';
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  onAction?: () => void;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

// Notification Context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Notification Provider
interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Toast Notification Component
interface ToastProps {
  notification: Notification;
  onClose: () => void;
  autoHideDuration?: number;
}

export function Toast({ notification, onClose, autoHideDuration = 4000 }: ToastProps) {
  const theme = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  React.useEffect(() => {
    // Show animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide
    const timer = setTimeout(() => {
      hideToast();
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, []);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          backgroundColor: theme.colors.success,
          icon: '✅',
          textColor: '#FFFFFF',
        };
      case 'error':
        return {
          backgroundColor: theme.colors.error,
          icon: '❌',
          textColor: '#FFFFFF',
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning,
          icon: '⚠️',
          textColor: '#FFFFFF',
        };
      case 'course':
        return {
          backgroundColor: theme.colors.primary,
          icon: '📚',
          textColor: '#FFFFFF',
        };
      case 'class':
        return {
          backgroundColor: theme.colors.secondary,
          icon: '🎓',
          textColor: '#FFFFFF',
        };
      case 'achievement':
        return {
          backgroundColor: '#FFD700',
          icon: '🏆',
          textColor: '#000000',
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          icon: 'ℹ️',
          textColor: theme.colors.text,
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 50,
        left: theme.spacing.md,
        right: theme.spacing.md,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        zIndex: 1000,
      }}
    >
      <View
        style={{
          backgroundColor: typeStyles.backgroundColor,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          ...theme.shadows.lg,
          elevation: 8,
        }}
      >
        {/* Icon */}
        <Text style={{
          fontSize: 20,
          marginRight: theme.spacing.sm,
        }}>
          {typeStyles.icon}
        </Text>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: theme.typography.fontSize.base,
            fontWeight: '600',
            color: typeStyles.textColor,
            marginBottom: 2,
          }}>
            {notification.title}
          </Text>
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: typeStyles.textColor,
            opacity: 0.9,
          }}>
            {notification.message}
          </Text>
        </View>

        {/* Action Button */}
        {notification.actionLabel && notification.onAction && (
          <TouchableOpacity
            onPress={notification.onAction}
            style={{
              marginLeft: theme.spacing.sm,
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.xs,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: theme.borderRadius.sm,
            }}
          >
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: '600',
              color: typeStyles.textColor,
            }}>
              {notification.actionLabel}
            </Text>
          </TouchableOpacity>
        )}

        {/* Close Button */}
        <TouchableOpacity
          onPress={hideToast}
          style={{
            marginLeft: theme.spacing.sm,
            padding: theme.spacing.xs,
          }}
        >
          <Text style={{
            fontSize: 16,
            color: typeStyles.textColor,
            opacity: 0.7,
          }}>
            ✕
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// Notification Badge Component
interface NotificationBadgeProps {
  count: number;
  style?: ViewStyle;
  maxCount?: number;
}

export function NotificationBadge({ count, style, maxCount = 99 }: NotificationBadgeProps) {
  const theme = useTheme();

  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <View
      style={[
        {
          position: 'absolute',
          top: -8,
          right: -8,
          backgroundColor: theme.colors.error,
          borderRadius: 10,
          minWidth: 20,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 4,
          borderWidth: 2,
          borderColor: theme.colors.background,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: '#FFFFFF',
        }}
      >
        {displayCount}
      </Text>
    </View>
  );
}

// Notification List Item Component
interface NotificationItemProps {
  notification: Notification;
  onPress?: () => void;
  onMarkAsRead?: () => void;
  onRemove?: () => void;
  style?: ViewStyle;
}

export function NotificationItem({
  notification,
  onPress,
  onMarkAsRead,
  onRemove,
  style,
}: NotificationItemProps) {
  const theme = useTheme();

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getTypeIcon = () => {
    switch (notification.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'course': return '📚';
      case 'class': return '🎓';
      case 'achievement': return '🏆';
      default: return 'ℹ️';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: notification.read ? 'transparent' : theme.colors.backgroundSecondary,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.md,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {/* Type Icon */}
        <Text style={{
          fontSize: 20,
          marginRight: theme.spacing.sm,
          marginTop: 2,
        }}>
          {getTypeIcon()}
        </Text>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: theme.typography.fontSize.base,
            fontWeight: notification.read ? '400' : '600',
            color: theme.colors.text,
            marginBottom: 4,
          }}>
            {notification.title}
          </Text>
          
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.textSecondary,
            lineHeight: 20,
            marginBottom: 4,
          }}>
            {notification.message}
          </Text>
          
          <Text style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.textTertiary,
          }}>
            {getTimeAgo(notification.timestamp)}
          </Text>
        </View>

        {/* Actions */}
        <View style={{ alignItems: 'flex-end' }}>
          {!notification.read && (
            <TouchableOpacity
              onPress={onMarkAsRead}
              style={{
                padding: theme.spacing.xs,
                marginBottom: theme.spacing.xs,
              }}
            >
              <Text style={{
                fontSize: 12,
                color: theme.colors.primary,
                fontWeight: '600',
              }}>
                Mark Read
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={onRemove}
            style={{
              padding: theme.spacing.xs,
            }}
          >
            <Text style={{
              fontSize: 16,
              color: theme.colors.textSecondary,
            }}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        {/* Unread Indicator */}
        {!notification.read && (
          <View style={{
            position: 'absolute',
            left: -theme.spacing.md,
            top: '50%',
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.colors.primary,
            transform: [{ translateY: -2 }],
          }} />
        )}
      </View>
    </TouchableOpacity>
  );
}

// Notification Panel Component
interface NotificationPanelProps {
  style?: ViewStyle;
  maxHeight?: number;
  showHeader?: boolean;
  emptyMessage?: string;
}

export function NotificationPanel({
  style,
  maxHeight = 400,
  showHeader = true,
  emptyMessage = 'No notifications yet',
}: NotificationPanelProps) {
  const theme = useTheme();
  const { notifications, markAsRead, removeNotification, markAllAsRead, clearAll } = useNotifications();

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <View style={[
      {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        maxHeight,
        ...theme.shadows.md,
      },
      style,
    ]}>
      {/* Header */}
      {showHeader && (
        <View style={{
          padding: theme.spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: '600',
            color: theme.colors.text,
          }}>
            Notifications
          </Text>
          
          <View style={{ flexDirection: 'row' }}>
            {unreadNotifications.length > 0 && (
              <TouchableOpacity
                onPress={markAllAsRead}
                style={{ marginRight: theme.spacing.sm }}
              >
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.primary,
                  fontWeight: '600',
                }}>
                  Mark All Read
                </Text>
              </TouchableOpacity>
            )}
            
            {notifications.length > 0 && (
              <TouchableOpacity onPress={clearAll}>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.error,
                  fontWeight: '600',
                }}>
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <View style={{
          padding: theme.spacing.xl,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.textSecondary,
            textAlign: 'center',
          }}>
            {emptyMessage}
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Unread Notifications */}
          {unreadNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => markAsRead(notification.id)}
              onRemove={() => removeNotification(notification.id)}
              onPress={notification.onAction}
            />
          ))}
          
          {/* Read Notifications */}
          {readNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRemove={() => removeNotification(notification.id)}
              onPress={notification.onAction}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// SkillBox specific notification helpers
export const SkillBoxNotifications = {
  courseEnrollment: (courseName: string, onViewCourse: () => void) => ({
    title: 'Course Enrollment',
    message: `You have successfully enrolled in "${courseName}"`,
    type: 'course' as const,
    actionLabel: 'View Course',
    onAction: onViewCourse,
  }),
  
  classReminder: (className: string, timeUntil: string, onJoinClass: () => void) => ({
    title: 'Class Starting Soon',
    message: `"${className}" starts in ${timeUntil}`,
    type: 'class' as const,
    actionLabel: 'Join Now',
    onAction: onJoinClass,
  }),
  
  achievement: (achievementName: string, onViewAchievement: () => void) => ({
    title: 'Achievement Unlocked!',
    message: `You earned the "${achievementName}" badge`,
    type: 'achievement' as const,
    actionLabel: 'View',
    onAction: onViewAchievement,
  }),
  
  assignment: (assignmentName: string, dueDate: string, onViewAssignment: () => void) => ({
    title: 'Assignment Due',
    message: `"${assignmentName}" is due ${dueDate}`,
    type: 'warning' as const,
    actionLabel: 'Open',
    onAction: onViewAssignment,
  }),
  
  gradeReceived: (courseName: string, grade: string, onViewGrade: () => void) => ({
    title: 'Grade Received',
    message: `You received a ${grade} in "${courseName}"`,
    type: 'success' as const,
    actionLabel: 'View Details',
    onAction: onViewGrade,
  }),
};
