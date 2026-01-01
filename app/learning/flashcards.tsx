/**
 * Flashcards Screen
 * Features: Spaced repetition, flip cards, progress tracking
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const FLASHCARD_SETS = [
  { id: 1, title: 'React Native Basics', course: 'React Native Masterclass', cards: 24, mastered: 18, icon: 'logo-react', color: '#61DAFB' },
  { id: 2, title: 'JavaScript ES6', course: 'JavaScript Fundamentals', cards: 32, mastered: 20, icon: 'logo-javascript', color: '#F7DF1E' },
  { id: 3, title: 'UI Design Principles', course: 'UI/UX Design', cards: 16, mastered: 10, icon: 'color-palette', color: '#EC4899' },
  { id: 4, title: 'Git Commands', course: 'Version Control', cards: 20, mastered: 15, icon: 'git-branch', color: '#F05032' },
];

const SAMPLE_CARDS = [
  { id: 1, front: 'What is useState?', back: 'A React Hook that lets you add state to functional components. Returns an array with the current state value and a function to update it.' },
  { id: 2, front: 'Explain useEffect', back: 'A Hook that lets you perform side effects in functional components. It runs after every render by default, but can be controlled with dependencies.' },
  { id: 3, front: 'What is JSX?', back: 'JavaScript XML - a syntax extension that allows you to write HTML-like code in JavaScript. Gets compiled to React.createElement() calls.' },
];

export default function FlashcardsScreen() {
  const router = useRouter();
  const [selectedSet, setSelectedSet] = useState<number | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<number[]>([]);

  const flipRotation = useSharedValue(0);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    flipRotation.value = withTiming(isFlipped ? 0 : 180, { duration: 400 });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${flipRotation.value}deg` }],
    opacity: flipRotation.value > 90 ? 0 : 1,
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${flipRotation.value - 180}deg` }],
    opacity: flipRotation.value > 90 ? 1 : 0,
  }));

  const handleMastered = () => {
    setMasteredCards([...masteredCards, SAMPLE_CARDS[currentCardIndex].id]);
    handleNext();
  };

  const handleNext = () => {
    if (currentCardIndex < SAMPLE_CARDS.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      flipRotation.value = 0;
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      flipRotation.value = 0;
    }
  };

  if (selectedSet) {
    const currentCard = SAMPLE_CARDS[currentCardIndex];
    const progress = ((currentCardIndex + 1) / SAMPLE_CARDS.length) * 100;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedSet(null)}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Study Session</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentCardIndex + 1} / {SAMPLE_CARDS.length}
          </Text>
        </View>

        <View style={styles.studyContent}>
          {/* Flashcard */}
          <TouchableOpacity activeOpacity={0.9} onPress={handleFlip} style={styles.cardContainer}>
            <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>QUESTION</Text>
                </View>
              </View>
              <Text style={styles.cardText}>{currentCard.front}</Text>
              <View style={styles.cardHint}>
                <Ionicons name="hand-left-outline" size={20} color="#9CA3AF" />
                <Text style={styles.cardHintText}>Tap to flip</Text>
              </View>
            </Animated.View>

            <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardBadge, { backgroundColor: '#D1FAE5' }]}>
                  <Text style={[styles.cardBadgeText, { color: '#10B981' }]}>ANSWER</Text>
                </View>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.cardText}>{currentCard.back}</Text>
              </ScrollView>
            </Animated.View>
          </TouchableOpacity>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.navButton, currentCardIndex === 0 && styles.navButtonDisabled]}
              onPress={handlePrevious}
              disabled={currentCardIndex === 0}
            >
              <Ionicons name="chevron-back" size={24} color={currentCardIndex === 0 ? '#D1D5DB' : '#6366F1'} />
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleNext}>
                <View style={styles.actionIcon}>
                  <Ionicons name="close" size={28} color="#EF4444" />
                </View>
                <Text style={styles.actionText}>Again</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleMastered}>
                <View style={[styles.actionIcon, { backgroundColor: '#D1FAE5' }]}>
                  <Ionicons name="checkmark" size={28} color="#10B981" />
                </View>
                <Text style={styles.actionText}>Got it</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.navButton, currentCardIndex === SAMPLE_CARDS.length - 1 && styles.navButtonDisabled]}
              onPress={handleNext}
              disabled={currentCardIndex === SAMPLE_CARDS.length - 1}
            >
              <Ionicons name="chevron-forward" size={24} color={currentCardIndex === SAMPLE_CARDS.length - 1 ? '#D1D5DB' : '#6366F1'} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flashcards</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="layers" size={24} color="#6366F1" />
            </View>
            <Text style={styles.statValue}>{FLASHCARD_SETS.length}</Text>
            <Text style={styles.statLabel}>Card Sets</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(150)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>
              {FLASHCARD_SETS.reduce((sum, set) => sum + set.mastered, 0)}
            </Text>
            <Text style={styles.statLabel}>Mastered</Text>
          </Animated.View>
        </View>

        {/* Flashcard Sets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Card Sets</Text>
          <View style={styles.setsList}>
            {FLASHCARD_SETS.map((set, index) => (
              <Animated.View
                key={set.id}
                entering={FadeInDown.delay(200 + index * 100)}
              >
                <TouchableOpacity
                  style={styles.setCard}
                  onPress={() => setSelectedSet(set.id)}
                >
                  <View style={[styles.setIcon, { backgroundColor: `${set.color}20` }]}>
                    <Ionicons name={set.icon as any} size={32} color={set.color} />
                  </View>
                  <View style={styles.setInfo}>
                    <Text style={styles.setTitle}>{set.title}</Text>
                    <Text style={styles.setCourse}>{set.course}</Text>
                    <View style={styles.setProgress}>
                      <View style={styles.setProgressBar}>
                        <View
                          style={[
                            styles.setProgressFill,
                            { width: `${(set.mastered / set.cards) * 100}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.setProgressText}>
                        {set.mastered}/{set.cards} mastered
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
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
  statsGrid: { flexDirection: 'row', padding: 20, gap: 12 },
  statCard: { flex: 1, padding: 20, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  statIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  setsList: { gap: 12 },
  setCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, gap: 12 },
  setIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  setInfo: { flex: 1 },
  setTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  setCourse: { fontSize: 13, color: '#6B7280', marginBottom: 8 },
  setProgress: { gap: 6 },
  setProgressBar: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  setProgressFill: { height: '100%', backgroundColor: '#6366F1', borderRadius: 3 },
  setProgressText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  bottomSpacing: { height: 20 },
  // Study Mode
  progressContainer: { padding: 20, backgroundColor: '#fff' },
  progressBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#6366F1', borderRadius: 4 },
  progressText: { fontSize: 14, fontWeight: '700', color: '#6B7280', textAlign: 'center' },
  studyContent: { flex: 1, padding: 20 },
  cardContainer: { flex: 1, marginBottom: 20 },
  card: { position: 'absolute', width: width - 40, minHeight: 400, padding: 24, backgroundColor: '#fff', borderRadius: 24, backfaceVisibility: 'hidden' },
  cardFront: {},
  cardBack: {},
  cardHeader: { marginBottom: 20 },
  cardBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#EEF2FF', borderRadius: 8 },
  cardBadgeText: { fontSize: 11, fontWeight: '800', color: '#6366F1' },
  cardText: { fontSize: 20, fontWeight: '700', color: '#1F2937', lineHeight: 32, flex: 1 },
  cardHint: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 'auto' },
  cardHintText: { fontSize: 14, fontWeight: '600', color: '#9CA3AF' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  navButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  navButtonDisabled: { opacity: 0.4 },
  actionButtons: { flexDirection: 'row', gap: 12, flex: 1, justifyContent: 'center' },
  actionButton: { alignItems: 'center', gap: 8 },
  actionIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' },
  actionText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
});
