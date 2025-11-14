import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  type: 'link' | 'navigation' | 'action';
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function SupportScreen() {
  const { theme } = useTheme();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');

  const supportOptions: SupportOption[] = [
    {
      id: 'help-center',
      title: 'Help Center',
      description: 'Browse articles and guides',
      icon: 'book.fill',
      type: 'link',
      action: () => {
        Linking.openURL('https://skillbox.com/help');
      },
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      description: 'Get help from our team',
      icon: 'envelope.fill',
      type: 'navigation',
      action: () => {
        router.push('/feedback');
      },
    },
    {
      id: 'live-chat',
      title: 'Live Chat',
      description: 'Chat with support agent',
      icon: 'bubble.left.fill',
      type: 'action',
      action: () => {
        Alert.alert('Live Chat', 'Live chat is available Mon-Fri 9AM-6PM PST');
      },
    },
    {
      id: 'phone-support',
      title: 'Phone Support',
      description: 'Call us directly',
      icon: 'phone.fill',
      type: 'action',
      action: () => {
        Alert.alert(
          'Phone Support',
          'Call us at: +1 (555) 123-4567\nHours: Mon-Fri 9AM-6PM PST',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Call Now', onPress: () => Linking.openURL('tel:+15551234567') },
          ]
        );
      },
    },
    {
      id: 'community',
      title: 'Community Forum',
      description: 'Connect with other learners',
      icon: 'person.3.fill',
      type: 'navigation',
      action: () => {
        router.push('/(tabs)/community');
      },
    },
    {
      id: 'feature-request',
      title: 'Feature Request',
      description: 'Suggest new features',
      icon: 'lightbulb.fill',
      type: 'navigation',
      action: () => {
        router.push('/feedback');
      },
    },
  ];

  const faqCategories = [
    { id: 'general', title: 'General' },
    { id: 'account', title: 'Account' },
    { id: 'courses', title: 'Courses' },
    { id: 'billing', title: 'Billing' },
    { id: 'technical', title: 'Technical' },
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'Go to the sign-in page and tap "Forgot Password". Enter your email address and we\'ll send you a reset link.',
      category: 'account',
    },
    {
      id: '2',
      question: 'How do I download course materials?',
      answer: 'Course materials can be downloaded from the course page. Look for the download icon next to each resource.',
      category: 'courses',
    },
    {
      id: '3',
      question: 'Can I get a refund for a course?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all courses. Contact support to request a refund.',
      category: 'billing',
    },
    {
      id: '4',
      question: 'Why is my video not playing?',
      answer: 'Check your internet connection. If the issue persists, try refreshing the app or clearing the cache.',
      category: 'technical',
    },
    {
      id: '5',
      question: 'How do I become a creator?',
      answer: 'You can apply to become a creator through your profile settings. We\'ll review your application within 5-7 business days.',
      category: 'general',
    },
    {
      id: '6',
      question: 'How do I change my email address?',
      answer: 'Go to Profile Settings > Account Information to update your email address. You\'ll need to verify the new email.',
      category: 'account',
    },
    {
      id: '7',
      question: 'Can I access courses offline?',
      answer: 'Yes, premium subscribers can download courses for offline viewing. Look for the download button in the course player.',
      category: 'courses',
    },
    {
      id: '8',
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription anytime in Profile Settings > Subscription. Your access will continue until the end of the billing period.',
      category: 'billing',
    },
  ];

  const filteredFAQs = faqItems.filter(item => 
    selectedCategory === 'general' || item.category === selectedCategory
  );

  const handleFAQToggle = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleEmergencyContact = () => {
    Alert.alert(
      'Emergency Contact',
      'For urgent issues outside business hours, please email: emergency@skillbox.com',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Email', onPress: () => Linking.openURL('mailto:emergency@skillbox.com') },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ThemedView style={styles.header}>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol name="chevron.left" size={24} color={theme.colors.text} />
        </Button>
        <ThemedText type="title" style={styles.headerTitle}>
          Support & Help
        </ThemedText>
        <View style={styles.headerSpacer} />
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.welcomeSection}>
          <View style={styles.welcomeIcon}>
            <IconSymbol name="questionmark.circle.fill" size={48} color={theme.colors.primary} />
          </View>
          <ThemedText type="subtitle" style={styles.welcomeTitle}>
            How can we help you?
          </ThemedText>
          <ThemedText style={[styles.welcomeDescription, { color: theme.colors.textSecondary }]}>
            Find answers to common questions or get in touch with our support team.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>
          <View style={styles.supportGrid}>
            {supportOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={option.action}
                style={styles.supportOptionTouchable}
              >
                <Card style={styles.supportOptionCard}>
                  <View style={[
                    styles.supportOptionIcon,
                    { backgroundColor: theme.colors.primary + '20' }
                  ]}>
                    <IconSymbol 
                      name={option.icon} 
                      size={24} 
                      color={theme.colors.primary} 
                    />
                  </View>
                  <ThemedText style={styles.supportOptionTitle}>
                    {option.title}
                  </ThemedText>
                  <ThemedText style={[styles.supportOptionDescription, { color: theme.colors.textSecondary }]}>
                    {option.description}
                  </ThemedText>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Frequently Asked Questions
          </ThemedText>
          
          <View style={styles.categoryTabs}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryTabsInner}>
                {faqCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'primary' : 'ghost'}
                    size="sm"
                    onPress={() => setSelectedCategory(category.id)}
                    style={styles.categoryTab}
                  >
                    {category.title}
                  </Button>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.faqList}>
            {filteredFAQs.map((faq) => (
              <TouchableOpacity
                key={faq.id}
                onPress={() => handleFAQToggle(faq.id)}
                style={styles.faqItem}
              >
                <Card style={[
                  styles.faqCard,
                  expandedFAQ === faq.id && styles.faqCardExpanded
                ]}>
                  <View style={styles.faqHeader}>
                    <ThemedText style={styles.faqQuestion}>
                      {faq.question}
                    </ThemedText>
                    <IconSymbol 
                      name={expandedFAQ === faq.id ? "chevron.up" : "chevron.down"} 
                      size={20} 
                      color={theme.colors.textSecondary} 
                    />
                  </View>
                  {expandedFAQ === faq.id && (
                    <ThemedText style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>
                      {faq.answer}
                    </ThemedText>
                  )}
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Contact Information
          </ThemedText>
          
          <Card style={styles.contactCard}>
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <IconSymbol name="envelope.fill" size={20} color={theme.colors.primary} />
                <View style={styles.contactText}>
                  <ThemedText style={styles.contactLabel}>Email Support</ThemedText>
                  <ThemedText style={[styles.contactValue, { color: theme.colors.textSecondary }]}>
                    support@skillbox.com
                  </ThemedText>
                </View>
              </View>

              <View style={styles.contactItem}>
                <IconSymbol name="phone.fill" size={20} color={theme.colors.primary} />
                <View style={styles.contactText}>
                  <ThemedText style={styles.contactLabel}>Phone</ThemedText>
                  <ThemedText style={[styles.contactValue, { color: theme.colors.textSecondary }]}>
                    +1 (555) 123-4567
                  </ThemedText>
                </View>
              </View>

              <View style={styles.contactItem}>
                <IconSymbol name="clock.fill" size={20} color={theme.colors.primary} />
                <View style={styles.contactText}>
                  <ThemedText style={styles.contactLabel}>Business Hours</ThemedText>
                  <ThemedText style={[styles.contactValue, { color: theme.colors.textSecondary }]}>
                    Mon-Fri 9AM-6PM PST
                  </ThemedText>
                </View>
              </View>
            </View>

            <Button
              variant="outline"
              onPress={handleEmergencyContact}
              style={styles.emergencyButton}
            >
              <IconSymbol name="exclamationmark.triangle.fill" size={16} color={theme.colors.warning} />
              <ThemedText style={{ color: theme.colors.warning, marginLeft: 8 }}>
                Emergency Contact
              </ThemedText>
            </Button>
          </Card>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Additional Resources
          </ThemedText>
          
          <View style={styles.resourcesList}>
            <Button
              variant="ghost"
              onPress={() => Linking.openURL('https://skillbox.com/terms')}
              style={styles.resourceItem}
            >
              <IconSymbol name="doc.text.fill" size={20} color={theme.colors.textSecondary} />
              <ThemedText style={[styles.resourceText, { color: theme.colors.text }]}>
                Terms of Service
              </ThemedText>
              <IconSymbol name="chevron.right" size={16} color={theme.colors.textSecondary} />
            </Button>

            <Button
              variant="ghost"
              onPress={() => Linking.openURL('https://skillbox.com/privacy')}
              style={styles.resourceItem}
            >
              <IconSymbol name="shield.fill" size={20} color={theme.colors.textSecondary} />
              <ThemedText style={[styles.resourceText, { color: theme.colors.text }]}>
                Privacy Policy
              </ThemedText>
              <IconSymbol name="chevron.right" size={16} color={theme.colors.textSecondary} />
            </Button>

            <Button
              variant="ghost"
              onPress={() => Linking.openURL('https://skillbox.com/status')}
              style={styles.resourceItem}
            >
              <IconSymbol name="checkmark.circle.fill" size={20} color={theme.colors.success} />
              <ThemedText style={[styles.resourceText, { color: theme.colors.text }]}>
                System Status
              </ThemedText>
              <IconSymbol name="chevron.right" size={16} color={theme.colors.textSecondary} />
            </Button>
          </View>
        </ThemedView>

        <ThemedView style={styles.bottomSection}>
          <ThemedText style={[styles.bottomText, { color: theme.colors.textTertiary }]}>
            SkillBOX v2.1.0 • Made with ❤️ for learners
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    paddingHorizontal: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  welcomeIcon: {
    marginBottom: 16,
  },
  welcomeTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeDescription: {
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  supportOptionTouchable: {
    width: '48%',
  },
  supportOptionCard: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  supportOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  supportOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  supportOptionDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  categoryTabs: {
    marginBottom: 16,
  },
  categoryTabsInner: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  categoryTab: {
    paddingHorizontal: 16,
  },
  faqList: {
    gap: 8,
  },
  faqItem: {
    // No styles needed
  },
  faqCard: {
    padding: 16,
  },
  faqCardExpanded: {
    // Could add shadow or border changes
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  faqAnswer: {
    marginTop: 12,
    lineHeight: 20,
  },
  contactCard: {
    padding: 20,
  },
  contactInfo: {
    gap: 16,
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourcesList: {
    gap: 4,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  resourceText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  bottomSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  bottomText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
