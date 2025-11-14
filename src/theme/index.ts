import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { create } from 'zustand';

export type ColorScheme = 'light' | 'dark' | 'auto';

interface ThemeStore {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  colorScheme: 'auto',
  
  setColorScheme: async (scheme: ColorScheme) => {
    await AsyncStorage.setItem('theme', scheme);
    set({ colorScheme: scheme });
  },
  
  initialize: async () => {
    try {
      const saved = await AsyncStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark' || saved === 'auto') {
        set({ colorScheme: saved });
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  },
}));

// Hook to get the actual color scheme (resolving 'auto' to light/dark)
export function useActualColorScheme() {
  const systemColorScheme = useRNColorScheme();
  const { colorScheme } = useThemeStore();
  
  if (colorScheme === 'auto') {
    return systemColorScheme || 'light';
  }
  return colorScheme;
}

// Theme colors for light and dark modes
export const lightColors = {
  primary: '#6366f1', // Indigo
  primaryDark: '#4f46e5',
  secondary: '#ec4899', // Pink
  secondaryDark: '#db2777',
  success: '#10b981', // Green
  warning: '#f59e0b', // Amber
  error: '#ef4444', // Red
  
  background: '#ffffff',
  surface: '#f9fafb',
  surfaceAlt: '#f3f4f6',
  
  text: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  
  border: '#e5e7eb',
  borderDark: '#d1d5db',
  
  overlay: 'rgba(0, 0, 0, 0.5)',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkColors = {
  primary: '#818cf8', // Lighter indigo for dark mode
  primaryDark: '#6366f1',
  secondary: '#f472b6', // Lighter pink
  secondaryDark: '#ec4899',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  
  background: '#111827',
  surface: '#1f2937',
  surfaceAlt: '#374151',
  
  text: '#f9fafb',
  textSecondary: '#d1d5db',
  textTertiary: '#9ca3af',
  
  border: '#374151',
  borderDark: '#4b5563',
  
  overlay: 'rgba(0, 0, 0, 0.7)',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
};

// Hook to get theme colors based on current scheme
export function useThemeColors() {
  const actualScheme = useActualColorScheme();
  return actualScheme === 'dark' ? darkColors : lightColors;
}

// Generate dynamic class names for NativeWind based on theme
export function themed(lightClass: string, darkClass: string) {
  return `${lightClass} dark:${darkClass}`;
}
