/**
 * Production-ready Enhanced Theme System
 * Supports light/dark mode with automatic system detection
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface Theme {
  dark: boolean;
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    disabled: string;
    placeholder: string;
    backdrop: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  fontWeight: {
    regular: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
  };
}

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',
    secondary: '#8B5CF6',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    disabled: '#9CA3AF',
    placeholder: '#9CA3AF',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
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
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

const darkTheme: Theme = {
  ...lightTheme,
  dark: true,
  colors: {
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',
    secondary: '#8B5CF6',
    background: '#111827',
    surface: '#1F2937',
    card: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    disabled: '#6B7280',
    placeholder: '#6B7280',
    backdrop: 'rgba(0, 0, 0, 0.7)',
  },
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@skillbox_theme_mode';

export function EnhancedThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
        setThemeModeState(saved as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, []);

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const toggleTheme = useCallback(() => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  }, [isDark, setThemeMode]);

  const theme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      setThemeMode,
      isDark,
      toggleTheme,
    }),
    [theme, themeMode, setThemeMode, isDark, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useEnhancedTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useEnhancedTheme must be used within EnhancedThemeProvider');
  }
  return context;
}

// Re-export as default theme hook
export { useEnhancedTheme as useTheme };
