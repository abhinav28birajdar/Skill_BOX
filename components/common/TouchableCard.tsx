import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface TouchableCardProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  variant?: 'default' | 'elevated' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  accessibilityLabel?: string;
}

const TouchableCard: React.FC<TouchableCardProps> = ({
  children,
  onPress,
  style,
  variant = 'default',
  padding = 'md',
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  
  // Apply styles based on the variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          ...theme.shadows.md,
        };
      case 'outline':
        return {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          ...theme.shadows.sm,
        };
    }
  };
  
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return {};
      case 'sm':
        return { padding: theme.spacing.sm };
      case 'md':
        return { padding: theme.spacing.md };
      case 'lg':
        return { padding: theme.spacing.lg };
      case 'xl':
        return { padding: theme.spacing.xl };
      default:
        return { padding: theme.spacing.md };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, getVariantStyles(), style]}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={[styles.content, getPaddingStyle()]}>{children}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  content: {
    // Padding is applied from theme in the component
  },
});

export default TouchableCard;
