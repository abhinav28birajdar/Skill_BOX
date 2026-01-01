/**
 * Badges Collection Screen
 * Features: All badges, earned badges, progress
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const BADGE_TABS = ['All', 'Earned', 'Locked'];

const BADGES = [
  {
    id: 1,
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'footsteps',
    color: '#10B981',
    earned: true,
    earnedAt: '2024-03-01',
    rarity: 'common',
  },
  {
    id: 2,
    name: 'Speed Learner',
    description: 'Complete 5 lessons in one day',
    icon: 'flash',
    color: '#F59E0B',
    earned: true,
    earnedAt: '2024-03-05',
    rarity: 'rare',
  },
  {
    id: 3,
    name: 'Quiz Master',
    description: 'Score 100% on 10 quizzes',
    icon: 'trophy',
    color: '#EF4444',
    earned: true,
    earnedAt: '2024-03-10',
    rarity: 'epic',
  },
  {
    id: 4,
    name: 'Night Owl',
    description: 'Study for 10 hours after 10 PM',
    icon: 'moon',
    color: '#8B5CF6',
    earned: false,
    progress: 6,
    total: 10,
    rarity: 'rare',
  },
  {
    id: 5,
    name: 'Early Bird',
    description: 'Study for 10 hours before 7 AM',
    icon: 'sunny',
    color: '#F59E0B',
    earned: false,
    progress: 3,
    total: 10,
    rarity: 'rare',
  },
  {
    id: 6,
    name: 'Marathon Runner',
    description: 'Study for 5 hours straight',
    icon: 'flag',
    color: '#3B82F6',
    earned: false,
    progress: 2,
    total: 5,
    rarity: 'epic',
  },
  {
    id: 7,
    name: 'Perfectionist',
    description: 'Complete 20 courses with 100%',
    icon: 'star',
    color: '#EC4899',
    earned: false,
    progress: 8,
    total: 20,
    rarity: 'legendary',
  },
  {
    id: 8,
    name: 'Helpful Hand',
    description: 'Help 50 students in forums',
    icon: 'hand-left',
    color: '#10B981',
    earned: false,
    progress: 24,
    total: 50,
    rarity: 'rare',
  },
];

export default function BadgesScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('All');

  const filteredBadges = BADGES.filter((badge) => {
    if (selectedTab === 'Earned') return badge.earned;
    if (selectedTab === 'Locked') return !badge.earned;
    return true;
  });

  const earnedCount = BADGES.filter((b) => b.earned).length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#10B981';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Badge Collection</Text>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.progressCard}>
          <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.progressGradient}>
            <View style={styles.progressIcon}>
              <Ionicons name="trophy" size={48} color="#fff" />
            </View>
            <Text style={styles.progressValue}>
              {earnedCount}/{BADGES.length}
            </Text>
            <Text style={styles.progressText}>Badges Collected</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(earnedCount / BADGES.length) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressPercent}>
              {Math.round((earnedCount / BADGES.length) * 100)}% Complete
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(200)} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="trophy" size={20} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{earnedCount}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(250)} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="lock-closed" size={20} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>{BADGES.length - earnedCount}</Text>
            <Text style={styles.statLabel}>Locked</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(300)} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="star" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>
              {BADGES.filter((b) => b.rarity === 'legendary' && b.earned).length}
            </Text>
            <Text style={styles.statLabel}>Legendary</Text>
          </Animated.View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {BADGE_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.tabActive]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Badges Grid */}
        <View style={styles.badgesGrid}>
          {filteredBadges.map((badge, index) => (
            <Animated.View
              key={badge.id}
              entering={FadeInDown.delay(350 + index * 100)}
              style={styles.badgeCard}
            >
              <View
                style={[
                  styles.badgeIconContainer,
                  {
                    backgroundColor: badge.earned ? badge.color : '#E5E7EB',
                    opacity: badge.earned ? 1 : 0.5,
                  },
                ]}
              >
                <Ionicons
                  name={badge.icon as any}
                  size={40}
                  color={badge.earned ? '#fff' : '#9CA3AF'}
                />
              </View>

              <View
                style={[
                  styles.rarityBadge,
                  { backgroundColor: `${getRarityColor(badge.rarity)}20` },
                ]}
              >
                <Text
                  style={[
                    styles.rarityText,
                    { color: getRarityColor(badge.rarity) },
                  ]}
                >
                  {badge.rarity.toUpperCase()}
                </Text>
              </View>

              <Text
                style={[
                  styles.badgeName,
                  { opacity: badge.earned ? 1 : 0.6 },
                ]}
              >
                {badge.name}
              </Text>
              <Text
                style={[
                  styles.badgeDescription,
                  { opacity: badge.earned ? 1 : 0.6 },
                ]}
              >
                {badge.description}
              </Text>

              {badge.earned ? (
                <View style={styles.earnedContainer}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.earnedText}>Earned {badge.earnedAt}</Text>
                </View>
              ) : (
                <View style={styles.progressContainer}>
                  <View style={styles.badgeProgressBar}>
                    <View
                      style={[
                        styles.badgeProgressFill,
                        {
                          width: `${(badge.progress! / badge.total!) * 100}%`,
                          backgroundColor: badge.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {badge.progress}/{badge.total}
                  </Text>
                </View>
              )}
            </Animated.View>
          ))}
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
  content: { flex: 1 },
  progressCard: { margin: 20, borderRadius: 24, overflow: 'hidden' },
  progressGradient: { padding: 24, alignItems: 'center' },
  progressIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  progressValue: { fontSize: 36, fontWeight: '800', color: '#fff', marginBottom: 8 },
  progressText: { fontSize: 15, color: 'rgba(255, 255, 255, 0.9)', marginBottom: 20 },
  progressBar: { width: '100%', height: 8, backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 4 },
  progressPercent: { fontSize: 14, fontWeight: '700', color: 'rgba(255, 255, 255, 0.9)' },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  statCard: { flex: 1, padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  statIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12 },
  badgeCard: { width: '48%', padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  badgeIconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  rarityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 8 },
  rarityText: { fontSize: 9, fontWeight: '800' },
  badgeName: { fontSize: 14, fontWeight: '800', color: '#1F2937', textAlign: 'center', marginBottom: 6 },
  badgeDescription: { fontSize: 12, color: '#6B7280', textAlign: 'center', lineHeight: 16, marginBottom: 12 },
  earnedContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  earnedText: { fontSize: 11, fontWeight: '600', color: '#10B981' },
  progressContainer: { width: '100%', gap: 6 },
  badgeProgressBar: { width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  badgeProgressFill: { height: '100%', borderRadius: 3 },
  bottomSpacing: { height: 20 },
});
