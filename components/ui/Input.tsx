import { useTheme } from '@/context/ThemeContext';
import React, { forwardRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'underlined' | 'default';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  isPassword?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  helperText,
  hint,
  size = 'md',
  variant = 'outline',
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  fullWidth = true,
  required = false,
  disabled = false,
  containerStyle,
  style,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: 12,
          paddingVertical: 8,
          minHeight: 32,
        };
      case 'md':
        return {
          paddingHorizontal: 16,
          paddingVertical: 12,
          minHeight: 40,
        };
      case 'lg':
        return {
          paddingHorizontal: 20,
          paddingVertical: 16,
          minHeight: 48,
        };
      default:
        return {};
    }
  };

  const getVariantStyle = (): ViewStyle => {
    const baseStyle = {
      borderRadius: 8,
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
          backgroundColor: theme.colors.card,
        };
      case 'filled':
        return {
          ...baseStyle,
          borderWidth: 0,
          backgroundColor: theme.colors.cardSecondary,
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
      case 'default':
      default:
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.card,
        };
    }
  };

  const inputStyle = [
    styles.input,
    getSizeStyle(),
    getVariantStyle(),
    {
      color: theme.colors.text,
      fontSize: 16,
    },
    leftIcon && styles.inputWithLeftIcon,
    (rightIcon || isPassword) && styles.inputWithRightIcon,
    fullWidth && styles.fullWidth,
    disabled && {
      backgroundColor: theme.colors.cardSecondary,
      opacity: 0.6,
    },
    style,
  ].filter(Boolean) as any;

  const containerStyles = [
    styles.container,
    fullWidth && styles.fullWidth,
    containerStyle,
  ];

  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={[styles.label, { color: error ? theme.colors.error : theme.colors.text }]}>
          {label}
          {required && <Text style={{ color: theme.colors.error }}> *</Text>}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          style={inputStyle}
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          editable={!disabled}
          {...props}
        />
        
        {(rightIcon || isPassword) && (
          <View style={styles.rightIconContainer}>
            {isPassword ? (
              <TouchableOpacity
                onPress={handlePasswordToggle}
                style={styles.passwordToggle}
              >
                <Text style={{ color: theme.colors.textSecondary }}>
                  {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={onRightIconPress}
                disabled={!onRightIconPress}
              >
                {rightIcon}
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      
      {(error || helperText || hint) && (
        <Text style={[
          styles.helperText, 
          { color: error ? theme.colors.error : theme.colors.textSecondary }
        ]}>
          {error || helperText || hint}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

// Password Input Component
interface PasswordInputProps extends Omit<InputProps, 'secureTextEntry' | 'rightIcon' | 'onRightIconPress' | 'isPassword'> {
  showPasswordToggle?: boolean;
}

export function PasswordInput({
  showPasswordToggle = true,
  ...props
}: PasswordInputProps) {
  return (
    <Input
      {...props}
      isPassword={showPasswordToggle}
    />
  );
}

// Search Input Component
interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onSearch?: (query: string) => void;
  showSearchIcon?: boolean;
}

export function SearchInput({
  onSearch,
  showSearchIcon = true,
  ...props
}: SearchInputProps) {
  const { theme } = useTheme();

  const searchIcon = (
    <Text style={{ color: theme.colors.textSecondary }}>🔍</Text>
  );

  return (
    <Input
      {...props}
      leftIcon={showSearchIcon ? searchIcon : undefined}
      placeholder={props.placeholder || 'Search...'}
      onChangeText={(text) => {
        props.onChangeText?.(text);
        onSearch?.(text);
      }}
      clearButtonMode="while-editing"
      returnKeyType="search"
    />
  );
}

// Textarea Component
interface TextareaProps extends Omit<InputProps, 'multiline' | 'numberOfLines'> {
  rows?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
}

export function Textarea({
  rows = 4,
  maxLength,
  showCharacterCount = false,
  value,
  ...props
}: TextareaProps) {
  const { theme } = useTheme();
  const characterCount = value?.length || 0;

  return (
    <View>
      <Input
        {...props}
        value={value}
        multiline
        numberOfLines={rows}
        textAlignVertical="top"
        maxLength={maxLength}
        style={[
          {
            minHeight: rows * 20,
          },
          props.style,
        ]}
      />
      {(showCharacterCount || maxLength) && (
        <Text style={{
          fontSize: 12,
          color: theme.colors.textSecondary,
          textAlign: 'right',
          marginTop: -8,
        }}>
          {maxLength ? `${characterCount}/${maxLength}` : characterCount}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
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
    fontSize: 12,
  },
});
