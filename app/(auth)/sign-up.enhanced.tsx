import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useAuth } from '@/context/AuthContext.enhanced';
import { useTheme } from '@/context/ThemeContext';
import { UserRole } from '@/types/database.enhanced';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { theme } = useTheme();

  const validateForm = () => {
    if (!email || !password || !username) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters long');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const { error } = await signUp(email, password, {
      username,
      full_name: fullName || username,
      role: 'student' as UserRole
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error.message || 'An error occurred');
    } else {
      Alert.alert(
        'Success',
        'We\'ve sent a verification link to your email address. Please check your inbox and click the link to complete your registration.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/sign-in'),
          },
        ]
      );
    }
  };

  const handleSignIn = () => {
    router.replace('/(auth)/sign-in');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container, 
        { backgroundColor: theme.colors.background }
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Image 
              source={require('../../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Join SkillBox
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Create your account to start learning
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Email *</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.colors.backgroundSecondary,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.label, { color: theme.colors.text }]}>Username *</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.colors.backgroundSecondary,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }
              ]}
              value={username}
              onChangeText={setUsername}
              placeholder="Choose a username"
              placeholderTextColor={theme.colors.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.label, { color: theme.colors.text }]}>Full Name</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.colors.backgroundSecondary,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }
              ]}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor={theme.colors.textTertiary}
              autoCapitalize="words"
            />

            <Text style={[styles.label, { color: theme.colors.text }]}>Password *</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.colors.backgroundSecondary,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor={theme.colors.textTertiary}
              secureTextEntry
              autoCapitalize="none"
            />

            <Text style={[styles.label, { color: theme.colors.text }]}>Confirm Password *</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.colors.backgroundSecondary,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor={theme.colors.textTertiary}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title="Sign Up" 
              onPress={handleSignUp} 
              style={{ marginTop: 20 }}
            />
          </View>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={[styles.signInText, { color: theme.colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={[styles.signInLink, { color: theme.colors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  signInText: {
    fontSize: 16,
  },
  signInLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});
