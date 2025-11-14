import React from 'react';
import {
    ActivityIndicator,
    Animated,
    Pressable,
    PressableProps,
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle,
} from 'react-native';
import { useThemeColors } from '../../theme';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  style,
  ...props
}) => {
  const colors = useThemeColors();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          shadowColor: colors.secondary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          backgroundColor: colors.error,
          shadowColor: colors.error,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        };
      case 'success':
        return {
          backgroundColor: colors.success,
          shadowColor: colors.success,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        };
      default:
        return {
          backgroundColor: colors.primary,
        };
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 10,
        };
      case 'md':
        return {
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 12,
        };
      case 'lg':
        return {
          paddingVertical: 18,
          paddingHorizontal: 32,
          borderRadius: 14,
        };
      default:
        return {
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 12,
        };
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '700',
      textAlign: 'center',
      letterSpacing: 0.5,
    };

    if (variant === 'outline' || variant === 'ghost') {
      baseStyle.color = colors.primary;
    } else {
      baseStyle.color = '#FFFFFF';
    }

    switch (size) {
      case 'sm':
        baseStyle.fontSize = 14;
        break;
      case 'md':
        baseStyle.fontSize = 16;
        break;
      case 'lg':
        baseStyle.fontSize = 18;
        break;
    }

    return baseStyle;
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
        fullWidth && { width: '100%' },
      ]}
    >
      <Pressable
        {...props}
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          {
            opacity: disabled || loading ? 0.6 : 1,
          },
          getVariantStyles(),
          getSizeStyles(),
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF'}
            size="small"
          />
        ) : (
          <>
            {icon && <>{icon}</>}
            <Text style={[getTextStyles(), ...(icon ? [{ marginLeft: 8 }] : [])]}>{title}</Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
