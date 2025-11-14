import React from 'react';
import { Text, View, ViewStyle } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  size = 'md',
  style,
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: '#007AFF15', text: '#007AFF' };
      case 'secondary':
        return { bg: '#5856D615', text: '#5856D6' };
      case 'success':
        return { bg: '#34C75915', text: '#34C759' };
      case 'warning':
        return { bg: '#FF9F0A15', text: '#FF9F0A' };
      case 'danger':
        return { bg: '#FF3B3015', text: '#FF3B30' };
      case 'info':
        return { bg: '#8E8E9315', text: '#8E8E93' };
      default:
        return { bg: '#007AFF15', text: '#007AFF' };
    }
  };

  const colors = getVariantColors();
  const fontSize = size === 'sm' ? 12 : 14;
  const paddingVertical = size === 'sm' ? 4 : 6;
  const paddingHorizontal = size === 'sm' ? 8 : 12;

  return (
    <View
      style={[
        {
          backgroundColor: colors.bg,
          paddingVertical,
          paddingHorizontal,
          borderRadius: 6,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text
        style={{
          color: colors.text,
          fontSize,
          fontWeight: '600',
        }}
      >
        {text}
      </Text>
    </View>
  );
};
