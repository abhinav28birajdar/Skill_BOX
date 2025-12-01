import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Enhanced theme system with more comprehensive color palette
const lightColors = {
  // Core colors
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#60A5FA',
  secondary: '#10B981',
  secondaryDark: '#059669',
  secondaryLight: '#34D399',
  
  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  surfaceTertiary: '#E2E8F0',
  
  // Text colors
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // State colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // UI elements
  border: '#E5E7EB',
  borderSecondary: '#D1D5DB',
  shadow: '#00000010',
  overlay: '#00000040',
  
  // Interactive elements
  cardBackground: '#FFFFFF',
  inputBackground: '#F9FAFB',
  buttonBackground: '#3B82F6',
  buttonText: '#FFFFFF',
  
  // Gradients (arrays for LinearGradient)
  primaryGradient: ['#3B82F6', '#2563EB'],
  secondaryGradient: ['#10B981', '#059669'],
  backgroundGradient: ['#F8FAFC', '#FFFFFF'],
};

const darkColors = {
  // Core colors
  primary: '#3B82F6',
  primaryDark: '#1D4ED8',
  primaryLight: '#93C5FD',
  secondary: '#10B981',
  secondaryDark: '#047857',
  secondaryLight: '#6EE7B7',
  
  // Backgrounds
  background: '#111827',
  backgroundSecondary: '#1F2937',
  surface: '#1F2937',
  surfaceSecondary: '#374151',
  surfaceTertiary: '#4B5563',
  
  // Text colors
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textInverse: '#1F2937',
  
  // State colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // UI elements
  border: '#374151',
  borderSecondary: '#4B5563',
  shadow: '#00000040',
  overlay: '#00000060',
  
  // Interactive elements
  cardBackground: '#1F2937',
  inputBackground: '#374151',
  buttonBackground: '#3B82F6',
  buttonText: '#FFFFFF',
  
  // Gradients (arrays for LinearGradient)
  primaryGradient: ['#3B82F6', '#1D4ED8'],
  secondaryGradient: ['#10B981', '#047857'],
  backgroundGradient: ['#111827', '#1F2937'],
};

export function useEnhancedTheme() {
  const systemColorScheme = useColorScheme();
  const { theme, setSystemTheme } = useAppStore();
  
  // Update system theme when it changes
  useEffect(() => {
    if (theme.theme === 'auto') {
      setSystemTheme(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, theme.theme, setSystemTheme]);
  
  // Determine the actual theme to use
  const isDark = theme.theme === 'dark' || 
    (theme.theme === 'auto' && systemColorScheme === 'dark');
  
  const colors = isDark ? darkColors : lightColors;
  
  return {
    colors,
    colorScheme: isDark ? 'dark' : 'light',
    isDark,
    theme: theme.theme,
    
    // Theme utilities
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      xxl: 24,
      full: 9999,
    },
    
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    
    fontWeight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    
    shadows: {
      sm: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      lg: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      xl: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
      },
    },
  };
}