import { Colors } from './Colors';

export interface ThemeColors {
  // Primary brand colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceVariant: string;
  
  // Text colors
  text: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Interactive colors
  interactive: string;
  interactiveSecondary: string;
  disabled: string;
  
  // Border and separator colors
  border: string;
  borderLight: string;
  separator: string;
  
  // Card and component colors
  card: string;
  cardSecondary: string;
  overlay: string;
  
  // Tab bar colors
  tabIconDefault: string;
  tabIconSelected: string;
  
  // Skill category colors
  technology: string;
  business: string;
  creative: string;
  health: string;
  education: string;
  lifestyle: string;
  trades: string;
  languages: string;
  
  // Status colors
  online: string;
  offline: string;
  busy: string;
  
  // Rating colors
  star: string;
  starEmpty: string;
}

export const lightTheme: ThemeColors = {
  // Primary brand colors
  primary: '#6366F1', // Indigo-500
  primaryLight: '#818CF8', // Indigo-400
  primaryDark: '#4F46E5', // Indigo-600
  secondary: '#EC4899', // Pink-500
  accent: '#F59E0B', // Amber-500
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB', // Gray-50
  backgroundTertiary: '#F3F4F6', // Gray-100
  surface: '#FFFFFF',
  surfaceVariant: '#F8FAFC', // Slate-50
  // Text colors
  text: '#111827', // Gray-900
  textPrimary: '#111827', // Gray-900
  textSecondary: '#6B7280', // Gray-500
  textTertiary: '#9CA3AF', // Gray-400
  textInverse: '#FFFFFF', // White text for dark backgrounds
  
  // Semantic colors
  success: '#10B981', // Emerald-500
  warning: '#F59E0B', // Amber-500
  error: '#EF4444', // Red-500
  info: '#3B82F6', // Blue-500
  
  // Interactive colors
  interactive: '#6366F1', // Primary
  interactiveSecondary: '#E5E7EB', // Gray-200
  disabled: '#D1D5DB', // Gray-300
  
  // Border and separator colors
  border: '#E5E7EB', // Gray-200
  borderLight: '#F3F4F6', // Gray-100
  separator: '#E5E7EB', // Gray-200
  
  // Card and component colors
  card: '#FFFFFF',
  cardSecondary: '#F9FAFB', // Gray-50
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Tab bar colors
  tabIconDefault: '#9CA3AF', // Gray-400
  tabIconSelected: '#6366F1', // Primary
  
  // Skill category colors
  technology: '#3B82F6', // Blue-500
  business: '#10B981', // Emerald-500
  creative: '#F59E0B', // Amber-500
  health: '#EF4444', // Red-500
  education: '#8B5CF6', // Violet-500
  lifestyle: '#EC4899', // Pink-500
  trades: '#F97316', // Orange-500
  languages: '#06B6D4', // Cyan-500
  
  // Status colors
  online: '#10B981', // Emerald-500
  offline: '#6B7280', // Gray-500
  busy: '#F59E0B', // Amber-500
  
  // Rating colors
  star: '#F59E0B', // Amber-500
  starEmpty: '#E5E7EB', // Gray-200
};

export const darkTheme: ThemeColors = {
  // Primary brand colors
  primary: '#818CF8', // Indigo-400
  primaryLight: '#A5B4FC', // Indigo-300
  primaryDark: '#6366F1', // Indigo-500
  secondary: '#F472B6', // Pink-400
  accent: '#FBBF24', // Amber-400
  
  // Background colors
  background: '#0F172A', // Slate-900
  backgroundSecondary: '#1E293B', // Slate-800
  backgroundTertiary: '#334155', // Slate-700
  surface: '#1E293B', // Slate-800
  surfaceVariant: '#334155', // Slate-700
  
  // Text colors
  text: '#F8FAFC', // Slate-50
  textPrimary: '#F8FAFC', // Slate-50
  textSecondary: '#CBD5E1', // Slate-300
  textTertiary: '#94A3B8', // Slate-400
  textInverse: '#0F172A', // Slate-900
  
  // Semantic colors
  success: '#34D399', // Emerald-400
  warning: '#FBBF24', // Amber-400
  error: '#F87171', // Red-400
  info: '#60A5FA', // Blue-400
  
  // Interactive colors
  interactive: '#818CF8', // Primary
  interactiveSecondary: '#475569', // Slate-600
  disabled: '#64748B', // Slate-500
  
  // Border and separator colors
  border: '#475569', // Slate-600
  borderLight: '#334155', // Slate-700
  separator: '#475569', // Slate-600
  
  // Card and component colors
  card: '#1E293B', // Slate-800
  cardSecondary: '#334155', // Slate-700
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Tab bar colors
  tabIconDefault: '#64748B', // Slate-500
  tabIconSelected: '#818CF8', // Primary
  
  // Skill category colors
  technology: '#60A5FA', // Blue-400
  business: '#34D399', // Emerald-400
  creative: '#FBBF24', // Amber-400
  health: '#F87171', // Red-400
  education: '#A78BFA', // Violet-400
  lifestyle: '#F472B6', // Pink-400
  trades: '#FB923C', // Orange-400
  languages: '#22D3EE', // Cyan-400
  
  // Status colors
  online: '#34D399', // Emerald-400
  offline: '#64748B', // Slate-500
  busy: '#FBBF24', // Amber-400
  
  // Rating colors
  star: '#FBBF24', // Amber-400
  starEmpty: '#475569', // Slate-600
};

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export const spacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export interface ThemeBorderRadius {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export const borderRadius: ThemeBorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export interface ThemeFontSizes {
  xs: number;
  sm: number;
  base: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
  '5xl': number;
}

export const fontSizes: ThemeFontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export const shadows: ThemeShadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  fontSizes: ThemeFontSizes;
  shadows: ThemeShadows;
}

export const themes = {
  light: {
    colors: lightTheme,
    spacing,
    borderRadius,
    fontSizes,
    shadows,
  } as Theme,
  dark: {
    colors: darkTheme,
    spacing,
    borderRadius,
    fontSizes,
    shadows,
  } as Theme,
};

// Enhanced Colors for backward compatibility
export const EnhancedColors = {
  light: {
    ...Colors.light,
    ...lightTheme,
    tint: lightTheme.primary,
    tabIconDefault: lightTheme.tabIconDefault,
    tabIconSelected: lightTheme.tabIconSelected,
  },
  dark: {
    ...Colors.dark,
    ...darkTheme,
    tint: darkTheme.primary,
    tabIconDefault: darkTheme.tabIconDefault,
    tabIconSelected: darkTheme.tabIconSelected,
  },
};
