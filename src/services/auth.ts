import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../../config/constants';
import { Profile, User } from '../types/database';
import supabase from './supabase';
import { updateRecord } from './supabase-helpers';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher';
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  profile: Profile | null;
  error: string | null;
}

class AuthService {
  // Sign up with email and password
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { email, password, name, role } = data;

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // Update user role
      const { error: userError } = await updateRecord('users', { role }, { id: authData.user.id });

      if (userError) throw userError;

      // Update profile with name
      const { error: profileError } = await updateRecord('profiles', { name }, { id: authData.user.id });

      if (profileError) throw profileError;

      // Fetch updated user and profile
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      // Store user data securely
      if (user) {
        await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      }

      return { user, profile, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { user: null, profile: null, error: error.message };
    }
  }

  // Sign in with email and password
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { email, password } = data;

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Sign in failed');

      // Fetch user data
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      // Store user data securely
      if (user) {
        await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      }

      return { user, profile, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { user: null, profile: null, error: error.message };
    }
  }

  // Sign out
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear stored data
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);

      return { error: null };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { error: error.message };
    }
  }

  // Get current session
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const session = await this.getSession();
      if (!session) return null;

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Get current profile
  async getCurrentProfile(): Promise<Profile | null> {
    try {
      const session = await this.getSession();
      if (!session) return null;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return data;
    } catch (error) {
      console.error('Get current profile error:', error);
      return null;
    }
  }

  // Update profile
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ error: string | null }> {
    try {
      const { error } = await updateRecord('profiles', updates, { id: userId });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { error: error.message };
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { error: error.message };
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Update password error:', error);
      return { error: error.message };
    }
  }

  // Upload avatar
  async uploadAvatar(userId: string, fileUri: string, fileType: string): Promise<{ url: string | null; error: string | null }> {
    try {
      const fileExt = fileUri.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Read file as blob
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          contentType: fileType,
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      // Update profile with new avatar URL
      await this.updateProfile(userId, { avatar_url: urlData.publicUrl });

      return { url: urlData.publicUrl, error: null };
    } catch (error: any) {
      console.error('Upload avatar error:', error);
      return { url: null, error: error.message };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        callback(data);
      } else {
        callback(null);
      }
    });
  }
}

export default new AuthService();
