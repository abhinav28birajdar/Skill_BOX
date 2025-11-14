export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
};

export const JITSI_CONFIG = {
  domain: process.env.EXPO_PUBLIC_JITSI_DOMAIN || 'meet.jit.si',
};

export const APP_CONFIG = {
  name: 'SkillBox',
  version: '1.0.0',
  supportEmail: 'support@skillbox.com',
  termsUrl: 'https://skillbox.com/terms',
  privacyUrl: 'https://skillbox.com/privacy',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  ONBOARDING_COMPLETED: 'onboarding_completed',
};
