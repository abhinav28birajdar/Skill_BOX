import React, { useState } from 'react';
import {
    Dimensions,
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

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  color, 
  subtitle 
}) => {
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
    <Card variant="outline" padding="lg" style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: `${color}20` }]}>
          <IconSymbol name={icon} size={24} color={color} />
        </View>
        
        {change && (
          <View style={[styles.trendBadge, { backgroundColor: `${getTrendColor()}15` }]}>
            <IconSymbol name={getTrendIcon()} size={12} color={getTrendColor()} />
            <Text variant="caption" style={{ color: getTrendColor(), marginLeft: 4 }}>
              {change}
            </Text>
          </View>
        )}
      </View>
      
      <Text variant="h3" weight="bold" style={styles.metricValue}>
        {value}
      </Text>
      
      <Text variant="body2" weight="medium" style={styles.metricTitle}>
        {title}
      </Text>
      
      {subtitle && (
        <Text variant="caption" color="textSecondary">
          {subtitle}
        </Text>
      )}
    </Card>
  );
};

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: number[];
  labels: string[];
  color: string;
}

const SimpleChart: React.FC<ChartCardProps> = ({ title, subtitle, data, labels, color }) => {
  const { theme } = useTheme();
  
  const maxValue = Math.max(...data);
  const normalizedData = data.map(value => (value / maxValue) * 100);

  return (
    <Card variant="outline" padding="lg" style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <View>
          <Text variant="h6" weight="semibold">
            {title}
          </Text>
          {subtitle && (
            <Text variant="caption" color="textSecondary">
              {subtitle}
            </Text>
          )}
        </View>
        
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.chartBars}>
          {normalizedData.map((height, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${height}%`,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              <Text variant="caption" color="textSecondary" style={styles.barLabel}>
                {labels[index]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
};

export default function CreatorAnalyticsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const periods = [
    { key: '7d', label: 'Last 7 days' },
    { key: '30d', label: 'Last 30 days' },
    { key: '90d', label: 'Last 90 days' },
    { key: '1y', label: 'Last year' },
  ] as const;

  // Mock analytics data
  const analyticsData = {
    revenue: {
      total: 2847.50,
      change: '+12.5%',
      trend: 'up' as const,
    },
    students: {
      total: 1234,
      change: '+8.2%',
      trend: 'up' as const,
    },
    views: {
      total: 15432,
      change: '+24.1%',
      trend: 'up' as const,
    },
    rating: {
      total: 4.8,
      change: '+0.2',
      trend: 'up' as const,
    },
    engagement: {
      total: '87%',
      change: '+5.3%',
      trend: 'up' as const,
    },
    completion: {
      total: '72%',
      change: '-2.1%',
      trend: 'down' as const,
    },
  };

  const revenueData = [120, 180, 150, 220, 280, 250, 320];
  const revenueLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const enrollmentData = [5, 8, 12, 7, 15, 11, 18];
  const enrollmentLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const topCourses = [
    {
      id: '1',
      title: 'Advanced React Patterns',
      students: 234,
      revenue: 1247.50,
      rating: 4.9,
      completion: 85,
    },
    {
      id: '2',
      title: 'JavaScript Fundamentals',
      students: 456,
      revenue: 987.20,
      rating: 4.8,
      completion: 78,
    },
    {
      id: '3',
      title: 'CSS Grid & Flexbox',
      students: 189,
      revenue: 612.80,
      rating: 4.7,
      completion: 92,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="h4" weight="bold">
            Analytics
          </Text>
          <Text variant="body2" color="textSecondary">
            Track your teaching performance and earnings
          </Text>
        </View>
      </View>

      {/* Period Selector */}
      <View style={styles.periodContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.periods}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor: selectedPeriod === period.key 
                      ? theme.colors.primary 
                      : theme.colors.backgroundSecondary,
                  },
                ]}
                onPress={() => setSelectedPeriod(period.key)}
              >
                <Text
                  variant="caption"
                  weight="medium"
                  style={{
                    color: selectedPeriod === period.key 
                      ? 'white' 
                      : theme.colors.textPrimary,
                  }}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Key Metrics */}
      <View style={styles.section}>
        <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
          Key Metrics
        </Text>
        
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Revenue"
            value={`$${analyticsData.revenue.total.toFixed(0)}`}
            change={analyticsData.revenue.change}
            trend={analyticsData.revenue.trend}
            icon="dollarsign.circle.fill"
            color="#10B981"
            subtitle="This month"
          />
          
          <MetricCard
            title="Active Students"
            value={analyticsData.students.total}
            change={analyticsData.students.change}
            trend={analyticsData.students.trend}
            icon="person.3.fill"
            color={theme.colors.primary}
            subtitle="Enrolled learners"
          />
          
          <MetricCard
            title="Course Views"
            value={analyticsData.views.total.toLocaleString()}
            change={analyticsData.views.change}
            trend={analyticsData.views.trend}
            icon="eye.fill"
            color="#8B5CF6"
            subtitle="Total impressions"
          />
          
          <MetricCard
            title="Average Rating"
            value={analyticsData.rating.total}
            change={analyticsData.rating.change}
            trend={analyticsData.rating.trend}
            icon="star.fill"
            color="#F59E0B"
            subtitle="Student feedback"
          />
          
          <MetricCard
            title="Engagement Rate"
            value={analyticsData.engagement.total}
            change={analyticsData.engagement.change}
            trend={analyticsData.engagement.trend}
            icon="heart.fill"
            color="#EF4444"
            subtitle="Student interaction"
          />
          
          <MetricCard
            title="Completion Rate"
            value={analyticsData.completion.total}
            change={analyticsData.completion.change}
            trend={analyticsData.completion.trend}
            icon="checkmark.circle.fill"
            color={theme.colors.secondary}
            subtitle="Course completion"
          />
        </View>
      </View>

      {/* Charts */}
      <View style={styles.section}>
        <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
          Performance Trends
        </Text>
        
        <SimpleChart
          title="Daily Revenue"
          subtitle="Revenue generated over the last 7 days"
          data={revenueData}
          labels={revenueLabels}
          color="#10B981"
        />
        
        <SimpleChart
          title="New Enrollments"
          subtitle="Student enrollments over the last 7 days"
          data={enrollmentData}
          labels={enrollmentLabels}
          color={theme.colors.primary}
        />
      </View>

      {/* Top Performing Courses */}
      <View style={styles.section}>
        <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
          Top Performing Courses
        </Text>
        
        {topCourses.map((course, index) => (
          <Card key={course.id} variant="outline" padding="lg" style={styles.courseItem}>
            <View style={styles.courseHeader}>
              <View style={styles.courseRank}>
                <Text variant="h6" weight="bold" color="primary">
                  #{index + 1}
                </Text>
              </View>
              
              <View style={styles.courseInfo}>
                <Text variant="body1" weight="semibold">
                  {course.title}
                </Text>
                <Text variant="caption" color="textSecondary">
                  {course.students} students • ${course.revenue.toFixed(2)} revenue
                </Text>
              </View>
              
              <View style={styles.courseMetrics}>
                <View style={styles.courseMetric}>
                  <IconSymbol name="star.fill" size={14} color="#F59E0B" />
                  <Text variant="caption" color="textSecondary">
                    {course.rating}
                  </Text>
                </View>
                
                <View style={styles.courseMetric}>
                  <IconSymbol name="checkmark.circle.fill" size={14} color="#10B981" />
                  <Text variant="caption" color="textSecondary">
                    {course.completion}%
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        ))}
      </View>

      {/* Insights & Recommendations */}
      <View style={styles.section}>
        <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
          Insights & Recommendations
        </Text>
        
        <Card variant="outline" padding="lg" style={styles.insightCard}>
          <View style={styles.insightItem}>
            <View style={[styles.insightIcon, { backgroundColor: '#10B98120' }]}>
              <IconSymbol name="lightbulb.fill" size={20} color="#10B981" />
            </View>
            
            <View style={styles.insightContent}>
              <Text variant="body2" weight="medium">
                High Engagement Period Detected
              </Text>
              <Text variant="caption" color="textSecondary">
                Students are most active between 7-9 PM. Consider scheduling live sessions during this time.
              </Text>
            </View>
          </View>
          
          <View style={styles.insightDivider} />
          
          <View style={styles.insightItem}>
            <View style={[styles.insightIcon, { backgroundColor: '#F59E0B20' }]}>
              <IconSymbol name="chart.bar.fill" size={20} color="#F59E0B" />
            </View>
            
            <View style={styles.insightContent}>
              <Text variant="body2" weight="medium">
                Course Completion Opportunity
              </Text>
              <Text variant="caption" color="textSecondary">
                Adding practice exercises could improve completion rates by an estimated 15%.
              </Text>
            </View>
          </View>
          
          <View style={styles.insightDivider} />
          
          <View style={styles.insightItem}>
            <View style={[styles.insightIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
              <IconSymbol name="target" size={20} color={theme.colors.primary} />
            </View>
            
            <View style={styles.insightContent}>
              <Text variant="body2" weight="medium">
                Revenue Growth Potential
              </Text>
              <Text variant="caption" color="textSecondary">
                Based on current trends, you could reach $4,000 monthly revenue with 2 more quality courses.
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
    padding: 16,
    paddingTop: 60,
  },
  periodContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  periods: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: (width - 44) / 2,
    minHeight: 140,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  metricValue: {
    marginBottom: 4,
  },
  metricTitle: {
    marginBottom: 4,
  },
  chartCard: {
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  chartContainer: {
    height: 120,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 8,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    height: 80,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    textAlign: 'center',
  },
  courseItem: {
    marginBottom: 12,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseRank: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  courseMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  insightCard: {
    gap: 0,
  },
  insightItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  bottomSpacing: {
    height: 100,
  },
});
