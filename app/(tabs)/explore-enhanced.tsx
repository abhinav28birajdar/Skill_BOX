// ===================================================================
// EXPLORE SCREEN - ENHANCED VERSION
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
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { ContentService } from '../../services/contentService';
import { ContentType, LearningContent, SearchFilters, SkillLevel } from '../../types/models';

const { width: screenWidth } = Dimensions.get('window');

// ===================================================================
// TYPES
// ===================================================================

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

interface FilterState extends SearchFilters {
  activeCategory?: string;
}

// ===================================================================
// EXPLORE SCREEN COMPONENT
// ===================================================================

export default function ExploreScreen() {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [content, setContent] = useState<LearningContent[]>([]);
  const [filteredContent, setFilteredContent] = useState<LearningContent[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    content_types: [],
    difficulty_levels: [],
    is_free: undefined,
    sort_by: 'popularity',
    sort_order: 'desc',
  });

  // ===================================================================
  // CATEGORIES DATA
  // ===================================================================

  const categories: Category[] = [
    {
      id: 'all',
      name: 'All',
      icon: 'apps',
      color: theme.colors.primary,
      count: 0,
    },
    {
      id: 'technology',
      name: 'Technology',
      icon: 'laptop',
      color: '#3B82F6',
      count: 1250,
    },
    {
      id: 'business',
      name: 'Business',
      icon: 'briefcase',
      color: '#10B981',
      count: 890,
    },
    {
      id: 'creative',
      name: 'Creative',
      icon: 'brush',
      color: '#F59E0B',
      count: 645,
    },
    {
      id: 'health',
      name: 'Health',
      icon: 'fitness',
      color: '#EF4444',
      count: 423,
    },
    {
      id: 'education',
      name: 'Education',
      icon: 'school',
      color: '#8B5CF6',
      count: 567,
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle',
      icon: 'home',
      color: '#EC4899',
      count: 334,
    },
  ];

  const contentTypes: Array<{ key: ContentType; label: string }> = [
    { key: 'video', label: 'Videos' },
    { key: 'audio', label: 'Audio' },
    { key: 'document', label: 'Documents' },
    { key: 'quiz', label: 'Quizzes' },
    { key: 'live_stream', label: 'Live Streams' },
    { key: 'workshop', label: 'Workshops' },
  ];

  const difficultyLevels: Array<{ key: SkillLevel; label: string }> = [
    { key: 'beginner', label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'advanced', label: 'Advanced' },
    { key: 'expert', label: 'Expert' },
  ];

  // ===================================================================
  // DATA LOADING
  // ===================================================================

  const loadContent = useCallback(async (page = 1, resetData = false) => {
    if (loading && !refreshing) return;

    try {
      setLoading(true);

      const searchFilters: SearchFilters = {
        ...filters,
        query: searchQuery.trim() || undefined,
      };

      const result = await ContentService.searchContent(searchFilters, page, 20);
      
      if (result.success && result.data) {
        const newContent = result.data.items;
        
        if (resetData || page === 1) {
          setContent(newContent);
          setFilteredContent(newContent);
        } else {
          setContent(prev => [...prev, ...newContent]);
          setFilteredContent(prev => [...prev, ...newContent]);
        }
        
        setHasMore(result.data.has_more);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, loading, refreshing]);

  useEffect(() => {
    loadContent(1, true);
  }, [filters, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadContent(1, true);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadContent(currentPage + 1);
    }
  };

  // ===================================================================
  // FILTER HANDLERS
  // ===================================================================

  const handleCategoryPress = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      activeCategory: categoryId,
      // Map category to skills filter
      skills: categoryId === 'all' ? undefined : [categoryId],
    }));
  };

  const handleContentTypeFilter = (contentType: ContentType) => {
    setFilters(prev => {
      const currentTypes = prev.content_types || [];
      const newTypes = currentTypes.includes(contentType)
        ? currentTypes.filter(type => type !== contentType)
        : [...currentTypes, contentType];
      
      return {
        ...prev,
        content_types: newTypes.length > 0 ? newTypes : undefined,
      };
    });
  };

  const handleDifficultyFilter = (difficulty: SkillLevel) => {
    setFilters(prev => {
      const currentLevels = prev.difficulty_levels || [];
      const newLevels = currentLevels.includes(difficulty)
        ? currentLevels.filter(level => level !== difficulty)
        : [...currentLevels, difficulty];
      
      return {
        ...prev,
        difficulty_levels: newLevels.length > 0 ? newLevels : undefined,
      };
    });
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sort_by: sortBy as any,
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      content_types: [],
      difficulty_levels: [],
      is_free: undefined,
      sort_by: 'popularity',
      sort_order: 'desc',
    });
    setSearchQuery('');
  };

  // ===================================================================
  // RENDER FUNCTIONS
  // ===================================================================

  const renderSearchBar = () => (
    <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
      <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
      <TextInput
        style={[styles.searchInput, { color: theme.colors.text }]}
        placeholder="Search courses, skills, instructors..."
        placeholderTextColor={theme.colors.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
        returnKeyType="search"
        onSubmitEditing={() => loadContent(1, true)}
      />
      <TouchableOpacity
        onPress={() => setShowFilters(!showFilters)}
        style={[
          styles.filterButton,
          {
            backgroundColor: showFilters ? theme.colors.primary : 'transparent',
          }
        ]}
      >
        <Ionicons
          name="options"
          size={20}
          color={showFilters ? 'white' : theme.colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );

  const renderCategories = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryItem,
            {
              backgroundColor: filters.activeCategory === category.id
                ? category.color
                : theme.colors.surface,
            }
          ]}
          onPress={() => handleCategoryPress(category.id)}
        >
          <Ionicons
            name={category.icon as any}
            size={20}
            color={
              filters.activeCategory === category.id
                ? 'white'
                : category.color
            }
          />
          <Text
            style={[
              styles.categoryText,
              {
                color: filters.activeCategory === category.id
                  ? 'white'
                  : theme.colors.text,
              }
            ]}
          >
            {category.name}
          </Text>
          {category.count > 0 && (
            <Text
              style={[
                styles.categoryCount,
                {
                  color: filters.activeCategory === category.id
                    ? 'rgba(255,255,255,0.8)'
                    : theme.colors.textSecondary,
                }
              ]}
            >
              {category.count}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <View style={[styles.filtersContainer, { backgroundColor: theme.colors.surface }]}>
        {/* Content Type Filters */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
            Content Type
          </Text>
          <View style={styles.filterOptions}>
            {contentTypes.map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: filters.content_types?.includes(type.key)
                      ? theme.colors.primary
                      : theme.colors.background,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => handleContentTypeFilter(type.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: filters.content_types?.includes(type.key)
                        ? 'white'
                        : theme.colors.text,
                    }
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Difficulty Filters */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
            Difficulty Level
          </Text>
          <View style={styles.filterOptions}>
            {difficultyLevels.map((level) => (
              <TouchableOpacity
                key={level.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: filters.difficulty_levels?.includes(level.key)
                      ? theme.colors.primary
                      : theme.colors.background,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => handleDifficultyFilter(level.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: filters.difficulty_levels?.includes(level.key)
                        ? 'white'
                        : theme.colors.text,
                    }
                  ]}
                >
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Filter */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
            Price
          </Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                {
                  backgroundColor: filters.is_free === true
                    ? theme.colors.primary
                    : theme.colors.background,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={() => setFilters(prev => ({
                ...prev,
                is_free: prev.is_free === true ? undefined : true,
              }))}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: filters.is_free === true
                      ? 'white'
                      : theme.colors.text,
                  }
                ]}
              >
                Free Only
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sort Options */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
            Sort By
          </Text>
          <View style={styles.filterOptions}>
            {[
              { key: 'popularity', label: 'Popularity' },
              { key: 'newest', label: 'Newest' },
              { key: 'rating', label: 'Rating' },
              { key: 'price_low', label: 'Price: Low to High' },
              { key: 'price_high', label: 'Price: High to Low' },
            ].map((sort) => (
              <TouchableOpacity
                key={sort.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: filters.sort_by === sort.key
                      ? theme.colors.primary
                      : theme.colors.background,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => handleSortChange(sort.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: filters.sort_by === sort.key
                        ? 'white'
                        : theme.colors.text,
                    }
                  ]}
                >
                  {sort.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Clear Filters */}
        <TouchableOpacity
          style={[styles.clearFiltersButton, { borderColor: theme.colors.border }]}
          onPress={clearFilters}
        >
          <Text style={[styles.clearFiltersText, { color: theme.colors.primary }]}>
            Clear All Filters
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContentItem = ({ item }: { item: LearningContent }) => (
    <TouchableOpacity
      style={[styles.contentItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => router.push(`/content/${item.id}`)}
    >
      <View style={[styles.contentThumbnail, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="play-circle" size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.contentDetails}>
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
          <Text style={[styles.views, { color: theme.colors.textSecondary }]}>
            • {item.views_count} views
          </Text>
          {item.duration_seconds && (
            <Text style={[styles.duration, { color: theme.colors.textSecondary }]}>
              • {Math.floor(item.duration_seconds / 60)}m
            </Text>
          )}
        </View>
        <View style={styles.contentFooter}>
          <View style={[styles.difficultyBadge, { backgroundColor: theme.colors.primary + '20' }]}>
            <Text style={[styles.difficultyText, { color: theme.colors.primary }]}>
              {item.difficulty_level}
            </Text>
          </View>
          {!item.is_free && (
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              ${item.price}
            </Text>
          )}
          {item.is_free && (
            <Text style={[styles.freeText, { color: theme.colors.success }]}>
              Free
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search" size={64} color={theme.colors.textTertiary} />
      <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
        No content found
      </Text>
      <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
        Try adjusting your search terms or filters
      </Text>
      <TouchableOpacity
        style={[styles.clearFiltersButton, { borderColor: theme.colors.primary }]}
        onPress={clearFilters}
      >
        <Text style={[styles.clearFiltersText, { color: theme.colors.primary }]}>
          Clear Filters
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ===================================================================
  // MAIN RENDER
  // ===================================================================

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderSearchBar()}
      {renderCategories()}
      {renderFilters()}
      
      <FlatList
        data={filteredContent}
        renderItem={renderContentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    marginRight: 8,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  categoryCount: {
    fontSize: 12,
    marginLeft: 4,
  },
  filtersContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  clearFiltersButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  contentItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  contentThumbnail: {
    width: 120,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentDetails: {
    flex: 1,
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
    marginBottom: 6,
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
    marginLeft: 2,
  },
  views: {
    fontSize: 12,
    marginLeft: 4,
  },
  duration: {
    fontSize: 12,
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  freeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
});
