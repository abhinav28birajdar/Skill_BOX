import { router } from 'expo-router';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

import Button from '@/components/ui/Button.new';
import ModernInput from '@/components/ui/ModernInput';
import { useEnhancedTheme } from '@/hooks/useEnhancedTheme';
import { useFormWithZod } from '@/hooks/useFormWithZod';
import { supabase } from '@/lib/supabase';
import { LoginFormData, loginSchema } from '@/lib/validationSchemas';
import { useAppStore } from '@/store/useAppStore';

export default function EnhancedLoginForm() {
  const { colors, spacing, fontSize, fontWeight } = useEnhancedTheme();
  const { setUser, setSession, setLoading } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useFormWithZod({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      if (authData?.user && authData?.session) {
        // Get user profile
        const { data: profileDataRaw } = (await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', authData.user.id)
          .single()) as any;

        const profileData: any = profileDataRaw;

        if (profileData) {
          setUser({
            id: authData.user.id,
            email: authData.user.email!,
            firstName: profileData.first_name,
            lastName: profileData.last_name,
            displayName: profileData.display_name,
            avatarUrl: profileData.avatar_url,
            role: profileData.role,
            isVerified: profileData.is_verified,
            preferences: profileData.preferences || {},
          });
        }

        setSession(authData.session);
        
        // Navigate based on user role
        if (profileData?.role === 'student') {
          router.replace('/(tabs)' as any);
        } else if (profileData?.role === 'teacher' || profileData?.role === 'creator') {
          router.replace('/(tabs)/creator' as any);
        } else {
          router.replace('/(tabs)' as any);
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'An unexpected error occurred';
      if (error?.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error?.message?.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email before signing in';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert('Login Failed', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: spacing.lg }}>
      {/* Header */}
      <View style={{ alignItems: 'center', marginBottom: spacing.xxl }}>
        <Text style={{
          fontSize: fontSize.xxxl,
          fontWeight: fontWeight.bold,
          color: colors.text,
          marginBottom: spacing.sm,
        }}>
          Welcome Back
        </Text>
        <Text style={{
          fontSize: fontSize.base,
          color: colors.textSecondary,
          textAlign: 'center',
        }}>
          Sign in to continue learning
        </Text>
      </View>

      {/* Email Input */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <ModernInput
            label="Email"
            placeholder="Enter your email"
            leftIcon="mail"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorText={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            required
            containerStyle={{ marginBottom: spacing.lg }}
          />
        )}
      />

      {/* Password Input */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <ModernInput
            label="Password"
            placeholder="Enter your password"
            leftIcon="lock-closed"
            rightIcon={showPassword ? 'eye-off' : 'eye'}
            onRightIconPress={() => setShowPassword(!showPassword)}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorText={errors.password?.message}
            secureTextEntry={!showPassword}
            required
            containerStyle={{ marginBottom: spacing.lg }}
          />
        )}
      />

      {/* Forgot Password Link */}
      <TouchableOpacity
        onPress={() => router.push('/forgot-password' as any)}
        style={{ alignSelf: 'flex-end', marginBottom: spacing.xl }}
      >
        <Text style={{
          fontSize: fontSize.sm,
          color: colors.primary,
          fontWeight: fontWeight.medium,
        }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Login Button */}
      <Button
        title="Sign In"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={!isValid}
        fullWidth
        gradient
        style={{ marginBottom: spacing.lg }}
      />

      {/* Divider */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.lg,
      }}>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        <Text style={{
          paddingHorizontal: spacing.md,
          fontSize: fontSize.sm,
          color: colors.textSecondary,
        }}>
          or
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
      </View>

      {/* Social Login Buttons */}
      <View style={{ flexDirection: 'row', marginBottom: spacing.xl }}>
        <Button
          title="Google"
          variant="outline"
          icon="logo-google"
          onPress={() => {
            // TODO: Implement Google Sign-In
            Alert.alert('Coming Soon', 'Google Sign-In will be available soon!');
          }}
          style={{ flex: 1, marginRight: spacing.sm }}
        />
        <Button
          title="Apple"
          variant="outline"
          icon="logo-apple"
          onPress={() => {
            // TODO: Implement Apple Sign-In
            Alert.alert('Coming Soon', 'Apple Sign-In will be available soon!');
          }}
          style={{ flex: 1, marginLeft: spacing.sm }}
        />
      </View>

      {/* Sign Up Link */}
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{
          fontSize: fontSize.base,
          color: colors.textSecondary,
        }}>
          Don't have an account? {' '}
        </Text>
        <TouchableOpacity onPress={() => router.push('/signup' as any)}>
          <Text style={{
            fontSize: fontSize.base,
            color: colors.primary,
            fontWeight: fontWeight.semibold,
          }}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}