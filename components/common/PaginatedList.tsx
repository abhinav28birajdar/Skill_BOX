import { Skeleton } from '@/components/ui/Skeleton';
import { useEnhancedTheme } from '@/hooks/useEnhancedTheme';
import React, { useCallback, useRef } from 'react';
import {
    ActivityIndicator,
    FlatList,
    FlatListProps,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface PaginatedListProps<T> extends Omit<FlatListProps<T>, 'onEndReached' | 'ListFooterComponent'> {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyMessage?: string;
  loadingComponent?: React.ReactElement;
  skeletonCount?: number;
  skeletonVariant?: 'card' | 'text' | 'avatar' | 'image';
}

export function PaginatedList<T>({
  data,
  loading,
  hasMore,
  onLoadMore,
  onRefresh,
  refreshing = false,
  emptyMessage = 'No items found',
  loadingComponent,
  skeletonCount = 5,
  skeletonVariant = 'card',
  renderItem,
  ...flatListProps
}: PaginatedListProps<T>) {
  const theme = useEnhancedTheme();
  const flatListRef = useRef<FlatList<T>>(null);

  const handleEndReached = useCallback(() => {
    if (!loading && hasMore) {
      onLoadMore();
    }
  }, [loading, hasMore, onLoadMore]);

  const renderFooter = () => {
    if (!hasMore && data && data.length > 0) {
      return (
        <View style={styles.endMessage}>
          <Text style={[styles.endMessageText, { color: theme.colors.textSecondary }]}>
            That's all for now!
          </Text>
        </View>
      );
    }

    if (loading && data && data.length > 0) {
      return (
        <View style={styles.footer}>
          {loadingComponent || (
            <ActivityIndicator
              size="small"
              color={theme.colors.primary}
              style={styles.footerLoader}
            />
          )}
        </View>
      );
    }

    return null;
  };

  const renderEmpty = () => {
    if (loading && (!data || data.length === 0)) {
      return (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <Skeleton
              key={index}
              style={[
                styles.skeleton,
                skeletonVariant === 'card' && styles.skeletonCard,
                skeletonVariant === 'text' && styles.skeletonText,
                skeletonVariant === 'avatar' && styles.skeletonAvatar,
                skeletonVariant === 'image' && styles.skeletonImage,
              ]}
            />
          ))}
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          {emptyMessage}
        </Text>
      </View>
    );
  };

  const refreshControl = onRefresh ? (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[theme.colors.primary]}
      tintColor={theme.colors.primary}
    />
  ) : undefined;

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        (!data || data.length === 0) && styles.emptyContainerStyle,
      ]}
      {...flatListProps}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  emptyContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerLoader: {
    marginVertical: 10,
  },
  endMessage: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endMessageText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  skeletonContainer: {
    padding: 16,
  },
  skeleton: {
    marginBottom: 12,
  },
  skeletonCard: {
    height: 120,
    borderRadius: 12,
  },
  skeletonText: {
    height: 20,
    borderRadius: 4,
  },
  skeletonAvatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignSelf: 'center',
  },
  skeletonImage: {
    height: 200,
    borderRadius: 8,
  },
});