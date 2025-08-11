import TouchableCard from '@/components/common/TouchableCard';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon, color }) => {
  const { theme } = useTheme();
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'arrow.up.right';
      case 'down':
        return 'arrow.down.right';
      default:
        return 'minus';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#10B981';
      case 'down':
        return '#EF4444';
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <Card variant="outline" padding="md" style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
          <IconSymbol name={icon} size={20} color={color} />
        </View>
        {change && (
          <View style={[styles.trendContainer, { backgroundColor: `${getTrendColor()}20` }]}>
            <IconSymbol name={getTrendIcon()} size={12} color={getTrendColor()} />
            <Text variant="caption" style={{ color: getTrendColor(), marginLeft: 4 }}>
              {change}
            </Text>
          </View>
        )}
      </View>
      
      <Text variant="h4" weight="bold" style={styles.statValue}>
        {value}
      </Text>
      
      <Text variant="caption" color="textSecondary">
        {title}
      </Text>
    </Card>
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
      variant="outline"
      padding="md"
      onPress={onPress}
      style={styles.quickAction}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>
        <IconSymbol name={icon} size={24} color={color} />
      </View>
      
      <Text variant="body1" weight="semibold" style={styles.quickActionTitle}>
        {title}
      </Text>
      
      <Text variant="caption" color="textSecondary" numberOfLines={2}>
        {subtitle}
      </Text>
    </TouchableCard>
  );
};

interface RecentActivityProps {
  activity: {
    id: string;
    type: 'enrollment' | 'rating' | 'comment' | 'earnings';
    title: string;
    subtitle: string;
    time: string;
    value?: string;
  };
}

const RecentActivityItem: React.FC<RecentActivityProps> = ({ activity }) => {
  const { theme } = useTheme();
  
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'enrollment':
        return 'person.badge.plus';
      case 'rating':
        return 'star.fill';
      case 'comment':
        return 'bubble.left.fill';
      case 'earnings':
        return 'dollarsign.circle.fill';
      default:
        return 'bell.fill';
    }
  };

  const getActivityColor = () => {
    switch (activity.type) {
      case 'enrollment':
        return theme.colors.primary;
      case 'rating':
        return '#F59E0B';
      case 'comment':
        return '#8B5CF6';
      case 'earnings':
        return '#10B981';
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: `${getActivityColor()}20` }]}>
        <IconSymbol name={getActivityIcon()} size={16} color={getActivityColor()} />
      </View>
      
      <View style={styles.activityContent}>
        <Text variant="body2" weight="medium">
          {activity.title}
        </Text>
        <Text variant="caption" color="textSecondary">
          {activity.subtitle}
        </Text>
        <Text variant="caption" color="textSecondary">
          {activity.time}
        </Text>
      </View>
      
      {activity.value && (
        <Text variant="body2" weight="semibold" style={{ color: getActivityColor() }}>
          {activity.value}
        </Text>
      )}
    </View>
  );
};

export default function CreatorDashboardScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 124,
    activeEnrollments: 89,
    totalEarnings: 2847.50,
    averageRating: 4.8,
    coursesPublished: 7,
    monthlyViews: 1543,
  });

  const [recentActivity] = useState([
    {
      id: '1',
      type: 'enrollment' as const,
      title: 'New student enrolled',
      subtitle: 'Sarah M. joined "Advanced React Patterns"',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'rating' as const,
      title: 'New 5-star review',
      subtitle: 'John D. rated "JavaScript Fundamentals"',
      time: '4 hours ago',
      value: '⭐⭐⭐⭐⭐',
    },
    {
      id: '3',
      type: 'earnings' as const,
      title: 'Payment received',
      subtitle: 'Course sales for this week',
      time: '1 day ago',
      value: '+$127.50',
    },
    {
      id: '4',
      type: 'comment' as const,
      title: 'New comment',
      subtitle: 'Mike R. commented on "CSS Grid Tutorial"',
      time: '2 days ago',
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
      title: 'Create Course',
      subtitle: 'Build a new comprehensive course',
      icon: 'play.rectangle.fill',
      color: theme.colors.primary,
      onPress: () => router.push('./courses'),
    },
    {
      title: 'Schedule Class',
      subtitle: 'Host a live learning session',
      icon: 'calendar.badge.plus',
      color: theme.colors.secondary,
      onPress: () => router.push('./classes'),
    },
    {
      title: 'Upload Content',
      subtitle: 'Share videos, tutorials, resources',
      icon: 'square.and.arrow.up.fill',
      color: '#8B5CF6',
      onPress: () => router.push('./content'),
    },
    {
      title: 'View Analytics',
      subtitle: 'Track performance and insights',
      icon: 'chart.bar.fill',
      color: '#10B981',
      onPress: () => router.push('./analytics'),
    },
  ];

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
            Creator Dashboard
          </Text>
          <Text variant="body2" color="textSecondary">
            Welcome back, {user?.full_name?.split(' ')[0]}! 👋
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile')}
          style={[styles.avatarButton, { backgroundColor: theme.colors.primary }]}
        >
          <Text variant="body1" color="white" weight="bold">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.section}>
        <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
          Overview
        </Text>
        
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            change="+12.5%"
            trend="up"
            icon="person.3.fill"
            color={theme.colors.primary}
          />
          
          <StatCard
            title="Monthly Earnings"
            value={`$${stats.totalEarnings.toFixed(0)}`}
            change="+8.2%"
            trend="up"
            icon="dollarsign.circle.fill"
            color="#10B981"
          />
          
          <StatCard
            title="Average Rating"
            value={stats.averageRating.toFixed(1)}
            change="+0.2"
            trend="up"
            icon="star.fill"
            color="#F59E0B"
          />
          
          <StatCard
            title="Course Views"
            value={stats.monthlyViews}
            change="+24.1%"
            trend="up"
            icon="eye.fill"
            color="#8B5CF6"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
          Quick Actions
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

      {/* Performance Insights */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="h6" weight="semibold">
            Performance Insights
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.push('./analytics')}
          >
            View All
          </Button>
        </View>
        
        <Card variant="outline" padding="lg" style={styles.insightsCard}>
          <View style={styles.insightItem}>
            <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color="#10B981" />
            <View style={styles.insightContent}>
              <Text variant="body2" weight="medium">
                Your courses are performing 23% better than average
              </Text>
              <Text variant="caption" color="textSecondary">
                Based on engagement and completion rates
              </Text>
            </View>
          </View>
          
          <View style={styles.insightItem}>
            <IconSymbol name="star.circle.fill" size={20} color="#F59E0B" />
            <View style={styles.insightContent}>
              <Text variant="body2" weight="medium">
                Students love your teaching style
              </Text>
              <Text variant="caption" color="textSecondary">
                97% positive feedback mentions "clear explanations"
              </Text>
            </View>
          </View>
          
          <View style={styles.insightItem}>
            <IconSymbol name="clock.fill" size={20} color={theme.colors.primary} />
            <View style={styles.insightContent}>
              <Text variant="body2" weight="medium">
                Peak learning hours: 7-9 PM
              </Text>
              <Text variant="caption" color="textSecondary">
                Consider scheduling live classes during this time
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="h6" weight="semibold">
            Recent Activity
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.push('./activity')}
          >
            View All
          </Button>
        </View>
        
        <Card variant="outline" padding="md">
          {recentActivity.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <RecentActivityItem activity={activity} />
              {index < recentActivity.length - 1 && <View style={styles.activityDivider} />}
            </React.Fragment>
          ))}
        </Card>
      </View>

      {/* Content Management */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="h6" weight="semibold">
            Your Content
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.push('./content')}
          >
            Manage All
          </Button>
        </View>
        
        <View style={styles.contentCards}>
          <TouchableCard
            variant="outline"
            padding="md"
            onPress={() => router.push('./courses')}
            style={styles.contentCard}
          >
            <View style={styles.contentCardHeader}>
              <IconSymbol name="play.rectangle.fill" size={24} color={theme.colors.primary} />
              <Text variant="h5" weight="bold">
                {stats.coursesPublished}
              </Text>
            </View>
            <Text variant="body2" weight="medium">
              Published Courses
            </Text>
            <Text variant="caption" color="textSecondary">
              2 drafts, 1 under review
            </Text>
          </TouchableCard>
          
          <TouchableCard
            variant="outline"
            padding="md"
            onPress={() => router.push('./classes')}
            style={styles.contentCard}
          >
            <View style={styles.contentCardHeader}>
              <IconSymbol name="video.fill" size={24} color={theme.colors.secondary} />
              <Text variant="h5" weight="bold">
                12
              </Text>
            </View>
            <Text variant="body2" weight="medium">
              Live Classes
            </Text>
            <Text variant="caption" color="textSecondary">
              3 scheduled this week
            </Text>
          </TouchableCard>
        </View>
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
  avatarButton: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 44) / 2,
    minHeight: 120,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statValue: {
    marginBottom: 4,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
  insightsCard: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  insightContent: {
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  contentCards: {
    flexDirection: 'row',
    gap: 12,
  },
  contentCard: {
    flex: 1,
    minHeight: 100,
  },
  contentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});
