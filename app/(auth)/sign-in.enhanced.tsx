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

import { Button } from '@/components/ui/Button.fixed';
import { Card } from '@/components/ui/Card.enhanced';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Input } from '@/components/ui/Input.enhanced';
import { Text } from '@/components/ui/Text.enhanced';
import { useAuth } from '@/context/AuthContext.enhanced';
import { useTheme } from '@/context/ThemeContext';

export default function SignInScreen() {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await signIn(email.trim().toLowerCase(), password);
      
      if (error) {
        Alert.alert('Sign In Failed', error.message);
      } else {
        // Navigation will be handled by the auth state change
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('./forgot-password');
  };

  const handleSignUp = () => {
    router.push('./sign-up');
  };

  const handleGoogleSignIn = async () => {
    Alert.alert('Coming Soon', 'Google Sign In will be available soon!');
  };

  const handleAppleSignIn = async () => {
    Alert.alert('Coming Soon', 'Apple Sign In will be available soon!');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={[styles.logo, { backgroundColor: theme.colors.primary }]}>
              <Text variant="h4" color="white" weight="bold">
                SB
              </Text>
            </View>
          </View>
          
          <Text variant="h3" weight="bold" align="center" style={styles.title}>
            Welcome Back
          </Text>
          
          <Text variant="body1" color="textSecondary" align="center" style={styles.subtitle}>
            Sign in to continue your learning journey
          </Text>
        </View>

        {/* Sign In Form */}
        <Card variant="elevated" padding="lg" style={styles.formCard}>
          <View style={styles.form}>
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={
                <IconSymbol 
                  name="envelope.fill" 
                  size={20} 
                  color={theme.colors.textSecondary} 
                />
              }
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              isPassword
              leftIcon={
                <IconSymbol 
                  name="lock.fill" 
                  size={20} 
                  color={theme.colors.textSecondary} 
                />
              }
            />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onPress={handleSignIn}
              style={styles.signInButton}
            >
              Sign In
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onPress={handleForgotPassword}
              style={styles.forgotButton}
            >
              Forgot Password?
            </Button>
          </View>
        </Card>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          <Text variant="caption" color="textSecondary" style={styles.dividerText}>
            OR CONTINUE WITH
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
        </View>

        {/* Social Sign In */}
        <View style={styles.socialButtons}>
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onPress={handleGoogleSignIn}
            leftIcon={
              <IconSymbol 
                name="globe" 
                size={20} 
                color={theme.colors.textSecondary} 
              />
            }
            style={styles.socialButton}
          >
            Continue with Google
          </Button>

          {Platform.OS === 'ios' && (
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onPress={handleAppleSignIn}
              leftIcon={
                <IconSymbol 
                  name="apple.logo" 
                  size={20} 
                  color={theme.colors.textSecondary} 
                />
              }
              style={styles.socialButton}
            >
              Continue with Apple
            </Button>
          )}
        </View>

        {/* Sign Up Link */}
        <View style={styles.footer}>
          <Text variant="body2" color="textSecondary" align="center">
            Don't have an account?{' '}
          </Text>
          <Button variant="ghost" size="sm" onPress={handleSignUp}>
            <Text variant="body2" color="primary" weight="semibold">
              Sign Up
            </Text>
          </Button>
        </View>

        {/* Demo Account Info */}
        <Card variant="filled" padding="md" style={styles.demoCard}>
          <Text variant="body2" weight="semibold" align="center" style={styles.demoTitle}>
            Demo Accounts
          </Text>
          <Text variant="caption" color="textSecondary" align="center">
            Learner: learner@skillbox.com / password123
          </Text>
          <Text variant="caption" color="textSecondary" align="center">
            Creator: creator@skillbox.com / password123
          </Text>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  formCard: {
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  signInButton: {
    marginTop: 8,
  },
  forgotButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontWeight: '500',
  },
  socialButtons: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  demoCard: {
    marginTop: 16,
  },
  demoTitle: {
    marginBottom: 8,
  },
});
