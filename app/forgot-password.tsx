import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { useThemeColors } from '../src/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="px-6 pt-4 pb-8">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: colors.surface }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-6 justify-center">
        {!emailSent ? (
          <>
            {/* Icon */}
            <View className="items-center mb-8">
              <View 
                className="w-24 h-24 rounded-full items-center justify-center mb-6"
                style={{ backgroundColor: colors.warning + '20' }}
              >
                <Ionicons name="key-outline" size={40} color={colors.warning} />
              </View>
              
              <Text 
                className="text-3xl font-bold text-center mb-4"
                style={{ color: colors.text }}
              >
                Forgot Password?
              </Text>
              
              <Text 
                className="text-lg text-center leading-6"
                style={{ color: colors.textSecondary }}
              >
                Don't worry! Enter your email and we'll send you a reset link
              </Text>
            </View>

            {/* Email Input */}
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
              containerStyle={{ marginBottom: 24 }}
            />

            {/* Send Button */}
            <Button
              title="Send Reset Link"
              onPress={handleSendReset}
              loading={loading}
              fullWidth
              size="lg"
              style={{ marginBottom: 24 }}
            />

            {/* Back to Login */}
            <TouchableOpacity 
              onPress={() => router.push('/login')}
              className="items-center"
            >
              <Text 
                className="text-base font-semibold"
                style={{ color: colors.primary }}
              >
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Success State */}
            <View className="items-center mb-8">
              <View 
                className="w-24 h-24 rounded-full items-center justify-center mb-6"
                style={{ backgroundColor: colors.success + '20' }}
              >
                <Ionicons name="checkmark-circle-outline" size={40} color={colors.success} />
              </View>
              
              <Text 
                className="text-3xl font-bold text-center mb-4"
                style={{ color: colors.text }}
              >
                Email Sent!
              </Text>
              
              <Text 
                className="text-lg text-center leading-6 mb-8"
                style={{ color: colors.textSecondary }}
              >
                We've sent a password reset link to{' '}
                <Text style={{ color: colors.text, fontWeight: '600' }}>
                  {email}
                </Text>
              </Text>
            </View>

            <Button
              title="Back to Sign In"
              onPress={() => router.push('/login')}
              fullWidth
              size="lg"
              variant="outline"
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}