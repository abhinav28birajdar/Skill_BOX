import { router } from 'expo-router';
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
import { Card, TouchableCard } from '@/components/ui/Card.enhanced';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Input } from '@/components/ui/Input.enhanced';
import { Text } from '@/components/ui/Text.enhanced';
import { useAuth } from '@/context/AuthContext.enhanced';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { CreatorProfile, LearningContent, SKILL_CATEGORIES, SkillCategory } from '@/types/database.enhanced';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 cards per row with margins

interface SkillCategoryCardProps {
  category: keyof typeof SKILL_CATEGORIES;
  data: typeof SKILL_CATEGORIES[keyof typeof SKILL_CATEGORIES];
  onPress: () => void;
}

const SkillCategoryCard: React.FC<SkillCategoryCardProps> = ({ category, data, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableCard
      variant="elevated"
      padding="md"
      style={[styles.categoryCard, { width: CARD_WIDTH }]}
      onPress={onPress}
    >
      <View style={styles.categoryIcon}>
        <Text variant="h2">{data.icon}</Text>
      </View>
      <Text 
        variant="h6" 
        weight="semibold" 
        align="center"
        style={[styles.categoryTitle, { color: data.color }]}
      >
        {data.name}
      </Text>
      <Text variant="caption" color="textSecondary" align="center">
        {data.skills.length} Skills
      </Text>
    </TouchableCard>
  );
};

interface FeaturedContentCardProps {
  content: LearningContent & { creator?: CreatorProfile };
  onPress: () => void;
}

const FeaturedContentCard: React.FC<FeaturedContentCardProps> = ({ content, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableCard
      variant="elevated"
      padding="none"
      style={styles.contentCard}
      onPress={onPress}
    >
      <View style={[styles.contentThumbnail, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <IconSymbol 
          name={content.content_type === 'video' ? 'play.circle.fill' : 'doc.circle.fill'} 
          size={40} 
          color={theme.colors.primary} 
        />
      </View>
      <View style={styles.contentInfo}>
        <Text variant="body1" weight="semibold" numberOfLines={2}>
          {content.title}
        </Text>
        <Text variant="caption" color="textSecondary" numberOfLines={1}>
          By {content.creator?.full_name || 'SkillBox'}
        </Text>
        <View style={styles.contentMeta}>
          <View style={styles.rating}>
            <IconSymbol name="star.fill" size={12} color={theme.colors.star} />
            <Text variant="caption" color="textSecondary">
              {content.average_rating?.toFixed(1) || 'New'}
            </Text>
          </View>
          <Text variant="caption" color="primary" weight="semibold">
            {content.is_free ? 'FREE' : `$${content.price}`}
          </Text>
        </View>
      </View>
    </TouchableCard>
  );
};

interface FeaturedCreatorCardProps {
  creator: CreatorProfile;
  onPress: () => void;
}

const FeaturedCreatorCard: React.FC<FeaturedCreatorCardProps> = ({ creator, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableCard
      variant="outlined"
      padding="md"
      style={styles.creatorCard}
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
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {creator.student_count || 0} students
          </Text>
        </View>
      </View>
      <Text variant="body2" color="textSecondary" numberOfLines={2} style={styles.creatorBio}>
        {creator.bio || 'Passionate educator sharing knowledge'}
      </Text>
      <View style={styles.creatorStats}>
        <View style={styles.stat}>
          <IconSymbol name="star.fill" size={16} color={theme.colors.star} />
          <Text variant="caption" color="textSecondary">
            {creator.average_rating?.toFixed(1) || 'New'}
          </Text>
        </View>
        <View style={styles.stat}>
          <IconSymbol name="video.fill" size={16} color={theme.colors.primary} />
          <Text variant="caption" color="textSecondary">
            {creator.content_count || 0} courses
          </Text>
        </View>
      </View>
    </TouchableCard>
  );
};

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user, isCreator, isLearner } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredContent, setFeaturedContent] = useState<(LearningContent & { creator?: CreatorProfile })[]>([]);
  const [featuredCreators, setFeaturedCreators] = useState<CreatorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedData();
  }, []);

  const loadFeaturedData = async () => {
    try {
      setLoading(true);
      
      // Load featured content
      const { data: contentData, error: contentError } = await supabase
        .from('learning_content')
        .select(`
          *,
          creator:creator_id(*)
        `)
        .eq('status', 'approved')
        .eq('is_curated_by_skillbox', true)
        .order('featured_at', { ascending: false, nullsFirst: false })
        .limit(6);

      if (contentError) {
        console.error('Error loading featured content:', contentError);
      } else {
        setFeaturedContent(contentData || []);
      }

      // Load featured creators
      const { data: creatorsData, error: creatorsError } = await supabase
        .from('users')
        .select('*')
        .in('role', ['creator', 'teacher_approved'])
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('average_rating', { ascending: false, nullsFirst: false })
        .limit(4);

      if (creatorsError) {
        console.error('Error loading featured creators:', creatorsError);
      } else {
        setFeaturedCreators(creatorsData || []);
      }
    } catch (error) {
      console.error('Error loading featured data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeaturedData();
    setRefreshing(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/explore',
        params: { search: searchQuery.trim() }
      });
    }
  };

  const handleCategoryPress = (category: SkillCategory) => {
    router.push({
      pathname: '/explore',
      params: { category }
    });
  };

  const handleContentPress = (content: LearningContent) => {
    router.push(`/content/${content.id}`);
  };

  const handleCreatorPress = (creator: CreatorProfile) => {
    router.push(`/creator/${creator.id}`);
  };

  const handleRoleSwitchPress = () => {
    if (isLearner) {
      router.push('/(creator)/apply');
    } else {
      router.push('/creator');
    }
  };

  const renderCategoryItem = ({ item }: { item: [SkillCategory, typeof SKILL_CATEGORIES[SkillCategory]] }) => {
    const [category, data] = item;
    return (
      <SkillCategoryCard
        category={category}
        data={data}
        onPress={() => handleCategoryPress(category)}
      />
    );
  };

  const categoryData = Object.entries(SKILL_CATEGORIES) as [SkillCategory, typeof SKILL_CATEGORIES[SkillCategory]][];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Text variant="h3" weight="bold" color="text">
            Welcome to SkillBox
          </Text>
          <Text variant="body1" color="textSecondary">
            {user?.full_name ? `Hi ${user.full_name.split(' ')[0]}! ` : ''}
            {isCreator ? 'Ready to share your expertise?' : 'Ready to learn something new?'}
          </Text>
        </View>

        {/* Search Bar */}
        <Input
          placeholder="Search skills, courses, creators..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          leftIcon={<IconSymbol name="magnifyingglass" size={20} color={theme.colors.textSecondary} />}
          rightIcon={
            <Button
              variant="ghost"
              size="sm"
              onPress={handleSearch}
              style={{ minHeight: 'auto', paddingVertical: 4 }}
            >
              <Text variant="caption" weight="semibold">Search</Text>
            </Button>
          }
        />

        {/* Role Switch CTA */}
        {isLearner && (
          <Card variant="filled" padding="md" style={styles.ctaCard}>
            <View style={styles.ctaContent}>
              <View style={styles.ctaText}>
                <Text variant="h6" weight="semibold">
                  Share Your Knowledge
                </Text>
                <Text variant="body2" color="textSecondary">
                  Become a creator and start earning by teaching others
                </Text>
              </View>
              <Button variant="primary" size="sm" onPress={handleRoleSwitchPress}>
                Become Creator
              </Button>
            </View>
          </Card>
        )}
      </View>

      {/* Skill Categories */}
      <View style={styles.section}>
        <Text variant="h5" weight="semibold" style={styles.sectionTitle}>
          Explore Skills
        </Text>
        <FlatList
          data={categoryData}
          renderItem={renderCategoryItem}
          keyExtractor={([category]) => category}
          numColumns={2}
          columnWrapperStyle={styles.categoryRow}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Featured Content */}
      {featuredContent.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h5" weight="semibold">
              Featured Content
            </Text>
            <Button variant="ghost" size="sm" onPress={() => router.push('/explore')}>
              View All
            </Button>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalList}>
              {featuredContent.map((content, index) => (
                <FeaturedContentCard
                  key={content.id}
                  content={content}
                  onPress={() => handleContentPress(content)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Featured Creators */}
      {featuredCreators.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h5" weight="semibold">
              Top Creators
            </Text>
            <Button variant="ghost" size="sm" onPress={() => router.push('/explore?tab=creators')}>
              View All
            </Button>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalList}>
              {featuredCreators.map((creator, index) => (
                <FeaturedCreatorCard
                  key={creator.id}
                  creator={creator}
                  onPress={() => handleCreatorPress(creator)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60, // Account for status bar
  },
  welcomeSection: {
    marginBottom: 24,
  },
  ctaCard: {
    marginTop: 16,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaText: {
    flex: 1,
    marginRight: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryTitle: {
    marginBottom: 4,
  },
  horizontalList: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  contentCard: {
    width: 280,
    marginRight: 16,
  },
  contentThumbnail: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  contentInfo: {
    padding: 16,
  },
  contentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  creatorCard: {
    width: 240,
    marginRight: 16,
  },
  creatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  creatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorBio: {
    marginBottom: 12,
  },
  creatorStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bottomSpacing: {
    height: 100, // Extra space for tab bar
  },
});
