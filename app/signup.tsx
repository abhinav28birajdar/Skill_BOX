import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { useAuth } from '../src/hooks/useAuth';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName, role);
    setLoading(false);

    if (error) {
      Alert.alert('Signup Failed', error);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginVertical: 32 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: '#1C1C1E',
                marginBottom: 8,
              }}
            >
              Create Account
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#8E8E93',
              }}
            >
              Join SkillBox today
            </Text>
          </View>

          {/* Role Selection */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#1C1C1E',
              marginBottom: 12,
            }}
          >
            I want to:
          </Text>
          <View style={{ flexDirection: 'row', marginBottom: 24 }}>
            <TouchableOpacity
              onPress={() => setRole('student')}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: role === 'student' ? '#007AFF' : '#E5E5EA',
                backgroundColor: role === 'student' ? '#007AFF10' : 'transparent',
                marginRight: 8,
              }}
            >
              <Ionicons
                name="school-outline"
                size={24}
                color={role === 'student' ? '#007AFF' : '#8E8E93'}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: role === 'student' ? '#007AFF' : '#8E8E93',
                  marginLeft: 8,
                }}
              >
                Learn
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRole('teacher')}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: role === 'teacher' ? '#007AFF' : '#E5E5EA',
                backgroundColor: role === 'teacher' ? '#007AFF10' : 'transparent',
                marginLeft: 8,
              }}
            >
              <Ionicons
                name="briefcase-outline"
                size={24}
                color={role === 'teacher' ? '#007AFF' : '#8E8E93'}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: role === 'teacher' ? '#007AFF' : '#8E8E93',
                  marginLeft: 8,
                }}
              >
                Teach
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            icon="person-outline"
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed-outline"
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon="lock-closed-outline"
          />

          <Button
            title="Create Account"
            onPress={handleSignup}
            loading={loading}
            fullWidth
            size="lg"
            style={{ marginTop: 8 }}
          />

          {/* Link to Login */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 24,
            }}
          >
            <Text style={{ color: '#8E8E93', fontSize: 14 }}>
              Already have an account?{' '}
            </Text>
            <Button
              title="Sign In"
              variant="ghost"
              onPress={() => router.push('/login')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
