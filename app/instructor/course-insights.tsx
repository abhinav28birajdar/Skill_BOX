/**
 * Instructor Course Insights Screen
 * Features: Detailed analytics, engagement metrics, student performance
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const PERIOD_TABS = ['7 Days', '30 Days', '90 Days', 'All Time'];

const ENGAGEMENT_DATA = [
  { day: 'Mon', views: 45, completions: 12 },
  { day: 'Tue', views: 52, completions: 15 },
  { day: 'Wed', views: 38, completions: 10 },
  { day: 'Thu', views: 65, completions: 20 },
  { day: 'Fri', views: 58, completions: 18 },
  { day: 'Sat', views: 42, completions: 14 },
  { day: 'Sun', views: 35, completions: 8 },
];

const LESSON_PERFORMANCE = [
  { id: 1, title: 'Introduction to React Native', views: 245, avgTime: '12:34', completionRate: 92, rating: 4.8 },
  { id: 2, title: 'Setting Up Development Environment', views: 198, avgTime: '18:45', completionRate: 85, rating: 4.5 },
  { id: 3, title: 'Components and Props', views: 156, avgTime: '24:12', completionRate: 78, rating: 4.7 },
  { id: 4, title: 'State Management Basics', views: 134, avgTime: '32:08', completionRate: 72, rating: 4.6 },
];

const STUDENT_INSIGHTS = [
  { metric: 'Total Students', value: '1,245', change: '+15.2%', trend: 'up', color: '#10B981' },
  { metric: 'Active Students', value: '842', change: '+8.5%', trend: 'up', color: '#6366F1' },
  { metric: 'Avg. Completion', value: '68%', change: '-2.3%', trend: 'down', color: '#F59E0B' },
  { metric: 'Avg. Rating', value: '4.7', change: '+0.2', trend: 'up', color: '#EC4899' },
];

export default function InstructorCourseInsightsScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('7 Days');

  const maxViews = Math.max(...ENGAGEMENT_DATA.map((d) => d.views));
  const chartHeight = 160;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Course Insights</Text>
        <TouchableOpacity>
          <Ionicons name="download-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Course Info */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.courseCard}>
          <View style={styles.courseIcon}>
            <Ionicons name="book" size={28} color="#6366F1" />
          </View>
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>React Native Masterclass 2024</Text>
            <View style={styles.courseMeta}>
              <View style={styles.courseMetaItem}>
                <Ionicons name="people" size={14} color="#6B7280" />
                <Text style={styles.courseMetaText}>1,245 students</Text>
              </View>
              <View style={styles.courseMetaDot} />
              <View style={styles.courseMetaItem}>
                <Ionicons name="play-circle" size={14} color="#6B7280" />
                <Text style={styles.courseMetaText}>24 lessons</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          {STUDENT_INSIGHTS.map((insight, index) => (
            <Animated.View
              key={insight.metric}
              entering={FadeInDown.delay(150 + index * 50)}
              style={styles.metricCard}
            >
              <Text style={styles.metricLabel}>{insight.metric}</Text>
              <Text style={styles.metricValue}>{insight.value}</Text>
              <View style={styles.metricChange}>
                <Ionicons
                  name={insight.trend === 'up' ? 'arrow-up' : 'arrow-down'}
                  size={12}
                  color={insight.trend === 'up' ? '#10B981' : '#EF4444'}
                />
                <Text
                  style={[
                    styles.metricChangeText,
                    { color: insight.trend === 'up' ? '#10B981' : '#EF4444' },
                  ]}
                >
                  {insight.change}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Period Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {PERIOD_TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, selectedPeriod === tab && styles.tabActive]}
                onPress={() => setSelectedPeriod(tab)}
              >
                <Text style={[styles.tabText, selectedPeriod === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Engagement Chart */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.chartCard}>
          <Text style={styles.chartTitle}>Student Engagement</Text>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#6366F1' }]} />
              <Text style={styles.legendText}>Views</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Completions</Text>
            </View>
          </View>
          <View style={styles.chart}>
            {ENGAGEMENT_DATA.map((data, index) => {
              const viewHeight = (data.views / maxViews) * chartHeight;
              const completionHeight = (data.completions / maxViews) * chartHeight;
              return (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.chartBarsContainer}>
                    <View style={[styles.chartBarFill, { height: viewHeight, backgroundColor: '#6366F1' }]} />
                    <View style={[styles.chartBarFill, { height: completionHeight, backgroundColor: '#10B981' }]} />
                  </View>
                  <Text style={styles.chartBarLabel}>{data.day}</Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Lesson Performance */}
        <View style={styles.lessonsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lesson Performance</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {LESSON_PERFORMANCE.map((lesson, index) => (
            <Animated.View
              key={lesson.id}
              entering={FadeInDown.delay(500 + index * 100)}
              style={styles.lessonCard}
            >
              <View style={styles.lessonHeader}>
                <View style={styles.lessonIcon}>
                  <Ionicons name="play-circle" size={20} color="#6366F1" />
                </View>
                <Text style={styles.lessonTitle} numberOfLines={1}>
                  {lesson.title}
                </Text>
              </View>

              <View style={styles.lessonStats}>
                <View style={styles.lessonStat}>
                  <Ionicons name="eye-outline" size={16} color="#6B7280" />
                  <Text style={styles.lessonStatValue}>{lesson.views}</Text>
                  <Text style={styles.lessonStatLabel}>views</Text>
                </View>
                <View style={styles.lessonStat}>
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text style={styles.lessonStatValue}>{lesson.avgTime}</Text>
                  <Text style={styles.lessonStatLabel}>avg time</Text>
                </View>
                <View style={styles.lessonStat}>
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.lessonStatValue}>{lesson.rating}</Text>
                  <Text style={styles.lessonStatLabel}>rating</Text>
                </View>
              </View>

              <View style={styles.completionContainer}>
                <View style={styles.completionBar}>
                  <View
                    style={[
                      styles.completionFill,
                      { width: `${lesson.completionRate}%` },
                    ]}
                  />
                </View>
                <Text style={styles.completionText}>{lesson.completionRate}%</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Insights Card */}
        <Animated.View entering={FadeInDown.delay(900)} style={styles.insightsCard}>
          <View style={styles.insightsIcon}>
            <Ionicons name="bulb" size={24} color="#F59E0B" />
          </View>
          <View style={styles.insightsContent}>
            <Text style={styles.insightsTitle}>💡 Insights & Recommendations</Text>
            <Text style={styles.insightsText}>
              • Lesson 4 has the lowest completion rate (72%). Consider adding more examples{'\n'}
              • Thursday shows highest engagement - schedule new content releases then{'\n'}
              • Average watch time is 12% below target - consider shorter videos
            </Text>
          </View>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  content: { flex: 1 },
  courseCard: { flexDirection: 'row', margin: 20, padding: 16, backgroundColor: '#fff', borderRadius: 16, gap: 12 },
  courseIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  courseInfo: { flex: 1 },
  courseTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  courseMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  courseMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  courseMetaText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  courseMetaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#D1D5DB' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  metricCard: { width: '48%', padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  metricLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 8 },
  metricValue: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 6 },
  metricChange: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricChangeText: { fontSize: 13, fontWeight: '700' },
  tabsContainer: { paddingHorizontal: 20, marginBottom: 20 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 12, marginRight: 8 },
  tabActive: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  chartCard: { marginHorizontal: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16, marginBottom: 20 },
  chartTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  chartLegend: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 180 },
  chartBar: { flex: 1, alignItems: 'center' },
  chartBarsContainer: { flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 2, paddingHorizontal: 2 },
  chartBarFill: { flex: 1, borderRadius: 4 },
  chartBarLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', marginTop: 8 },
  lessonsSection: { paddingHorizontal: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  seeAllText: { fontSize: 14, fontWeight: '700', color: '#6366F1' },
  lessonCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16, marginBottom: 12 },
  lessonHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  lessonIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  lessonTitle: { flex: 1, fontSize: 15, fontWeight: '800', color: '#1F2937' },
  lessonStats: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  lessonStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lessonStatValue: { fontSize: 13, fontWeight: '800', color: '#1F2937' },
  lessonStatLabel: { fontSize: 11, fontWeight: '600', color: '#6B7280' },
  completionContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  completionBar: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  completionFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 4 },
  completionText: { fontSize: 13, fontWeight: '800', color: '#10B981', minWidth: 36 },
  insightsCard: { flexDirection: 'row', marginHorizontal: 20, padding: 16, backgroundColor: '#FEF3C7', borderRadius: 16, gap: 12 },
  insightsIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  insightsContent: { flex: 1 },
  insightsTitle: { fontSize: 15, fontWeight: '800', color: '#92400E', marginBottom: 8 },
  insightsText: { fontSize: 13, color: '#78350F', lineHeight: 20 },
  bottomSpacing: { height: 20 },
});
