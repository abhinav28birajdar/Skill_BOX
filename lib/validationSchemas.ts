import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
});

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  acceptTerms: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Profile schemas
export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
  displayName: z
    .string()
    .max(100, 'Display name is too long')
    .optional(),
  bio: z
    .string()
    .max(500, 'Bio is too long')
    .optional(),
  location: z
    .string()
    .max(100, 'Location is too long')
    .optional(),
  website: z
    .string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),
});

// Course creation schema
export const courseSchema = z.object({
  title: z
    .string()
    .min(1, 'Course title is required')
    .max(200, 'Title is too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description is too long'),
  shortDescription: z
    .string()
    .min(10, 'Short description must be at least 10 characters')
    .max(500, 'Short description is too long'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  price: z
    .number()
    .min(0, 'Price must be positive')
    .max(9999.99, 'Price is too high'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  language: z.string().min(2, 'Language is required'),
  estimatedHours: z
    .number()
    .min(1, 'Estimated hours must be at least 1')
    .max(1000, 'Estimated hours is too high'),
});

// Settings schemas
export const notificationSettingsSchema = z.object({
  push: z.boolean(),
  email: z.boolean(),
  inApp: z.boolean(),
});

export const privacySettingsSchema = z.object({
  profilePublic: z.boolean(),
  progressVisible: z.boolean(),
  showOnlineStatus: z.boolean(),
});

export const learningSettingsSchema = z.object({
  reminderEnabled: z.boolean(),
  reminderTime: z.string(),
  autoPlay: z.boolean(),
  playbackSpeed: z.number().min(0.5).max(2.0),
});

// API Key Manager schema
export const apiKeySchema = z.object({
  supabaseUrl: z
    .string()
    .min(1, 'Supabase URL is required')
    .url('Invalid URL format')
    .refine(url => url.includes('.supabase.co'), {
      message: 'Must be a valid Supabase URL (*.supabase.co)',
    }),
  supabaseAnonKey: z
    .string()
    .min(100, 'Invalid anon key (too short)')
    .regex(/^eyJ/, 'Anon key must be a valid JWT token'),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type NotificationSettingsData = z.infer<typeof notificationSettingsSchema>;
export type PrivacySettingsData = z.infer<typeof privacySettingsSchema>;
export type LearningSettingsData = z.infer<typeof learningSettingsSchema>;
export type ApiKeyFormData = z.infer<typeof apiKeySchema>;