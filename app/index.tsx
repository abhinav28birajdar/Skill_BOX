/**
 * Main App Entry Point - SkillBox
 * Handles initial routing logic and app initialization
 */

import { useTheme } from '@/context/EnhancedThemeContext';
import { Redirect } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function IndexScreen() {
  const { theme } = useTheme();

  // For now, always redirect to welcome screen to show the UI
  // Later, you can uncomment the auth logic once Supabase is configured
  return <Redirect href="/welcome" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
