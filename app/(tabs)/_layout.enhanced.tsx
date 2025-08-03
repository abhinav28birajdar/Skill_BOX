import { Tabs, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useAuth } from '@/context/AuthContext.enhanced';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { theme, isDark } = useTheme();
  const { user, session, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !session) {
      Alert.alert('Authentication Required', 'Please sign in to continue', [
        { text: 'OK', onPress: () => console.log('Sign in required') }
      ]);
    }
  }, [session, loading]);

  // Show loading or redirect if not authenticated
  if (loading) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
  }

  if (!session) {
    return null; // Will redirect via useEffect
  }

  const isCreator = user?.role === 'creator' || user?.role === 'teacher_approved';
  const isLearner = user?.role === 'learner' || user?.role === 'student';
  const isAdmin = user?.role?.includes('admin');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          ...Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        },
      }}>
      
      {/* Home Tab - Available to all users */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      {/* Explore Tab - Available to all users */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
        }}
      />

      {/* Learning Tab - For learners */}
      {(isLearner || isAdmin) && (
        <Tabs.Screen
          name="learning"
          options={{
            title: 'My Learning',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />,
          }}
        />
      )}

      {/* Creator Hub Tab - For creators */}
      {(isCreator || isAdmin) && (
        <Tabs.Screen
          name="creator"
          options={{
            title: isCreator ? 'Creator Hub' : 'Create',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
          }}
        />
      )}

      {/* Community Tab - Available to all users */}
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3.fill" color={color} />,
        }}
      />

      {/* Profile Tab - Available to all users */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.circle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
