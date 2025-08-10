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

interface LiveClassProps {
  liveClass: {
    id: string;
    title: string;
    description: string;
    scheduledAt: string;
    duration: number;
    status: 'scheduled' | 'live' | 'completed' | 'cancelled';
    maxParticipants: number;
    currentParticipants: number;
    category: string;
    price: number;
    isRecorded: boolean;
    meetingLink?: string;
    createdAt: string;
    tags: string[];
  };
}

const LiveClassCard: React.FC<LiveClassProps> = ({ liveClass }) => {
  const { theme } = useTheme();
  
  const getStatusColor = () => {
    switch (liveClass.status) {
      case 'live':
        return '#EF4444';
      case 'scheduled':
        return theme.colors.primary;
      case 'completed':
        return '#10B981';
      case 'cancelled':
        return '#6B7280';
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (liveClass.status) {
      case 'live':
        return '🔴 LIVE NOW';
      case 'scheduled':
        return '📅 Scheduled';
      case 'completed':
        return '✅ Completed';
      case 'cancelled':
        return '❌ Cancelled';
      default:
        return liveClass.status;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true
      }),
    };
  };

  const { date, time } = formatDateTime(liveClass.scheduledAt);

  const getActionButton = () => {
    switch (liveClass.status) {
      case 'live':
        return (
          <Button
            variant="danger"
            size="sm"
            onPress={() => Alert.alert('Join Live', `Join live class: ${liveClass.title}`)}
          >
            Join Live
          </Button>
        );
      case 'scheduled':
        return (
          <Button
            variant="primary"
            size="sm"
            onPress={() => Alert.alert('Start Class', `Start class: ${liveClass.title}`)}
          >
            Start Class
          </Button>
        );
      case 'completed':
        return (
          <Button
            variant="outline"
            size="sm"
            onPress={() => Alert.alert('View Recording', `View recording for: ${liveClass.title}`)}
          >
            View Recording
          </Button>
        );
      default:
        return (
          <Button
            variant="ghost"
            size="sm"
            onPress={() => Alert.alert('Edit Class', `Edit class: ${liveClass.title}`)}
          >
            Edit
          </Button>
        );
    }
  };

  return (
    <TouchableCard
      variant="outlined"
      padding="lg"
      onPress={() => Alert.alert('Class Details', `View details for: ${liveClass.title}`)}
      style={styles.classCard}
    >
      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
        <Text variant="caption" weight="medium" style={{ color: getStatusColor() }}>
          {getStatusText()}
        </Text>
      </View>

      {/* Class Info */}
      <View style={styles.classHeader}>
        <Text variant="h6" weight="semibold" numberOfLines={2}>
          {liveClass.title}
        </Text>
        
        <Text variant="body2" color="textSecondary" numberOfLines={3} style={styles.classDescription}>
          {liveClass.description}
        </Text>
      </View>

      {/* Schedule Info */}
      <View style={styles.scheduleInfo}>
        <View style={styles.scheduleItem}>
          <IconSymbol name="calendar" size={16} color={theme.colors.textSecondary} />
          <Text variant="body2" color="textSecondary">
            {date} at {time}
          </Text>
        </View>
        
        <View style={styles.scheduleItem}>
          <IconSymbol name="clock" size={16} color={theme.colors.textSecondary} />
          <Text variant="body2" color="textSecondary">
            {liveClass.duration} minutes
          </Text>
        </View>
      </View>

      {/* Participants & Price */}
      <View style={styles.classStats}>
        <View style={styles.statGroup}>
          <View style={styles.statItem}>
            <IconSymbol name="person.2.fill" size={16} color={theme.colors.textSecondary} />
            <Text variant="caption" color="textSecondary">
              {liveClass.currentParticipants}/{liveClass.maxParticipants} participants
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <IconSymbol name="dollarsign.circle" size={16} color="#10B981" />
            <Text variant="caption" style={{ color: '#10B981' }}>
              ${liveClass.price}
            </Text>
          </View>
          
          {liveClass.isRecorded && (
            <View style={styles.statItem}>
              <IconSymbol name="record.circle" size={16} color="#EF4444" />
              <Text variant="caption" color="textSecondary">
                Recording
              </Text>
            </View>
          )}
        </View>

        {getActionButton()}
      </View>

      {/* Category & Tags */}
      <View style={styles.classFooter}>
        <View style={[styles.categoryBadge, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text variant="caption" color="primary" weight="medium">
            {liveClass.category}
          </Text>
        </View>
        
        {liveClass.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {liveClass.tags.slice(0, 2).map((tag, index) => (
              <Text key={index} variant="caption" color="textSecondary">
                #{tag}
              </Text>
            ))}
            {liveClass.tags.length > 2 && (
              <Text variant="caption" color="textSecondary">
                +{liveClass.tags.length - 2}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableCard>
  );
};

interface QuickStatsProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const QuickStats: React.FC<QuickStatsProps> = ({ title, value, icon, color }) => {
  return (
    <Card variant="outlined" padding="md" style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <IconSymbol name={icon} size={20} color={color} />
      </View>
      
      <Text variant="h5" weight="bold">
        {value}
      </Text>
      
      <Text variant="caption" color="textSecondary">
        {title}
      </Text>
    </Card>
  );
};

export default function CreatorClassesScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'scheduled' | 'live' | 'completed'>('all');

  // Mock data - in real app, this would come from API
  const [liveClasses] = useState([
    {
      id: '1',
      title: 'React Advanced Patterns Workshop',
      description: 'Deep dive into advanced React patterns including compound components, render props, and custom hooks.',
      scheduledAt: '2024-01-25T19:00:00Z',
      duration: 90,
      status: 'scheduled' as const,
      maxParticipants: 50,
      currentParticipants: 32,
      category: 'Technology',
      price: 29.99,
      isRecorded: true,
      createdAt: '2024-01-20',
      tags: ['react', 'advanced', 'patterns', 'workshop'],
    },
    {
      id: '2',
      title: 'JavaScript Fundamentals Q&A',
      description: 'Interactive session answering common JavaScript questions and solving real-world problems.',
      scheduledAt: '2024-01-24T18:00:00Z',
      duration: 60,
      status: 'live' as const,
      maxParticipants: 100,
      currentParticipants: 87,
      category: 'Technology',
      price: 0,
      isRecorded: true,
      meetingLink: 'https://meet.skillbox.com/js-qa-123',
      createdAt: '2024-01-22',
      tags: ['javascript', 'qa', 'fundamentals'],
    },
    {
      id: '3',
      title: 'Building Modern UIs with CSS Grid',
      description: 'Learn how to create responsive and modern user interfaces using CSS Grid and Flexbox.',
      scheduledAt: '2024-01-22T20:00:00Z',
      duration: 75,
      status: 'completed' as const,
      maxParticipants: 40,
      currentParticipants: 35,
      category: 'Technology',
      price: 19.99,
      isRecorded: true,
      createdAt: '2024-01-18',
      tags: ['css', 'grid', 'flexbox', 'ui'],
    },
    {
      id: '4',
      title: 'Node.js Best Practices',
      description: 'Exploring production-ready Node.js patterns, error handling, and performance optimization.',
      scheduledAt: '2024-01-28T17:00:00Z',
      duration: 120,
      status: 'scheduled' as const,
      maxParticipants: 30,
      currentParticipants: 18,
      category: 'Technology',
      price: 39.99,
      isRecorded: true,
      createdAt: '2024-01-21',
      tags: ['nodejs', 'backend', 'performance'],
    },
  ]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const filteredClasses = liveClasses.filter(liveClass => {
    if (selectedFilter === 'all') return true;
    return liveClass.status === selectedFilter;
  });

  const filters = [
    { key: 'all', label: 'All Classes', count: liveClasses.length },
    { key: 'scheduled', label: 'Scheduled', count: liveClasses.filter(c => c.status === 'scheduled').length },
    { key: 'live', label: 'Live Now', count: liveClasses.filter(c => c.status === 'live').length },
    { key: 'completed', label: 'Completed', count: liveClasses.filter(c => c.status === 'completed').length },
  ] as const;

  const stats = {
    totalClasses: liveClasses.length,
    totalParticipants: liveClasses.reduce((sum, c) => sum + c.currentParticipants, 0),
    totalEarnings: liveClasses.reduce((sum, c) => sum + (c.price * c.currentParticipants), 0),
    averageRating: 4.8,
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
            Live Classes
          </Text>
          <Text variant="body2" color="textSecondary">
            Schedule and manage your interactive sessions
          </Text>
        </View>
        
        <Button
          variant="primary"
          size="sm"
          onPress={() => Alert.alert('Schedule Class', 'Class scheduling feature coming soon!')}
          leftIcon={<IconSymbol name="plus" size={16} color="white" />}
        >
          Schedule Class
        </Button>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <QuickStats
          title="Total Classes"
          value={stats.totalClasses}
          icon="video.fill"
          color={theme.colors.primary}
        />
        
        <QuickStats
          title="Total Participants"
          value={stats.totalParticipants}
          icon="person.3.fill"
          color="#8B5CF6"
        />
        
        <QuickStats
          title="Total Earnings"
          value={`$${stats.totalEarnings.toFixed(0)}`}
          icon="dollarsign.circle.fill"
          color="#10B981"
        />
        
        <QuickStats
          title="Avg Rating"
          value={stats.averageRating}
          icon="star.fill"
          color="#F59E0B"
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
          Quick Actions
        </Text>
        
        <View style={styles.quickActionsGrid}>
          <TouchableCard
            variant="outlined"
            padding="md"
            onPress={() => Alert.alert('Schedule Class', 'Class scheduling feature coming soon!')}
            style={styles.quickAction}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
              <IconSymbol name="calendar.badge.plus" size={24} color={theme.colors.primary} />
            </View>
            <Text variant="body2" weight="semibold">
              Schedule New Class
            </Text>
            <Text variant="caption" color="textSecondary" numberOfLines={2}>
              Plan an upcoming session
            </Text>
          </TouchableCard>
          
          <TouchableCard
            variant="outlined"
            padding="md"
            onPress={() => Alert.alert('Instant Class', 'Instant class feature coming soon!')}
            style={styles.quickAction}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#EF444420' }]}>
              <IconSymbol name="video.circle.fill" size={24} color="#EF4444" />
            </View>
            <Text variant="body2" weight="semibold">
              Start Instant Class
            </Text>
            <Text variant="caption" color="textSecondary" numberOfLines={2}>
              Go live immediately
            </Text>
          </TouchableCard>
          
          <TouchableCard
            variant="outlined"
            padding="md"
            onPress={() => Alert.alert('Class Templates', 'Class templates feature coming soon!')}
            style={styles.quickAction}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#10B98120' }]}>
              <IconSymbol name="doc.badge.plus" size={24} color="#10B981" />
            </View>
            <Text variant="body2" weight="semibold">
              Class Templates
            </Text>
            <Text variant="caption" color="textSecondary" numberOfLines={2}>
              Reuse previous setups
            </Text>
          </TouchableCard>
          
          <TouchableCard
            variant="outlined"
            padding="md"
            onPress={() => Alert.alert('Class Analytics', 'Class analytics feature coming soon!')}
            style={styles.quickAction}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#8B5CF620' }]}>
              <IconSymbol name="chart.bar.fill" size={24} color="#8B5CF6" />
            </View>
            <Text variant="body2" weight="semibold">
              Class Analytics
            </Text>
            <Text variant="caption" color="textSecondary" numberOfLines={2}>
              View performance data
            </Text>
          </TouchableCard>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            {filters.map((filter) => (
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
      </View>

      {/* Classes List */}
      <View style={styles.classesContainer}>
        {filteredClasses.length > 0 ? (
          filteredClasses.map((liveClass) => (
            <LiveClassCard key={liveClass.id} liveClass={liveClass} />
          ))
        ) : (
          <Card variant="outlined" padding="xl" style={styles.emptyState}>
            <View style={styles.emptyStateContent}>
              <View style={[styles.emptyStateIcon, { backgroundColor: theme.colors.backgroundSecondary }]}>
                <IconSymbol name="video" size={48} color={theme.colors.textSecondary} />
              </View>
              
              <Text variant="h6" weight="semibold" style={styles.emptyStateTitle}>
                No classes found
              </Text>
              
              <Text variant="body2" color="textSecondary" style={styles.emptyStateDescription}>
                {selectedFilter === 'all' 
                  ? "You haven't scheduled any live classes yet. Start engaging with your students through interactive sessions!"
                  : `No ${selectedFilter} classes found. Try a different filter or schedule a new class.`
                }
              </Text>
              
              {selectedFilter === 'all' && (
                <Button
                  variant="primary"
                  size="lg"
                  onPress={() => Alert.alert('Schedule Class', 'Class scheduling feature coming soon!')}
                  style={styles.emptyStateButton}
                >
                  Schedule Your First Class
                </Button>
              )}
            </View>
          </Card>
        )}
      </View>

      {/* Live Class Tips */}
      <View style={styles.section}>
        <Card variant="outlined" padding="lg" style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <IconSymbol name="lightbulb.fill" size={24} color="#F59E0B" />
            <Text variant="h6" weight="semibold">
              Live Class Tips
            </Text>
          </View>
          
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text variant="body2" weight="medium">
                • Test your setup 15 minutes before going live
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Text variant="body2" weight="medium">
                • Prepare interactive elements to keep students engaged
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Text variant="body2" weight="medium">
                • Record sessions for students who can't attend live
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Text variant="body2" weight="medium">
                • Use polls and Q&A features to encourage participation
              </Text>
            </View>
          </View>
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
    alignItems: 'flex-start',
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
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
    minHeight: 100,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  classesContainer: {
    padding: 16,
    gap: 16,
  },
  classCard: {
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  classHeader: {
    marginBottom: 16,
    paddingRight: 80,
  },
  classDescription: {
    marginTop: 8,
    lineHeight: 20,
  },
  scheduleInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  classStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statGroup: {
    flex: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  classFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tipsCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    paddingLeft: 8,
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
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyStateButton: {
    minWidth: 200,
  },
  bottomSpacing: {
    height: 100,
  },
});
