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
import { UserRole } from '@/types/database.enhanced';

export default function SignUpScreen() {
  const { theme } = useTheme();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
  });
  const [selectedRole, setSelectedRole] = useState<UserRole>('learner');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Role Selection, 3: Account Details

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName.trim()) {
        Alert.alert('Missing Information', 'Please enter your full name.');
        return;
      }
      if (!formData.username.trim()) {
        Alert.alert('Missing Information', 'Please enter a username.');
        return;
      }
      if (!validateUsername(formData.username)) {
        Alert.alert('Invalid Username', 'Username must be 3-20 characters and contain only letters, numbers, and underscores.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSignUp = async () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!validatePassword(formData.password)) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await signUp(
        formData.email.trim().toLowerCase(),
        formData.password,
        {
          username: formData.username.trim().toLowerCase(),
          full_name: formData.fullName.trim(),
          role: selectedRole,
        }
      );
      
      if (error) {
        Alert.alert('Sign Up Failed', error.message);
      } else {
        Alert.alert(
          'Account Created!',
          `Welcome to SkillBox! Your ${selectedRole} account has been created successfully.`,
          [
            {
              text: 'Get Started',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('./sign-in');
  };

  const roleOptions = [
    {
      key: 'learner' as UserRole,
      title: 'I want to learn',
      description: 'Discover new skills, take courses, and connect with expert creators',
      icon: 'book.fill',
      color: theme.colors.primary,
    },
    {
      key: 'creator' as UserRole,
      title: 'I want to teach',
      description: 'Share your expertise, create courses, and build your teaching business',
      icon: 'person.crop.circle.badge.plus',
      color: theme.colors.secondary,
    },
  ];

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text variant="h4" weight="bold" align="center" style={styles.stepTitle}>
        Let's get started
      </Text>
      <Text variant="body1" color="textSecondary" align="center" style={styles.stepSubtitle}>
        Tell us a bit about yourself
      </Text>

      <View style={styles.form}>
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
          leftIcon={
            <IconSymbol 
              name="person.fill" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          }
        />

        <Input
          label="Username"
          placeholder="Choose a unique username"
          value={formData.username}
          onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
          autoCapitalize="none"
          leftIcon={
            <IconSymbol 
              name="at" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          }
          helperText="3-20 characters, letters, numbers, and underscores only"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text variant="h4" weight="bold" align="center" style={styles.stepTitle}>
        Choose your role
      </Text>
      <Text variant="body1" color="textSecondary" align="center" style={styles.stepSubtitle}>
        What brings you to SkillBox?
      </Text>

      <View style={styles.roleOptions}>
        {roleOptions.map((option) => (
          <Card
            key={option.key}
            variant={selectedRole === option.key ? 'elevated' : 'outlined'}
            padding="lg"
            touchable
            onPress={() => setSelectedRole(option.key)}
            style={[
              styles.roleOption,
              selectedRole === option.key && {
                borderColor: option.color,
                borderWidth: 2,
              }
            ]}
          >
            <View style={styles.roleHeader}>
              <View style={[styles.roleIcon, { backgroundColor: option.color }]}>
                <IconSymbol name={option.icon} size={24} color="white" />
              </View>
              <Text variant="h6" weight="semibold">
                {option.title}
              </Text>
            </View>
            <Text variant="body2" color="textSecondary">
              {option.description}
            </Text>
          </Card>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text variant="h4" weight="bold" align="center" style={styles.stepTitle}>
        Create your account
      </Text>
      <Text variant="body1" color="textSecondary" align="center" style={styles.stepSubtitle}>
        You're almost there!
      </Text>

      <View style={styles.form}>
        <Input
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
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
          placeholder="Create a password"
          value={formData.password}
          onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
          isPassword
          leftIcon={
            <IconSymbol 
              name="lock.fill" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          }
          helperText="At least 6 characters"
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
          isPassword
          leftIcon={
            <IconSymbol 
              name="lock.fill" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          }
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            {[1, 2, 3].map((stepNum) => (
              <View
                key={stepNum}
                style={[
                  styles.progressStep,
                  {
                    backgroundColor: step >= stepNum ? theme.colors.primary : theme.colors.border,
                  }
                ]}
              />
            ))}
          </View>
          <Text variant="caption" color="textSecondary" align="center">
            Step {step} of 3
          </Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={[styles.logo, { backgroundColor: theme.colors.primary }]}>
              <Text variant="h4" color="white" weight="bold">
                SB
              </Text>
            </View>
          </View>
        </View>

        {/* Step Content */}
        <Card variant="elevated" padding="lg" style={styles.formCard}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </Card>

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          {step > 1 && (
            <Button
              variant="outline"
              size="lg"
              onPress={handleBack}
              style={styles.navButton}
            >
              Back
            </Button>
          )}
          
          {step < 3 ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth={step === 1}
              onPress={handleNext}
              style={step > 1 ? styles.navButton : undefined}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onPress={handleSignUp}
            >
              Create Account
            </Button>
          )}
        </View>

        {/* Sign In Link */}
        <View style={styles.footer}>
          <Text variant="body2" color="textSecondary" align="center">
            Already have an account?{' '}
          </Text>
          <Button variant="ghost" size="sm" onPress={handleSignIn}>
            <Text variant="body2" color="primary" weight="semibold">
              Sign In
            </Text>
          </Button>
        </View>
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
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  progressStep: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    marginBottom: 24,
  },
  stepContent: {
    gap: 24,
  },
  stepTitle: {
    marginBottom: 8,
  },
  stepSubtitle: {
    marginBottom: 16,
  },
  form: {
    gap: 16,
  },
  roleOptions: {
    gap: 16,
  },
  roleOption: {
    borderWidth: 1,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  navigation: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  navButton: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
