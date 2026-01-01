/**
 * Admin System Logs Screen
 * Features: Real-time logs, filtering, error tracking
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const LOG_LEVELS = ['All', 'Info', 'Warning', 'Error', 'Critical'];

const LOGS = [
  {
    id: 1,
    level: 'error',
    message: 'Failed to connect to database',
    source: 'DatabaseService',
    timestamp: '2024-03-15 14:32:18',
    details: 'Connection timeout after 30s',
    userId: null,
  },
  {
    id: 2,
    level: 'warning',
    message: 'High memory usage detected',
    source: 'SystemMonitor',
    timestamp: '2024-03-15 14:30:45',
    details: 'Memory usage: 85%',
    userId: null,
  },
  {
    id: 3,
    level: 'info',
    message: 'User login successful',
    source: 'AuthService',
    timestamp: '2024-03-15 14:28:12',
    details: 'User: sarah.j@email.com',
    userId: '1245',
  },
  {
    id: 4,
    level: 'critical',
    message: 'Payment processing failed',
    source: 'PaymentGateway',
    timestamp: '2024-03-15 14:25:33',
    details: 'Gateway timeout - $49.99 transaction',
    userId: '3421',
  },
  {
    id: 5,
    level: 'info',
    message: 'Course published successfully',
    source: 'ContentService',
    timestamp: '2024-03-15 14:22:08',
    details: 'Course ID: 245 - React Native Masterclass',
    userId: '892',
  },
  {
    id: 6,
    level: 'warning',
    message: 'API rate limit approaching',
    source: 'APIGateway',
    timestamp: '2024-03-15 14:18:54',
    details: '850/1000 requests in last hour',
    userId: null,
  },
  {
    id: 7,
    level: 'error',
    message: 'Video upload failed',
    source: 'MediaService',
    timestamp: '2024-03-15 14:15:21',
    details: 'File size exceeds limit: 512MB',
    userId: '567',
  },
];

export default function AdminSystemLogsScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = LOGS.filter((log) => {
    const matchesLevel = selectedLevel === 'All' || log.level === selectedLevel.toLowerCase();
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return 'alert-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return { bg: '#7C2D12', text: '#fff', badge: '#FEE2E2', badgeText: '#7C2D12' };
      case 'error':
        return { bg: '#FEE2E2', text: '#7F1D1D', badge: '#FEE2E2', badgeText: '#EF4444' };
      case 'warning':
        return { bg: '#FEF3C7', text: '#78350F', badge: '#FEF3C7', badgeText: '#F59E0B' };
      default:
        return { bg: '#DBEAFE', text: '#1E3A8A', badge: '#DBEAFE', badgeText: '#3B82F6' };
    }
  };

  const getLogCount = (level: string) => {
    if (level === 'All') return LOGS.length;
    return LOGS.filter((log) => log.level === level.toLowerCase()).length;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>System Logs</Text>
        <TouchableOpacity>
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search logs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
          </View>
          <Text style={styles.statValue}>
            {LOGS.filter((l) => l.level === 'critical' || l.level === 'error').length}
          </Text>
          <Text style={styles.statLabel}>Errors</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(150)} style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="warning" size={20} color="#F59E0B" />
          </View>
          <Text style={styles.statValue}>
            {LOGS.filter((l) => l.level === 'warning').length}
          </Text>
          <Text style={styles.statLabel}>Warnings</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
          </View>
          <Text style={styles.statValue}>
            {LOGS.filter((l) => l.level === 'info').length}
          </Text>
          <Text style={styles.statLabel}>Info</Text>
        </Animated.View>
      </View>

      {/* Level Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {LOG_LEVELS.map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.tab, selectedLevel === level && styles.tabActive]}
              onPress={() => setSelectedLevel(level)}
            >
              <Text style={[styles.tabText, selectedLevel === level && styles.tabTextActive]}>
                {level}
              </Text>
              <View style={styles.tabBadge}>
                <Text style={[styles.tabBadgeText, selectedLevel === level && styles.tabBadgeTextActive]}>
                  {getLogCount(level)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logs List */}
        <View style={styles.logsList}>
          {filteredLogs.map((log, index) => {
            const levelStyle = getLevelColor(log.level);
            return (
              <Animated.View
                key={log.id}
                entering={FadeInDown.delay(250 + index * 50)}
                style={[styles.logCard, { backgroundColor: levelStyle.bg }]}
              >
                <View style={styles.logHeader}>
                  <View style={styles.logHeaderLeft}>
                    <Ionicons
                      name={getLevelIcon(log.level) as any}
                      size={20}
                      color={levelStyle.badgeText}
                    />
                    <View style={[styles.levelBadge, { backgroundColor: levelStyle.badge }]}>
                      <Text style={[styles.levelText, { color: levelStyle.badgeText }]}>
                        {log.level.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.timestamp, { color: levelStyle.text }]}>
                    {log.timestamp}
                  </Text>
                </View>

                <Text style={[styles.logMessage, { color: levelStyle.text }]}>
                  {log.message}
                </Text>

                <View style={styles.logDetails}>
                  <View style={styles.logDetailRow}>
                    <Ionicons name="code-slash-outline" size={14} color={levelStyle.text} />
                    <Text style={[styles.logDetailText, { color: levelStyle.text }]}>
                      {log.source}
                    </Text>
                  </View>
                  {log.userId && (
                    <View style={styles.logDetailRow}>
                      <Ionicons name="person-outline" size={14} color={levelStyle.text} />
                      <Text style={[styles.logDetailText, { color: levelStyle.text }]}>
                        User: {log.userId}
                      </Text>
                    </View>
                  )}
                </View>

                {log.details && (
                  <View style={[styles.detailsContainer, { backgroundColor: 'rgba(0, 0, 0, 0.05)' }]}>
                    <Text style={[styles.detailsText, { color: levelStyle.text }]}>
                      {log.details}
                    </Text>
                  </View>
                )}

                <View style={styles.logActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="copy-outline" size={16} color={levelStyle.badgeText} />
                    <Text style={[styles.actionButtonText, { color: levelStyle.badgeText }]}>
                      Copy
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-social-outline" size={16} color={levelStyle.badgeText} />
                    <Text style={[styles.actionButtonText, { color: levelStyle.badgeText }]}>
                      Share
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="search-outline" size={16} color={levelStyle.badgeText} />
                    <Text style={[styles.actionButtonText, { color: levelStyle.badgeText }]}>
                      Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  searchContainer: { padding: 20, backgroundColor: '#fff' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F9FAFB', borderRadius: 12 },
  searchInput: { flex: 1, fontSize: 15, color: '#1F2937' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  statCard: { flex: 1, alignItems: 'center', gap: 6, padding: 12, backgroundColor: '#fff', borderRadius: 12 },
  statIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
  statLabel: { fontSize: 11, fontWeight: '600', color: '#6B7280' },
  tabsContainer: { backgroundColor: '#fff', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tabsScroll: { paddingHorizontal: 20 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
  tabActive: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  tabBadge: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  tabBadgeText: { fontSize: 11, fontWeight: '800', color: '#6B7280' },
  tabBadgeTextActive: { color: '#6366F1' },
  content: { flex: 1 },
  logsList: { padding: 20, gap: 12 },
  logCard: { padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)' },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  logHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  levelText: { fontSize: 10, fontWeight: '800' },
  timestamp: { fontSize: 11, fontWeight: '600' },
  logMessage: { fontSize: 15, fontWeight: '800', lineHeight: 22, marginBottom: 12 },
  logDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  logDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logDetailText: { fontSize: 12, fontWeight: '600' },
  detailsContainer: { padding: 12, borderRadius: 8, marginBottom: 12 },
  detailsText: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  logActions: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 8 },
  actionButtonText: { fontSize: 12, fontWeight: '700' },
  bottomSpacing: { height: 20 },
});
