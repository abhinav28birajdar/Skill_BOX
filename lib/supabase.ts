import { Database } from '@/types/database.enhanced';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Using placeholder values for development.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Storage helpers
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File | Blob,
  options?: {
    cacheControl?: string;
    upsert?: boolean;
  }
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      upsert: options?.upsert || false,
    });

  if (error) throw error;
  return data;
};

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const deleteFile = async (bucket: string, paths: string[]) => {
  const { data, error } = await supabase.storage.from(bucket).remove(paths);
  if (error) throw error;
  return data;
};

// Real-time helpers
export const subscribeToTable = <T = any>(
  table: string,
  callback: (payload: any) => void,
  filters?: { column: string; value: any }[]
) => {
  let subscription = supabase
    .channel(`public:${table}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table,
        ...(filters && { filter: filters.map(f => `${f.column}=eq.${f.value}`).join(',') })
      }, 
      callback
    );

  return subscription.subscribe();
};

// Database helpers with error handling
export const dbSelect = async <T = any>(
  from: string,
  select = '*',
  filters?: Record<string, any>
) => {
  let query = supabase.from(from).select(select);
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as T[];
};

export const dbInsert = async <T = any>(
  into: string,
  values: any | any[]
) => {
  const { data, error } = await supabase
    .from(into)
    .insert(values)
    .select();
    
  if (error) throw error;
  return data as T[];
};

export const dbUpdate = async <T = any>(
  table: string,
  updates: Record<string, any>,
  filters: Record<string, any>
) => {
  let query = supabase.from(table).update(updates);
  
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  
  const { data, error } = await query.select();
  if (error) throw error;
  return data as T[];
};

export const dbDelete = async (
  from: string,
  filters: Record<string, any>
) => {
  let query = supabase.from(from).delete();
  
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  
  const { error } = await query;
  if (error) throw error;
};

// Pagination helper
export const dbSelectPaginated = async <T = any>(
  from: string,
  {
    select = '*',
    filters,
    orderBy,
    ascending = true,
    page = 1,
    limit = 10,
  }: {
    select?: string;
    filters?: Record<string, any>;
    orderBy?: string;
    ascending?: boolean;
    page?: number;
    limit?: number;
  } = {}
) => {
  let query = supabase.from(from).select(select, { count: 'exact' });
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        query = query.in(key, value);
      } else {
        query = query.eq(key, value);
      }
    });
  }
  
  if (orderBy) {
    query = query.order(orderBy, { ascending });
  }
  
  const from_index = (page - 1) * limit;
  const to_index = from_index + limit - 1;
  
  query = query.range(from_index, to_index);
  
  const { data, error, count } = await query;
  if (error) throw error;
  
  return {
    data: data as T[],
    count: count || 0,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
  };
};

// Search helper
export const dbSearch = async <T = any>(
  from: string,
  {
    select = '*',
    searchColumn,
    searchTerm,
    filters,
    orderBy,
    ascending = true,
    limit = 50,
  }: {
    select?: string;
    searchColumn: string;
    searchTerm: string;
    filters?: Record<string, any>;
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
  }
) => {
  let query = supabase
    .from(from)
    .select(select)
    .ilike(searchColumn, `%${searchTerm}%`);
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        query = query.in(key, value);
      } else {
        query = query.eq(key, value);
      }
    });
  }
  
  if (orderBy) {
    query = query.order(orderBy, { ascending });
  }
  
  query = query.limit(limit);
  
  const { data, error } = await query;
  if (error) throw error;
  return data as T[];
};

// RPC (Remote Procedure Call) helper
export const dbRpc = async <T = any>(
  functionName: string,
  params?: Record<string, any>
) => {
  const { data, error } = await supabase.rpc(functionName, params);
  if (error) throw error;
  return data as T;
};
