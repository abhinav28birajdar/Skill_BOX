/**
 * Quiz Results Page
 * Features: Score, time spent, correct/incorrect breakdown, review answers
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const RESULTS_DATA = {
  score: 85,
  totalQuestions: 20,
  correctAnswers: 17,
  incorrectAnswers: 3,
  skippedQuestions: 0,
  timeSpent: 1245, // seconds
  passingScore: 70,
  xpEarned: 150,
  nextSteps: [
    { title: 'Review incorrect answers', icon: 'book-outline', action: 'review' },
    { title: 'Continue to next lesson', icon: 'play-circle-outline', action: 'next' },
    { title: 'Retake quiz', icon: 'refresh-outline', action: 'retake' },
  ],
};

export default function QuizResultsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const passed = RESULTS_DATA.score >= RESULTS_DATA.passingScore;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={passed ? ['#10B981', '#059669'] : ['#6366F1', '#8B5CF6']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.replace(`/lessons/${id}`)} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.delay(100)} style={styles.scoreContainer}>
          <Ionicons name={passed ? 'checkmark-circle' : 'trophy'} size={80} color="#fff" />
          <Text style={styles.scoreTitle}>{passed ? 'Congratulations!' : 'Quiz Complete!'}</Text>
          <Text style={styles.scoreValue}>{RESULTS_DATA.score}%</Text>
          <Text style={styles.scoreSubtitle}>
            {RESULTS_DATA.correctAnswers} out of {RESULTS_DATA.totalQuestions} correct
          </Text>

          {passed && (
            <View style={styles.xpBadge}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.xpText}>+{RESULTS_DATA.xpEarned} XP</Text>
            </View>
          )}
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(200)} style={[styles.statCard, { backgroundColor: '#10B981' }]}>
            <Ionicons name="checkmark-circle" size={32} color="#fff" />
            <Text style={styles.statValue}>{RESULTS_DATA.correctAnswers}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)} style={[styles.statCard, { backgroundColor: '#EF4444' }]}>
            <Ionicons name="close-circle" size={32} color="#fff" />
            <Text style={styles.statValue}>{RESULTS_DATA.incorrectAnswers}</Text>
            <Text style={styles.statLabel}>Incorrect</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)} style={[styles.statCard, { backgroundColor: '#6366F1' }]}>
            <Ionicons name="time-outline" size={32} color="#fff" />
            <Text style={styles.statValue}>{formatTime(RESULTS_DATA.timeSpent)}</Text>
            <Text style={styles.statLabel}>Time Spent</Text>
          </Animated.View>
        </View>

        {/* Performance Message */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.messageCard}>
          {passed ? (
            <>
              <Text style={styles.messageTitle}>Excellent Work! 🎉</Text>
              <Text style={styles.messageText}>
                You've demonstrated a strong understanding of the material. Keep up the great work!
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.messageTitle}>Keep Learning! 📚</Text>
              <Text style={styles.messageText}>
                Review the material and try again. You're making progress! Passing score is {RESULTS_DATA.passingScore}%.
              </Text>
            </>
          )}
        </Animated.View>

        {/* Next Steps */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>What's Next?</Text>
          <View style={styles.actionsList}>
            {RESULTS_DATA.nextSteps.map((step, index) => (
              <TouchableOpacity key={index} style={styles.actionCard}>
                <View style={styles.actionIcon}>
                  <Ionicons name={step.icon as any} size={24} color="#6366F1" />
                </View>
                <Text style={styles.actionTitle}>{step.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Question Breakdown */}
        <Animated.View entering={FadeInDown.delay(700)} style={styles.section}>
          <Text style={styles.sectionTitle}>Question Breakdown</Text>
          <View style={styles.breakdownCard}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => {
              const isCorrect = num <= RESULTS_DATA.correctAnswers;
              return (
                <View
                  key={num}
                  style={[
                    styles.questionBadge,
                    { backgroundColor: isCorrect ? '#D1FAE5' : '#FEE2E2' },
                  ]}
                >
                  <Text
                    style={[
                      styles.questionBadgeText,
                      { color: isCorrect ? '#059669' : '#DC2626' },
                    ]}
                  >
                    {num}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Review Answers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryGradient}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, alignItems: 'center' },
  closeButton: { alignSelf: 'flex-end' },
  scoreContainer: { alignItems: 'center', marginTop: 20 },
  scoreTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginTop: 16 },
  scoreValue: { fontSize: 64, fontWeight: '900', color: '#fff', marginTop: 8 },
  scoreSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  xpBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 16 },
  xpText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  content: { flex: 1 },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, gap: 12 },
  statCard: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center', gap: 8 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  messageCard: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16 },
  messageTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  messageText: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  actionsList: { gap: 12 },
  actionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12, gap: 12 },
  actionIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  actionTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1F2937' },
  breakdownCard: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  questionBadge: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  questionBadgeText: { fontSize: 14, fontWeight: '700' },
  bottomSpacing: { height: 20 },
  bottomBar: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 12 },
  secondaryButton: { flex: 1, paddingVertical: 14, backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center' },
  secondaryButtonText: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  primaryButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  primaryGradient: { paddingVertical: 14, alignItems: 'center' },
  primaryButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
