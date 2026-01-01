import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { useAuth as useAuthHook } from '../src/hooks/useAuth';
import { useThemeColors } from '../src/theme';

export default function LoginScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthHook();
  const { enterDemoMode } = useAuth();
  
  const logoScale = useSharedValue(1);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Animate logo
    logoScale.value = withSpring(0.9, {}, () => {
      logoScale.value = withSpring(1);
    });

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleDemoMode = () => {
    enterDemoMode();
    router.replace('/(tabs)');
  };

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }]
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />
      
      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="items-center justify-center flex-1 mb-8">
              <Animated.View style={[animatedLogoStyle, { alignItems: 'center' }]}>
                <View 
                  className="w-20 h-20 rounded-2xl items-center justify-center mb-6"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Ionicons name="school-outline" size={40} color="white" />
                </View>
                
                <Text 
                  className="text-4xl font-bold mb-2"
                  style={{ color: colors.text }}
                >
                  SkillBox
                </Text>
                
                <Text 
                  className="text-lg text-center"
                  style={{ color: colors.textSecondary }}
                >
                  Welcome back! Sign in to continue
                </Text>
              </Animated.View>
            </View>

            {/* Form */}
            <View className="space-y-4 mb-8">
              <Input
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="mail-outline"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                icon="lock-closed-outline"
              />
            </View>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              size="lg"
              style={{ marginBottom: 16 }}
            />

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => router.push('/forgot-password')}
              className="items-center py-3"
            >
              <Text 
                className="text-base font-semibold"
                style={{ color: colors.primary }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View 
                className="flex-1 h-px"
                style={{ backgroundColor: colors.border }}
              />
              <Text 
                className="mx-4 text-sm"
                style={{ color: colors.textTertiary }}
              >
                or
              </Text>
              <View 
                className="flex-1 h-px"
                style={{ backgroundColor: colors.border }}
              />
            </View>

            {/* Demo Mode Button */}
            <TouchableOpacity
              onPress={handleDemoMode}
              className="flex-row items-center justify-center py-4 px-6 rounded-2xl mb-4"
              style={{ 
                backgroundColor: colors.surface,
                borderWidth: 2,
                borderColor: colors.primary,
              }}
            >
              <Ionicons name="eye-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <Text 
                className="text-base font-semibold"
                style={{ color: colors.primary }}
              >
                Try Demo Mode
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center">
              <Text 
                className="text-base"
                style={{ color: colors.textSecondary }}
              >
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text 
                  className="text-base font-semibold"
                  style={{ color: colors.primary }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
