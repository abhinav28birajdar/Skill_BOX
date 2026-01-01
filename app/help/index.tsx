/**
 * Help Center Page
 * Features: FAQs, search help topics, contact support
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const FAQ_CATEGORIES = [
  { id: 1, title: 'Getting Started', icon: 'rocket-outline', count: 12, color: '#6366F1' },
  { id: 2, title: 'Payments & Billing', icon: 'card-outline', count: 8, color: '#10B981' },
  { id: 3, title: 'Courses & Learning', icon: 'book-outline', count: 15, color: '#F59E0B' },
  { id: 4, title: 'Technical Issues', icon: 'bug-outline', count: 10, color: '#EF4444' },
];

const POPULAR_FAQS = [
  {
    id: 1,
    question: 'How do I reset my password?',
    answer: 'Go to Settings > Account > Change Password. You will receive an email with reset instructions.',
  },
  {
    id: 2,
    question: 'Can I download courses for offline viewing?',
    answer: 'Yes! Premium users can download courses for offline access. Tap the download icon on any lesson.',
  },
  {
    id: 3,
    question: 'How do I get a refund?',
    answer: 'Refunds are available within 30 days of purchase. Go to Payment History and select Request Refund.',
  },
];

const SUPPORT_OPTIONS = [
  { id: 1, title: 'Email Support', subtitle: 'support@skillbox.com', icon: 'mail-outline', action: 'email' },
  { id: 2, title: 'Live Chat', subtitle: 'Available 9AM - 5PM EST', icon: 'chatbubble-outline', action: 'chat' },
  { id: 3, title: 'Call Us', subtitle: '+1 (800) 123-4567', icon: 'call-outline', action: 'phone' },
];

export default function HelpScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleSupportAction = (action: string, value: string) => {
    switch (action) {
      case 'email':
        Linking.openURL(`mailto:${value}`);
        break;
      case 'phone':
        Linking.openURL(`tel:${value.replace(/[^\d+]/g, '')}`);
        break;
      case 'chat':
        // Navigate to chat
        router.push('/messages');
        break;
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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search help articles..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* FAQ Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <View style={styles.categoriesGrid}>
            {FAQ_CATEGORIES.map((category, index) => (
              <Animated.View key={category.id} entering={FadeInDown.delay(index * 100)} style={styles.categoryCard}>
                <TouchableOpacity style={styles.categoryContent}>
                  <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
                    <Ionicons name={category.icon as any} size={28} color={category.color} />
                  </View>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryCount}>{category.count} articles</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Popular FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {POPULAR_FAQS.map((faq, index) => (
              <Animated.View key={faq.id} entering={FadeInDown.delay(index * 100)} style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons
                    name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
                {expandedFAQ === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Contact Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.supportList}>
            {SUPPORT_OPTIONS.map((option, index) => (
              <Animated.View key={option.id} entering={FadeInDown.delay(index * 100)}>
                <TouchableOpacity
                  style={styles.supportCard}
                  onPress={() => handleSupportAction(option.action, option.subtitle)}
                >
                  <View style={styles.supportIcon}>
                    <Ionicons name={option.icon as any} size={24} color="#6366F1" />
                  </View>
                  <View style={styles.supportInfo}>
                    <Text style={styles.supportTitle}>{option.title}</Text>
                    <Text style={styles.supportSubtitle}>{option.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Submit Ticket */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.ticketCard}>
          <Text style={styles.ticketTitle}>Can't find what you're looking for?</Text>
          <Text style={styles.ticketSubtitle}>Submit a support ticket and we'll get back to you within 24 hours</Text>
          <TouchableOpacity style={styles.ticketButton}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ticketGradient}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.ticketButtonText}>Submit a Ticket</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  content: { flex: 1 },
  searchContainer: { padding: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 12, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#1F2937' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: { width: '48%' },
  categoryContent: { padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  categoryIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  categoryTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', textAlign: 'center', marginBottom: 4 },
  categoryCount: { fontSize: 13, color: '#6B7280' },
  faqList: { gap: 12 },
  faqCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  faqQuestion: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1F2937', marginRight: 8 },
  faqAnswer: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 0, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  faqAnswerText: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  supportList: { gap: 12 },
  supportCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  supportIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  supportInfo: { flex: 1 },
  supportTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  supportSubtitle: { fontSize: 13, color: '#6B7280' },
  ticketCard: { marginHorizontal: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16, marginBottom: 20 },
  ticketTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  ticketSubtitle: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 16 },
  ticketButton: { borderRadius: 12, overflow: 'hidden' },
  ticketGradient: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, gap: 8 },
  ticketButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  bottomSpacing: { height: 40 },
});
