/**
 * API Configuration Setup Screen
 * Allows users to securely input and store Supabase credentials
 */

import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { configManager } from '@/lib/configManager';
import { setSupabaseCredentials } from '@/lib/supabase';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ConfigSetupScreen() {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const { theme } = useTheme();
  const colors = theme.colors;

  useEffect(() => {
    checkExistingConfig();
  }, []);

  const checkExistingConfig = async () => {
    try {
      const config = await configManager.getSupabaseConfig();
      if (config) {
        setSupabaseUrl(config.url);
        setSupabaseKey(config.key.substring(0, 20) + '...');
      }
    } catch (error) {
      console.error('Error checking config:', error);
    } finally {
      setChecking(false);
    }
  };

  const validateInputs = (): boolean => {
    if (!supabaseUrl.trim()) {
      Alert.alert('Error', 'Please enter your Supabase URL');
      return false;
    }

    if (!supabaseKey.trim()) {
      Alert.alert('Error', 'Please enter your Supabase Anon Key');
      return false;
    }

    if (!configManager.validateSupabaseUrl(supabaseUrl)) {
      Alert.alert(
        'Invalid URL',
        'Please enter a valid Supabase URL\n\nFormat: https://your-project.supabase.co'
      );
      return false;
    }

    if (!configManager.validateSupabaseKey(supabaseKey)) {
      Alert.alert(
        'Invalid Key',
        'The Supabase key appears to be invalid. Please check and try again.'
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      // Test connection before saving
      const client = await setSupabaseCredentials(supabaseUrl, supabaseKey);
      
      if (!client) {
        throw new Error('Failed to create Supabase client');
      }

      // Save configuration
      await configManager.setSupabaseConfig(supabaseUrl, supabaseKey);

      Alert.alert(
        'Success',
        'Configuration saved successfully! You can now use the app.',
        [
          {
            text: 'Continue',
            onPress: () => {
              router.replace('/');
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Connection Failed',
        error.message || 'Could not connect to Supabase. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Setup?',
      'You can configure this later in Settings. Some features may not work without proper configuration.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => router.replace('/'),
          style: 'destructive',
        },
      ]
    );
  };

  if (checking) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              🔐 Secure Configuration
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Enter your Supabase credentials to get started
            </Text>
          </View>

          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[styles.infoTitle, { color: colors.primary }]}>
              📝 Where to find your credentials:
            </Text>
            <Text style={[styles.infoText, { color: colors.text }]}>
              1. Go to your Supabase project dashboard{'\n'}
              2. Navigate to Settings → API{'\n'}
              3. Copy the Project URL and anon/public key
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Supabase URL *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="https://your-project.supabase.co"
                placeholderTextColor={colors.textSecondary}
                value={supabaseUrl}
                onChangeText={setSupabaseUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Supabase Anon Key *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                placeholderTextColor={colors.textSecondary}
                value={supabaseKey}
                onChangeText={setSupabaseKey}
                autoCapitalize="none"
                autoCorrect={false}
                multiline
                numberOfLines={4}
                secureTextEntry={false}
              />
            </View>

            {/* Security Note */}
            <View style={[styles.securityNote, { backgroundColor: colors.success + '15' }]}>
              <Text style={[styles.securityText, { color: colors.success }]}>
                🔒 Your credentials are encrypted and stored securely on your device
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save & Continue</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  form: {
    marginBottom: 24,
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
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  securityNote: {
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  securityText: {
    fontSize: 13,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  saveButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
  },
});
