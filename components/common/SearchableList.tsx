import ModernCard from '@/components/ui/ModernCard';
import ModernInput from '@/components/ui/ModernInput';
import { Skeleton } from '@/components/ui/Skeleton';
import { useEnhancedTheme } from '@/hooks/useEnhancedTheme';
import { SearchResult, searchService } from '@/services/searchService';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface SearchableListProps<T> {
  searchType: 'courses' | 'users' | 'skills';
  renderItem: (item: T) => React.ReactElement;
  placeholder?: string;
  filters?: any;
  sortOptions?: string[];
  onItemPress?: (item: T) => void;
  emptyMessage?: string;
}

export function SearchableList<T>({
  searchType,
  renderItem,
  placeholder = 'Search...',
  filters = {},
  sortOptions = ['relevance', 'rating', 'date'],
  onItemPress,
  emptyMessage = 'No results found',
}: SearchableListProps<T>) {
  const theme = useEnhancedTheme();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [results, setResults] = useState<SearchResult<T>>({
    items: [],
    total: 0,
    hasMore: false,
  });
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [page, setPage] = useState(0);

  const performSearch = useCallback(async (
    searchQuery: string = query,
    reset: boolean = true
  ) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(0);
      }

      const currentPage = reset ? 0 : page;
      const searchFunction = 
        searchType === 'courses' ? searchService.searchCourses :
        searchType === 'users' ? searchService.searchUsers :
        searchService.searchSkills;

      const result = await searchFunction(searchQuery, filters, {
        limit: 20,
        offset: currentPage * 20,
        sortBy: sortBy as any,
      });

      if (reset) {
        setResults(result);
      } else {
        setResults(prev => ({
          ...result,
          items: [...prev.items, ...result.items],
        }));
      }

      if (!reset) {
        setPage(prev => prev + 1);
      }

      // Record search for analytics
      if (searchQuery.trim()) {
        await searchService.recordSearch(searchQuery);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [query, sortBy, filters, searchType, page]);

  const debouncedSearch = useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (searchQuery: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => performSearch(searchQuery), 500);
    };
  }, [performSearch]);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    performSearch(query, true);
  };

  const loadMore = () => {
    if (!loading && results.hasMore) {
      performSearch(query, false);
    }
  };

  const renderListItem = ({ item }: { item: T }) => (
    <TouchableOpacity
      onPress={() => onItemPress?.(item)}
      style={styles.itemContainer}
    >
      <ModernCard style={styles.resultCard}>
        {renderItem(item)}
      </ModernCard>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!results.hasMore) return null;
    
    return (
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <TouchableOpacity onPress={loadMore} style={styles.loadMoreButton}>
            <Text style={[styles.loadMoreText, { color: theme.colors.primary }]}>
              Load More
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading && results.items.length === 0) {
      return (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              style={styles.skeletonCard}
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Input */}
      <ModernInput
        value={query}
        onChangeText={handleQueryChange}
        placeholder={placeholder}
        leftIcon="search"
        style={styles.searchInput}
      />

      {/* Sort Options */}
      {sortOptions.length > 1 && (
        <View style={styles.sortContainer}>
          <Text style={[styles.sortLabel, { color: theme.colors.textSecondary }]}>
            Sort by:
          </Text>
          <View style={styles.sortButtons}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setSortBy(option)}
                style={[
                  styles.sortButton,
                  sortBy === option && { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    {
                      color: sortBy === option 
                        ? theme.colors.surface 
                        : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Results Count */}
      {results.total > 0 && (
        <Text style={[styles.resultsCount, { color: theme.colors.textSecondary }]}>
          {results.total} result{results.total !== 1 ? 's' : ''} found
        </Text>
      )}

      {/* Results List */}
      <FlatList
        data={results.items}
        renderItem={renderListItem}
        keyExtractor={(item: any, index) => `${item.id || index}`}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    marginBottom: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 14,
    marginRight: 12,
    fontWeight: '500',
  },
  sortButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  resultsCount: {
    fontSize: 14,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  listContainer: {
    flexGrow: 1,
  },
  itemContainer: {
    marginBottom: 12,
  },
  resultCard: {
    padding: 0,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonCard: {
    height: 120,
    marginBottom: 12,
  },
});