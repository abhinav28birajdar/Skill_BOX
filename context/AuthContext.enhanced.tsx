import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types/database.enhanced';
import { AuthError, Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signUp: (email: string, password: string, userData: { username: string; full_name: string; role?: UserRole }) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<{ error?: AuthError }>;
  updateProfile: (updates: Partial<User>) => Promise<{ error?: any }>;
  switchRole: (newRole: UserRole) => Promise<{ error?: any }>;
  isCreator: boolean;
  isLearner: boolean;
  isAdmin: boolean;
  canCreateContent: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Computed properties based on user role
  const isCreator = user?.role === 'creator' || user?.role === 'teacher_approved';
  const isLearner = user?.role === 'learner' || user?.role === 'student';
  const isAdmin = user?.role?.includes('admin') || false;
  const canCreateContent = isCreator || isAdmin;

  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const refreshUser = async () => {
    if (session?.user?.id) {
      const userProfile = await fetchUserProfile(session.user.id);
      setUser(userProfile);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Sign In Error', error.message);
        return { error };
      }

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user.id);
        setUser(userProfile);
        setSession(data.session);
      }

      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: { username: string; full_name: string; role?: UserRole }
  ) => {
    try {
      setLoading(true);
      
      // First check if username is available
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', userData.username)
        .single();

      if (existingUser) {
        Alert.alert('Username Taken', 'This username is already taken. Please choose another.');
        return { error: { message: 'Username already taken' } as AuthError };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert('Sign Up Error', error.message);
        return { error };
      }

      if (data.user) {
        // Create user profile
        const userProfile = {
          id: data.user.id,
          email: data.user.email!,
          username: userData.username,
          full_name: userData.full_name,
          role: userData.role || 'learner' as UserRole,
          is_active: true,
          is_featured: false,
          notification_settings: {
            email_notifications: true,
            push_notifications: true,
            class_reminders: true,
            content_updates: true,
          },
          created_at: new Date().toISOString(),
        };

        const { error: profileError } = await supabase
          .from('users')
          .insert([userProfile]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          Alert.alert('Profile Creation Error', 'Failed to create user profile. Please try again.');
          return { error: profileError as unknown as AuthError };
        }

        setUser(userProfile as User);
        setSession(data.session);

        Alert.alert('Welcome to SkillBox!', 'Your account has been created successfully.');
      }

      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        Alert.alert('Sign Out Error', error.message);
        return { error };
      }

      setUser(null);
      setSession(null);
      return {};
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) {
        return { error: 'No user logged in' };
      }

      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Update Error', 'Failed to update profile. Please try again.');
        return { error };
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
      
      Alert.alert('Success', 'Profile updated successfully!');
      return {};
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const switchRole = async (newRole: UserRole) => {
    try {
      if (!user) {
        return { error: 'No user logged in' };
      }

      // Validate role transition
      const allowedTransitions: Record<UserRole, UserRole[]> = {
        'learner': ['creator'],
        'student': ['creator'],
        'creator': ['learner', 'teacher_approved'],
        'teacher_approved': ['creator'],
        'admin_content': ['admin_super'],
        'admin_teacher_ops': ['admin_super'],
        'admin_super': ['admin_content', 'admin_teacher_ops'],
      };

      if (!allowedTransitions[user.role]?.includes(newRole)) {
        Alert.alert('Invalid Role Change', 'You cannot switch to this role.');
        return { error: 'Invalid role transition' };
      }

      const { error } = await supabase
        .from('users')
        .update({
          role: newRole,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error switching role:', error);
        Alert.alert('Role Switch Error', 'Failed to switch role. Please try again.');
        return { error };
      }

      setUser(prev => prev ? { ...prev, role: newRole } : null);
      Alert.alert('Role Updated', `You are now a ${newRole.replace('_', ' ')}!`);
      
      return {};
    } catch (error) {
      console.error('Error switching role:', error);
      return { error };
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
        if (session?.user) {
          fetchUserProfile(session.user.id).then(setUser);
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          setUser(userProfile);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    switchRole,
    isCreator,
    isLearner,
    isAdmin,
    canCreateContent,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
