import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '../src/hooks/useAuth';

export default function IndexPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Redirect href="/splash" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/welcome" />;
  }

  // Redirect to appropriate dashboard based on role
  return <Redirect href="/(student)" />;
}