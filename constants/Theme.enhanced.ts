// ===================================================================
// THEME TOKENS AND DESIGN SYSTEM
// ===================================================================

import { Colors } from './Colors';

export const ThemeColors = {
  // Primary brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main brand color
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  
  // Secondary colors
  secondary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
  },
  
  // Accent colors
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
    950: '#4a044e',
  },
  
  // Success colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  // Warning colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  // Error colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  
  // Neutral/Gray colors
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  
  // Dark theme colors
  dark: {
    bg: '#0f172a',
    surface: '#1e293b',
    elevated: '#334155',
    border: '#475569',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
  },
  
  // Light theme colors
  light: {
    bg: '#ffffff',
    surface: '#f8fafc',
    elevated: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
  },
} as const;

// ===================================================================
// TYPOGRAPHY SYSTEM
// ===================================================================

export const Typography = {
  fonts: {
    heading: 'Inter_700Bold',
    body: 'Inter_400Regular',
    mono: 'FiraCode_400Regular',
  },
  
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
    '8xl': 96,
    '9xl': 128,
  },
  
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  fontWeights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
} as const;

// ===================================================================
// SPACING SYSTEM
// ===================================================================

export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
} as const;

// ===================================================================
// BORDER RADIUS SYSTEM
// ===================================================================

export const BorderRadius = {
  none: 0,
  sm: 2,
  DEFAULT: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
} as const;

// ===================================================================
// SHADOW SYSTEM
// ===================================================================

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  DEFAULT: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 12,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 16,
  },
} as const;

// ===================================================================
// COMPONENT SIZES
// ===================================================================

export const ComponentSizes = {
  button: {
    sm: {
      height: 32,
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 14,
      borderRadius: 4,
    },
    md: {
      height: 40,
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 16,
      borderRadius: 6,
    },
    lg: {
      height: 48,
      paddingHorizontal: 20,
      paddingVertical: 12,
      fontSize: 18,
      borderRadius: 8,
    },
    xl: {
      height: 56,
      paddingHorizontal: 24,
      paddingVertical: 16,
      fontSize: 20,
      borderRadius: 10,
    },
  },
  
  input: {
    sm: {
      height: 36,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      borderRadius: 4,
    },
    md: {
      height: 44,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      borderRadius: 6,
    },
    lg: {
      height: 52,
      paddingHorizontal: 20,
      paddingVertical: 16,
      fontSize: 18,
      borderRadius: 8,
    },
  },
  
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
    '2xl': 64,
    '3xl': 80,
    '4xl': 96,
  },
  
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
  },
} as const;

// ===================================================================
// THEME TYPE DEFINITIONS
// ===================================================================

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

export type ThemeMode = 'light' | 'dark' | 'system';

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
