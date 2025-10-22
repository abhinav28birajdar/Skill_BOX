import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="mt-4 text-lg text-gray-700 dark:text-gray-300">
        Loading SkillBox...
      </Text>
    </View>
  );
}