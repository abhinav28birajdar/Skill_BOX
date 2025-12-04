declare module '@config/constants' {
  export const SUPABASE_CONFIG: any;
  export const STORAGE_KEYS: any;
}

declare module '@config/*' {
  const value: any;
  export default value;
}

declare module '@/lib/supabase' {
  export const supabase: any;
  export default supabase;
}

declare module '@supabase/supabase-js' {
  export const createClient: any;
  export type SupabaseClient = any;
  const _default: any;
  export default _default;
}

declare module '@/*' {
  const value: any;
  export default value;
}

declare module 'expo-image' {
  export const Image: any;
  export default Image;
}
