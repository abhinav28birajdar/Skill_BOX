import { buttonSizes, buttonVariants, useTheme } from '@/constants/Theme';
import React from 'react';
import {
    ActivityIndicator,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  onPress,
  ...props
}: ButtonProps) {
  const theme = useTheme();

  const variantStyles = buttonVariants[variant](theme);
  const sizeStyles = buttonSizes[size](theme);

  const isDisabled = disabled || loading;

  const buttonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...sizeStyles,
    ...variantStyles,
    ...(fullWidth && { width: '100%' }),
    ...(isDisabled && {
      opacity: 0.5,
    }),
    ...style,
  };

  const getTextColor = () => {
    if (variant === 'secondary' || variant === 'ghost') {
      return theme.colors.text;
    }
    return '#FFFFFF';
  };

  const textStyles: TextStyle = {
    fontSize: size === 'sm' ? theme.typography.fontSize.sm : theme.typography.fontSize.base,
    fontWeight: '600' as const,
    color: getTextColor(),
    ...textStyle,
  };

  const handlePress = (event: any) => {
    if (!isDisabled && onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={{ marginRight: title ? theme.spacing.sm : 0 }}
        />
      ) : (
        leftIcon && (
          <React.Fragment>
            {leftIcon}
            {title && <Text style={{ width: theme.spacing.sm }} />}
          </React.Fragment>
        )
      )}
      
      {title && <Text style={textStyles}>{title}</Text>}
      
      {rightIcon && !loading && (
        <React.Fragment>
          {title && <Text style={{ width: theme.spacing.sm }} />}
          {rightIcon}
        </React.Fragment>
      )}
    </TouchableOpacity>
  );
}

// Icon Button Component
interface IconButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  style,
  onPress,
  ...props
}: IconButtonProps) {
  const theme = useTheme();

  const variantStyles = buttonVariants[variant](theme);
  
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const buttonSize = sizeMap[size];

  const buttonStyle: ViewStyle = {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...variantStyles,
    ...(disabled && { opacity: 0.5 }),
    ...style,
  };

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
}
