import { useTheme } from '@/context/ThemeContext';
import React, { useState } from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { Text } from './Text.enhanced';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'underlined';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  fullWidth?: boolean;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'outline',
  leftIcon,
  rightIcon,
  isPassword = false,
  fullWidth = true,
  containerStyle,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          minHeight: 32,
        };
      case 'md':
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          minHeight: 40,
        };
      case 'lg':
        return {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          minHeight: 48,
        };
      default:
        return {};
    }
  };

  const getVariantStyle = (): ViewStyle => {
    const baseStyle = {
      borderRadius: theme.borderRadius.md,
    };

    switch (variant) {
      case 'outline':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: error 
            ? theme.colors.error 
            : isFocused 
              ? theme.colors.primary 
              : theme.colors.border,
          backgroundColor: theme.colors.surface,
        };
      case 'filled':
        return {
          ...baseStyle,
          borderWidth: 0,
          backgroundColor: theme.colors.backgroundSecondary,
        };
      case 'underlined':
        return {
          borderBottomWidth: 1,
          borderBottomColor: error 
            ? theme.colors.error 
            : isFocused 
              ? theme.colors.primary 
              : theme.colors.border,
          backgroundColor: 'transparent',
          borderRadius: 0,
        };
      default:
        return baseStyle;
    }
  };

  const inputStyle = [
    styles.input,
    getSizeStyle(),
    getVariantStyle(),
    {
      color: theme.colors.text,
      fontSize: theme.fontSizes.base,
    },
    leftIcon && styles.inputWithLeftIcon,
    (rightIcon || isPassword) && styles.inputWithRightIcon,
    fullWidth && styles.fullWidth,
    style,
  ].filter(Boolean);

  const containerStyles = [
    styles.container,
    fullWidth && styles.fullWidth,
    containerStyle,
  ];

  return (
    <View style={containerStyles}>
      {label && (
        <Text 
          variant="body2" 
          color={error ? 'error' : 'textSecondary'}
          weight="medium"
          style={styles.label}
        >
          {label}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={inputStyle}
          placeholderTextColor={theme.colors.textTertiary}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {(rightIcon || isPassword) && (
          <View style={styles.rightIconContainer}>
            {isPassword ? (
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.passwordToggle}
              >
                <IconSymbol
                  name={isPasswordVisible ? 'eye.slash' : 'eye'}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            ) : (
              rightIcon
            )}
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <Text 
          variant="caption" 
          color={error ? 'error' : 'textSecondary'}
          style={styles.helperText}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    textAlignVertical: 'center',
  },
  inputWithLeftIcon: {
    paddingLeft: 40,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  leftIconContainer: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
  passwordToggle: {
    padding: 4,
  },
  helperText: {
    marginTop: 4,
  },
});
