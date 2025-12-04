import { useEnhancedTheme } from '@/hooks/useEnhancedTheme';
import { useAppStore } from '@/store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ApiKeyManagerProps {
  visible: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

interface FormData {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

interface FormErrors {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export default function ApiKeyManager({ visible, onClose, onComplete }: ApiKeyManagerProps) {
  const { colors } = useEnhancedTheme();
  const { setSupabaseConfig, supabase: supabaseConfig } = useAppStore();
  
  const [formData, setFormData] = useState<FormData>({
    supabaseUrl: '',
    supabaseAnonKey: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    loadExistingCredentials();
  }, [visible]);

  const loadExistingCredentials = async () => {
    try {
      const url = await SecureStore.getItemAsync('SUPABASE_URL');
      const key = await SecureStore.getItemAsync('SUPABASE_ANON_KEY');
      
      if (url && key) {
        setFormData({ supabaseUrl: url, supabaseAnonKey: key });
      }
    } catch (error) {
      console.error('Failed to load existing credentials:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate Supabase URL
    if (!formData.supabaseUrl.trim()) {
      newErrors.supabaseUrl = 'Supabase URL is required';
    } else if (!/^https:\/\/.+\.supabase\.co$/.test(formData.supabaseUrl.trim())) {
      newErrors.supabaseUrl = 'Invalid Supabase URL format (should be https://xxx.supabase.co)';
    }

    // Validate Supabase Anon Key
    if (!formData.supabaseAnonKey.trim()) {
      newErrors.supabaseAnonKey = 'Supabase Anon Key is required';
    } else if (formData.supabaseAnonKey.trim().length < 100) {
      newErrors.supabaseAnonKey = 'Invalid Anon Key (too short)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const testConnection = async (): Promise<boolean> => {
    setIsTestingConnection(true);
    try {
      // Temporarily initialize with new credentials
      const testClient = await initializeSupabase(
        formData.supabaseUrl.trim(),
        formData.supabaseAnonKey.trim()
      );

      // Test the connection with a simple query
      const { error } = await testClient
        .from('user_profiles')
        .select('id')
        .limit(1);

      if (error && !error.message.includes('RLS')) {
        // RLS error is expected if not authenticated, but means connection works
        throw error;
      }

      setIsTestingConnection(false);
      return true;
    } catch (error) {
      setIsTestingConnection(false);
      console.error('Connection test failed:', error);
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Test connection first
      const isConnectionValid = await testConnection();
      
      if (!isConnectionValid) {
        Alert.alert(
          'Connection Failed',
          'Could not connect to Supabase with the provided credentials. Please check your URL and key.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      // Save credentials securely
      await setSupabaseCredentials(
        formData.supabaseUrl.trim(),
        formData.supabaseAnonKey.trim()
      );

      // Update app store
      setSupabaseConfig(formData.supabaseUrl.trim(), formData.supabaseAnonKey.trim());

      Alert.alert(
        'Success',
        'Supabase credentials saved successfully! The app will now use your database.',
        [{ text: 'OK', onPress: () => {
          onComplete?.();
          onClose();
        } }]
      );
    } catch (error) {
      Alert.alert(
        'Save Failed',
        `Failed to save credentials: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Clear Credentials',
      'This will remove all saved API credentials. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync('SUPABASE_URL');
              await SecureStore.deleteItemAsync('SUPABASE_ANON_KEY');
              setFormData({ supabaseUrl: '', supabaseAnonKey: '' });
              // Re-initialize with default/placeholder credentials
              await initializeSupabase();
              onClose();
            } catch (error) {
              console.error('Failed to clear credentials:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
            <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: colors.text,
            }}>
              API Configuration
            </Text>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? colors.border : colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
                opacity: isLoading ? 0.6 : 1,
              }}>
                {isLoading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={{ padding: 20 }}>
              {/* Info Section */}
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="information-circle" size={20} color={colors.primary} />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                    marginLeft: 8,
                  }}>
                    Secure Configuration
                  </Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  lineHeight: 20,
                }}>
                  Your API credentials are stored securely using Expo SecureStore and never shared. 
                  You'll need to get these from your Supabase project dashboard.
                </Text>
              </View>

              {/* Connection Status */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: supabaseConfig.isConfigured ? colors.success + '20' : colors.warning + '20',
                borderRadius: 12,
                marginBottom: 24,
              }}>
                <Ionicons
                  name={supabaseConfig.isConfigured ? 'checkmark-circle' : 'warning'}
                  size={20}
                  color={supabaseConfig.isConfigured ? colors.success : colors.warning}
                />
                <Text style={{
                  fontSize: 14,
                  color: supabaseConfig.isConfigured ? colors.success : colors.warning,
                  fontWeight: '500',
                  marginLeft: 8,
                  flex: 1,
                }}>
                  {supabaseConfig.isConfigured 
                    ? 'Connected to your Supabase database'
                    : 'Using development placeholder - configure for production use'}
                </Text>
              </View>

              {/* Supabase URL */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 8,
                }}>
                  Supabase URL
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: errors.supabaseUrl ? colors.error : colors.border,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 16,
                    color: colors.text,
                  }}
                  placeholder="https://your-project.supabase.co"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.supabaseUrl}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, supabaseUrl: text }));
                    if (errors.supabaseUrl) {
                      setErrors(prev => ({ ...prev, supabaseUrl: undefined }));
                    }
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                />
                {errors.supabaseUrl && (
                  <Text style={{
                    color: colors.error,
                    fontSize: 12,
                    marginTop: 4,
                  }}>
                    {errors.supabaseUrl}
                  </Text>
                )}
              </View>

              {/* Supabase Anon Key */}
              <View style={{ marginBottom: 24 }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                  }}>
                    Supabase Anon Key
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowKeys(!showKeys)}
                    style={{ padding: 4 }}
                  >
                    <Ionicons
                      name={showKeys ? 'eye-off' : 'eye'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: errors.supabaseAnonKey ? colors.error : colors.border,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 14,
                    color: colors.text,
                    minHeight: 80,
                  }}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  placeholderTextColor={colors.textSecondary}
                  value={formData.supabaseAnonKey}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, supabaseAnonKey: text }));
                    if (errors.supabaseAnonKey) {
                      setErrors(prev => ({ ...prev, supabaseAnonKey: undefined }));
                    }
                  }}
                  secureTextEntry={!showKeys}
                  autoCapitalize="none"
                  autoCorrect={false}
                  multiline
                />
                {errors.supabaseAnonKey && (
                  <Text style={{
                    color: colors.error,
                    fontSize: 12,
                    marginTop: 4,
                  }}>
                    {errors.supabaseAnonKey}
                  </Text>
                )}
              </View>

              {/* Test Connection Button */}
              <TouchableOpacity
                onPress={testConnection}
                disabled={isTestingConnection || !formData.supabaseUrl || !formData.supabaseAnonKey}
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: 'center',
                  marginBottom: 16,
                  opacity: (!formData.supabaseUrl || !formData.supabaseAnonKey) ? 0.5 : 1,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {isTestingConnection ? (
                    <Ionicons name="time" size={20} color={colors.primary} />
                  ) : (
                    <Ionicons name="wifi" size={20} color={colors.primary} />
                  )}
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.primary,
                    marginLeft: 8,
                  }}>
                    {isTestingConnection ? 'Testing Connection...' : 'Test Connection'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Clear Credentials Button */}
              {supabaseConfig.isConfigured && (
                <TouchableOpacity
                  onPress={handleClear}
                  style={{
                    backgroundColor: colors.error + '20',
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="trash" size={20} color={colors.error} />
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: colors.error,
                      marginLeft: 8,
                    }}>
                      Clear Credentials
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Instructions */}
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                marginTop: 24,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 12,
                }}>
                  How to get your Supabase credentials:
                </Text>
                <View style={{ paddingLeft: 12 }}>
                  <Text style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    lineHeight: 20,
                    marginBottom: 8,
                  }}>
                    1. Go to your Supabase project dashboard
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    lineHeight: 20,
                    marginBottom: 8,
                  }}>
                    2. Navigate to Settings → API
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    lineHeight: 20,
                    marginBottom: 8,
                  }}>
                    3. Copy the URL and anon/public key
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    lineHeight: 20,
                  }}>
                    4. Paste them above and test the connection
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}