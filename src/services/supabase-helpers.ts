// Temporary type fixes for Supabase operations
// This file provides type-safe wrappers for Supabase operations until the type generation is fixed

import { Database } from '../types/database';
import supabase from './supabase';

// Create a properly typed client reference
export const typedSupabase = supabase as any;

// Helper function to perform typed inserts
export async function insertRecord<T extends keyof Database['public']['Tables']>(
  table: T,
  data: Database['public']['Tables'][T]['Insert']
) {
  return await typedSupabase.from(table).insert(data).select().single();
}

// Helper function to perform typed updates  
export async function updateRecord<T extends keyof Database['public']['Tables']>(
  table: T,
  data: Database['public']['Tables'][T]['Update'],
  conditions: Record<string, any>
) {
  let query = typedSupabase.from(table).update(data);
  
  Object.entries(conditions).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  
  return await query;
}

// Helper function to perform typed selects
export async function selectRecords<T extends keyof Database['public']['Tables']>(
  table: T,
  columns = '*',
  conditions: Record<string, any> = {}
) {
  let query = typedSupabase.from(table).select(columns);
  
  Object.entries(conditions).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  
  return await query;
}