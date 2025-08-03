import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button.enhanced';
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
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual password reset logic with Supabase
      // const { error } = await supabase.auth.resetPasswordForEmail(email, {
      //   redirectTo: 'your-app://reset-password'
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsEmailSent(true);
      Alert.alert(
        'Email Sent',
        'We\'ve sent you a link to reset your password. Please check your email.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setIsEmailSent(false);
    handleResetPassword();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
          </ThemedView>

          <ThemedView style={styles.content}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, { backgroundColor: theme.colors.primary + '20' }]}>
                <IconSymbol 
                  name={isEmailSent ? "checkmark.circle.fill" : "envelope.fill"} 
                  size={48} 
                  color={theme.colors.primary} 
                />
              </View>
            </View>

            <ThemedText type="title" style={styles.title}>
              {isEmailSent ? 'Check Your Email' : 'Forgot Password?'}
            </ThemedText>

            <ThemedText style={[styles.description, { color: theme.colors.textSecondary }]}>
              {isEmailSent
                ? `We've sent a password reset link to ${email}. Click the link in your email to reset your password.`
                : 'Enter your email address and we\'ll send you a link to reset your password.'
              }
            </ThemedText>

            {!isEmailSent && (
              <View style={styles.form}>
                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  leftIcon="envelope"
                />

                <Button
                  onPress={handleResetPassword}
                  loading={isLoading}
                  disabled={!email.trim() || isLoading}
                  style={styles.resetButton}
                >
                  Send Reset Link
                </Button>
              </View>
            )}

            {isEmailSent && (
              <View style={styles.emailSentActions}>
                <Button
                  variant="outline"
                  onPress={handleResendEmail}
                  disabled={isLoading}
                  style={styles.resendButton}
                >
                  Resend Email
                </Button>

                <Button
                  variant="ghost"
                  onPress={() => router.back()}
                  style={styles.backToSignInButton}
                >
                  <ThemedText style={{ color: theme.colors.primary }}>
                    Back to Sign In
                  </ThemedText>
                </Button>
              </View>
            )}

            <View style={styles.helpSection}>
              <ThemedText style={[styles.helpText, { color: theme.colors.textSecondary }]}>
                Remember your password?
              </ThemedText>
              <Button
                variant="ghost"
                onPress={() => router.replace('/(auth)/sign-in.enhanced')}
                style={styles.signInLink}
              >
                <ThemedText style={{ color: theme.colors.primary }}>
                  Sign In
                </ThemedText>
              </Button>
            </View>

            <View style={styles.supportSection}>
              <ThemedText style={[styles.supportText, { color: theme.colors.textTertiary }]}>
                Need help? Contact our support team
              </ThemedText>
              <Button
                variant="ghost"
                onPress={() => {
                  // TODO: Navigate to support/help page
                  Alert.alert('Support', 'Contact: support@skillbox.com');
                }}
                style={styles.supportLink}
              >
                <ThemedText style={[styles.supportLinkText, { color: theme.colors.primary }]}>
                  Get Support
                </ThemedText>
              </Button>
            </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
  },
  content: {
    flex: 1,
    paddingTop: 32,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconBackground: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 28,
    fontWeight: '700',
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    gap: 24,
    marginBottom: 32,
  },
  resetButton: {
    marginTop: 8,
  },
  emailSentActions: {
    gap: 16,
    marginBottom: 32,
  },
  resendButton: {
    // Custom styles if needed
  },
  backToSignInButton: {
    paddingVertical: 8,
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  helpText: {
    fontSize: 14,
  },
  signInLink: {
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  supportSection: {
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  supportText: {
    fontSize: 12,
    marginBottom: 8,
  },
  supportLink: {
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  supportLinkText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
