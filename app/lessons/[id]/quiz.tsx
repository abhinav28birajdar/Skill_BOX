/**
 * Quiz/Assessment Page
 * Features: Multiple question types, timer, progress, flag for review
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const QUIZ_DATA = {
  title: 'React Native Fundamentals Quiz',
  duration: 1800, // 30 minutes in seconds
  totalQuestions: 20,
  questions: [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the primary purpose of React Native?',
      options: [
        'To build websites',
        'To build mobile applications',
        'To build desktop applications',
        'To build game engines'
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: 'multiple-answer',
      question: 'Which of the following are React Native components? (Select all that apply)',
      options: ['View', 'Text', 'Div', 'Image', 'Span'],
      correctAnswers: [0, 1, 3],
    },
    {
      id: 3,
      type: 'true-false',
      question: 'React Native apps can run on both iOS and Android platforms.',
      correctAnswer: true,
    },
  ],
};

export default function QuizScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [flagged, setFlagged] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_DATA.duration);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const question = QUIZ_DATA.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_DATA.totalQuestions) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswer = (answerIndex: number) => {
    if (question.type === 'multiple-answer') {
      const current = answers[question.id] || [];
      const newAnswers = current.includes(answerIndex)
        ? current.filter((i: number) => i !== answerIndex)
        : [...current, answerIndex];
      setAnswers({ ...answers, [question.id]: newAnswers });
    } else if (question.type === 'multiple-choice') {
      setAnswers({ ...answers, [question.id]: answerIndex });
    }
  };

  const handleTrueFalse = (value: boolean) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const toggleFlag = () => {
    setFlagged(
      flagged.includes(question.id)
        ? flagged.filter((id) => id !== question.id)
        : [...flagged, question.id]
    );
  };

  const handleSubmit = () => {
    router.push(`/lessons/${id}/quiz/results`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.timer}>
          <Ionicons name="time-outline" size={20} color="#EF4444" />
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        </View>
        <TouchableOpacity onPress={toggleFlag}>
          <Ionicons 
            name={flagged.includes(question.id) ? 'flag' : 'flag-outline'} 
            size={24} 
            color={flagged.includes(question.id) ? '#EF4444' : '#6B7280'} 
          />
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>Question {currentQuestion + 1} of {QUIZ_DATA.totalQuestions}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Question {currentQuestion + 1}</Text>
          <Text style={styles.questionText}>{question.question}</Text>

          {/* Multiple Choice / Multiple Answer */}
          {(question.type === 'multiple-choice' || question.type === 'multiple-answer') && (
            <View style={styles.optionsContainer}>
              {question.options?.map((option, index) => {
                const isSelected = question.type === 'multiple-answer'
                  ? (answers[question.id] || []).includes(index)
                  : answers[question.id] === index;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => handleAnswer(index)}
                  >
                    <View style={[styles.optionRadio, isSelected && styles.optionRadioSelected]}>
                      {isSelected && <View style={styles.optionRadioDot} />}
                    </View>
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* True/False */}
          {question.type === 'true-false' && (
            <View style={styles.trueFalseContainer}>
              <TouchableOpacity
                style={[styles.trueFalseButton, answers[question.id] === true && styles.trueFalseSelected]}
                onPress={() => handleTrueFalse(true)}
              >
                <Ionicons 
                  name="checkmark-circle" 
                  size={32} 
                  color={answers[question.id] === true ? '#10B981' : '#D1D5DB'} 
                />
                <Text style={[styles.trueFalseText, answers[question.id] === true && styles.trueFalseTextSelected]}>
                  True
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.trueFalseButton, answers[question.id] === false && styles.trueFalseSelected]}
                onPress={() => handleTrueFalse(false)}
              >
                <Ionicons 
                  name="close-circle" 
                  size={32} 
                  color={answers[question.id] === false ? '#EF4444' : '#D1D5DB'} 
                />
                <Text style={[styles.trueFalseText, answers[question.id] === false && styles.trueFalseTextSelected]}>
                  False
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestion === 0 && styles.navButtonDisabled]}
            onPress={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <Ionicons name="chevron-back" size={20} color={currentQuestion === 0 ? '#D1D5DB' : '#6366F1'} />
            <Text style={[styles.navButtonText, currentQuestion === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          {currentQuestion < QUIZ_DATA.questions.length - 1 ? (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentQuestion(currentQuestion + 1)}
            >
              <Text style={styles.navButtonText}>Next</Text>
              <Ionicons name="chevron-forward" size={20} color="#6366F1" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => setShowSubmitConfirm(true)}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                <Text style={styles.submitText}>Submit Quiz</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="alert-circle-outline" size={48} color="#F59E0B" />
            <Text style={styles.modalTitle}>Submit Quiz?</Text>
            <Text style={styles.modalText}>
              You have answered {Object.keys(answers).length} out of {QUIZ_DATA.totalQuestions} questions.
              {flagged.length > 0 && ` ${flagged.length} question(s) are flagged for review.`}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowSubmitConfirm(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Review</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={handleSubmit}
              >
                <Text style={styles.modalButtonPrimaryText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timerText: { fontSize: 16, fontWeight: '700', color: '#EF4444' },
  progressContainer: { padding: 20, backgroundColor: '#fff' },
  progressBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 8, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 14, fontWeight: '600', color: '#6B7280', textAlign: 'center' },
  content: { flex: 1 },
  questionCard: { margin: 20, padding: 24, backgroundColor: '#fff', borderRadius: 16 },
  questionNumber: { fontSize: 14, fontWeight: '700', color: '#6366F1', marginBottom: 12 },
  questionText: { fontSize: 18, fontWeight: '700', color: '#1F2937', lineHeight: 28, marginBottom: 24 },
  optionsContainer: { gap: 12 },
  option: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 2, borderColor: 'transparent', gap: 12 },
  optionSelected: { backgroundColor: '#EEF2FF', borderColor: '#6366F1' },
  optionRadio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  optionRadioSelected: { borderColor: '#6366F1' },
  optionRadioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#6366F1' },
  optionText: { flex: 1, fontSize: 15, color: '#4B5563' },
  optionTextSelected: { color: '#1F2937', fontWeight: '600' },
  trueFalseContainer: { flexDirection: 'row', gap: 16 },
  trueFalseButton: { flex: 1, alignItems: 'center', padding: 24, backgroundColor: '#F9FAFB', borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
  trueFalseSelected: { backgroundColor: '#EEF2FF', borderColor: '#6366F1' },
  trueFalseText: { fontSize: 16, fontWeight: '600', color: '#6B7280', marginTop: 8 },
  trueFalseTextSelected: { color: '#1F2937' },
  navigation: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, gap: 12 },
  navButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', gap: 6 },
  navButtonDisabled: { opacity: 0.5 },
  navButtonText: { fontSize: 15, fontWeight: '600', color: '#6366F1' },
  navButtonTextDisabled: { color: '#D1D5DB' },
  submitButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  submitGradient: { paddingVertical: 14, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  bottomSpacing: { height: 40 },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginTop: 16, marginBottom: 8 },
  modalText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  modalButtonSecondary: { flex: 1, paddingVertical: 12, backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center' },
  modalButtonSecondaryText: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  modalButtonPrimary: { flex: 1, paddingVertical: 12, backgroundColor: '#6366F1', borderRadius: 12, alignItems: 'center' },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
