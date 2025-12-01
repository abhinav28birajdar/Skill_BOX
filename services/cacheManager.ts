import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface CacheConfig {
  ttl?: number; // Time to live in minutes
  maxSize?: number; // Maximum cache size in MB
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private readonly CACHE_PREFIX = 'skillbox_cache_';
  private readonly DEFAULT_TTL = 60; // 60 minutes
  private readonly MAX_CACHE_SIZE = 50; // 50 MB

  async set<T>(
    key: string, 
    data: T, 
    config: CacheConfig = {}
  ): Promise<void> {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: (config.ttl || this.DEFAULT_TTL) * 60 * 1000, // Convert to milliseconds
      };

      await AsyncStorage.setItem(
        this.CACHE_PREFIX + key,
        JSON.stringify(item)
      );

      // Cleanup old items periodically
      this.cleanupExpired();
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(this.CACHE_PREFIX + key);
      
      if (!cached) return null;

      const item: CacheItem<T> = JSON.parse(cached);
      const now = Date.now();

      // Check if item has expired
      if (now - item.timestamp > item.ttl) {
        await this.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CACHE_PREFIX + key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    config: CacheConfig = {}
  ): Promise<T> {
    // Check if we have cached data first
    const cached = await this.get<T>(key);
    if (cached) return cached;

    // Check network connectivity
    const netInfo = await NetInfo.fetch();
    
    if (!netInfo.isConnected) {
      throw new Error('No network connection and no cached data available');
    }

    // Fetch fresh data
    const data = await fetcher();
    await this.set(key, data, config);
    
    return data;
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const matchingKeys = keys.filter(key => 
        key.startsWith(this.CACHE_PREFIX) && 
        key.includes(pattern)
      );
      
      await AsyncStorage.multiRemove(matchingKeys);
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
    }
  }

  private async cleanupExpired(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      const now = Date.now();

      for (const key of cacheKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          const item = JSON.parse(cached);
          if (now - item.timestamp > item.ttl) {
            await AsyncStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }

  async getCacheSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      let totalSize = 0;

      for (const key of cacheKeys) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          totalSize += new Blob([item]).size;
        }
      }

      return totalSize / (1024 * 1024); // Convert to MB
    } catch (error) {
      console.error('Cache size calculation error:', error);
      return 0;
    }
  }
}

export const cacheManager = new CacheManager();

// Cache utility hooks
export const useCachedData = <T>(
  key: string,
  fetcher: () => Promise<T>,
  config?: CacheConfig
) => {
  return cacheManager.getOrFetch(key, fetcher, config);
};