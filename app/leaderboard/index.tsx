/**
 * Leaderboard Page
 * Features: Global/friends rankings, XP, levels, filters
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=1', xp: 12450, level: 24, streak: 45 },
  { rank: 2, name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/150?img=2', xp: 11230, level: 23, streak: 38 },
  { rank: 3, name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?img=3', xp: 10890, level: 22, streak: 42 },
  { rank: 4, name: 'Alex Kumar', avatar: 'https://i.pravatar.cc/150?img=4', xp: 9750, level: 21, streak: 29 },
  { rank: 5, name: 'Sofia Rodriguez', avatar: 'https://i.pravatar.cc/150?img=5', xp: 9320, level: 20, streak: 35 },
  { rank: 6, name: 'David Park', avatar: 'https://i.pravatar.cc/150?img=6', xp: 8940, level: 19, streak: 27 },
  { rank: 7, name: 'Lisa Anderson', avatar: 'https://i.pravatar.cc/150?img=7', xp: 8560, level: 19, streak: 31 },
  { rank: 8, name: 'James Taylor', avatar: 'https://i.pravatar.cc/150?img=8', xp: 8120, level: 18, streak: 24 },
];

export default function LeaderboardScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'global' | 'friends' | 'weekly'>('global');

  const tabs = [
    { key: 'global', label: 'Global' },
    { key: 'friends', label: 'Friends' },
    { key: 'weekly', label: 'This Week' },
  ];

  const getMedalColor = (rank: number) => {
    if (rank === 1) return ['#FBBF24', '#F59E0B'];
    if (rank === 2) return ['#9CA3AF', '#6B7280'];
    if (rank === 3) return ['#F97316', '#EA580C'];
    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.tabActive]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Text style={[styles.tabText, selectedTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top 3 Podium */}
        <View style={styles.podium}>
          {/* Second Place */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.podiumItem}>
            <View style={styles.rankBadge2}>
              <Text style={styles.rankText}>2</Text>
            </View>
            <Image source={{ uri: LEADERBOARD_DATA[1].avatar }} style={styles.podiumAvatar} />
            <Text style={styles.podiumName}>{LEADERBOARD_DATA[1].name.split(' ')[0]}</Text>
            <Text style={styles.podiumXP}>{LEADERBOARD_DATA[1].xp.toLocaleString()} XP</Text>
            <View style={styles.podiumPedestal2}>
              <Text style={styles.pedestalText}>2nd</Text>
            </View>
          </Animated.View>

          {/* First Place */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.podiumItem}>
            <LinearGradient colors={['#FBBF24', '#F59E0B']} style={styles.crownBadge}>
              <Ionicons name="trophy" size={20} color="#fff" />
            </LinearGradient>
            <Image source={{ uri: LEADERBOARD_DATA[0].avatar }} style={[styles.podiumAvatar, styles.winnerAvatar]} />
            <Text style={styles.podiumName}>{LEADERBOARD_DATA[0].name.split(' ')[0]}</Text>
            <Text style={styles.podiumXP}>{LEADERBOARD_DATA[0].xp.toLocaleString()} XP</Text>
            <View style={styles.podiumPedestal1}>
              <Text style={styles.pedestalText}>1st</Text>
            </View>
          </Animated.View>

          {/* Third Place */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.podiumItem}>
            <View style={styles.rankBadge3}>
              <Text style={styles.rankText}>3</Text>
            </View>
            <Image source={{ uri: LEADERBOARD_DATA[2].avatar }} style={styles.podiumAvatar} />
            <Text style={styles.podiumName}>{LEADERBOARD_DATA[2].name.split(' ')[0]}</Text>
            <Text style={styles.podiumXP}>{LEADERBOARD_DATA[2].xp.toLocaleString()} XP</Text>
            <View style={styles.podiumPedestal3}>
              <Text style={styles.pedestalText}>3rd</Text>
            </View>
          </Animated.View>
        </View>

        {/* Rankings List */}
        <View style={styles.rankingsList}>
          {LEADERBOARD_DATA.slice(3).map((user, index) => (
            <Animated.View
              key={user.rank}
              entering={FadeInDown.delay((index + 3) * 100)}
              style={styles.rankingCard}
            >
              <View style={styles.rankNumber}>
                <Text style={styles.rankNumberText}>{user.rank}</Text>
              </View>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userLevel}>Level {user.level} · {user.xp.toLocaleString()} XP</Text>
              </View>
              <View style={styles.streakBadge}>
                <Ionicons name="flame" size={14} color="#F59E0B" />
                <Text style={styles.streakText}>{user.streak}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Your Rank Card */}
        <Animated.View entering={FadeInDown.delay(1200)} style={styles.yourRankCard}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.yourRankGradient}>
            <View style={styles.yourRankContent}>
              <View style={styles.yourRankLeft}>
                <Text style={styles.yourRankLabel}>Your Rank</Text>
                <Text style={styles.yourRankValue}>#47</Text>
              </View>
              <View style={styles.yourRankStats}>
                <Text style={styles.yourRankStat}>6,540 XP</Text>
                <Text style={styles.yourRankStat}>Level 15</Text>
              </View>
            </View>
          </LinearGradient>
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
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', gap: 8 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#EEF2FF' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#6366F1' },
  content: { flex: 1 },
  podium: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', padding: 20, gap: 12 },
  podiumItem: { flex: 1, alignItems: 'center' },
  rankBadge2: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#9CA3AF', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  rankBadge3: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F97316', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  rankText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  crownBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  podiumAvatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 8, borderWidth: 2, borderColor: '#fff' },
  winnerAvatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3 },
  podiumName: { fontSize: 13, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  podiumXP: { fontSize: 11, color: '#6B7280', marginBottom: 8 },
  podiumPedestal1: { width: '100%', height: 60, backgroundColor: '#FBBF24', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  podiumPedestal2: { width: '100%', height: 48, backgroundColor: '#9CA3AF', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  podiumPedestal3: { width: '100%', height: 40, backgroundColor: '#F97316', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  pedestalText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  rankingsList: { padding: 20, gap: 12 },
  rankingCard: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 12, gap: 12 },
  rankNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  rankNumberText: { fontSize: 14, fontWeight: '800', color: '#6B7280' },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  userLevel: { fontSize: 12, color: '#6B7280' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#FEF3C7', borderRadius: 8 },
  streakText: { fontSize: 12, fontWeight: '700', color: '#F59E0B' },
  yourRankCard: { margin: 20, borderRadius: 16, overflow: 'hidden' },
  yourRankGradient: { padding: 20 },
  yourRankContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  yourRankLeft: { flex: 1 },
  yourRankLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  yourRankValue: { fontSize: 32, fontWeight: '900', color: '#fff' },
  yourRankStats: { alignItems: 'flex-end' },
  yourRankStat: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 4 },
  bottomSpacing: { height: 40 },
});
