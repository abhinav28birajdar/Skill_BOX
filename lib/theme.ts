/**
 * Enhanced Theme System for SkillBox
 * Supports Light, Dark, and System modes with smooth transitions
 */

import { useThemeStore } from '@/store';
import { useColorScheme as useRNColorScheme } from 'react-native';

// ============================================
// Color Palettes
// ============================================

export const LightColors = {
  // Primary colors
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  
  // Secondary colors
  secondary: '#8B5CF6',
  secondaryLight: '#A78BFA',
  secondaryDark: '#7C3AED',
  
  // Accent colors
  accent: '#10B981',
  accentLight: '#34D399',
  accentDark: '#059669',
  
  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F3F4F6',
  
  // Surface colors
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  cardElevated: '#F9FAFB',
  
  // Text colors
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Status bar
  statusBar: 'dark',
} as const;

export const DarkColors = {
  // Primary colors
  primary: '#60A5FA',
  primaryLight: '#93C5FD',
  primaryDark: '#3B82F6',
  
  // Secondary colors
  secondary: '#A78BFA',
  secondaryLight: '#C4B5FD',
  secondaryDark: '#8B5CF6',
  
  // Accent colors
  accent: '#34D399',
  accentLight: '#6EE7B7',
  accentDark: '#10B981',
  
  // Semantic colors
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  
  // Background colors
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  backgroundTertiary: '#334155',
  
  // Surface colors
  surface: '#1E293B',
  surfaceElevated: '#334155',
  card: '#1E293B',
  cardElevated: '#334155',
  
  // Text colors
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textInverse: '#0F172A',
  
  // Border colors
  border: '#334155',
  borderLight: '#475569',
  borderDark: '#1E293B',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  
  // Status bar
  statusBar: 'light',
} as const;

// ============================================
// Typography Scale
// ============================================

export const typography = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
    mono: 'Courier',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Font Weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
} as const;

// ============================================
// Spacing Scale
// ============================================

export const spacing = {
  '0': 0,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
  '20': 80,
  '24': 96,
} as const;

// ============================================
// Border Radius
// ============================================

export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

// ============================================
// Shadows
// ============================================

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

// ============================================
// Animation Durations
// ============================================

export const durations = {
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
} as const;

// ============================================
// Theme Hook
// ============================================

export interface Theme {
  colors: typeof LightColors | typeof DarkColors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  durations: typeof durations;
  isDark: boolean;
}

export function useTheme(): Theme {
  const systemColorScheme = useRNColorScheme();
  const { mode } = useThemeStore();
  
  // Determine the actual theme mode
  const effectiveMode = mode === 'system' ? systemColorScheme : mode;
  const isDark = effectiveMode === 'dark';
  
  return {
    colors: isDark ? DarkColors : LightColors,
    typography,
    spacing,
    borderRadius,
    shadows,
    durations,
    isDark,
  };
}

// ============================================
// Common Styles Generator
// ============================================

export const createStyles = (theme: Theme) => ({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Card styles
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing['4'],
    ...theme.shadows.base,
  },
  
  cardElevated: {
    backgroundColor: theme.colors.cardElevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing['4'],
    ...theme.shadows.md,
  },
  
  // Button styles
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.base,
    paddingVertical: theme.spacing['3'],
    paddingHorizontal: theme.spacing['6'],
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...theme.shadows.base,
  },
  
  buttonSecondary: {
    backgroundColor: theme.colors.backgroundTertiary,
    borderRadius: theme.borderRadius.base,
    paddingVertical: theme.spacing['3'],
    paddingHorizontal: theme.spacing['6'],
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.base,
    paddingVertical: theme.spacing['3'],
    paddingHorizontal: theme.spacing['6'],
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  // Text styles
  heading1: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    lineHeight: theme.typography.fontSize['4xl'] * theme.typography.lineHeight.tight,
  },
  
  heading2: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    lineHeight: theme.typography.fontSize['3xl'] * theme.typography.lineHeight.tight,
  },
  
  heading3: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    lineHeight: theme.typography.fontSize['2xl'] * theme.typography.lineHeight.normal,
  },
  
  bodyLarge: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    lineHeight: theme.typography.fontSize.lg * theme.typography.lineHeight.normal,
  },
  
  body: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
  },
  
  bodySmall: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
  },
  
  caption: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    lineHeight: theme.typography.fontSize.xs * theme.typography.lineHeight.normal,
  },
  
  // Input styles
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing['3'],
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  
  inputFocused: {
    borderColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  
  // Loading
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
});

import { StyleSheet } from 'react-native';

export default { useTheme, createStyles, LightColors, DarkColors };
