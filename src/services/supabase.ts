import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { SUPABASE_CONFIG } from '../../config/constants';

if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
  throw new Error('Missing Supabase configuration. Please check your .env file.');
}

export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
) as any;

// Export typed version for use in service helpers
export const typedSupabase = supabase as any;

// Helper function to get public URL for storage files
export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// Helper function to upload file to storage
export const uploadFile = async (
  bucket: string,
  path: string,
  file: Blob | File,
  contentType?: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: true,
      });

    if (error) throw error;
    return data.path;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};

// Helper function to delete file from storage
export const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

export default supabase;
