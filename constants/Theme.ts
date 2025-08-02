import { useColorScheme } from '@/hooks/useColorScheme';

export const lightTheme = {
  colors: {
    primary: '#007AFF',
    primaryDark: '#0056CC',
    primaryLight: '#4DA3FF',
    secondary: '#5AC8FA',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
    
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F2F2F7',
    backgroundTertiary: '#F9F9F9',
    surface: '#FFFFFF',
    surfaceSecondary: '#F8F8F8',
    
    // Text colors
    text: '#000000',
    textSecondary: '#6D6D80',
    textTertiary: '#8E8E93',
    textDisabled: '#C7C7CC',
    
    // Border colors
    border: '#E5E5EA',
    borderSecondary: '#F2F2F7',
    
    // Other colors
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    disabled: '#F2F2F7',
  },
  
  typography: {
    // Font families
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semiBold: 'System',
      bold: 'System',
    },
    
    // Font sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    
    // Line heights
    lineHeight: {
      xs: 16,
      sm: 20,
      base: 24,
      lg: 28,
      xl: 32,
      '2xl': 36,
      '3xl': 42,
      '4xl': 48,
    },
    
    // Font weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const darkTheme: typeof lightTheme = {
  ...lightTheme,
  colors: {
    primary: '#0A84FF',
    primaryDark: '#0056CC',
    primaryLight: '#4DA3FF',
    secondary: '#5AC8FA',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',
    
    // Background colors
    background: '#000000',
    backgroundSecondary: '#1C1C1E',
    backgroundTertiary: '#2C2C2E',
    surface: '#1C1C1E',
    surfaceSecondary: '#2C2C2E',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#98989D',
    textTertiary: '#6D6D80',
    textDisabled: '#48484A',
    
    // Border colors
    border: '#38383A',
    borderSecondary: '#2C2C2E',
    
    // Other colors
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    disabled: '#2C2C2E',
  },
};

export type Theme = typeof lightTheme;

export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

// Theme-aware styled component helper
export const createStyleSheet = <T extends Record<string, any>>(
  styleFactory: (theme: Theme) => T
) => {
  return (): T => {
    const theme = useTheme();
    return styleFactory(theme);
  };
};

// Common component variants
export const buttonVariants = {
  primary: (theme: Theme) => ({
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  }),
  secondary: (theme: Theme) => ({
    backgroundColor: 'transparent',
    borderColor: theme.colors.border,
    borderWidth: 1,
  }),
  success: (theme: Theme) => ({
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  }),
  warning: (theme: Theme) => ({
    backgroundColor: theme.colors.warning,
    borderColor: theme.colors.warning,
  }),
  error: (theme: Theme) => ({
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  }),
  ghost: (theme: Theme) => ({
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  }),
};

export const buttonSizes = {
  sm: (theme: Theme) => ({
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    minHeight: 36,
  }),
  md: (theme: Theme) => ({
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    minHeight: 44,
  }),
  lg: (theme: Theme) => ({
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    minHeight: 52,
  }),
};

export const textVariants = {
  h1: (theme: Theme) => ({
    fontSize: theme.typography.fontSize['4xl'],
    lineHeight: theme.typography.lineHeight['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  }),
  h2: (theme: Theme) => ({
    fontSize: theme.typography.fontSize['3xl'],
    lineHeight: theme.typography.lineHeight['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  }),
  h3: (theme: Theme) => ({
    fontSize: theme.typography.fontSize['2xl'],
    lineHeight: theme.typography.lineHeight['2xl'],
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
  }),
  h4: (theme: Theme) => ({
    fontSize: theme.typography.fontSize.xl,
    lineHeight: theme.typography.lineHeight.xl,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
  }),
  h5: (theme: Theme) => ({
    fontSize: theme.typography.fontSize.lg,
    lineHeight: theme.typography.lineHeight.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  }),
  h6: (theme: Theme) => ({
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.lineHeight.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  }),
  body: (theme: Theme) => ({
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.lineHeight.base,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text,
  }),
  bodySmall: (theme: Theme) => ({
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.textSecondary,
  }),
  caption: (theme: Theme) => ({
    fontSize: theme.typography.fontSize.xs,
    lineHeight: theme.typography.lineHeight.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.textTertiary,
  }),
  link: (theme: Theme) => ({
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.lineHeight.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
    textDecorationLine: 'underline' as const,
  }),
};

// Input variants
export const inputVariants = {
  default: (theme: Theme) => ({
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    minHeight: 44,
  }),
  filled: (theme: Theme) => ({
    backgroundColor: theme.colors.backgroundSecondary,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    minHeight: 44,
  }),
  outline: (theme: Theme) => ({
    backgroundColor: 'transparent',
    borderColor: theme.colors.border,
    borderWidth: 2,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    minHeight: 44,
  }),
};

// Card variants
export const cardVariants = {
  default: (theme: Theme) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  }),
  elevated: (theme: Theme) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  }),
  outline: (theme: Theme) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  }),
};
