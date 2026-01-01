/**
 * Instructor Analytics
 * Features: Revenue charts, student stats, course performance
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ANALYTICS_DATA = {
  revenue: { current: 12450, previous: 10820, change: 15.1 },
  students: { current: 2345, previous: 2167, change: 8.2 },
  courses: { current: 12, previous: 11, change: 9.1 },
  rating: { current: 4.8, previous: 4.6, change: 4.3 },
};

const REVENUE_CHART_DATA = [
  { month: 'Jan', amount: 8500 },
  { month: 'Feb', amount: 9200 },
  { month: 'Mar', amount: 10100 },
  { month: 'Apr', amount: 9800 },
  { month: 'May', amount: 11200 },
  { month: 'Jun', amount: 12450 },
];

const TOP_COURSES = [
  { id: 1, title: 'React Native Masterclass', students: 845, revenue: 4225, rating: 4.9 },
  { id: 2, title: 'Advanced TypeScript', students: 623, revenue: 3115, rating: 4.8 },
  { id: 3, title: 'UI/UX Design Basics', students: 489, revenue: 2445, rating: 4.7 },
];

export default function InstructorAnalyticsScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const periods = ['week', 'month', 'year'];
  const maxRevenue = Math.max(...REVENUE_CHART_DATA.map(d => d.amount));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <TouchableOpacity>
          <Ionicons name="download-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod(period as any)}
            >
              <Text style={[styles.periodText, selectedPeriod === period && styles.periodTextActive]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: '#10B98120' }]}>
              <Ionicons name="cash-outline" size={24} color="#10B981" />
            </View>
            <Text style={styles.metricValue}>${ANALYTICS_DATA.revenue.current.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Total Revenue</Text>
            <View style={styles.changeContainer}>
              <Ionicons name="trending-up" size={14} color="#10B981" />
              <Text style={[styles.changeText, { color: '#10B981' }]}>
                +{ANALYTICS_DATA.revenue.change}%
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)} style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: '#3B82F620' }]}>
              <Ionicons name="people-outline" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.metricValue}>{ANALYTICS_DATA.students.current.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Students</Text>
            <View style={styles.changeContainer}>
              <Ionicons name="trending-up" size={14} color="#10B981" />
              <Text style={[styles.changeText, { color: '#10B981' }]}>
                +{ANALYTICS_DATA.students.change}%
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)} style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: '#8B5CF620' }]}>
              <Ionicons name="book-outline" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.metricValue}>{ANALYTICS_DATA.courses.current}</Text>
            <Text style={styles.metricLabel}>Courses</Text>
            <View style={styles.changeContainer}>
              <Ionicons name="trending-up" size={14} color="#10B981" />
              <Text style={[styles.changeText, { color: '#10B981' }]}>
                +{ANALYTICS_DATA.courses.change}%
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)} style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: '#F59E0B20' }]}>
              <Ionicons name="star-outline" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.metricValue}>{ANALYTICS_DATA.rating.current}</Text>
            <Text style={styles.metricLabel}>Avg Rating</Text>
            <View style={styles.changeContainer}>
              <Ionicons name="trending-up" size={14} color="#10B981" />
              <Text style={[styles.changeText, { color: '#10B981' }]}>
                +{ANALYTICS_DATA.rating.change}%
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Revenue Chart */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Revenue Trend</Text>
          <View style={styles.chartCard}>
            <View style={styles.chart}>
              {REVENUE_CHART_DATA.map((data, index) => {
                const barHeight = (data.amount / maxRevenue) * 120;
                return (
                  <View key={index} style={styles.chartBar}>
                    <View style={styles.barContainer}>
                      <LinearGradient
                        colors={['#6366F1', '#8B5CF6']}
                        style={[styles.bar, { height: barHeight }]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{data.month}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* Top Courses */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Performing Courses</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.coursesList}>
            {TOP_COURSES.map((course, index) => (
              <View key={course.id} style={styles.courseCard}>
                <View style={styles.courseRank}>
                  <Text style={styles.courseRankText}>{index + 1}</Text>
                </View>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <View style={styles.courseStats}>
                    <View style={styles.courseStat}>
                      <Ionicons name="people-outline" size={14} color="#6B7280" />
                      <Text style={styles.courseStatText}>{course.students}</Text>
                    </View>
                    <View style={styles.courseStat}>
                      <Ionicons name="cash-outline" size={14} color="#6B7280" />
                      <Text style={styles.courseStatText}>${course.revenue}</Text>
                    </View>
                    <View style={styles.courseStat}>
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text style={styles.courseStatText}>{course.rating}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
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
  periodSelector: { flexDirection: 'row', padding: 20, gap: 8 },
  periodButton: { flex: 1, paddingVertical: 10, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center' },
  periodButtonActive: { backgroundColor: '#6366F1' },
  periodText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  periodTextActive: { color: '#fff' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12 },
  metricCard: { width: '48%', padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  metricIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  metricValue: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  metricLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 8 },
  changeContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  changeText: { fontSize: 12, fontWeight: '700' },
  chartSection: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  chartCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  chartBar: { flex: 1, alignItems: 'center', gap: 8 },
  barContainer: { height: 120, justifyContent: 'flex-end' },
  bar: { width: 32, borderRadius: 4 },
  barLabel: { fontSize: 11, fontWeight: '600', color: '#6B7280' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewAll: { fontSize: 14, fontWeight: '600', color: '#6366F1' },
  coursesList: { gap: 12 },
  courseCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12, gap: 12 },
  courseRank: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  courseRankText: { fontSize: 16, fontWeight: '800', color: '#6366F1' },
  courseInfo: { flex: 1 },
  courseTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  courseStats: { flexDirection: 'row', gap: 16 },
  courseStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  courseStatText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  bottomSpacing: { height: 40 },
});
