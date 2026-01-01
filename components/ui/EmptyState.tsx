/**
 * Empty State Component
 * Displays empty states for various scenarios
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'default' | 'search' | 'error';
}

export function EmptyState({
  icon = 'file-tray-outline',
  title,
  description,
  actionLabel,
  onAction,
  type = 'default',
}: EmptyStateProps) {
  const iconColors = {
    default: { bg: '#EEF2FF', color: '#6366F1' },
    search: { bg: '#FEF3C7', color: '#F59E0B' },
    error: { bg: '#FEE2E2', color: '#EF4444' },
  };

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: iconColors[type].bg }]}>
        <Ionicons name={icon as any} size={64} color={iconColors[type].color} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>{actionLabel}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

// Specialized Empty States
export function NoCoursesEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="book-outline"
      title="No courses yet"
      description="Start your learning journey by exploring our course catalog"
      actionLabel="Browse Courses"
      onAction={onAction}
    />
  );
}

export function NoResultsEmptyState({ searchQuery }: { searchQuery?: string }) {
  return (
    <EmptyState
      icon="search-outline"
      title="No results found"
      description={searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your search criteria'}
      type="search"
    />
  );
}

export function NoNotificationsEmptyState() {
  return (
    <EmptyState
      icon="notifications-outline"
      title="No notifications"
      description="You're all caught up! Check back later for new updates"
    />
  );
}

export function NoMessagesEmptyState() {
  return (
    <EmptyState
      icon="chatbubbles-outline"
      title="No messages"
      description="Start a conversation with your instructors or classmates"
    />
  );
}

export function ErrorEmptyState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon="alert-circle-outline"
      title="Something went wrong"
      description="Unable to load content. Please try again"
      actionLabel="Retry"
      onAction={onRetry}
      type="error"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
});
