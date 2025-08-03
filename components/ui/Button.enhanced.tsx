import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';
import { Text } from './Text.enhanced';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          borderWidth: 1,
          borderColor: theme.colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.error,
          borderWidth: 1,
          borderColor: theme.colors.error,
        };
      case 'success':
        return {
          backgroundColor: theme.colors.success,
          borderWidth: 1,
          borderColor: theme.colors.success,
        };
      default:
        return {};
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          borderRadius: theme.borderRadius.sm,
          minHeight: 32,
        };
      case 'md':
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          borderRadius: theme.borderRadius.md,
          minHeight: 40,
        };
      case 'lg':
        return {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          borderRadius: theme.borderRadius.lg,
          minHeight: 48,
        };
      case 'xl':
        return {
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.lg,
          borderRadius: theme.borderRadius.lg,
          minHeight: 56,
        };
      default:
        return {};
    }
  };

  const getTextColor = () => {
    if (disabled) return 'textTertiary';
    
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
      case 'success':
        return 'white';
      case 'outline':
        return 'primary';
      case 'ghost':
        return 'text';
      default:
        return 'white';
    }
  };

  const getTextVariant = () => {
    switch (size) {
      case 'sm':
        return 'body2';
      case 'xl':
        return 'h6';
      default:
        return 'body1';
    }
  };

  const buttonStyle = [
    styles.button,
    getVariantStyle(),
    getSizeStyle(),
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      <div style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={getTextColor() === 'white' ? '#FFFFFF' : theme.colors.primary}
            style={styles.loader}
          />
        ) : (
          <>
            {leftIcon && <div style={styles.leftIcon}>{leftIcon}</div>}
            <Text
              variant={getTextVariant() as any}
              color={getTextColor() as any}
              weight="semibold"
              style={styles.text}
            >
              {children}
            </Text>
            {rightIcon && <div style={styles.rightIcon}>{rightIcon}</div>}
          </>
        )}
      </div>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  loader: {
    marginHorizontal: 8,
  },
});
