/**
 * Production-ready Loading Screen with smooth animations
 */

import { useTheme } from '@/context/EnhancedThemeContext';
import { MotiView } from 'moti';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading SkillBox...' }: LoadingScreenProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 600 }}
        style={styles.content}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});