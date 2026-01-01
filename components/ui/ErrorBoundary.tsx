/**
 * Error Boundary Component
 * Catches and displays errors gracefully
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Component, ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.header}>
            <View style={styles.errorIcon}>
              <Ionicons name="alert-circle" size={64} color="#fff" />
            </View>
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorSubtitle}>
              We're sorry for the inconvenience. Please try again.
            </Text>
          </LinearGradient>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.errorDetails}>
              <Text style={styles.detailsTitle}>Error Details</Text>
              <View style={styles.detailsCard}>
                <Text style={styles.errorName}>
                  {this.state.error?.name || 'Unknown Error'}
                </Text>
                <Text style={styles.errorMessage}>
                  {this.state.error?.message || 'No error message available'}
                </Text>
              </View>

              {__DEV__ && this.state.error?.stack && (
                <View style={styles.stackCard}>
                  <Text style={styles.stackTitle}>Stack Trace (Dev Only)</Text>
                  <Text style={styles.stackTrace}>{this.state.error.stack}</Text>
                </View>
              )}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton} onPress={this.handleReset}>
                <View style={styles.actionIcon}>
                  <Ionicons name="refresh" size={20} color="#6366F1" />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionLabel}>Try Again</Text>
                  <Text style={styles.actionDescription}>Reload this screen</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="help-circle" size={20} color="#F59E0B" />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionLabel}>Get Help</Text>
                  <Text style={styles.actionDescription}>Contact support</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="bug" size={20} color="#3B82F6" />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionLabel}>Report Bug</Text>
                  <Text style={styles.actionDescription}>Help us improve</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

// Functional Error State Component (for manual error display)
export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.errorStateContainer}>
      <View style={styles.errorStateIcon}>
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
      </View>
      <Text style={styles.errorStateTitle}>{title}</Text>
      <Text style={styles.errorStateMessage}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.retryButtonGradient}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 40,
    alignItems: 'center',
  },
  errorIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  errorDetails: {
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
  },
  detailsCard: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  stackCard: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#1F2937',
    borderRadius: 16,
  },
  stackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 8,
  },
  stackTrace: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#D1D5DB',
    lineHeight: 16,
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    gap: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  // Error State Styles
  errorStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
  },
  errorStateIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorStateTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorStateMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  retryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
});
