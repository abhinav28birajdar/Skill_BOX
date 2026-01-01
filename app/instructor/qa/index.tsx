/**
 * Instructor Q&A Management
 * Features: Student questions, answers, filter by status
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const QA_TABS = ['All', 'Unanswered', 'Answered'];

const QUESTIONS = [
  {
    id: 1,
    student: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    course: 'React Native Masterclass',
    lesson: 'State Management',
    question: 'How do I pass data from child to parent component in React Native?',
    time: '2 hours ago',
    status: 'unanswered',
    upvotes: 5,
  },
  {
    id: 2,
    student: 'Mike Chen',
    avatar: 'https://i.pravatar.cc/150?img=2',
    course: 'React Native Masterclass',
    lesson: 'Navigation',
    question: 'What is the difference between Stack and Tab navigation?',
    time: '5 hours ago',
    status: 'answered',
    answer: 'Stack navigation allows you to navigate between screens in a stack, while Tab navigation shows multiple screens in tabs at the bottom or top.',
    upvotes: 12,
    answerTime: '4 hours ago',
  },
  {
    id: 3,
    student: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    course: 'UI/UX Design Fundamentals',
    lesson: 'Color Theory',
    question: 'Can you explain the difference between RGB and HSL color models?',
    time: '1 day ago',
    status: 'unanswered',
    upvotes: 3,
  },
  {
    id: 4,
    student: 'David Brown',
    avatar: 'https://i.pravatar.cc/150?img=4',
    course: 'React Native Masterclass',
    lesson: 'Hooks',
    question: 'When should I use useCallback vs useMemo?',
    time: '2 days ago',
    status: 'answered',
    answer: 'Use useCallback to memoize functions and useMemo to memoize computed values. useCallback is for preventing function re-creation, useMemo is for expensive calculations.',
    upvotes: 8,
    answerTime: '1 day ago',
  },
];

export default function InstructorQAScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('All');
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState('');

  const filteredQuestions = QUESTIONS.filter((q) => {
    if (selectedTab === 'All') return true;
    if (selectedTab === 'Unanswered') return q.status === 'unanswered';
    if (selectedTab === 'Answered') return q.status === 'answered';
    return true;
  });

  const handleSubmitAnswer = () => {
    console.log('Submit answer:', answerText);
    setSelectedQuestion(null);
    setAnswerText('');
  };

  if (selectedQuestion) {
    const question = QUESTIONS.find((q) => q.id === selectedQuestion);
    if (!question) return null;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" />

        <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedQuestion(null)}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Answer Question</Text>
          <View style={{ width: 24 }} />
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Question Details */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.questionDetail}>
            <View style={styles.studentHeader}>
              <View style={styles.studentAvatar}>
                <Text style={styles.studentAvatarText}>
                  {question.student.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{question.student}</Text>
                <Text style={styles.questionTime}>{question.time}</Text>
              </View>
            </View>

            <View style={styles.questionContext}>
              <View style={styles.contextItem}>
                <Ionicons name="book-outline" size={16} color="#6366F1" />
                <Text style={styles.contextText}>{question.course}</Text>
              </View>
              <View style={styles.contextItem}>
                <Ionicons name="play-circle-outline" size={16} color="#6366F1" />
                <Text style={styles.contextText}>{question.lesson}</Text>
              </View>
            </View>

            <Text style={styles.questionText}>{question.question}</Text>

            <View style={styles.questionMeta}>
              <View style={styles.upvoteButton}>
                <Ionicons name="arrow-up" size={16} color="#6B7280" />
                <Text style={styles.upvoteText}>{question.upvotes} upvotes</Text>
              </View>
            </View>
          </Animated.View>

          {/* Answer Form */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.answerForm}>
            <Text style={styles.formLabel}>Your Answer</Text>
            <TextInput
              style={styles.answerInput}
              value={answerText}
              onChangeText={setAnswerText}
              placeholder="Type your answer here..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />

            {/* Tips */}
            <View style={styles.tipsCard}>
              <Ionicons name="bulb-outline" size={20} color="#F59E0B" />
              <Text style={styles.tipsText}>
                Be clear and concise. Include examples if helpful.
              </Text>
            </View>
          </Animated.View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.submitButton, !answerText.trim() && styles.submitButtonDisabled]}
            onPress={handleSubmitAnswer}
            disabled={!answerText.trim()}
          >
            <LinearGradient colors={['#10B981', '#059669']} style={styles.submitButtonGradient}>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </LinearGradient>
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Q&A Management</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {QA_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.tabActive]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
              {tab === 'Unanswered' && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>
                    {QUESTIONS.filter((q) => q.status === 'unanswered').length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="help-circle" size={24} color="#6366F1" />
            </View>
            <Text style={styles.statValue}>{QUESTIONS.length}</Text>
            <Text style={styles.statLabel}>Total Questions</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(150)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="alert-circle" size={24} color="#EF4444" />
            </View>
            <Text style={styles.statValue}>
              {QUESTIONS.filter((q) => q.status === 'unanswered').length}
            </Text>
            <Text style={styles.statLabel}>Unanswered</Text>
          </Animated.View>
        </View>

        {/* Questions List */}
        <View style={styles.questionsList}>
          {filteredQuestions.map((question, index) => (
            <Animated.View
              key={question.id}
              entering={FadeInDown.delay(200 + index * 100)}
            >
              <TouchableOpacity
                style={styles.questionCard}
                onPress={() => setSelectedQuestion(question.id)}
              >
                <View style={styles.questionHeader}>
                  <View style={styles.studentAvatar}>
                    <Text style={styles.studentAvatarText}>
                      {question.student.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.questionHeaderInfo}>
                    <Text style={styles.studentName}>{question.student}</Text>
                    <Text style={styles.questionCourse}>{question.course}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      question.status === 'answered' && styles.statusBadgeAnswered,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        question.status === 'answered' && styles.statusTextAnswered,
                      ]}
                    >
                      {question.status === 'answered' ? 'Answered' : 'Pending'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.questionCardText} numberOfLines={2}>
                  {question.question}
                </Text>

                <View style={styles.questionFooter}>
                  <View style={styles.questionMeta}>
                    <Ionicons name="play-circle-outline" size={14} color="#6B7280" />
                    <Text style={styles.questionMetaText}>{question.lesson}</Text>
                  </View>
                  <View style={styles.questionMetaDivider} />
                  <Text style={styles.questionTime}>{question.time}</Text>
                  <View style={styles.questionMetaDivider} />
                  <View style={styles.upvoteCount}>
                    <Ionicons name="arrow-up" size={14} color="#6B7280" />
                    <Text style={styles.questionMetaText}>{question.upvotes}</Text>
                  </View>
                </View>

                {question.answer && (
                  <View style={styles.answerPreview}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.answerPreviewText} numberOfLines={1}>
                      {question.answer}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
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
  tabsContainer: { backgroundColor: '#fff', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tabsScroll: { paddingHorizontal: 20 },
  tab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, marginRight: 12, backgroundColor: '#F3F4F6', borderRadius: 20, gap: 6 },
  tabActive: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  tabBadge: { paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#EF4444', borderRadius: 10 },
  tabBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  content: { flex: 1 },
  statsGrid: { flexDirection: 'row', padding: 20, gap: 12 },
  statCard: { flex: 1, padding: 20, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  statIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280', textAlign: 'center' },
  questionsList: { paddingHorizontal: 20, gap: 12 },
  questionCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  questionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  studentAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  studentAvatarText: { fontSize: 14, fontWeight: '800', color: '#6366F1' },
  questionHeaderInfo: { flex: 1 },
  studentName: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  questionCourse: { fontSize: 12, color: '#6B7280' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#FEF3C7', borderRadius: 12 },
  statusBadgeAnswered: { backgroundColor: '#D1FAE5' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#F59E0B' },
  statusTextAnswered: { color: '#10B981' },
  questionCardText: { fontSize: 15, fontWeight: '600', color: '#1F2937', lineHeight: 22, marginBottom: 12 },
  questionFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  questionMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  questionMetaText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  questionMetaDivider: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#D1D5DB' },
  questionTime: { fontSize: 12, color: '#9CA3AF' },
  upvoteCount: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  answerPreview: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, padding: 12, backgroundColor: '#F0FDF4', borderRadius: 12 },
  answerPreviewText: { flex: 1, fontSize: 13, color: '#059669' },
  bottomSpacing: { height: 20 },
  // Answer Screen
  questionDetail: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16 },
  studentHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  studentInfo: { flex: 1 },
  questionContext: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  contextItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#EEF2FF', borderRadius: 12 },
  contextText: { fontSize: 12, fontWeight: '600', color: '#6366F1' },
  questionText: { fontSize: 16, fontWeight: '600', color: '#1F2937', lineHeight: 24, marginBottom: 16 },
  upvoteButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F9FAFB', borderRadius: 12 },
  upvoteText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  answerForm: { margin: 20, marginTop: 0, padding: 20, backgroundColor: '#fff', borderRadius: 16 },
  formLabel: { fontSize: 15, fontWeight: '800', color: '#1F2937', marginBottom: 12 },
  answerInput: { padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12, fontSize: 15, color: '#1F2937', lineHeight: 22, minHeight: 160, marginBottom: 16 },
  tipsCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#FEF3C7', borderRadius: 12 },
  tipsText: { flex: 1, fontSize: 13, color: '#92400E', lineHeight: 18 },
  bottomBar: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  submitButton: { borderRadius: 12, overflow: 'hidden' },
  submitButtonDisabled: { opacity: 0.4 },
  submitButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  submitButtonText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
