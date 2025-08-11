import { supabase } from '@/lib/supabase';
import { SignInData, SignUpData, User, UserProfileUpdate } from '@/types/database';
import { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isCreator: boolean;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<{ error?: string }>;
  signIn: (data: SignInData) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: UserProfileUpdate) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
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
        setUser(data);
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
          .from('users')
          .select('username')
          .eq('username', username)
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

  const signIn = async ({ email, password }: SignInData) => {
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

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: UserProfileUpdate) => {
    try {
      if (!user) return { error: 'No user logged in' };

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }

      // Update local state
      setUser({ ...user, ...updates });
      return {};
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  // Check if the user is a creator
  const isCreator = user?.role === 'creator' || user?.role === 'teacher';
  
  const value: AuthContextType = {
    session,
    user,
    isCreator,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
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
