import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';

// Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  role: 'student' | 'teacher' | 'creator' | 'admin_content' | 'admin_teacher_ops' | 'admin_super';
  isVerified: boolean;
  preferences: Record<string, any>;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export interface ThemeState {
  theme: 'light' | 'dark' | 'auto';
  colors: Record<string, string>;
  isDark: boolean;
}

export interface AppSettings {
  notifications: {
    push: boolean;
    email: boolean;
    inApp: boolean;
  };
  privacy: {
    profilePublic: boolean;
    progressVisible: boolean;
    showOnlineStatus: boolean;
  };
  learning: {
    reminderEnabled: boolean;
    reminderTime: string;
    autoPlay: boolean;
    playbackSpeed: number;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    reduceAnimations: boolean;
    highContrast: boolean;
  };
}

export interface SupabaseConfig {
  url: string | null;
  anonKey: string | null;
  isConfigured: boolean;
}

export interface AppStore {
  // Auth
  auth: AuthState;
  
  // Theme
  theme: ThemeState;
  
  // Settings
  settings: AppSettings;
  
  // Supabase Configuration
  supabase: SupabaseConfig;
  
  // Real-time state
  notifications: any[];
  onlineUsers: string[];
  
  // Offline/Cache state
  isOnline: boolean;
  lastSync: Date | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleTheme: () => void;
  setSystemTheme: (isDark: boolean) => void;
  
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  
  setSupabaseConfig: (url: string, anonKey: string) => void;
  clearSupabaseConfig: () => void;
  
  addNotification: (notification: any) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  setOnlineUsers: (users: string[]) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  updateLastSync: () => void;
  
  // Cleanup
  reset: () => void;
}

const defaultTheme: ThemeState = {
  theme: 'auto',
  isDark: false,
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
  }
};

const defaultSettings: AppSettings = {
  notifications: {
    push: true,
    email: true,
    inApp: true,
  },
  privacy: {
    profilePublic: true,
    progressVisible: true,
    showOnlineStatus: true,
  },
  learning: {
    reminderEnabled: true,
    reminderTime: '19:00',
    autoPlay: true,
    playbackSpeed: 1.0,
  },
  accessibility: {
    fontSize: 'medium',
    reduceAnimations: false,
    highContrast: false,
  },
};

export const useAppStore = create<AppStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        auth: {
          user: null,
          session: null,
          isLoading: false,
          isInitialized: false,
          error: null,
        },
        
        theme: defaultTheme,
        settings: defaultSettings,
        
        supabase: {
          url: null,
          anonKey: null,
          isConfigured: false,
        },
        
        notifications: [],
        onlineUsers: [],
        isOnline: true,
        lastSync: null,
        
        // Auth actions
        setUser: (user) => 
          set((state) => ({
            auth: { ...state.auth, user }
          })),
          
        setSession: (session) => 
          set((state) => ({
            auth: { ...state.auth, session }
          })),
          
        setLoading: (isLoading) => 
          set((state) => ({
            auth: { ...state.auth, isLoading }
          })),
          
        setError: (error) => 
          set((state) => ({
            auth: { ...state.auth, error }
          })),
          
        setInitialized: (isInitialized) => 
          set((state) => ({
            auth: { ...state.auth, isInitialized }
          })),
        
        // Theme actions
        setTheme: (theme) => {
          const isDark = theme === 'dark' || 
            (theme === 'auto' && 
             // This will be updated by the system theme listener
             false);
          
          set((state) => ({
            theme: { 
              ...state.theme, 
              theme,
              isDark,
              colors: isDark ? {
                primary: '#3B82F6',
                secondary: '#10B981',
                background: '#111827',
                surface: '#1F2937',
                text: '#F9FAFB',
                textSecondary: '#D1D5DB',
                border: '#374151',
                error: '#EF4444',
                warning: '#F59E0B',
                success: '#10B981',
              } : {
                primary: '#3B82F6',
                secondary: '#10B981',
                background: '#FFFFFF',
                surface: '#F8FAFC',
                text: '#1F2937',
                textSecondary: '#6B7280',
                border: '#E5E7EB',
                error: '#EF4444',
                warning: '#F59E0B',
                success: '#10B981',
              }
            }
          }));
        },
        
        toggleTheme: () => {
          const current = get().theme.theme;
          const newTheme = current === 'light' ? 'dark' : 'light';
          get().setTheme(newTheme);
        },
        
        setSystemTheme: (isDark) => {
          const theme = get().theme.theme;
          if (theme === 'auto') {
            set((state) => ({
              theme: { ...state.theme, isDark }
            }));
          }
        },
        
        // Settings actions
        updateSettings: (newSettings) => 
          set((state) => ({
            settings: { ...state.settings, ...newSettings }
          })),
          
        resetSettings: () => 
          set({ settings: defaultSettings }),
        
        // Supabase actions
        setSupabaseConfig: (url, anonKey) => 
          set({
            supabase: { url, anonKey, isConfigured: true }
          }),
          
        clearSupabaseConfig: () => 
          set({
            supabase: { url: null, anonKey: null, isConfigured: false }
          }),
        
        // Notification actions
        addNotification: (notification) => 
          set((state) => ({
            notifications: [notification, ...state.notifications]
          })),
          
        markNotificationRead: (id) => 
          set((state) => ({
            notifications: state.notifications.map(n => 
              n.id === id ? { ...n, isRead: true } : n
            )
          })),
          
        clearNotifications: () => 
          set({ notifications: [] }),
        
        // Online/Real-time actions
        setOnlineUsers: (onlineUsers) => 
          set({ onlineUsers }),
          
        setOnlineStatus: (isOnline) => 
          set({ isOnline }),
          
        updateLastSync: () => 
          set({ lastSync: new Date() }),
        
        // Reset
        reset: () => 
          set({
            auth: {
              user: null,
              session: null,
              isLoading: false,
              isInitialized: false,
              error: null,
            },
            notifications: [],
            onlineUsers: [],
          }),
      }),
      {
        name: 'skillbox-store',
        storage: createJSONStorage(() => AsyncStorage),
        // Only persist certain parts
        partialize: (state) => ({
          theme: state.theme,
          settings: state.settings,
          supabase: state.supabase,
        }),
      }
    )
  )
);

// Selector hooks for better performance
export const useAuth = () => useAppStore((state) => state.auth);
export const useTheme = () => useAppStore((state) => state.theme);
export const useSettings = () => useAppStore((state) => state.settings);
export const useSupabaseConfig = () => useAppStore((state) => state.supabase);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useOnlineStatus = () => useAppStore((state) => ({ 
  isOnline: state.isOnline, 
  onlineUsers: state.onlineUsers 
}));