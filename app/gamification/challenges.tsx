/**
 * Gamification Challenges Screen
 * Features: Daily/weekly challenges, streaks, rewards
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const CHALLENGE_TABS = ['Daily', 'Weekly', 'Special'];

const CHALLENGES = [
  {
    id: 1,
    type: 'daily',
    title: 'Complete 2 Lessons',
    description: 'Complete any 2 lessons today',
    progress: 1,
    goal: 2,
    reward: 50,
    icon: 'book',
    color: '#6366F1',
    expiresIn: '12h',
    completed: false,
  },
  {
    id: 2,
    type: 'daily',
    title: 'Study for 30 Minutes',
    description: 'Spend 30 minutes learning today',
    progress: 22,
    goal: 30,
    reward: 30,
    icon: 'time',
    color: '#10B981',
    expiresIn: '12h',
    completed: false,
  },
  {
    id: 3,
    type: 'daily',
    title: 'Practice Test',
    description: 'Complete a practice test with 70% or higher',
    progress: 0,
    goal: 1,
    reward: 100,
    icon: 'medal',
    color: '#F59E0B',
    expiresIn: '12h',
    completed: false,
  },
  {
    id: 4,
    type: 'weekly',
    title: 'Weekly Warrior',
    description: 'Complete 10 lessons this week',
    progress: 7,
    goal: 10,
    reward: 300,
    icon: 'flame',
    color: '#EF4444',
    expiresIn: '3d',
    completed: false,
  },
  {
    id: 5,
    type: 'weekly',
    title: 'Quiz Master',
    description: 'Score 90% or higher on 5 quizzes',
    progress: 3,
    goal: 5,
    reward: 250,
    icon: 'trophy',
    color: '#8B5CF6',
    expiresIn: '3d',
    completed: false,
  },
  {
    id: 6,
    type: 'special',
    title: '🎄 Holiday Special',
    description: 'Complete any course by Dec 31st',
    progress: 75,
    goal: 100,
    reward: 1000,
    icon: 'gift',
    color: '#EC4899',
    expiresIn: '15d',
    completed: false,
  },
];

export default function ChallengesScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('Daily');

  const filteredChallenges = CHALLENGES.filter((c) =>
    c.type === selectedTab.toLowerCase()
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Challenges</Text>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Streak Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.streakCard}>
          <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.streakGradient}>
            <View style={styles.streakIcon}>
              <Ionicons name="flame" size={48} color="#fff" />
            </View>
            <Text style={styles.streakValue}>7 Day Streak! 🔥</Text>
            <Text style={styles.streakText}>
              You've studied for 7 days in a row. Keep it up!
            </Text>
            <View style={styles.streakDays}>
              {[...Array(7)].map((_, i) => (
                <View key={i} style={styles.streakDay}>
                  <View style={styles.streakDayIcon}>
                    <Ionicons name="checkmark" size={12} color="#EF4444" />
                  </View>
                  <Text style={styles.streakDayText}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(200)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>2,450</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(250)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            </View>
            <Text style={styles.statValue}>
              {CHALLENGES.filter((c) => c.completed).length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </Animated.View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {CHALLENGE_TABS.map((tab) => (
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

        {/* Challenges List */}
        <View style={styles.challengesList}>
          {filteredChallenges.map((challenge, index) => {
            const progressPercent = (challenge.progress / challenge.goal) * 100;

            return (
              <Animated.View
                key={challenge.id}
                entering={FadeInDown.delay(300 + index * 100)}
                style={styles.challengeCard}
              >
                <View
                  style={[
                    styles.challengeIcon,
                    { backgroundColor: `${challenge.color}20` },
                  ]}
                >
                  <Ionicons name={challenge.icon as any} size={28} color={challenge.color} />
                </View>

                <View style={styles.challengeContent}>
                  <View style={styles.challengeHeader}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <View style={styles.rewardBadge}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={styles.rewardText}>{challenge.reward}</Text>
                    </View>
                  </View>

                  <Text style={styles.challengeDescription}>{challenge.description}</Text>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${progressPercent}%`, backgroundColor: challenge.color },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {challenge.progress}/{challenge.goal}
                    </Text>
                  </View>

                  <View style={styles.challengeFooter}>
                    <View style={styles.expiryBadge}>
                      <Ionicons name="time-outline" size={12} color="#6B7280" />
                      <Text style={styles.expiryText}>Expires in {challenge.expiresIn}</Text>
                    </View>
                  </View>
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
  content: { flex: 1 },
  streakCard: { margin: 20, borderRadius: 24, overflow: 'hidden' },
  streakGradient: { padding: 24, alignItems: 'center' },
  streakIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  streakValue: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 8 },
  streakText: { fontSize: 15, color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center', marginBottom: 20 },
  streakDays: { flexDirection: 'row', gap: 12 },
  streakDay: { alignItems: 'center', gap: 6 },
  streakDayIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  streakDayText: { fontSize: 11, fontWeight: '700', color: 'rgba(255, 255, 255, 0.9)' },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  statCard: { flex: 1, padding: 20, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  statIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280', textAlign: 'center' },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  challengesList: { paddingHorizontal: 20, gap: 12 },
  challengeCard: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderRadius: 16, gap: 12 },
  challengeIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  challengeContent: { flex: 1 },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  challengeTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
  rewardBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#FEF3C7', borderRadius: 8 },
  rewardText: { fontSize: 12, fontWeight: '800', color: '#F59E0B' },
  challengeDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 12 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  progressBar: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  challengeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expiryBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  expiryText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  bottomSpacing: { height: 20 },
});
