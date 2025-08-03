import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useAuth } from '@/context/AuthContext.enhanced';
import { useTheme } from '@/context/ThemeContext';

export default function CreatorTabLayout() {
  const { theme } = useTheme();
  const { user, isCreator } = useAuth();

  // Redirect if not a creator
  React.useEffect(() => {
    if (!isCreator && user) {
      // Could redirect back to main tabs
    }
  }, [isCreator, user]);

  if (!isCreator) {
    return null; // Or loading screen
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          height: Platform.OS === 'ios' ? 84 : 60,
        },
        tabBarBackground: TabBarBackground,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? 'chart.bar.fill' : 'chart.bar'} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="content"
        options={{
          title: 'Content',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? 'folder.fill' : 'folder'} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? 'play.rectangle.fill' : 'play.rectangle'} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="classes"
        options={{
          title: 'Live Classes',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? 'video.fill' : 'video'} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? 'chart.line.uptrend.xyaxis' : 'chart.xyaxis.line'} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
