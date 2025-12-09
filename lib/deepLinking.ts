/**
 * Deep Linking Configuration
 * Handles universal links and deep links for the app
 */

import * as Linking from 'expo-linking';

// Define the app's URL schemes
export const prefix = Linking.createURL('/');

export const linking = {
  prefixes: [prefix, 'skillbox://', 'https://skillbox.app', 'https://*.skillbox.app'],
  config: {
    screens: {
      // Auth screens
      '(auth)': {
        screens: {
          login: 'login',
          signup: 'signup',
          'forgot-password': 'forgot-password',
          'reset-password': 'reset-password',
          'verify-email': 'verify-email',
        },
      },

      // Main tabs
      '(tabs)': {
        screens: {
          index: '',
          explore: 'explore',
          learning: 'learning',
          profile: 'profile',
        },
      },

      // Course related
      'courses/:id': 'courses/:id',
      'lessons/:id': 'lessons/:id',

      // Skills
      'skills/:id': 'skills/:id',

      // Profile
      'profile/:id': 'profile/:id',

      // Creator
      'creators/:id': 'creators/:id',
      'creator/edit-content/:id': 'creator/edit-content/:id',

      // Classes
      'classes/:id': 'classes/:id',

      // Community
      community: 'community',

      // Settings
      settings: {
        screens: {
          index: 'settings',
          account: 'settings/account',
          security: 'settings/security',
          notifications: 'settings/notifications',
          privacy: 'settings/privacy',
          about: 'settings/about',
        },
      },

      // Notifications
      notifications: 'notifications',

      // Support
      support: 'support',
      feedback: 'feedback',

      // Config
      'config-setup': 'config-setup',

      // Not found
      '+not-found': '*',
    },
  },
};

/**
 * Parse deep link URL
 */
export function parseDeepLink(url: string): {
  screen: string;
  params?: Record<string, any>;
} | null {
  try {
    const { path, queryParams } = Linking.parse(url);

    if (!path) return null;

    const segments = path.split('/').filter(Boolean);
    const screen = segments[0];
    const params: Record<string, any> = { ...queryParams };

    // Extract dynamic params (e.g., /courses/123 -> { id: '123' })
    if (segments.length > 1) {
      params.id = segments[1];
    }

    return { screen, params };
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
}

/**
 * Create a deep link URL
 */
export function createDeepLink(screen: string, params?: Record<string, any>): string {
  const queryString = params
    ? '?' + Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
    : '';

  return `${prefix}${screen}${queryString}`;
}

/**
 * Open external URL
 */
export async function openExternalUrl(url: string): Promise<void> {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    console.error(`Cannot open URL: ${url}`);
  }
}

/**
 * Share a deep link
 */
export function getShareableLink(screen: string, params?: Record<string, any>): string {
  const baseUrl = 'https://skillbox.app';
  const queryString = params
    ? '?' + Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
    : '';

  return `${baseUrl}/${screen}${queryString}`;
}

/**
 * Common deep link creators
 */
export const deepLinks = {
  course: (courseId: string) => createDeepLink(`courses/${courseId}`),
  lesson: (lessonId: string) => createDeepLink(`lessons/${lessonId}`),
  skill: (skillId: string) => createDeepLink(`skills/${skillId}`),
  profile: (userId: string) => createDeepLink(`profile/${userId}`),
  creator: (creatorId: string) => createDeepLink(`creators/${creatorId}`),
  class: (classId: string) => createDeepLink(`classes/${classId}`),
};

/**
 * Shareable link creators
 */
export const shareLinks = {
  course: (courseId: string, courseName: string) =>
    getShareableLink(`courses/${courseId}`, { name: courseName }),
  profile: (userId: string, username: string) =>
    getShareableLink(`profile/${userId}`, { username }),
  referral: (userId: string, referralCode: string) =>
    getShareableLink('signup', { ref: referralCode, from: userId }),
};

export default linking;
