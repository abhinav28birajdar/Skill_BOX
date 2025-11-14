import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 16,
  style,
  children,
  ...props
}) => {
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        };
      case 'outlined':
        return {
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#E5E5EA',
        };
      case 'flat':
        return {
          backgroundColor: '#F2F2F7',
        };
      default:
        return {
          backgroundColor: '#FFFFFF',
        };
    }
  };

  return (
    <View
      {...props}
      style={[
        {
          borderRadius: 12,
          padding,
        },
        getVariantStyles(),
        style,
      ]}
    >
      {children}
    </View>
  );
};
