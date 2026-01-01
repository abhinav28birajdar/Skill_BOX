import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserProfileUpdate, UserRole, getFullName } from '../types/supabase';

// Sign up data interface
interface SignUpData {
  email: string;
  password: string;
  username?: string;
  full_name?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isCreator: boolean;
  loading: boolean;
  isDemoMode: boolean;
  signUp: (data: SignUpData) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: UserProfileUpdate) => Promise<{ error?: string }>;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Demo user data
  const demoUser: User = {
    id: 'demo-user-id',
    email: 'demo@skillbox.com',
    username: 'demo_user',
    display_name: 'Demo User',
    first_name: 'Demo',
    last_name: 'User',
    full_name: 'Demo User',
    role: 'student',
    bio: 'Exploring SkillBox in demo mode',
    profile_image_url: null,
    skills: [],
    interests: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  useEffect(() => {
    // Skip auth check if in demo mode
    if (isDemoMode) {
      setUser(demoUser);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Auth state changed: INITIAL_SESSION', session?.user?.id);
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isDemoMode]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        if (error.code === 'PGRST116') {
          // User profile doesn't exist, this is normal for new users
          setUser(null);
        }
      } else {
        // Add computed full_name property
        const userWithFullName = {
          ...(data as any),
          full_name: getFullName(data as any)
        } as User;
        setUser(userWithFullName);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ email, password, username, full_name }: SignUpData) => {
    try {
      setLoading(true);
      
      // Check if username is available (if provided)
      if (username) {
        const { data: existingUser } = await supabase
          .from('user_profiles')
          .select('display_name')
          .eq('display_name', username)
          .maybeSingle();

        if (existingUser) {
          return { error: 'Username is already taken' };
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
            full_name: full_name || '',
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      // The user profile creation will be handled by a database trigger
      // or we'll create it on the first sign-in
      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // For now, return a placeholder implementation
      // In production, this would integrate with Google Sign-In SDK
      console.log('Google Sign-In would be implemented here');
      
      // Mock successful Google sign-in for demo purposes
      return { error: 'Google Sign-In not yet implemented. Please use email/password.' };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { error: 'Google Sign-In failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      if (isDemoMode) {
        setIsDemoMode(false);
        setUser(null);
        return;
      }
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const enterDemoMode = () => {
    setIsDemoMode(true);
    setUser(demoUser);
    setLoading(false);
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    setUser(null);
  };

  const updateProfile = async (updates: UserProfileUpdate) => {
    try {
      if (!user) return { error: 'No user logged in' };

      const { error } = await (supabase as any)
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }

      // Update local state with computed full_name
      const updatedUser = { ...user, ...updates } as User;
      updatedUser.full_name = getFullName(updatedUser);
      setUser(updatedUser);
      return {};
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  // Check if the user is a creator
  const isCreator = user?.role === 'creator' || user?.role === 'teacher_approved' || user?.role === 'teacher_pending';
  
  const value: AuthContextType = {
    session,
    user,
    isCreator,
    loading,
    isDemoMode,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    enterDemoMode,
    exitDemoMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
