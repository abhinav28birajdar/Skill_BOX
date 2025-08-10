import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

import { Button } from '@/components/ui/Button.fixed';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/context/AuthContext.enhanced';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

interface ContentItemProps {
  content: {
    id: string;
    title: string;
    type: 'video' | 'article' | 'course' | 'live_class' | 'resource';
    status: 'draft' | 'published' | 'under_review' | 'archived';
    thumbnail: string;
    duration?: string;
    views: number;
    likes: number;
    comments: number;
    earnings: number;
    createdAt: string;
    updatedAt: string;
    category: string;
  };
}

const ContentItem: React.FC<ContentItemProps> = ({ content }) => {
  const { theme } = useTheme();
  
  const getStatusColor = () => {
    switch (content.status) {
      case 'published':
        return '#10B981';
      case 'under_review':
        return '#F59E0B';
      case 'draft':
        return theme.colors.textSecondary;
      case 'archived':
        return '#6B7280';
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (content.status) {
      case 'published':
        return 'Live';
      case 'under_review':
        return 'Review';
      case 'draft':
        return 'Draft';
      case 'archived':
        return 'Archived';
      default:
        return content.status;
    }
  };

  const getTypeIcon = () => {
    switch (content.type) {
      case 'video':
        return 'play.rectangle.fill';
      case 'article':
        return 'doc.text.fill';
      case 'course':
        return 'book.closed.fill';
      case 'live_class':
        return 'video.circle.fill';
      case 'resource':
        return 'folder.fill';
      default:
        return 'doc.fill';
    }
  };

  const getTypeColor = () => {
    switch (content.type) {
      case 'video':
        return '#EF4444';
      case 'article':
        return '#3B82F6';
      case 'course':
        return theme.colors.primary;
      case 'live_class':
        return '#8B5CF6';
      case 'resource':
        return '#10B981';
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <TouchableCard
      variant="outlined"
      padding="md"
      onPress={() => Alert.alert('Content Details', `View details for: ${content.title}`)}
      style={styles.contentItem}
    >
      <View style={styles.contentHeader}>
        {/* Thumbnail/Icon */}
        <View style={[styles.contentThumbnail, { backgroundColor: `${getTypeColor()}20` }]}>
          <IconSymbol name={getTypeIcon()} size={24} color={getTypeColor()} />
          {content.duration && (
            <View style={[styles.durationBadge, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
              <Text variant="caption" color="white">
                {content.duration}
              </Text>
            </View>
          )}
        </View>

        {/* Content Info */}
        <View style={styles.contentInfo}>
          <View style={styles.contentTitleRow}>
            <Text variant="body1" weight="semibold" numberOfLines={2} style={styles.contentTitle}>
              {content.title}
            </Text>
            
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
              <Text variant="caption" style={{ color: getStatusColor() }}>
                {getStatusText()}
              </Text>
            </View>
          </View>

          <View style={styles.contentMeta}>
            <Text variant="caption" color="textSecondary">
              {content.type.replace('_', ' ')} • {content.category}
            </Text>
            <Text variant="caption" color="textSecondary">
              Updated {content.updatedAt}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.contentStats}>
            <View style={styles.statItem}>
              <IconSymbol name="eye.fill" size={14} color={theme.colors.textSecondary} />
              <Text variant="caption" color="textSecondary">
                {content.views.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <IconSymbol name="heart.fill" size={14} color={theme.colors.textSecondary} />
              <Text variant="caption" color="textSecondary">
                {content.likes}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <IconSymbol name="bubble.left.fill" size={14} color={theme.colors.textSecondary} />
              <Text variant="caption" color="textSecondary">
                {content.comments}
              </Text>
            </View>
            
            {content.earnings > 0 && (
              <View style={styles.statItem}>
                <IconSymbol name="dollarsign.circle.fill" size={14} color="#10B981" />
                <Text variant="caption" style={{ color: '#10B981' }}>
                  ${content.earnings.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.contentActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.backgroundSecondary }]}
            onPress={() => Alert.alert('Edit Content', `Edit content: ${content.title}`)}
          >
            <IconSymbol name="pencil" size={16} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.backgroundSecondary }]}
            onPress={() => Alert.alert('Analytics', `View analytics for: ${content.title}`)}
          >
            <IconSymbol name="chart.bar.fill" size={16} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableCard>
  );
};

interface QuickActionProps {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, subtitle, icon, color, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableCard
      variant="outlined"
      padding="md"
      onPress={onPress}
      style={styles.quickAction}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>
        <IconSymbol name={icon} size={28} color={color} />
      </View>
      
      <Text variant="body2" weight="semibold" style={styles.quickActionTitle}>
        {title}
      </Text>
      
      <Text variant="caption" color="textSecondary" numberOfLines={2}>
        {subtitle}
      </Text>
    </TouchableCard>
  );
};

export default function CreatorContentScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'video' | 'course' | 'article' | 'live_class'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft' | 'under_review'>('all');

  // Mock data - in real app, this would come from API
  const [content] = useState([
    {
      id: '1',
      title: 'Advanced React Hooks Tutorial',
      type: 'video' as const,
      status: 'published' as const,
      thumbnail: '',
      duration: '45:32',
      views: 1234,
      likes: 89,
      comments: 23,
      earnings: 156.75,
      createdAt: '2024-01-15',
      updatedAt: '2 days ago',
      category: 'Technology',
    },
    {
      id: '2',
      title: 'Complete React Development Course',
      type: 'course' as const,
      status: 'published' as const,
      thumbnail: '',
      views: 2456,
      likes: 234,
      comments: 67,
      earnings: 1247.50,
      createdAt: '2024-01-10',
      updatedAt: '1 week ago',
      category: 'Technology',
    },
    {
      id: '3',
      title: 'Understanding React Context API',
      type: 'article' as const,
      status: 'published' as const,
      thumbnail: '',
      views: 567,
      likes: 45,
      comments: 12,
      earnings: 23.40,
      createdAt: '2024-01-20',
      updatedAt: '3 days ago',
      category: 'Technology',
    },
    {
      id: '4',
      title: 'Live React Q&A Session',
      type: 'live_class' as const,
      status: 'draft' as const,
      thumbnail: '',
      views: 0,
      likes: 0,
      comments: 0,
      earnings: 0,
      createdAt: '2024-01-22',
      updatedAt: '1 hour ago',
      category: 'Technology',
    },
    {
      id: '5',
      title: 'React Project Starter Kit',
      type: 'resource' as const,
      status: 'under_review' as const,
      thumbnail: '',
      views: 123,
      likes: 15,
      comments: 3,
      earnings: 12.50,
      createdAt: '2024-01-18',
      updatedAt: '5 days ago',
      category: 'Technology',
    },
  ]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const filteredContent = content.filter(item => {
    const matchesType = selectedFilter === 'all' || item.type === selectedFilter;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const typeFilters = [
    { key: 'all', label: 'All Content', count: content.length },
    { key: 'video', label: 'Videos', count: content.filter(c => c.type === 'video').length },
    { key: 'course', label: 'Courses', count: content.filter(c => c.type === 'course').length },
    { key: 'article', label: 'Articles', count: content.filter(c => c.type === 'article').length },
    { key: 'live_class', label: 'Live Classes', count: content.filter(c => c.type === 'live_class').length },
  ] as const;

  const statusFilters = [
    { key: 'all', label: 'All Status' },
    { key: 'published', label: 'Published' },
    { key: 'draft', label: 'Drafts' },
    { key: 'under_review', label: 'Under Review' },
  ] as const;

  const quickActions = [
    {
      title: 'Upload Video',
      subtitle: 'Share tutorial or lesson video',
      icon: 'video.badge.plus',
      color: '#EF4444',
      onPress: () => Alert.alert('Upload Video', 'Video upload feature coming soon!'),
    },
    {
      title: 'Write Article',
      subtitle: 'Create educational blog post',
      icon: 'doc.badge.plus',
      color: '#3B82F6',
      onPress: () => Alert.alert('Write Article', 'Article creation feature coming soon!'),
    },
    {
      title: 'Build Course',
      subtitle: 'Create comprehensive course',
      icon: 'book.closed.badge.plus',
      color: theme.colors.primary,
      onPress: () => Alert.alert('Build Course', 'Course creation feature coming soon!'),
    },
    {
      title: 'Schedule Live Class',
      subtitle: 'Host interactive session',
      icon: 'calendar.badge.plus',
      color: '#8B5CF6',
      onPress: () => Alert.alert('Schedule Live Class', 'Live class scheduling feature coming soon!'),
    },
  ];

  const totalViews = content.reduce((sum, item) => sum + item.views, 0);
  const totalEarnings = content.reduce((sum, item) => sum + item.earnings, 0);
  const publishedCount = content.filter(c => c.status === 'published').length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="h4" weight="bold">
            Content Library
          </Text>
          <Text variant="body2" color="textSecondary">
            Manage all your educational content
          </Text>
        </View>
      </View>

      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <Card variant="outlined" padding="md" style={styles.statCard}>
          <Text variant="h5" weight="bold">
            {content.length}
          </Text>
          <Text variant="caption" color="textSecondary">
            Total Content
          </Text>
        </Card>
        
        <Card variant="outlined" padding="md" style={styles.statCard}>
          <Text variant="h5" weight="bold">
            {publishedCount}
          </Text>
          <Text variant="caption" color="textSecondary">
            Published
          </Text>
        </Card>
        
        <Card variant="outlined" padding="md" style={styles.statCard}>
          <Text variant="h5" weight="bold">
            {totalViews.toLocaleString()}
          </Text>
          <Text variant="caption" color="textSecondary">
            Total Views
          </Text>
        </Card>
        
        <Card variant="outlined" padding="md" style={styles.statCard}>
          <Text variant="h5" weight="bold">
            ${totalEarnings.toFixed(0)}
          </Text>
          <Text variant="caption" color="textSecondary">
            Earnings
          </Text>
        </Card>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
          Create New Content
        </Text>
        
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              title={action.title}
              subtitle={action.subtitle}
              icon={action.icon}
              color={action.color}
              onPress={action.onPress}
            />
          ))}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <Text variant="body1" weight="semibold" style={styles.filterLabel}>
          Content Type
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            {typeFilters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: selectedFilter === filter.key 
                      ? theme.colors.primary 
                      : theme.colors.backgroundSecondary,
                  },
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text
                  variant="caption"
                  weight="medium"
                  style={{
                    color: selectedFilter === filter.key 
                      ? 'white' 
                      : theme.colors.textPrimary,
                  }}
                >
                  {filter.label} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        
        <Text variant="body1" weight="semibold" style={styles.filterLabel}>
          Status
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            {statusFilters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: selectedStatus === filter.key 
                      ? theme.colors.primary 
                      : theme.colors.backgroundSecondary,
                  },
                ]}
                onPress={() => setSelectedStatus(filter.key)}
              >
                <Text
                  variant="caption"
                  weight="medium"
                  style={{
                    color: selectedStatus === filter.key 
                      ? 'white' 
                      : theme.colors.textPrimary,
                  }}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Content List */}
      <View style={styles.contentContainer}>
        {filteredContent.length > 0 ? (
          filteredContent.map((contentItem) => (
            <ContentItem key={contentItem.id} content={contentItem} />
          ))
        ) : (
          <Card variant="outlined" padding="xl" style={styles.emptyState}>
            <View style={styles.emptyStateContent}>
              <View style={[styles.emptyStateIcon, { backgroundColor: theme.colors.backgroundSecondary }]}>
                <IconSymbol name="folder" size={48} color={theme.colors.textSecondary} />
              </View>
              
              <Text variant="h6" weight="semibold" style={styles.emptyStateTitle}>
                No content found
              </Text>
              
              <Text variant="body2" color="textSecondary" style={styles.emptyStateDescription}>
                {selectedFilter === 'all' && selectedStatus === 'all'
                  ? "You haven't created any content yet. Start by uploading your first video or writing an article!"
                  : `No ${selectedFilter !== 'all' ? selectedFilter : ''} ${selectedStatus !== 'all' ? selectedStatus : ''} content found. Try adjusting your filters.`
                }
              </Text>
              
              {selectedFilter === 'all' && selectedStatus === 'all' && (
                <View style={styles.emptyStateActions}>
                  <Button
                    variant="primary"
                    size="lg"
                    onPress={() => Alert.alert('Upload Video', 'Video upload feature coming soon!')}
                    style={styles.emptyStateButton}
                  >
                    Upload First Video
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onPress={() => Alert.alert('Write Article', 'Article creation feature coming soon!')}
                    style={styles.emptyStateButton}
                  >
                    Write Article
                  </Button>
                </View>
              )}
            </View>
          </Card>
        )}
      </View>

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
    paddingTop: 60,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    width: (width - 44) / 2,
    alignItems: 'center',
    minHeight: 120,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
  filtersSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterLabel: {
    marginBottom: 8,
    marginTop: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  contentItem: {
    marginBottom: 4,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contentThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  contentTitle: {
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  contentMeta: {
    marginBottom: 8,
  },
  contentStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contentActions: {
    flexDirection: 'column',
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyStateContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateDescription: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyStateActions: {
    gap: 12,
    width: '100%',
  },
  emptyStateButton: {
    minWidth: 180,
  },
  bottomSpacing: {
    height: 100,
  },
});
