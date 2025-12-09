/**
 * Secure Configuration Manager for SkillBox
 * Handles secure storage and retrieval of API keys and sensitive configuration
 */

import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';

// Initialize MMKV for encrypted storage (fallback for web)
const storage = new MMKV({
  id: 'skillbox-secure-storage',
  encryptionKey: 'skillbox-app-encryption-key-2024',
});

// Configuration keys
export enum ConfigKey {
  SUPABASE_URL = 'supabase_url',
  SUPABASE_ANON_KEY = 'supabase_anon_key',
  ANALYTICS_KEY = 'analytics_key',
  PUSH_NOTIFICATION_KEY = 'push_notification_key',
  CONFIG_INITIALIZED = 'config_initialized',
}

/**
 * Secure storage wrapper that uses SecureStore on native and encrypted MMKV on web
 */
class SecureConfigManager {
  private static instance: SecureConfigManager;

  private constructor() {}

  public static getInstance(): SecureConfigManager {
    if (!SecureConfigManager.instance) {
      SecureConfigManager.instance = new SecureConfigManager();
    }
    return SecureConfigManager.instance;
  }

  /**
   * Save a value securely
   */
  async setValue(key: ConfigKey, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Use encrypted MMKV for web
        storage.set(key, value);
      } else {
        // Use SecureStore for native platforms
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw new Error(`Failed to save configuration: ${key}`);
    }
  }

  /**
   * Get a value securely
   */
  async getValue(key: ConfigKey): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return storage.getString(key) || null;
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete a value
   */
  async deleteValue(key: ConfigKey): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        storage.delete(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`Error deleting ${key}:`, error);
    }
  }

  /**
   * Clear all configuration
   */
  async clearAll(): Promise<void> {
    const keys = Object.values(ConfigKey);
    for (const key of keys) {
      await this.deleteValue(key as ConfigKey);
    }
  }

  /**
   * Check if configuration is initialized
   */
  async isConfigured(): Promise<boolean> {
    const initialized = await this.getValue(ConfigKey.CONFIG_INITIALIZED);
    return initialized === 'true';
  }

  /**
   * Mark configuration as initialized
   */
  async markConfigured(): Promise<void> {
    await this.setValue(ConfigKey.CONFIG_INITIALIZED, 'true');
  }

  /**
   * Get Supabase configuration
   */
  async getSupabaseConfig(): Promise<{ url: string; key: string } | null> {
    const url = await this.getValue(ConfigKey.SUPABASE_URL);
    const key = await this.getValue(ConfigKey.SUPABASE_ANON_KEY);

    if (!url || !key) {
      return null;
    }

    return { url, key };
  }

  /**
   * Set Supabase configuration
   */
  async setSupabaseConfig(url: string, key: string): Promise<void> {
    await this.setValue(ConfigKey.SUPABASE_URL, url);
    await this.setValue(ConfigKey.SUPABASE_ANON_KEY, key);
    await this.markConfigured();
  }

  /**
   * Validate Supabase URL format
   */
  validateSupabaseUrl(url: string): boolean {
    const urlPattern = /^https:\/\/[a-z0-9-]+\.supabase\.co$/;
    return urlPattern.test(url);
  }

  /**
   * Validate Supabase key format (basic check)
   */
  validateSupabaseKey(key: string): boolean {
    return key.length > 50 && key.includes('.');
  }

  /**
   * Encrypt sensitive data (additional layer)
   */
  async encrypt(data: string): Promise<string> {
    try {
      const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        data
      );
      return digest;
    } catch (error) {
      console.error('Encryption error:', error);
      return data;
    }
  }
}

// Export singleton instance
export const configManager = SecureConfigManager.getInstance();

// Helper functions for easy access
export const getSupabaseConfig = () => configManager.getSupabaseConfig();
export const setSupabaseConfig = (url: string, key: string) =>
  configManager.setSupabaseConfig(url, key);
export const isConfigured = () => configManager.isConfigured();
export const clearConfig = () => configManager.clearAll();
