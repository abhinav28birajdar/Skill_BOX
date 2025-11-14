import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface AvatarProps {
  source?: { uri: string } | number;
  size?: 'small' | 'medium' | 'large';
  fallbackText?: string;
  style?: any;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 'medium',
  fallbackText = '?',
  style,
}) => {
  const sizeStyles = {
    small: { width: 32, height: 32, borderRadius: 16 },
    medium: { width: 48, height: 48, borderRadius: 24 },
    large: { width: 64, height: 64, borderRadius: 32 },
  };

  const currentSize = sizeStyles[size];

  if (source) {
    return (
      <Image
        source={source}
        style={[styles.avatar, currentSize, style]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={[styles.fallback, currentSize, style]}>
      <Text style={[styles.fallbackText, { fontSize: currentSize.width * 0.4 }]}>
        {fallbackText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#f0f0f0',
  },
  fallback: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontWeight: 'bold',
    color: '#666',
  },
});
