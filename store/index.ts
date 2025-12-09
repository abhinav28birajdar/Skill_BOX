/**
 * Global App Store using Zustand
 * Centralized state management for the SkillBox app
 */

import { User } from '@/types/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ============================================
// Theme Store
// ============================================
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ============================================
// User Store
// ============================================
interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      setUser: (user) =>
        set({ user, isAuthenticated: !!user, loading: false }),
      setLoading: (loading) => set({ loading }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      clearUser: () =>
        set({ user: null, isAuthenticated: false, loading: false }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }), // Only persist user data
    }
  )
);

// ============================================
// App Settings Store
// ============================================
interface AppSettings {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  offlineMode: boolean;
  dataSync: boolean;
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  autoPlayVideos: boolean;
  downloadQuality: 'low' | 'medium' | 'high';
}

interface SettingsStore extends AppSettings {
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  notificationsEnabled: true,
  soundEnabled: true,
  hapticsEnabled: true,
  offlineMode: false,
  dataSync: true,
  language: 'en',
  fontSize: 'medium',
  autoPlayVideos: true,
  downloadQuality: 'medium',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ============================================
// Learning Progress Store
// ============================================
interface LearningProgress {
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  totalLessonsCompleted: number;
  totalStudyMinutes: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  lastStudyDate: string | null;
}

interface ProgressStore extends LearningProgress {
  updateProgress: (progress: Partial<LearningProgress>) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addStudyTime: (minutes: number) => void;
  addXP: (xp: number) => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      totalCoursesEnrolled: 0,
      totalCoursesCompleted: 0,
      totalLessonsCompleted: 0,
      totalStudyMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalXP: 0,
      level: 1,
      lastStudyDate: null,
      updateProgress: (progress) => set((state) => ({ ...state, ...progress })),
      incrementStreak: () =>
        set((state) => {
          const newStreak = state.currentStreak + 1;
          return {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak),
            lastStudyDate: new Date().toISOString(),
          };
        }),
      resetStreak: () => set({ currentStreak: 0 }),
      addStudyTime: (minutes) =>
        set((state) => ({
          totalStudyMinutes: state.totalStudyMinutes + minutes,
        })),
      addXP: (xp) =>
        set((state) => {
          const newXP = state.totalXP + xp;
          const newLevel = Math.floor(newXP / 1000) + 1; // Level up every 1000 XP
          return {
            totalXP: newXP,
            level: newLevel,
          };
        }),
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ============================================
// Notification Store
// ============================================
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) =>
        set((state) => {
          const newNotification: Notification = {
            ...notification,
            id: Math.random().toString(36).substring(7),
            timestamp: new Date().toISOString(),
            read: false,
          };
          return {
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
          };
        }),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),
      removeNotification: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: notification && !notification.read 
              ? state.unreadCount - 1 
              : state.unreadCount,
          };
        }),
      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'notifications-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ============================================
// Cache Store (for offline support)
// ============================================
interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

interface CacheStore {
  cache: Record<string, CacheItem>;
  set: (key: string, data: any, expiresIn?: number) => void;
  get: <T = any>(key: string) => T | null;
  remove: (key: string) => void;
  clear: () => void;
  isExpired: (key: string) => boolean;
}

export const useCacheStore = create<CacheStore>()(
  persist(
    (set, get) => ({
      cache: {},
      set: (key, data, expiresIn = 3600000) =>
        set((state) => ({
          cache: {
            ...state.cache,
            [key]: {
              data,
              timestamp: Date.now(),
              expiresIn,
            },
          },
        })),
      get: (key) => {
        const state = get();
        const item = state.cache[key];
        if (!item) return null;
        if (state.isExpired(key)) {
          state.remove(key);
          return null;
        }
        return item.data;
      },
      remove: (key) =>
        set((state) => {
          const newCache = { ...state.cache };
          delete newCache[key];
          return { cache: newCache };
        }),
      clear: () => set({ cache: {} }),
      isExpired: (key) => {
        const item = get().cache[key];
        if (!item) return true;
        return Date.now() - item.timestamp > item.expiresIn;
      },
    }),
    {
      name: 'cache-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ============================================
// UI State Store (non-persisted)
// ============================================
interface UIStore {
  isMenuOpen: boolean;
  activeModal: string | null;
  isLoading: boolean;
  loadingMessage: string;
  searchQuery: string;
  filters: Record<string, any>;
  setMenuOpen: (open: boolean) => void;
  setActiveModal: (modal: string | null) => void;
  setLoading: (loading: boolean, message?: string) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  resetFilters: () => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  isMenuOpen: false,
  activeModal: null,
  isLoading: false,
  loadingMessage: '',
  searchQuery: '',
  filters: {},
  setMenuOpen: (open) => set({ isMenuOpen: open }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setLoading: (loading, message = '') =>
    set({ isLoading: loading, loadingMessage: message }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: {} }),
}));

// ============================================
// Export all stores
// ============================================
export const stores = {
  theme: useThemeStore,
  user: useUserStore,
  settings: useSettingsStore,
  progress: useProgressStore,
  notifications: useNotificationStore,
  cache: useCacheStore,
  ui: useUIStore,
};
