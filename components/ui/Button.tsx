import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  onPress,
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
      case 'warning':
        return {
          backgroundColor: theme.colors.warning,
          borderWidth: 1,
          borderColor: theme.colors.warning,
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

  const getTextColor = (): string => {
    if (disabled) return theme.colors.textTertiary;
    
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
      case 'success':
      case 'warning':
        return '#FFFFFF';
      case 'outline':
        return theme.colors.primary;
      case 'ghost':
        return theme.colors.text;
      default:
        return '#FFFFFF';
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return theme.fontSizes.sm;
      case 'lg':
        return theme.fontSizes.lg;
      case 'xl':
        return theme.fontSizes.xl;
      default:
        return theme.fontSizes.base;
    }
  };

  const buttonStyle = [
    styles.button,
    getVariantStyle(),
    getSizeStyle(),
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ].filter(Boolean);

  const buttonTextStyle: TextStyle = {
    fontSize: getFontSize(),
    fontWeight: '600',
    color: getTextColor(),
    textAlign: 'center',
    ...textStyle,
  };

  const isDisabled = disabled || loading;

  const handlePress = (event: any) => {
    if (!isDisabled && onPress) {
      onPress(event);
    }
  };

  const renderContent = () => {
    const content = title || children;
    
    return (
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={getTextColor()}
            style={styles.loader}
          />
        ) : (
          <>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            {content && (
              <Text style={buttonTextStyle}>
                {content}
              </Text>
            )}
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={isDisabled}
      onPress={handlePress}
      activeOpacity={0.7}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

// Icon Button Component
interface IconButtonProps extends TouchableOpacityProps {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  style,
  onPress,
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
      case 'warning':
        return {
          backgroundColor: theme.colors.warning,
          borderWidth: 1,
          borderColor: theme.colors.warning,
        };
      default:
        return {};
    }
  };
  
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const buttonSize = sizeMap[size];

  const buttonStyle = [
    {
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    getVariantStyle(),
    disabled && styles.disabled,
    style,
  ].filter(Boolean);

  const handlePress = (event: any) => {
    if (!disabled && onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      {icon}
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
