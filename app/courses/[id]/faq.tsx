/**
 * Course FAQ Tab
 * Features: Expandable FAQ accordion
 */

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const FAQS = [
  {
    id: 1,
    question: 'How long do I have access to the course?',
    answer: 'You have lifetime access to the course once you enroll. You can watch the videos and access materials anytime at your own pace.',
  },
  {
    id: 2,
    question: 'What if I am not satisfied with the course?',
    answer: 'We offer a 30-day money-back guarantee. If you are not satisfied with the course for any reason, you can request a full refund within 30 days of purchase.',
  },
  {
    id: 3,
    question: 'Do I need any prior experience?',
    answer: 'Basic knowledge of JavaScript and React is recommended. The course starts with fundamentals but moves quickly to advanced topics.',
  },
  {
    id: 4,
    question: 'Will I receive a certificate?',
    answer: 'Yes! Upon completing all lessons and assignments, you will receive a certificate of completion that you can share on your resume and LinkedIn.',
  },
  {
    id: 5,
    question: 'Can I download the videos?',
    answer: 'Video downloads are available with the Premium plan. With the Standard plan, you can watch videos online anytime.',
  },
  {
    id: 6,
    question: 'How do I ask questions?',
    answer: 'You can ask questions in the course Q&A section, join study groups, or message the instructor directly. We respond within 24 hours.',
  },
  {
    id: 7,
    question: 'Are there any prerequisites?',
    answer: 'You should have a computer with a code editor installed, an internet connection, and basic familiarity with programming concepts.',
  },
  {
    id: 8,
    question: 'Is this course updated regularly?',
    answer: 'Yes! This course is updated regularly to reflect the latest best practices and new features in React Native.',
  },
];

function FAQItem({ faq, index }: { faq: typeof FAQS[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const heightValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(expanded ? heightValue.value : 0, { duration: 300 }),
      opacity: withTiming(expanded ? 1 : 0, { duration: 300 }),
    };
  });

  return (
    <Animated.View entering={FadeInDown.delay(index * 100)} style={styles.faqCard}>
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.faqBody}>
          <Text style={styles.faqAnswer}>{faq.answer}</Text>
        </View>
      )}
    </Animated.View>
  );
}

export default function CourseFAQTab() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
        <Text style={styles.headerSubtitle}>
          Find answers to common questions about this course
        </Text>
      </View>

      {/* FAQs */}
      <View style={styles.faqList}>
        {FAQS.map((faq, index) => (
          <FAQItem key={faq.id} faq={faq} index={index} />
        ))}
      </View>

      {/* Contact Card */}
      <Animated.View entering={FadeInDown.delay(FAQS.length * 100)} style={styles.contactCard}>
        <View style={styles.contactIcon}>
          <Ionicons name="help-circle-outline" size={32} color="#6366F1" />
        </View>
        <Text style={styles.contactTitle}>Still have questions?</Text>
        <Text style={styles.contactText}>
          Can't find the answer you're looking for? Contact our support team.
        </Text>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Contact Support</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 20, backgroundColor: '#fff', marginBottom: 2 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  headerSubtitle: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  faqList: { gap: 2 },
  faqCard: { backgroundColor: '#fff', overflow: 'hidden' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  faqQuestion: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1F2937', marginRight: 12 },
  faqBody: { paddingHorizontal: 20, paddingBottom: 20 },
  faqAnswer: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  contactCard: { margin: 20, padding: 24, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  contactIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  contactTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  contactText: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  contactButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#6366F1', borderRadius: 12 },
  contactButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  bottomSpacing: { height: 20 },
});
