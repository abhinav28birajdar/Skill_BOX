import { inputVariants, useTheme } from '@/constants/Theme';
import React, { forwardRef, useState } from 'react';
import {
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: 'default' | 'filled' | 'outline';
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  hintStyle?: TextStyle;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  hint,
  variant = 'default',
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  hintStyle,
  ...props
}, ref) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const variantStyles = inputVariants[variant](theme);

  const containerStyles: ViewStyle = {
    marginBottom: theme.spacing.md,
    ...containerStyle,
  };

  const labelStyles: TextStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    ...labelStyle,
  };

  const inputContainerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    ...variantStyles,
    ...(isFocused && {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    }),
    ...(error && {
      borderColor: theme.colors.error,
      borderWidth: 2,
    }),
    ...(disabled && {
      backgroundColor: theme.colors.disabled,
      opacity: 0.6,
    }),
  };

  const textInputStyles: TextStyle = {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    ...inputStyle,
  };

  const errorStyles: TextStyle = {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    ...errorStyle,
  };

  const hintStyles: TextStyle = {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
    ...hintStyle,
  };

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={labelStyles}>
          {label}
          {required && <Text style={{ color: theme.colors.error }}> *</Text>}
        </Text>
      )}
      
      <View style={inputContainerStyles}>
        {leftIcon && (
          <View style={{ marginRight: theme.spacing.sm }}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          style={textInputStyles}
          placeholderTextColor={theme.colors.textTertiary}
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
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={{ marginLeft: theme.spacing.sm }}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={errorStyles}>{error}</Text>}
      {hint && !error && <Text style={hintStyles}>{hint}</Text>}
    </View>
  );
});

Input.displayName = 'Input';

// Password Input Component
interface PasswordInputProps extends Omit<InputProps, 'secureTextEntry' | 'rightIcon' | 'onRightIconPress'> {
  showPasswordToggle?: boolean;
}

export function PasswordInput({
  showPasswordToggle = true,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const eyeIcon = (
    <Text style={{ color: theme.colors.textTertiary }}>
      {showPassword ? '👁️' : '👁️‍🗨️'}
    </Text>
  );

  return (
    <Input
      {...props}
      secureTextEntry={!showPassword}
      rightIcon={showPasswordToggle ? eyeIcon : undefined}
      onRightIconPress={showPasswordToggle ? togglePasswordVisibility : undefined}
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
  const theme = useTheme();

  const searchIcon = (
    <Text style={{ color: theme.colors.textTertiary }}>🔍</Text>
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
  const theme = useTheme();
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
        inputStyle={{
          minHeight: rows * 20,
          ...props.inputStyle,
        }}
      />
      {(showCharacterCount || maxLength) && (
        <Text style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.textTertiary,
          textAlign: 'right',
          marginTop: -theme.spacing.sm,
        }}>
          {maxLength ? `${characterCount}/${maxLength}` : characterCount}
        </Text>
      )}
    </View>
  );
}
