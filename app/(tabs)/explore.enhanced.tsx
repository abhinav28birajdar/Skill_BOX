import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { Button } from '@/components/ui/Button.fixed';
import { TouchableCard } from '@/components/ui/Card.enhanced';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Input } from '@/components/ui/Input.enhanced';
import { Text } from '@/components/ui/Text.enhanced';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Class, Course, CreatorProfile, LearningContent, SKILL_CATEGORIES, SkillCategory } from '@/types/database.enhanced';

const { width } = Dimensions.get('window');

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <Button
      variant={selected ? 'primary' : 'outline'}
      size="sm"
      onPress={onPress}
      style={[
        styles.filterChip,
        {
          backgroundColor: selected ? theme.colors.primary : 'transparent',
          borderColor: selected ? theme.colors.primary : theme.colors.border,
        }
      ]}
    >
      <Text 
        variant="caption" 
        color={selected ? 'white' : 'text'}
        weight="medium"
      >
        {label}
      </Text>
    </Button>
  );
};

interface ContentItemProps {
  item: LearningContent | Class | Course;
  type: 'content' | 'class' | 'course';
  onPress: () => void;
}

const ContentItem: React.FC<ContentItemProps> = ({ item, type, onPress }) => {
  const { theme } = useTheme();
  
  const getTypeIcon = () => {
    switch (type) {
      case 'content':
        return (item as LearningContent).content_type === 'video' ? 'play.circle.fill' : 'doc.circle.fill';
      case 'class':
        return 'video.badge.plus';
      case 'course':
        return 'book.closed.fill';
      default:
        return 'doc.circle.fill';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'content':
        return (item as LearningContent).content_type?.toUpperCase();
      case 'class':
        return `${(item as Class).duration_minutes}min CLASS`;
      case 'course':
        return `${(item as Course).total_lessons || 0} LESSONS`;
      default:
        return 'CONTENT';
    }
  };

  const getPrice = () => {
    if ('price' in item) {
      return item.price === 0 ? 'FREE' : `$${item.price}`;
    }
    return 'FREE';
  };

  return (
    <TouchableCard
      variant="outlined"
      padding="none"
      style={styles.contentItem}
      onPress={onPress}
    >
      <View style={[styles.itemThumbnail, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <IconSymbol 
          name={getTypeIcon()} 
          size={32} 
          color={theme.colors.primary} 
        />
        <View style={[styles.typeBadge, { backgroundColor: theme.colors.primary }]}>
          <Text variant="caption" color="white" weight="bold">
            {getTypeLabel()}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemContent}>
        <Text variant="body1" weight="semibold" numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text variant="body2" color="textSecondary" numberOfLines={2} style={styles.itemDescription}>
          {item.description}
        </Text>
        
        <View style={styles.itemMeta}>
          <View style={styles.itemRating}>
            <IconSymbol name="star.fill" size={12} color={theme.colors.star} />
            <Text variant="caption" color="textSecondary">
              {item.average_rating?.toFixed(1) || 'New'}
            </Text>
          </View>
          
          <Text variant="caption" color="primary" weight="bold">
            {getPrice()}
          </Text>
        </View>
        
        <View style={styles.itemFooter}>
          <Text variant="caption" color="textSecondary">
            {item.views_count || 0} views
          </Text>
          
          <View style={styles.skillLevel}>
            <Text variant="caption" color="textSecondary">
              {'skill_level' in item ? item.skill_level : 'beginner'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableCard>
  );
};

interface CreatorItemProps {
  creator: CreatorProfile;
  onPress: () => void;
}

const CreatorItem: React.FC<CreatorItemProps> = ({ creator, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableCard
      variant="outlined"
      padding="md"
      style={styles.creatorItem}
      onPress={onPress}
    >
      <View style={styles.creatorHeader}>
        <View style={[styles.creatorAvatar, { backgroundColor: theme.colors.primary }]}>
          <Text variant="h6" color="white" weight="bold">
            {creator.full_name?.charAt(0) || 'U'}
          </Text>
        </View>
        
        <View style={styles.creatorInfo}>
          <Text variant="body1" weight="semibold" numberOfLines={1}>
            {creator.full_name}
          </Text>
          
          <Text variant="caption" color="textSecondary">
            @{creator.username}
          </Text>
          
          <View style={styles.creatorStats}>
            <View style={styles.stat}>
              <IconSymbol name="star.fill" size={12} color={theme.colors.star} />
              <Text variant="caption" color="textSecondary">
                {creator.average_rating?.toFixed(1) || 'New'}
              </Text>
            </View>
            
            <View style={styles.stat}>
              <IconSymbol name="person.2.fill" size={12} color={theme.colors.primary} />
              <Text variant="caption" color="textSecondary">
                {creator.student_count || 0}
              </Text>
            </View>
          </View>
        </View>
        
        <Button variant="outline" size="sm">
          Follow
        </Button>
      </View>
      
      {creator.bio && (
        <Text variant="body2" color="textSecondary" numberOfLines={2} style={styles.creatorBio}>
          {creator.bio}
        </Text>
      )}
    </TouchableCard>
  );
};

export default function ExploreScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  
  const [searchQuery, setSearchQuery] = useState((params.search as string) || '');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(
    (params.category as SkillCategory) || null
  );
  const [selectedTab, setSelectedTab] = useState<'all' | 'content' | 'classes' | 'courses' | 'creators'>(
    (params.tab as any) || 'all'
  );
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const [content, setContent] = useState<LearningContent[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory, selectedTab, selectedLevel, selectedType]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadContent(),
        loadClasses(),
        loadCourses(),
        loadCreators(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async () => {
    let query = supabase
      .from('learning_content')
      .select('*')
      .eq('status', 'approved');

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
    }

    if (selectedCategory && SKILL_CATEGORIES[selectedCategory]) {
      // Filter by skills in the category
      const categorySkills = SKILL_CATEGORIES[selectedCategory].skills;
      // This would need to be implemented with proper skill filtering
    }

    if (selectedLevel) {
      query = query.eq('skill_level', selectedLevel);
    }

    if (selectedType) {
      query = query.eq('content_type', selectedType);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error loading content:', error);
    } else {
      setContent(data || []);
    }
  };

  const loadClasses = async () => {
    let query = supabase
      .from('classes')
      .select('*')
      .eq('status', 'approved');

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    if (selectedLevel) {
      query = query.eq('difficulty_level', selectedLevel);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error loading classes:', error);
    } else {
      setClasses(data || []);
    }
  };

  const loadCourses = async () => {
    let query = supabase
      .from('courses')
      .select('*')
      .eq('status', 'approved');

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    if (selectedLevel) {
      query = query.eq('difficulty_level', selectedLevel);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error loading courses:', error);
    } else {
      setCourses(data || []);
    }
  };

  const loadCreators = async () => {
    let query = supabase
      .from('users')
      .select('*')
      .in('role', ['creator', 'teacher_approved'])
      .eq('is_active', true);

    if (searchQuery) {
      query = query.or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query
      .order('average_rating', { ascending: false, nullsFirst: false })
      .limit(20);

    if (error) {
      console.error('Error loading creators:', error);
    } else {
      setCreators(data || []);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSearch = () => {
    loadData();
  };

  const renderAllContent = () => {
    const allItems = [
      ...content.map(item => ({ ...item, type: 'content' as const })),
      ...classes.map(item => ({ ...item, type: 'class' as const })),
      ...courses.map(item => ({ ...item, type: 'course' as const })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
      <FlatList
        data={allItems}
        renderItem={({ item }) => (
          <ContentItem
            item={item}
            type={item.type}
            onPress={() => {/* Navigate to item */}}
          />
        )}
        keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'content':
        return (
          <FlatList
            data={content}
            renderItem={({ item }) => (
              <ContentItem
                item={item}
                type="content"
                onPress={() => {/* Navigate to content */}}
              />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'classes':
        return (
          <FlatList
            data={classes}
            renderItem={({ item }) => (
              <ContentItem
                item={item}
                type="class"
                onPress={() => {/* Navigate to class */}}
              />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'courses':
        return (
          <FlatList
            data={courses}
            renderItem={({ item }) => (
              <ContentItem
                item={item}
                type="course"
                onPress={() => {/* Navigate to course */}}
              />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'creators':
        return (
          <FlatList
            data={creators}
            renderItem={({ item }) => (
              <CreatorItem
                creator={item}
                onPress={() => {/* Navigate to creator */}}
              />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        );
      default:
        return renderAllContent();
    }
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'content', label: 'Content' },
    { key: 'classes', label: 'Classes' },
    { key: 'courses', label: 'Courses' },
    { key: 'creators', label: 'Creators' },
  ];

  const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const contentTypes = ['video', 'documentation', 'quiz', 'resource_file'];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h4" weight="bold">
          Explore Skills
        </Text>
        
        {/* Search Bar */}
        <Input
          placeholder="Search anything..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          leftIcon={<IconSymbol name="magnifyingglass" size={20} color={theme.colors.textSecondary} />}
        />
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories Filter */}
        <View style={styles.filtersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filtersRow}>
              <FilterChip
                label="All Categories"
                selected={!selectedCategory}
                onPress={() => setSelectedCategory(null)}
              />
              {Object.entries(SKILL_CATEGORIES).map(([key, category]) => (
                <FilterChip
                  key={key}
                  label={category.name.split(' ')[0]}
                  selected={selectedCategory === key}
                  onPress={() => setSelectedCategory(key as SkillCategory)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Tabs */}
        <View style={styles.tabsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tabsRow}>
              {tabs.map((tab) => (
                <FilterChip
                  key={tab.key}
                  label={tab.label}
                  selected={selectedTab === tab.key}
                  onPress={() => setSelectedTab(tab.key as any)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Additional Filters */}
        {selectedTab !== 'creators' && (
          <View style={styles.filtersSection}>
            <Text variant="body2" weight="medium" color="textSecondary" style={styles.filterLabel}>
              Skill Level
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filtersRow}>
                <FilterChip
                  label="All Levels"
                  selected={!selectedLevel}
                  onPress={() => setSelectedLevel(null)}
                />
                {skillLevels.map((level) => (
                  <FilterChip
                    key={level}
                    label={level.charAt(0).toUpperCase() + level.slice(1)}
                    selected={selectedLevel === level}
                    onPress={() => setSelectedLevel(level)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {selectedTab === 'content' && (
          <View style={styles.filtersSection}>
            <Text variant="body2" weight="medium" color="textSecondary" style={styles.filterLabel}>
              Content Type
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filtersRow}>
                <FilterChip
                  label="All Types"
                  selected={!selectedType}
                  onPress={() => setSelectedType(null)}
                />
                {contentTypes.map((type) => (
                  <FilterChip
                    key={type}
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                    selected={selectedType === type}
                    onPress={() => setSelectedType(type)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Content */}
        <View style={styles.contentSection}>
          {renderTabContent()}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
  },
  filtersSection: {
    paddingVertical: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  filterLabel: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tabsSection: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  contentSection: {
    padding: 16,
  },
  contentItem: {
    marginBottom: 16,
  },
  itemThumbnail: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    position: 'relative',
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemContent: {
    padding: 16,
  },
  itemDescription: {
    marginTop: 4,
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillLevel: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  creatorItem: {
    marginBottom: 16,
  },
  creatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  creatorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  creatorBio: {
    marginTop: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});
