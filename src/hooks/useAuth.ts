import { useEffect, useState } from 'react';
import authService from '../services/auth';
import type { Profile, User } from '../types/database';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();

    const { data: authListener } = authService.onAuthStateChange((user) => {
      setUser(user);
      if (user) {
        loadProfile(user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const loadUser = async () => {
    const currentUser = await authService.getCurrentUser();
    const currentProfile = await authService.getCurrentProfile();
    setUser(currentUser);
    setProfile(currentProfile);
    setLoading(false);
  };

  const loadProfile = async (userId: string) => {
    const currentProfile = await authService.getCurrentProfile();
    setProfile(currentProfile);
  };

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn({ email, password });
    if (result.user && result.profile) {
      setUser(result.user);
      setProfile(result.profile);
    }
    return result;
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'student' | 'teacher') => {
    const result = await authService.signUp({ email, password, name: fullName, role });
    if (result.user && result.profile) {
      setUser(result.user);
      setProfile(result.profile);
    }
    return result;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isTeacher: user?.role === 'teacher',
  };
};
