import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../src/components/ui/Input';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendResetLink = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
    }, 2000);
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.content}>
          {/* Success Icon */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={styles.iconContainer}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.iconGradient}
            >
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>

          {/* Success Message */}
          <Animated.View
            entering={FadeInUp.delay(200).springify()}
            style={styles.textContainer}
          >
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent password reset instructions to{'\n'}
              <Text style={styles.email}>{email}</Text>
            </Text>
          </Animated.View>

          {/* Buttons */}
          <Animated.View
            entering={FadeInUp.delay(300).springify()}
            style={styles.buttonContainer}
          >
            <Pressable
              onPress={() => router.push('/login-new')}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.primaryButtonText}>Back to Login</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={handleSendResetLink}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Resend Email</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Back Button */}
        <Animated.View entering={FadeInUp.delay(100).springify()}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </Pressable>
        </Animated.View>

        <View style={styles.content}>
          {/* Icon */}
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={styles.iconContainer}
          >
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.iconGradient}
            >
              <Ionicons name="key" size={48} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>

          {/* Title */}
          <Animated.View
            entering={FadeInUp.delay(300).springify()}
            style={styles.textContainer}
          >
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              No worries! Enter your email and we'll send you reset instructions
            </Text>
          </Animated.View>

          {/* Email Input */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              leftIcon={<Ionicons name="mail-outline" size={20} color="#6B7280" />}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </Animated.View>

          {/* Send Button */}
          <Animated.View entering={FadeInUp.delay(500).springify()}>
            <Pressable
              onPress={handleSendResetLink}
              disabled={loading}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Text>
                {!loading && (
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                )}
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              style={styles.backToLoginButton}
            >
              <Ionicons name="arrow-back" size={16} color="#6366F1" />
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </Pressable>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  keyboardView: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  email: {
    fontWeight: '600',
    color: '#6366F1',
  },
  buttonContainer: {
    marginTop: 32,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  gradientButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  backToLoginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  backToLoginText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
    marginLeft: 6,
  },
});
