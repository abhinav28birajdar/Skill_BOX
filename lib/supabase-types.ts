// Enhanced type definitions for Supabase client

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/mergedDatabase'

// Types for supabase-js client when using our merged database types
export type TypedSupabaseClient = ReturnType<typeof createClient<Database>>

// Helper function to create typed supabase client
export const createTypedClient = (
  supabaseUrl: string, 
  supabaseKey: string, 
  options?: any
) => {
  return createClient<Database>(supabaseUrl, supabaseKey, options)
}

// Type guard to check if the error is from Supabase
export function isSupabaseError(error: any): boolean {
  return error && typeof error === 'object' && 'code' in error && 'message' in error
}

// Helper types for better type safety when using supabase queries
export type SupabaseQueryResult<T> = {
  data: T | null
  error: Error | null
}

// Helper function to handle supabase error responses
export function handleSupabaseError(error: any): string {
  if (isSupabaseError(error)) {
    return `Database error: ${error.message} (code: ${error.code})`
  } else if (error instanceof Error) {
    return `Error: ${error.message}`
  } else {
    return 'An unknown error occurred'
  }
}