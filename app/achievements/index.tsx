/**
 * Achievements Page
 * Features: Achievement grid, progress, badges, rewards
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const ACHIEVEMENTS = [
  { id: 1, title: 'First Steps', description: 'Complete your first lesson', icon: 'footsteps', unlocked: true, xp: 50, color: ['#10B981', '#059669'] },
  { id: 2, title: 'Week Warrior', description: '7-day learning streak', icon: 'flame', unlocked: true, xp: 100, color: ['#F59E0B', '#D97706'] },
  { id: 3, title: 'Quiz Master', description: 'Score 100% on 5 quizzes', icon: 'trophy', unlocked: true, xp: 150, color: ['#EF4444', '#DC2626'] },
  { id: 4, title: 'Code Ninja', description: 'Complete 10 coding challenges', icon: 'code-slash', unlocked: false, progress: 6, total: 10, xp: 200, color: ['#8B5CF6', '#7C3AED'] },
  { id: 5, title: 'Social Butterfly', description: 'Join 3 study groups', icon: 'people', unlocked: false, progress: 1, total: 3, xp: 75, color: ['#3B82F6', '#2563EB'] },
  { id: 6, title: 'Night Owl', description: 'Study after midnight 5 times', icon: 'moon', unlocked: false, progress: 2, total: 5, xp: 100, color: ['#6366F1', '#4F46E5'] },
  { id: 7, title: 'Speed Reader', description: 'Complete a course in 24 hours', icon: 'flash', unlocked: false, xp: 300, color: ['#F59E0B', '#D97706'] },
  { id: 8, title: 'Mentor', description: 'Help 20 students in forums', icon: 'heart', unlocked: false, progress: 5, total: 20, xp: 250, color: ['#EC4899', '#DB2777'] },
  { id: 9, title: 'Perfectionist', description: 'Get 100% on final exam', icon: 'star', unlocked: false, xp: 500, color: ['#FBBF24', '#F59E0B'] },
];

export default function AchievementsScreen() {
  const router = useRouter();
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const totalXP = ACHIEVEMENTS.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xp, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{unlockedCount}/{ACHIEVEMENTS.length}</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>

        {/* Achievements Grid */}
        <View style={styles.achievementsGrid}>
          {ACHIEVEMENTS.map((achievement, index) => (
            <Animated.View
              key={achievement.id}
              entering={FadeInDown.delay(index * 100)}
              style={styles.achievementCard}
            >
              <LinearGradient
                colors={achievement.unlocked ? achievement.color : ['#E5E7EB', '#D1D5DB']}
                style={styles.achievementIconContainer}
              >
                <Ionicons
                  name={achievement.icon as any}
                  size={32}
                  color={achievement.unlocked ? '#fff' : '#9CA3AF'}
                />
              </LinearGradient>

              <Text style={[styles.achievementTitle, !achievement.unlocked && styles.lockedText]}>
                {achievement.title}
              </Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>

              {achievement.unlocked ? (
                <View style={styles.xpBadge}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.xpText}>+{achievement.xp} XP</Text>
                </View>
              ) : achievement.progress !== undefined ? (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${(achievement.progress / achievement.total!) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {achievement.progress}/{achievement.total}
                  </Text>
                </View>
              ) : (
                <View style={styles.lockedBadge}>
                  <Ionicons name="lock-closed" size={12} color="#9CA3AF" />
                  <Text style={styles.lockedBadgeText}>Locked</Text>
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
  statsContainer: { flexDirection: 'row', padding: 20, gap: 12 },
  statCard: { flex: 1, padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  achievementsGrid: { paddingHorizontal: 20, gap: 16 },
  achievementCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  achievementIconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  achievementTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  achievementDescription: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 12 },
  lockedText: { color: '#9CA3AF' },
  xpBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#FEF3C7', borderRadius: 12 },
  xpText: { fontSize: 12, fontWeight: '700', color: '#F59E0B' },
  progressContainer: { width: '100%' },
  progressBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: '#6366F1' },
  progressText: { fontSize: 12, fontWeight: '600', color: '#6B7280', textAlign: 'center' },
  lockedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F3F4F6', borderRadius: 12 },
  lockedBadgeText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  bottomSpacing: { height: 40 },
});
