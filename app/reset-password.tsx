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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Your password has been reset successfully!',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />
      
      <View className="flex-1 px-6 justify-center">
        {/* Icon */}
        <View className="items-center mb-8">
          <View 
            className="w-24 h-24 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: colors.primary + '20' }}
          >
            <Ionicons name="shield-checkmark-outline" size={40} color={colors.primary} />
          </View>
          
          <Text 
            className="text-3xl font-bold text-center mb-4"
            style={{ color: colors.text }}
          >
            Reset Password
          </Text>
          
          <Text 
            className="text-lg text-center leading-6"
            style={{ color: colors.textSecondary }}
          >
            Create a new secure password for your account
          </Text>
        </View>

        {/* Password Inputs */}
        <View className="space-y-4 mb-8">
          <Input
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            icon="lock-closed-outline"
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            icon="lock-closed-outline"
          />
        </View>

        {/* Password Requirements */}
        <View 
          className="p-4 rounded-xl mb-8"
          style={{ backgroundColor: colors.surface }}
        >
          <Text 
            className="text-sm font-semibold mb-2"
            style={{ color: colors.text }}
          >
            Password must contain:
          </Text>
          <View className="space-y-1">
            <View className="flex-row items-center">
              <Ionicons 
                name={password.length >= 8 ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={password.length >= 8 ? colors.success : colors.textTertiary}
              />
              <Text 
                className="text-xs ml-2"
                style={{ color: password.length >= 8 ? colors.success : colors.textTertiary }}
              >
                At least 8 characters
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons 
                name={/[A-Z]/.test(password) ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={/[A-Z]/.test(password) ? colors.success : colors.textTertiary}
              />
              <Text 
                className="text-xs ml-2"
                style={{ color: /[A-Z]/.test(password) ? colors.success : colors.textTertiary }}
              >
                One uppercase letter
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons 
                name={/[0-9]/.test(password) ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={/[0-9]/.test(password) ? colors.success : colors.textTertiary}
              />
              <Text 
                className="text-xs ml-2"
                style={{ color: /[0-9]/.test(password) ? colors.success : colors.textTertiary }}
              >
                One number
              </Text>
            </View>
          </View>
        </View>

        {/* Reset Button */}
        <Button
          title="Reset Password"
          onPress={handleResetPassword}
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
      </View>
    </SafeAreaView>
  );
}