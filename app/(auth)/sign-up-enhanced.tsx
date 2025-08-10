// ===================================================================
// AUTHENTICATION SCREENS - SIGN UP SCREEN
// ===================================================================

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { useTheme } from '../../hooks/useTheme';
import { AuthService, SignUpData } from '../../services/authService';
import { UserRole } from '../../types/auth';

// ===================================================================
// TYPES
// ===================================================================

interface FormData extends SignUpData {
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  agreedToTerms?: string;
  general?: string;
}

// ===================================================================
// SIGN UP SCREEN COMPONENT
// ===================================================================

export default function SignUpScreen() {
  const { theme, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    agreedToTerms: false,
    marketingConsent: false,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  // ===================================================================
  // VALIDATION
  // ===================================================================
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===================================================================
  // FORM HANDLERS
  // ===================================================================
  
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    handleInputChange('role', role);
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await AuthService.signUp({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        agreedToTerms: formData.agreedToTerms,
        marketingConsent: formData.marketingConsent,
      });

      if (result.success) {
        if (result.data?.needsEmailVerification) {
          Alert.alert(
            'Verify Your Email',
            'We\'ve sent a verification link to your email address. Please check your inbox and click the link to complete your registration.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/(auth)/sign-in'),
              },
            ]
          );
        } else {
          // Navigate to onboarding
          router.replace('/(auth)/onboarding');
        }
      } else {
        setErrors({
          general: result.error?.message || 'Registration failed. Please try again.',
        });
      }
    } catch (error) {
      setErrors({
        general: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('/(auth)/sign-in');
  };

  const handleSocialSignUp = (provider: 'google' | 'apple' | 'facebook') => {
    // TODO: Implement social sign up
    Alert.alert('Coming Soon', `${provider} sign up will be available soon`);
  };

  // ===================================================================
  // RENDER
  // ===================================================================
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>

          {/* Logo and Title */}
          <View style={styles.logoSection}>
            <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.logoText}>SB</Text>
            </View>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Join SkillBox and start your learning journey today
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* General Error */}
            {errors.general && (
              <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '10', borderColor: theme.colors.error }]}>
                <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.general}
                </Text>
              </View>
            )}

            {/* Name Inputs */}
            <View style={styles.nameRow}>
              <View style={[styles.inputGroup, styles.nameInput]}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  First Name
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: errors.firstName ? theme.colors.error : theme.colors.border,
                      color: theme.colors.text,
                    }
                  ]}
                  placeholder="First name"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={formData.firstName}
                  onChangeText={(text) => handleInputChange('firstName', text)}
                  autoCapitalize="words"
                  textContentType="givenName"
                  editable={!loading}
                />
                {errors.firstName && (
                  <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                    {errors.firstName}
                  </Text>
                )}
              </View>

              <View style={[styles.inputGroup, styles.nameInput]}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Last Name
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: errors.lastName ? theme.colors.error : theme.colors.border,
                      color: theme.colors.text,
                    }
                  ]}
                  placeholder="Last name"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={formData.lastName}
                  onChangeText={(text) => handleInputChange('lastName', text)}
                  autoCapitalize="words"
                  textContentType="familyName"
                  editable={!loading}
                />
                {errors.lastName && (
                  <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                    {errors.lastName}
                  </Text>
                )}
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Email Address
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: errors.email ? theme.colors.error : theme.colors.border,
                    color: theme.colors.text,
                  }
                ]}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.textTertiary}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                editable={!loading}
              />
              {errors.email && (
                <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Role Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                I want to
              </Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    {
                      backgroundColor: formData.role === 'student' ? theme.colors.primary : theme.colors.surface,
                      borderColor: formData.role === 'student' ? theme.colors.primary : theme.colors.border,
                    }
                  ]}
                  onPress={() => handleRoleSelect('student')}
                  disabled={loading}
                >
                  <Ionicons
                    name="book"
                    size={20}
                    color={formData.role === 'student' ? 'white' : theme.colors.text}
                  />
                  <Text style={[
                    styles.roleButtonText,
                    { color: formData.role === 'student' ? 'white' : theme.colors.text }
                  ]}>
                    Learn
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    {
                      backgroundColor: formData.role === 'teacher' ? theme.colors.primary : theme.colors.surface,
                      borderColor: formData.role === 'teacher' ? theme.colors.primary : theme.colors.border,
                    }
                  ]}
                  onPress={() => handleRoleSelect('teacher')}
                  disabled={loading}
                >
                  <Ionicons
                    name="school"
                    size={20}
                    color={formData.role === 'teacher' ? 'white' : theme.colors.text}
                  />
                  <Text style={[
                    styles.roleButtonText,
                    { color: formData.role === 'teacher' ? 'white' : theme.colors.text }
                  ]}>
                    Teach
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    {
                      backgroundColor: formData.role === 'both' ? theme.colors.primary : theme.colors.surface,
                      borderColor: formData.role === 'both' ? theme.colors.primary : theme.colors.border,
                    }
                  ]}
                  onPress={() => handleRoleSelect('both')}
                  disabled={loading}
                >
                  <Ionicons
                    name="people"
                    size={20}
                    color={formData.role === 'both' ? 'white' : theme.colors.text}
                  />
                  <Text style={[
                    styles.roleButtonText,
                    { color: formData.role === 'both' ? 'white' : theme.colors.text }
                  ]}>
                    Both
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Password
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: errors.password ? theme.colors.error : theme.colors.border,
                      color: theme.colors.text,
                    }
                  ]}
                  placeholder="Create a password"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  secureTextEntry={!showPassword}
                  textContentType="newPassword"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={theme.colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Confirm Password
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: errors.confirmPassword ? theme.colors.error : theme.colors.border,
                      color: theme.colors.text,
                    }
                  ]}
                  placeholder="Confirm your password"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleInputChange('confirmPassword', text)}
                  secureTextEntry={!showConfirmPassword}
                  textContentType="newPassword"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={theme.colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            {/* Terms and Marketing */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => handleInputChange('agreedToTerms', !formData.agreedToTerms)}
                disabled={loading}
              >
                <View style={[
                  styles.checkbox,
                  {
                    backgroundColor: formData.agreedToTerms ? theme.colors.primary : 'transparent',
                    borderColor: formData.agreedToTerms ? theme.colors.primary : (errors.agreedToTerms ? theme.colors.error : theme.colors.border),
                  }
                ]}>
                  {formData.agreedToTerms && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text style={[styles.checkboxText, { color: theme.colors.textSecondary }]}>
                  I agree to the{' '}
                  <Text style={{ color: theme.colors.primary }}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={{ color: theme.colors.primary }}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
              {errors.agreedToTerms && (
                <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                  {errors.agreedToTerms}
                </Text>
              )}

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => handleInputChange('marketingConsent', !formData.marketingConsent)}
                disabled={loading}
              >
                <View style={[
                  styles.checkbox,
                  {
                    backgroundColor: formData.marketingConsent ? theme.colors.primary : 'transparent',
                    borderColor: formData.marketingConsent ? theme.colors.primary : theme.colors.border,
                  }
                ]}>
                  {formData.marketingConsent && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text style={[styles.checkboxText, { color: theme.colors.textSecondary }]}>
                  Send me updates about new features and courses
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onPress={handleSignUp}
              
              style={styles.signUpButton}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.textTertiary }]}>
                or sign up with
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            </View>

            {/* Social Sign Up */}
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                onPress={() => handleSocialSignUp('google')}
                disabled={loading}
              >
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text style={[styles.socialButtonText, { color: theme.colors.text }]}>
                  Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                onPress={() => handleSocialSignUp('apple')}
                disabled={loading}
              >
                <Ionicons name="logo-apple" size={20} color={theme.colors.text} />
                <Text style={[styles.socialButtonText, { color: theme.colors.text }]}>
                  Apple
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={[styles.signInText, { color: theme.colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleSignIn} disabled={loading}>
              <Text style={[styles.signInLink, { color: theme.colors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      {loading && <Loading overlay />}
    </SafeAreaView>
  );
}

// ===================================================================
// STYLES
// ===================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    width: '48%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 2,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 5,
  },
  fieldError: {
    fontSize: 14,
    marginTop: 4,
  },
  checkboxContainer: {
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  signUpButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    paddingHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  signInText: {
    fontSize: 16,
  },
  signInLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});
