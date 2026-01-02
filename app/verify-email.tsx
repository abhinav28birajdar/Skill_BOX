import { OTPInput } from '@/components/auth/OTPInput';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const email = 'user@example.com'; // This should come from navigation params or context

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleComplete = async (code: string) => {
    setOtp(code);
    setLoading(true);
    setError(false);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Check if code is correct (mock validation)
      if (code === '123456') {
        Alert.alert('Success', 'Email verified successfully!', [
          {
            text: 'Continue',
            onPress: () => router.push('/profile-setup'),
          },
        ]);
      } else {
        setError(true);
        Alert.alert('Error', 'Invalid verification code. Please try again.');
      }
    }, 2000);
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setTimer(60);
      setCanResend(false);
      Alert.alert('Success', 'Verification code sent to your email');
    }, 1000);
  };

  const handleEditEmail = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

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
            <Ionicons name="mail" size={48} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Animated.View
          entering={FadeInUp.delay(300).springify()}
          style={styles.textContainer}
        >
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to{'\n'}
            <Text style={styles.email}>{email}</Text>
          </Text>
        </Animated.View>

        {/* OTP Input */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={styles.otpContainer}
        >
          <OTPInput
            length={6}
            onComplete={handleComplete}
            error={error}
          />
        </Animated.View>

        {/* Edit Email */}
        <Animated.View entering={FadeInUp.delay(500).springify()}>
          <Pressable onPress={handleEditEmail} style={styles.editButton}>
            <Ionicons name="create-outline" size={16} color="#6366F1" />
            <Text style={styles.editText}>Edit Email Address</Text>
          </Pressable>
        </Animated.View>

        {/* Resend Code */}
        <Animated.View
          entering={FadeInUp.delay(600).springify()}
          style={styles.resendContainer}
        >
          {canResend ? (
            <Pressable onPress={handleResend} disabled={loading}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </Pressable>
          ) : (
            <Text style={styles.timerText}>
              Resend code in {timer}s
            </Text>
          )}
        </Animated.View>

        {/* Info */}
        <Animated.View
          entering={FadeInUp.delay(700).springify()}
          style={styles.infoContainer}
        >
          <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
          <Text style={styles.infoText}>
            Check your spam folder if you don't see the email
          </Text>
        </Animated.View>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <Text style={styles.loadingText}>Verifying...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
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
  },
  email: {
    fontWeight: '600',
    color: '#6366F1',
  },
  otpContainer: {
    marginBottom: 32,
  },
  editButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginLeft: 6,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resendLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  timerText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});
