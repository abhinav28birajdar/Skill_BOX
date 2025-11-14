import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  style,
}) => {
  const variantStyles = {
    default: { backgroundColor: '#e0e0e0', color: '#333' },
    primary: { backgroundColor: '#007AFF', color: '#fff' },
    success: { backgroundColor: '#34C759', color: '#fff' },
    warning: { backgroundColor: '#FF9500', color: '#fff' },
    error: { backgroundColor: '#FF3B30', color: '#fff' },
  };

  const sizeStyles = {
    small: { paddingHorizontal: 6, paddingVertical: 2, fontSize: 12 },
    medium: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 14 },
    large: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 16 },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: currentVariant.backgroundColor,
          paddingHorizontal: currentSize.paddingHorizontal,
          paddingVertical: currentSize.paddingVertical,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: currentVariant.color,
            fontSize: currentSize.fontSize,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
