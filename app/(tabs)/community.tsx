import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import { Button } from '@/components/ui/Button.fixed';
import { Card, TouchableCard } from '@/components/ui/Card.enhanced';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Text } from '@/components/ui/Text.enhanced';
import { useAuth } from '@/context/AuthContext.enhanced';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

interface ForumPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: {
      name: string;
      avatar: string;
      role: string;
    };
    category: string;
    replies: number;
    likes: number;
    isLiked: boolean;
    createdAt: string;
    lastReply: string;
    tags: string[];
  };
}

const ForumPost: React.FC<ForumPostProps> = ({ post }) => {
  const { theme } = useTheme();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  
  const getCategoryColor = (category: string) => {
    const colors = {
      'General': theme.colors.primary,
      'Technology': '#3B82F6',
      'Business': '#10B981',
      'Creative': '#8B5CF6',
      'Support': '#F59E0B',
    };
    return colors[category as keyof typeof colors] || theme.colors.textSecondary;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Creator':
      case 'Verified Creator':
        return theme.colors.secondary;
      case 'Moderator':
        return '#10B981';
      case 'Admin':
        return '#EF4444';
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <TouchableCard
      variant="outlined"
      padding="md"
      onPress={() => Alert.alert('Post Details', `View post: ${post.title}`)}
      style={styles.forumPost}
    >
      {/* Category Badge */}
      <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(post.category)}20` }]}>
        <Text variant="caption" style={{ color: getCategoryColor(post.category) }}>
          {post.category}
        </Text>
      </View>

      {/* Post Content */}
      <Text variant="body1" weight="semibold" numberOfLines={2} style={styles.postTitle}>
        {post.title}
      </Text>
      
      <Text variant="body2" color="textSecondary" numberOfLines={3} style={styles.postContent}>
        {post.content}
      </Text>

      {/* Tags */}
      {post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: theme.colors.backgroundSecondary }]}>
              <Text variant="caption" color="textSecondary">
                #{tag}
              </Text>
            </View>
          ))}
          {post.tags.length > 3 && (
            <Text variant="caption" color="textSecondary">
              +{post.tags.length - 3}
            </Text>
          )}
        </View>
      )}

      {/* Author Info */}
      <View style={styles.postFooter}>
        <View style={styles.authorInfo}>
          <View style={[styles.authorAvatar, { backgroundColor: theme.colors.primary }]}>
            <Text variant="caption" color="white" weight="bold">
              {post.author.name.charAt(0)}
            </Text>
          </View>
          
          <View>
            <Text variant="caption" weight="medium">
              {post.author.name}
            </Text>
            <Text variant="caption" style={{ color: getRoleColor(post.author.role) }}>
              {post.author.role}
            </Text>
          </View>
        </View>

        <View style={styles.postStats}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => setIsLiked(!isLiked)}
          >
            <IconSymbol 
              name={isLiked ? 'heart.fill' : 'heart'} 
              size={16} 
              color={isLiked ? '#EF4444' : theme.colors.textSecondary} 
            />
            <Text variant="caption" color="textSecondary">
              {post.likes + (isLiked ? 1 : 0)}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.statItem}>
            <IconSymbol name="bubble.left" size={16} color={theme.colors.textSecondary} />
            <Text variant="caption" color="textSecondary">
              {post.replies}
            </Text>
          </View>
          
          <Text variant="caption" color="textSecondary">
            {post.createdAt}
          </Text>
        </View>
      </View>
    </TouchableCard>
  );
};

interface StudyGroupProps {
  group: {
    id: string;
    name: string;
    description: string;
    members: number;
    maxMembers: number;
    category: string;
    level: string;
    nextSession: string;
    isJoined: boolean;
    tags: string[];
  };
}

const StudyGroupCard: React.FC<StudyGroupProps> = ({ group }) => {
  const { theme } = useTheme();
  const [isJoined, setIsJoined] = useState(group.isJoined);
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return '#10B981';
      case 'Intermediate':
        return '#F59E0B';
      case 'Advanced':
        return '#EF4444';
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <Card variant="outlined" padding="md" style={styles.studyGroupCard}>
      <View style={styles.studyGroupHeader}>
        <View style={styles.studyGroupInfo}>
          <Text variant="body1" weight="semibold" numberOfLines={1}>
            {group.name}
          </Text>
          
          <View style={styles.studyGroupMeta}>
            <View style={[styles.levelBadge, { backgroundColor: `${getLevelColor(group.level)}20` }]}>
              <Text variant="caption" style={{ color: getLevelColor(group.level) }}>
                {group.level}
              </Text>
            </View>
            
            <Text variant="caption" color="textSecondary">
              {group.category}
            </Text>
          </View>
        </View>
        
        <Button
          variant={isJoined ? "outline" : "primary"}
          size="sm"
          onPress={() => setIsJoined(!isJoined)}
        >
          {isJoined ? 'Joined' : 'Join'}
        </Button>
      </View>

      <Text variant="body2" color="textSecondary" numberOfLines={2} style={styles.studyGroupDescription}>
        {group.description}
      </Text>

      <View style={styles.studyGroupFooter}>
        <View style={styles.studyGroupStats}>
          <View style={styles.statItem}>
            <IconSymbol name="person.2.fill" size={14} color={theme.colors.textSecondary} />
            <Text variant="caption" color="textSecondary">
              {group.members}/{group.maxMembers} members
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <IconSymbol name="calendar" size={14} color={theme.colors.textSecondary} />
            <Text variant="caption" color="textSecondary">
              Next: {group.nextSession}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

interface QuickActionProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, icon, color, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableCard
      variant="outlined"
      padding="md"
      onPress={onPress}
      style={styles.quickAction}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>
        <IconSymbol name={icon} size={24} color={color} />
      </View>
      
      <Text variant="caption" weight="medium" numberOfLines={2} style={styles.quickActionTitle}>
        {title}
      </Text>
    </TouchableCard>
  );
};

export default function CommunityScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'discussions' | 'study-groups' | 'events'>('discussions');

  // Mock data - in real app, this would come from API
  const [forumPosts] = useState([
    {
      id: '1',
      title: 'Best practices for React Hooks?',
      content: 'I\'m working on a complex React project and wondering about the best practices for using hooks effectively. Any tips or resources you\'d recommend?',
      author: {
        name: 'Alex Johnson',
        avatar: '',
        role: 'Learner',
      },
      category: 'Technology',
      replies: 12,
      likes: 24,
      isLiked: false,
      createdAt: '2 hours ago',
      lastReply: '30 min ago',
      tags: ['react', 'hooks', 'javascript', 'frontend'],
    },
    {
      id: '2',
      title: 'How to price online courses effectively?',
      content: 'As a new creator, I\'m struggling with pricing my first course. What factors should I consider? Should I start low and increase later?',
      author: {
        name: 'Sarah Chen',
        avatar: '',
        role: 'Creator',
      },
      category: 'Business',
      replies: 8,
      likes: 15,
      isLiked: true,
      createdAt: '5 hours ago',
      lastReply: '1 hour ago',
      tags: ['pricing', 'creator', 'business', 'strategy'],
    },
    {
      id: '3',
      title: 'UI/UX Portfolio Review - Feedback Welcome!',
      content: 'Just finished updating my portfolio and would love some feedback from the community. Looking for honest critiques and suggestions for improvement.',
      author: {
        name: 'Mike Rodriguez',
        avatar: '',
        role: 'Verified Creator',
      },
      category: 'Creative',
      replies: 18,
      likes: 42,
      isLiked: false,
      createdAt: '1 day ago',
      lastReply: '3 hours ago',
      tags: ['portfolio', 'feedback', 'ui', 'ux', 'design'],
    },
  ]);

  const [studyGroups] = useState([
    {
      id: '1',
      name: 'React Mastery Circle',
      description: 'Weekly discussions and coding sessions focused on advanced React patterns and best practices.',
      members: 24,
      maxMembers: 30,
      category: 'Technology',
      level: 'Advanced',
      nextSession: 'Today 7 PM',
      isJoined: true,
      tags: ['react', 'javascript', 'frontend'],
    },
    {
      id: '2',
      name: 'Design Thinking Workshop',
      description: 'Collaborative sessions to learn and practice design thinking methodology for product development.',
      members: 18,
      maxMembers: 25,
      category: 'Creative',
      level: 'Intermediate',
      nextSession: 'Tomorrow 6 PM',
      isJoined: false,
      tags: ['design', 'workshop', 'product'],
    },
    {
      id: '3',
      name: 'Digital Marketing Strategies',
      description: 'Share insights and learn from each other about effective digital marketing techniques and tools.',
      members: 32,
      maxMembers: 40,
      category: 'Business',
      level: 'Beginner',
      nextSession: 'Friday 8 PM',
      isJoined: false,
      tags: ['marketing', 'digital', 'business'],
    },
  ]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const quickActions = [
    {
      title: 'Start Discussion',
      icon: 'plus.bubble',
      color: theme.colors.primary,
      onPress: () => Alert.alert('Start Discussion', 'Discussion creation feature coming soon!'),
    },
    {
      title: 'Create Study Group',
      icon: 'person.2.badge.plus',
      color: theme.colors.secondary,
      onPress: () => Alert.alert('Create Study Group', 'Study group creation feature coming soon!'),
    },
    {
      title: 'Find Mentors',
      icon: 'person.badge.plus',
      color: '#8B5CF6',
      onPress: () => Alert.alert('Find Mentors', 'Mentor finding feature coming soon!'),
    },
    {
      title: 'Live Events',
      icon: 'calendar.badge.plus',
      color: '#10B981',
      onPress: () => Alert.alert('Live Events', 'Live events feature coming soon!'),
    },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'study-groups':
        return (
          <View style={styles.tabContent}>
            {studyGroups.map((group) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </View>
        );
      case 'events':
        return (
          <View style={styles.tabContent}>
            <Card variant="outlined" padding="xl" style={styles.emptyState}>
              <View style={styles.emptyStateContent}>
                <View style={[styles.emptyStateIcon, { backgroundColor: theme.colors.backgroundSecondary }]}>
                  <IconSymbol name="calendar" size={48} color={theme.colors.textSecondary} />
                </View>
                
                <Text variant="h6" weight="semibold" style={styles.emptyStateTitle}>
                  No upcoming events
                </Text>
                
                <Text variant="body2" color="textSecondary" style={styles.emptyStateDescription}>
                  Community events will appear here. Check back soon for workshops, webinars, and networking sessions.
                </Text>
              </View>
            </Card>
          </View>
        );
      default:
        return (
          <View style={styles.tabContent}>
            {forumPosts.map((post) => (
              <ForumPost key={post.id} post={post} />
            ))}
          </View>
        );
    }
  };

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
            Community
          </Text>
          <Text variant="body2" color="textSecondary">
            Connect, learn, and grow together
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => router.push('/notifications')}
          style={[styles.notificationButton, { backgroundColor: theme.colors.backgroundSecondary }]}
        >
          <IconSymbol name="bell" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              title={action.title}
              icon={action.icon}
              color={action.color}
              onPress={action.onPress}
            />
          ))}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.section}>
        <View style={styles.tabsContainer}>
          {[
            { key: 'discussions', label: 'Discussions', count: forumPosts.length },
            { key: 'study-groups', label: 'Study Groups', count: studyGroups.length },
            { key: 'events', label: 'Events', count: 0 },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                {
                  backgroundColor: selectedTab === tab.key 
                    ? theme.colors.primary 
                    : theme.colors.backgroundSecondary,
                },
              ]}
              onPress={() => setSelectedTab(tab.key as any)}
            >
              <Text
                variant="caption"
                weight="medium"
                style={{
                  color: selectedTab === tab.key 
                    ? 'white' 
                    : theme.colors.textPrimary,
                }}
              >
                {tab.label} ({tab.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </View>

      {/* Popular Topics */}
      <View style={styles.section}>
        <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
          Popular Topics
        </Text>
        
        <View style={styles.topicsContainer}>
          {['#react', '#webdev', '#ui-design', '#business', '#python', '#mobile'].map((topic, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.topicTag, { backgroundColor: theme.colors.backgroundSecondary }]}
              onPress={() => Alert.alert('Topic Discussion', `View ${topic} discussions coming soon!`)}
            >
              <Text variant="caption" color="primary" weight="medium">
                {topic}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Community Guidelines */}
      <View style={styles.section}>
        <Card variant="outlined" padding="lg" style={styles.guidelinesCard}>
          <View style={styles.guidelinesHeader}>
            <IconSymbol name="info.circle.fill" size={24} color={theme.colors.primary} />
            <Text variant="body1" weight="semibold">
              Community Guidelines
            </Text>
          </View>
          
          <Text variant="body2" color="textSecondary" style={styles.guidelinesText}>
            Help us maintain a positive learning environment by being respectful, 
            helpful, and constructive in all interactions.
          </Text>
          
          <Button
            variant="outline"
            size="sm"
            onPress={() => Alert.alert('Community Guidelines', 'Guidelines page coming soon!')}
            style={styles.guidelinesButton}
          >
            Read Full Guidelines
          </Button>
        </Card>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
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
    width: (width - 44) / 4,
    alignItems: 'center',
    minHeight: 80,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  tabContent: {
    gap: 12,
  },
  forumPost: {
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  postTitle: {
    marginBottom: 8,
  },
  postContent: {
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  studyGroupCard: {
    marginBottom: 12,
  },
  studyGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  studyGroupInfo: {
    flex: 1,
    marginRight: 12,
  },
  studyGroupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  studyGroupDescription: {
    marginBottom: 12,
    lineHeight: 18,
  },
  studyGroupFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  studyGroupStats: {
    flexDirection: 'row',
    gap: 16,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  guidelinesCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  guidelinesText: {
    marginBottom: 16,
    lineHeight: 20,
  },
  guidelinesButton: {
    alignSelf: 'flex-start',
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyStateContent: {
    alignItems: 'center',
    maxWidth: 280,
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
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
});
