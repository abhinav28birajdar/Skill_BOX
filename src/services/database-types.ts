// Extended database types for service layer
import { Database } from '../types/database';

// Create properly typed Supabase client helpers
export type Tables = Database['public']['Tables'];

// Helper types for insertions
export type UserInsert = Tables['users']['Insert'];
export type ProfileInsert = Tables['profiles']['Insert'];
export type CourseInsert = Tables['courses']['Insert'];
export type LessonInsert = Tables['lessons']['Insert'];
export type EnrollmentInsert = Tables['enrollments']['Insert'];
export type MessageInsert = Tables['messages']['Insert'];
export type ThreadInsert = Tables['threads']['Insert'];
export type NotificationInsert = Tables['notifications']['Insert'];
export type LiveSessionInsert = Tables['live_sessions']['Insert'];
export type ReviewInsert = Tables['reviews']['Insert'];
export type ShowcaseInsert = Tables['showcases']['Insert'];

// Helper types for updates
export type UserUpdate = Tables['users']['Update'];
export type ProfileUpdate = Tables['profiles']['Update'];
export type CourseUpdate = Tables['courses']['Update'];
export type LessonUpdate = Tables['lessons']['Update'];
export type EnrollmentUpdate = Tables['enrollments']['Update'];
export type MessageUpdate = Tables['messages']['Update'];
export type ThreadUpdate = Tables['threads']['Update'];
export type NotificationUpdate = Tables['notifications']['Update'];
export type LiveSessionUpdate = Tables['live_sessions']['Update'];
export type ReviewUpdate = Tables['reviews']['Update'];
export type ShowcaseUpdate = Tables['showcases']['Update'];

// Helper types for rows
export type UserRow = Tables['users']['Row'];
export type ProfileRow = Tables['profiles']['Row'];
export type CourseRow = Tables['courses']['Row'];
export type LessonRow = Tables['lessons']['Row'];
export type EnrollmentRow = Tables['enrollments']['Row'];
export type MessageRow = Tables['messages']['Row'];
export type ThreadRow = Tables['threads']['Row'];
export type NotificationRow = Tables['notifications']['Row'];
export type LiveSessionRow = Tables['live_sessions']['Row'];
export type ReviewRow = Tables['reviews']['Row'];
export type ShowcaseRow = Tables['showcases']['Row'];