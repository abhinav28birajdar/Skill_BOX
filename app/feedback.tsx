import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button.enhanced';
import { Card } from '@/components/ui/Card.enhanced';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Input } from '@/components/ui/Input.enhanced';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FeedbackType = 'bug' | 'feature' | 'improvement' | 'general';
type RatingType = 1 | 2 | 3 | 4 | 5;

interface FeedbackCategory {
  id: FeedbackType;
  title: string;
  description: string;
  icon: string;
}

export default function FeedbackScreen() {
  const { theme } = useTheme();
  const [selectedType, setSelectedType] = useState<FeedbackType>('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState<RatingType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [includeDeviceInfo, setIncludeDeviceInfo] = useState(true);

  const feedbackCategories: FeedbackCategory[] = [
    {
      id: 'bug',
      title: 'Bug Report',
      description: 'Report a bug or technical issue',
      icon: 'exclamationmark.triangle.fill',
    },
    {
      id: 'feature',
      title: 'Feature Request',
      description: 'Suggest a new feature',
      icon: 'lightbulb.fill',
    },
    {
      id: 'improvement',
      title: 'Improvement',
      description: 'Suggest improvements to existing features',
      icon: 'arrow.up.circle.fill',
    },
    {
      id: 'general',
      title: 'General Feedback',
      description: 'Share your thoughts and experiences',
      icon: 'bubble.left.fill',
    },
  ];

  const handleSubmitFeedback = async () => {
    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject for your feedback');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your feedback message');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual feedback submission
      const feedbackData = {
        type: selectedType,
        subject: subject.trim(),
        message: message.trim(),
        email: email.trim(),
        rating,
        includeDeviceInfo,
        timestamp: new Date().toISOString(),
        deviceInfo: includeDeviceInfo ? {
          platform: Platform.OS,
          version: Platform.Version,
          // Add more device info as needed
        } : null,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Feedback Sent',
        'Thank you for your feedback! We\'ll review it and get back to you if needed.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setSubject('');
              setMessage('');
              setEmail('');
              setRating(null);
              setSelectedType('general');
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRatingStars = () => {
    return (
      <View style={styles.ratingContainer}>
        <ThemedText style={[styles.ratingLabel, { color: theme.colors.text }]}>
          How would you rate your overall experience?
        </ThemedText>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              variant="ghost"
              size="sm"
              onPress={() => setRating(star as RatingType)}
              style={styles.starButton}
            >
              <IconSymbol
                name={rating && star <= rating ? "star.fill" : "star"}
                size={32}
                color={rating && star <= rating ? theme.colors.star : theme.colors.starEmpty}
              />
            </Button>
          ))}
        </View>
        {rating && (
          <ThemedText style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </ThemedText>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
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
            Send Feedback
          </ThemedText>
          <View style={styles.headerSpacer} />
        </ThemedView>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView style={styles.introSection}>
            <ThemedText style={[styles.introText, { color: theme.colors.textSecondary }]}>
              We value your feedback! Help us improve SkillBOX by sharing your thoughts, suggestions, or reporting issues.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Feedback Type
            </ThemedText>
            <View style={styles.categoriesGrid}>
              {feedbackCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  onPress={() => setSelectedType(category.id)}
                  style={[
                    styles.categoryCard,
                    selectedType === category.id && {
                      backgroundColor: theme.colors.primary + '10',
                      borderColor: theme.colors.primary,
                    }
                  ]}
                >
                  <Card style={[
                    styles.categoryCardInner,
                    { backgroundColor: 'transparent' }
                  ]}>
                    <View style={[
                      styles.categoryIcon,
                      { backgroundColor: theme.colors.primary + '20' }
                    ]}>
                      <IconSymbol
                        name={category.icon as any}
                        size={24}
                        color={theme.colors.primary}
                      />
                    </View>
                    <ThemedText style={styles.categoryTitle}>
                      {category.title}
                    </ThemedText>
                    <ThemedText style={[styles.categoryDescription, { color: theme.colors.textSecondary }]}>
                      {category.description}
                    </ThemedText>
                  </Card>
                </Button>
              ))}
            </View>
          </ThemedView>

          {renderRatingStars()}

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Feedback Details
            </ThemedText>
            
            <View style={styles.form}>
              <Input
                label="Subject"
                placeholder="Brief description of your feedback"
                value={subject}
                onChangeText={setSubject}
                maxLength={100}
              />

              <View style={styles.textAreaContainer}>
                <ThemedText style={[styles.textAreaLabel, { color: theme.colors.text }]}>
                  Message *
                </ThemedText>
                <TextInput
                  style={[
                    styles.textArea,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    }
                  ]}
                  placeholder="Please provide detailed feedback..."
                  placeholderTextColor={theme.colors.textTertiary}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  maxLength={1000}
                />
                <ThemedText style={[styles.characterCount, { color: theme.colors.textTertiary }]}>
                  {message.length}/1000
                </ThemedText>
              </View>

              <Input
                label="Email Address"
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                leftIcon="envelope"
              />
            </View>
          </ThemedView>

          <ThemedView style={styles.section}>
            <Button
              variant="ghost"
              onPress={() => setIncludeDeviceInfo(!includeDeviceInfo)}
              style={styles.checkboxButton}
            >
              <View style={styles.checkboxRow}>
                <View style={[
                  styles.checkbox,
                  {
                    backgroundColor: includeDeviceInfo ? theme.colors.primary : 'transparent',
                    borderColor: theme.colors.border,
                  }
                ]}>
                  {includeDeviceInfo && (
                    <IconSymbol name="checkmark" size={16} color="white" />
                  )}
                </View>
                <View style={styles.checkboxText}>
                  <ThemedText style={styles.checkboxTitle}>
                    Include device information
                  </ThemedText>
                  <ThemedText style={[styles.checkboxDescription, { color: theme.colors.textSecondary }]}>
                    This helps us debug issues more effectively
                  </ThemedText>
                </View>
              </View>
            </Button>
          </ThemedView>

          <ThemedView style={styles.submitSection}>
            <Button
              onPress={handleSubmitFeedback}
              loading={isLoading}
              disabled={!subject.trim() || !message.trim() || !email.trim() || isLoading}
              style={styles.submitButton}
            >
              Send Feedback
            </Button>

            <ThemedText style={[styles.privacyNote, { color: theme.colors.textTertiary }]}>
              Your feedback helps us improve SkillBOX. We respect your privacy and will only use this information to address your feedback.
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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
  introSection: {
    marginBottom: 24,
  },
  introText: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
    padding: 0,
  },
  categoryCardInner: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  ratingContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  starButton: {
    paddingHorizontal: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    gap: 20,
  },
  textAreaContainer: {
    gap: 8,
  },
  textAreaLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
  },
  checkboxButton: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxText: {
    flex: 1,
    gap: 4,
  },
  checkboxTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  checkboxDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  submitSection: {
    paddingBottom: 32,
    gap: 16,
  },
  submitButton: {
    marginBottom: 8,
  },
  privacyNote: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
});
