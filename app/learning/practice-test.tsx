/**
 * Practice Test Screen
 * Features: Mock exams, timed tests, immediate feedback
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRACTICE_TESTS = [
  { id: 1, title: 'React Native Fundamentals', questions: 20, duration: 30, difficulty: 'Beginner', attempts: 3, bestScore: 85, icon: 'logo-react', color: '#61DAFB' },
  { id: 2, title: 'JavaScript ES6 Assessment', questions: 25, duration: 40, difficulty: 'Intermediate', attempts: 2, bestScore: 72, icon: 'logo-javascript', color: '#F7DF1E' },
  { id: 3, title: 'UI/UX Design Principles', questions: 15, duration: 25, difficulty: 'Beginner', attempts: 1, bestScore: 90, icon: 'color-palette', color: '#EC4899' },
  { id: 4, title: 'Advanced Hooks & Patterns', questions: 30, duration: 45, difficulty: 'Advanced', attempts: 0, bestScore: null, icon: 'code-slash', color: '#8B5CF6' },
];

const TEST_QUESTIONS = [
  {
    id: 1,
    question: 'What is the purpose of useState in React?',
    options: [
      'To manage component state',
      'To make API calls',
      'To handle routing',
      'To style components',
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: 'Which hook is used for side effects?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: 'What does JSX stand for?',
    options: [
      'JavaScript XML',
      'Java Syntax Extension',
      'JavaScript Extended',
      'Java XML',
    ],
    correctAnswer: 0,
  },
];

export default function PracticeTestScreen() {
  const router = useRouter();
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(TEST_QUESTIONS.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < TEST_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === TEST_QUESTIONS[index].correctAnswer) correct++;
    });
    return Math.round((correct / TEST_QUESTIONS.length) * 100);
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" />

        <LinearGradient
          colors={passed ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => {
            setSelectedTest(null);
            setCurrentQuestion(0);
            setAnswers(Array(TEST_QUESTIONS.length).fill(null));
            setShowResults(false);
          }}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Test Results</Text>
          <View style={{ width: 24 }} />
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.resultsCard}>
            <LinearGradient
              colors={passed ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
              style={styles.scoreCircle}
            >
              <Text style={styles.scoreValue}>{score}%</Text>
              <Text style={styles.scoreLabel}>{passed ? 'Passed!' : 'Keep Trying'}</Text>
            </LinearGradient>

            <View style={styles.resultsStats}>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatValue}>
                  {answers.filter((a, i) => a === TEST_QUESTIONS[i].correctAnswer).length}
                </Text>
                <Text style={styles.resultStatLabel}>Correct</Text>
              </View>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatValue}>
                  {answers.filter((a, i) => a !== null && a !== TEST_QUESTIONS[i].correctAnswer).length}
                </Text>
                <Text style={styles.resultStatLabel}>Incorrect</Text>
              </View>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatValue}>
                  {answers.filter((a) => a === null).length}
                </Text>
                <Text style={styles.resultStatLabel}>Skipped</Text>
              </View>
            </View>
          </Animated.View>

          {/* Review Answers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Review Answers</Text>
            <View style={styles.reviewList}>
              {TEST_QUESTIONS.map((q, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === q.correctAnswer;
                const isSkipped = userAnswer === null;

                return (
                  <Animated.View
                    key={q.id}
                    entering={FadeInDown.delay(200 + index * 100)}
                    style={styles.reviewItem}
                  >
                    <View style={styles.reviewHeader}>
                      <View
                        style={[
                          styles.reviewIcon,
                          isSkipped
                            ? styles.reviewIconSkipped
                            : isCorrect
                            ? styles.reviewIconCorrect
                            : styles.reviewIconIncorrect,
                        ]}
                      >
                        <Ionicons
                          name={
                            isSkipped
                              ? 'help-circle'
                              : isCorrect
                              ? 'checkmark-circle'
                              : 'close-circle'
                          }
                          size={24}
                          color={
                            isSkipped ? '#F59E0B' : isCorrect ? '#10B981' : '#EF4444'
                          }
                        />
                      </View>
                      <Text style={styles.reviewQuestion}>Question {index + 1}</Text>
                    </View>
                    <Text style={styles.reviewQuestionText}>{q.question}</Text>
                    {userAnswer !== null && (
                      <View style={styles.reviewAnswer}>
                        <Text style={styles.reviewAnswerLabel}>Your answer:</Text>
                        <Text
                          style={[
                            styles.reviewAnswerText,
                            isCorrect && styles.reviewAnswerCorrect,
                            !isCorrect && styles.reviewAnswerIncorrect,
                          ]}
                        >
                          {q.options[userAnswer]}
                        </Text>
                      </View>
                    )}
                    {!isCorrect && (
                      <View style={styles.reviewAnswer}>
                        <Text style={styles.reviewAnswerLabel}>Correct answer:</Text>
                        <Text style={[styles.reviewAnswerText, styles.reviewAnswerCorrect]}>
                          {q.options[q.correctAnswer]}
                        </Text>
                      </View>
                    )}
                  </Animated.View>
                );
              })}
            </View>
          </View>

          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setCurrentQuestion(0);
                setAnswers(Array(TEST_QUESTIONS.length).fill(null));
                setShowResults(false);
              }}
            >
              <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.actionButtonGradient}>
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Retake Test</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (selectedTest) {
    const question = TEST_QUESTIONS[currentQuestion];
    const progress = ((currentQuestion + 1) / TEST_QUESTIONS.length) * 100;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" />

        <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedTest(null)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Practice Test</Text>
          <TouchableOpacity>
            <Ionicons name="time-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {TEST_QUESTIONS.length}
          </Text>
        </View>

        <ScrollView style={styles.testContent} showsVerticalScrollIndicator={false}>
          {/* Question */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.questionCard}>
            <Text style={styles.questionNumber}>Question {currentQuestion + 1}</Text>
            <Text style={styles.questionText}>{question.question}</Text>
          </Animated.View>

          {/* Options */}
          <View style={styles.optionsList}>
            {question.options.map((option, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(200 + index * 100)}
              >
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    answers[currentQuestion] === index && styles.optionCardSelected,
                  ]}
                  onPress={() => handleSelectAnswer(index)}
                >
                  <View
                    style={[
                      styles.optionRadio,
                      answers[currentQuestion] === index && styles.optionRadioSelected,
                    ]}
                  >
                    {answers[currentQuestion] === index && (
                      <View style={styles.optionRadioDot} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      answers[currentQuestion] === index && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Navigation */}
        <View style={styles.testNavigation}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestion === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={currentQuestion === 0 ? '#D1D5DB' : '#6366F1'}
            />
            <Text
              style={[
                styles.navButtonText,
                currentQuestion === 0 && styles.navButtonTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          {currentQuestion < TEST_QUESTIONS.length - 1 ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.nextButtonGradient}>
                <Text style={styles.nextButtonText}>Next</Text>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
              <LinearGradient colors={['#10B981', '#059669']} style={styles.nextButtonGradient}>
                <Text style={styles.nextButtonText}>Submit</Text>
                <Ionicons name="checkmark" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Practice Tests</Text>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="information-circle" size={32} color="#6366F1" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Test Your Knowledge</Text>
            <Text style={styles.infoText}>
              Practice tests help you prepare for certifications and assess your understanding
            </Text>
          </View>
        </Animated.View>

        {/* Tests List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Tests</Text>
          <View style={styles.testsList}>
            {PRACTICE_TESTS.map((test, index) => (
              <Animated.View
                key={test.id}
                entering={FadeInDown.delay(200 + index * 100)}
              >
                <TouchableOpacity
                  style={styles.testCard}
                  onPress={() => setSelectedTest(test.id)}
                >
                  <View style={[styles.testIcon, { backgroundColor: `${test.color}20` }]}>
                    <Ionicons name={test.icon as any} size={32} color={test.color} />
                  </View>
                  <View style={styles.testInfo}>
                    <Text style={styles.testTitle}>{test.title}</Text>
                    <View style={styles.testMeta}>
                      <View style={styles.testMetaItem}>
                        <Ionicons name="help-circle-outline" size={14} color="#6B7280" />
                        <Text style={styles.testMetaText}>{test.questions} questions</Text>
                      </View>
                      <View style={styles.testMetaDot} />
                      <View style={styles.testMetaItem}>
                        <Ionicons name="time-outline" size={14} color="#6B7280" />
                        <Text style={styles.testMetaText}>{test.duration} min</Text>
                      </View>
                    </View>
                    <View style={styles.testBadges}>
                      <View
                        style={[
                          styles.difficultyBadge,
                          test.difficulty === 'Beginner' && styles.difficultyBeginner,
                          test.difficulty === 'Intermediate' && styles.difficultyIntermediate,
                          test.difficulty === 'Advanced' && styles.difficultyAdvanced,
                        ]}
                      >
                        <Text style={styles.difficultyText}>{test.difficulty}</Text>
                      </View>
                      {test.bestScore && (
                        <View style={styles.scoreBadge}>
                          <Ionicons name="trophy" size={12} color="#F59E0B" />
                          <Text style={styles.scoreText}>Best: {test.bestScore}%</Text>
                        </View>
                      )}
                    </View>
                    {test.attempts > 0 && (
                      <Text style={styles.attemptsText}>{test.attempts} attempts</Text>
                    )}
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
  infoCard: { flexDirection: 'row', margin: 20, padding: 16, backgroundColor: '#EEF2FF', borderRadius: 16, gap: 12 },
  infoIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 15, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#6B7280', lineHeight: 18 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  testsList: { gap: 12 },
  testCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, gap: 12 },
  testIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  testInfo: { flex: 1 },
  testTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  testMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  testMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  testMetaText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  testMetaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#D1D5DB' },
  testBadges: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  difficultyBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  difficultyBeginner: { backgroundColor: '#D1FAE5' },
  difficultyIntermediate: { backgroundColor: '#FEF3C7' },
  difficultyAdvanced: { backgroundColor: '#FEE2E2' },
  difficultyText: { fontSize: 11, fontWeight: '700', color: '#1F2937' },
  scoreBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#FEF3C7', borderRadius: 6 },
  scoreText: { fontSize: 11, fontWeight: '700', color: '#F59E0B' },
  attemptsText: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  bottomSpacing: { height: 20 },
  // Test Mode
  progressContainer: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  progressBar: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#6366F1', borderRadius: 3 },
  progressText: { fontSize: 14, fontWeight: '700', color: '#6B7280', textAlign: 'center' },
  testContent: { flex: 1 },
  questionCard: { margin: 20, padding: 24, backgroundColor: '#fff', borderRadius: 16 },
  questionNumber: { fontSize: 13, fontWeight: '700', color: '#6366F1', marginBottom: 12 },
  questionText: { fontSize: 18, fontWeight: '700', color: '#1F2937', lineHeight: 28 },
  optionsList: { paddingHorizontal: 20, gap: 12 },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12, gap: 12, borderWidth: 2, borderColor: 'transparent' },
  optionCardSelected: { borderColor: '#6366F1', backgroundColor: '#EEF2FF' },
  optionRadio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  optionRadioSelected: { borderColor: '#6366F1' },
  optionRadioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#6366F1' },
  optionText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#4B5563' },
  optionTextSelected: { color: '#1F2937', fontWeight: '700' },
  testNavigation: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 12 },
  navButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#F3F4F6', borderRadius: 12 },
  navButtonDisabled: { opacity: 0.4 },
  navButtonText: { fontSize: 15, fontWeight: '700', color: '#6366F1' },
  navButtonTextDisabled: { color: '#D1D5DB' },
  nextButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  nextButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  nextButtonText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  // Results
  resultsCard: { margin: 20, padding: 32, backgroundColor: '#fff', borderRadius: 24, alignItems: 'center' },
  scoreCircle: { width: 180, height: 180, borderRadius: 90, justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  scoreValue: { fontSize: 48, fontWeight: '800', color: '#fff', marginBottom: 4 },
  scoreLabel: { fontSize: 16, fontWeight: '700', color: 'rgba(255, 255, 255, 0.9)' },
  resultsStats: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  resultStat: { alignItems: 'center' },
  resultStatValue: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  resultStatLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  reviewList: { gap: 12 },
  reviewItem: { padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  reviewIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  reviewIconCorrect: { backgroundColor: '#D1FAE5' },
  reviewIconIncorrect: { backgroundColor: '#FEE2E2' },
  reviewIconSkipped: { backgroundColor: '#FEF3C7' },
  reviewQuestion: { fontSize: 15, fontWeight: '800', color: '#1F2937' },
  reviewQuestionText: { fontSize: 15, color: '#4B5563', lineHeight: 22, marginBottom: 12 },
  reviewAnswer: { marginTop: 8 },
  reviewAnswerLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 4 },
  reviewAnswerText: { fontSize: 14, fontWeight: '600', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  reviewAnswerCorrect: { color: '#10B981', backgroundColor: '#D1FAE5' },
  reviewAnswerIncorrect: { color: '#EF4444', backgroundColor: '#FEE2E2' },
  bottomActions: { padding: 20 },
  actionButton: { borderRadius: 12, overflow: 'hidden' },
  actionButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  actionButtonText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
