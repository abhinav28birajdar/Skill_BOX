// ===================================================================
// ENHANCED THEME SYSTEM FOR SKILLBOX
// ===================================================================

import { Colors } from './Colors';

// ===================================================================
// COLOR PALETTE
// ===================================================================

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
} as const;

// ===================================================================
// THEME INTERFACE
// ===================================================================

export interface ThemeScheme {
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

// ===================================================================
// LIGHT THEME
// ===================================================================

export const lightTheme: ThemeScheme = {
  // Primary brand colors
  primary: ThemeColors.primary[500],
  primaryLight: ThemeColors.primary[400],
  primaryDark: ThemeColors.primary[600],
  secondary: ThemeColors.secondary[500],
  accent: ThemeColors.accent[500],
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: ThemeColors.gray[50],
  backgroundTertiary: ThemeColors.gray[100],
  surface: '#FFFFFF',
  surfaceVariant: ThemeColors.gray[50],
  
  // Text colors
  text: ThemeColors.gray[900],
  textPrimary: ThemeColors.gray[900],
  textSecondary: ThemeColors.gray[500],
  textTertiary: ThemeColors.gray[400],
  textInverse: '#FFFFFF',
  
  // Semantic colors
  success: ThemeColors.success[500],
  warning: ThemeColors.warning[500],
  error: ThemeColors.error[500],
  info: ThemeColors.primary[500],
  
  // Interactive colors
  interactive: ThemeColors.primary[500],
  interactiveSecondary: ThemeColors.gray[200],
  disabled: ThemeColors.gray[300],
  
  // Border and separator colors
  border: ThemeColors.gray[200],
  borderLight: ThemeColors.gray[100],
  separator: ThemeColors.gray[200],
  
  // Card and component colors
  card: '#FFFFFF',
  cardSecondary: ThemeColors.gray[50],
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Tab bar colors
  tabIconDefault: ThemeColors.gray[400],
  tabIconSelected: ThemeColors.primary[500],
  
  // Skill category colors
  technology: ThemeColors.primary[500],
  business: ThemeColors.success[500],
  creative: ThemeColors.warning[500],
  health: ThemeColors.error[500],
  education: ThemeColors.accent[500],
  lifestyle: '#EC4899',
  trades: '#F97316',
  languages: '#06B6D4',
  
  // Status colors
  online: ThemeColors.success[500],
  offline: ThemeColors.gray[500],
  busy: ThemeColors.warning[500],
  
  // Rating colors
  star: ThemeColors.warning[500],
  starEmpty: ThemeColors.gray[200],
};

// ===================================================================
// DARK THEME
// ===================================================================

export const darkTheme: ThemeScheme = {
  // Primary brand colors
  primary: ThemeColors.primary[400],
  primaryLight: ThemeColors.primary[300],
  primaryDark: ThemeColors.primary[500],
  secondary: ThemeColors.secondary[400],
  accent: ThemeColors.accent[400],
  
  // Background colors
  background: ThemeColors.gray[900],
  backgroundSecondary: ThemeColors.gray[800],
  backgroundTertiary: ThemeColors.gray[700],
  surface: ThemeColors.gray[800],
  surfaceVariant: ThemeColors.gray[700],
  
  // Text colors
  text: ThemeColors.gray[50],
  textPrimary: ThemeColors.gray[50],
  textSecondary: ThemeColors.gray[300],
  textTertiary: ThemeColors.gray[400],
  textInverse: ThemeColors.gray[900],
  
  // Semantic colors
  success: ThemeColors.success[400],
  warning: ThemeColors.warning[400],
  error: ThemeColors.error[400],
  info: ThemeColors.primary[400],
  
  // Interactive colors
  interactive: ThemeColors.primary[400],
  interactiveSecondary: ThemeColors.gray[600],
  disabled: ThemeColors.gray[500],
  
  // Border and separator colors
  border: ThemeColors.gray[600],
  borderLight: ThemeColors.gray[700],
  separator: ThemeColors.gray[600],
  
  // Card and component colors
  card: ThemeColors.gray[800],
  cardSecondary: ThemeColors.gray[700],
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Tab bar colors
  tabIconDefault: ThemeColors.gray[500],
  tabIconSelected: ThemeColors.primary[400],
  
  // Skill category colors
  technology: '#60A5FA',
  business: '#34D399',
  creative: '#FBBF24',
  health: '#F87171',
  education: '#A78BFA',
  lifestyle: '#F472B6',
  trades: '#FB923C',
  languages: '#22D3EE',
  
  // Status colors
  online: ThemeColors.success[400],
  offline: ThemeColors.gray[500],
  busy: ThemeColors.warning[400],
  
  // Rating colors
  star: ThemeColors.warning[400],
  starEmpty: ThemeColors.gray[600],
};

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

// ===================================================================
// BORDER RADIUS SYSTEM
// ===================================================================

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

// ===================================================================
// FONT SIZES
// ===================================================================

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

// ===================================================================
// SHADOWS
// ===================================================================

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

// ===================================================================
// THEME INTERFACE
// ===================================================================

export interface Theme {
  colors: ThemeScheme;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  fontSizes: ThemeFontSizes;
  shadows: ThemeShadows;
}

// ===================================================================
// THEME EXPORT
// ===================================================================

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

// ===================================================================
// ENHANCED COLORS FOR BACKWARD COMPATIBILITY
// ===================================================================

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

// ===================================================================
// THEME MODE TYPE
// ===================================================================

export type ThemeMode = 'light' | 'dark' | 'system';

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
// ANIMATION VALUES
// ===================================================================

export const Animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 1000,
  },
  
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounceIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounceOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  
  spring: {
    gentle: {
      damping: 20,
      stiffness: 300,
    },
    bouncy: {
      damping: 15,
      stiffness: 400,
    },
    snappy: {
      damping: 25,
      stiffness: 500,
    },
  },
} as const;

// ===================================================================
// LAYOUT CONSTANTS
// ===================================================================

export const Layout = {
  screen: {
    width: 375,
    height: 812,
  },
  
  headerHeight: 60,
  tabBarHeight: 80,
  statusBarHeight: 44,
  bottomSafeArea: 34,
  
  container: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
} as const;

// ===================================================================
// DEFAULT EXPORT
// ===================================================================

export default {
  colors: ThemeColors,
  themes,
  typography: Typography,
  spacing,
  borderRadius,
  fontSizes,
  shadows,
  componentSizes: ComponentSizes,
  animations: Animations,
  layout: Layout,
  enhancedColors: EnhancedColors,
};
