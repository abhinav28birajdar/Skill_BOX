/**
 * Main App Entry Point - SkillBox
 * Handles initial routing logic and app initialization
 */

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/EnhancedThemeContext';
import { configManager } from '@/lib/configManager';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function IndexScreen() {
  const [initializing, setInitializing] = useState(true);
  const [needsConfig, setNeedsConfig] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      // Check if Supabase is configured
      const isConfigured = await configManager.isConfigured();
      
      if (!isConfigured) {
        const config = await configManager.getSupabaseConfig();
        if (!config || !config.url || !config.key) {
          setNeedsConfig(true);
          setInitializing(false);
          return;
        }
      }

      setNeedsConfig(false);
    } catch (error) {
      console.error('Configuration check error:', error);
      setNeedsConfig(true);
    } finally {
      setInitializing(false);
    }
  };

  // Show loading while checking auth and config
  if (initializing || authLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // If needs configuration, redirect to config setup
  if (needsConfig) {
    return <Redirect href="/config-setup" />;
  }

  // If not authenticated, redirect to welcome/auth flow
  if (!user) {
    return <Redirect href="/welcome" />;
  }

  // If user needs onboarding
  if (user && !user.onboarding_completed) {
    return <Redirect href="/role-selection" />;
  }

  // Redirect to appropriate dashboard based on user role
  if (user.role === 'learner') {
    return <Redirect href="/(student)/dashboard" />;
  } else if (user.role === 'teacher_approved' || user.role === 'teacher_pending') {
    return <Redirect href="/(tabs)" />;
  }

  // Default: redirect to tabs
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
