/**
 * Optimized FlashList wrapper for high-performance lists
 * Replaces FlatList for better performance
 */

import { useTheme } from '@/hooks/useTheme';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, Text, View } from 'react-native';

interface OptimizedFlashListProps<T> extends Partial<FlashListProps<T>> {
  data: T[];
  renderItem: FlashListProps<T>['renderItem'];
  emptyMessage?: string;
  emptyIcon?: string;
  loading?: boolean;
  onRefresh?: () => void | Promise<void>;
  refreshing?: boolean;
  estimatedItemSize: number;
}

function OptimizedFlashListComponent<T>({
  data,
  renderItem,
  emptyMessage = 'No items found',
  emptyIcon = '📭',
  loading = false,
  onRefresh,
  refreshing = false,
  estimatedItemSize,
  ...props
}: OptimizedFlashListProps<T>) {
  const { theme } = useTheme();

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
    }
  }, [onRefresh]);

  const renderEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>{emptyIcon}</Text>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          {emptyMessage}
        </Text>
      </View>
    );
  }, [loading, emptyMessage, emptyIcon, theme]);

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={estimatedItemSize}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      {...props}
    />
  );
}

export const OptimizedFlashList = memo(OptimizedFlashListComponent) as typeof OptimizedFlashListComponent;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
