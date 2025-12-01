import { useEnhancedTheme } from '@/hooks/useEnhancedTheme';
import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import {
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

type InputVariant = 'default' | 'filled' | 'outline';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  variant?: InputVariant;
  size?: InputSize;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  required?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
}

const Input = forwardRef<TextInput, InputProps>(({
  label,
  helperText,
  errorText,
  variant = 'outline',
  size = 'md',
  leftIcon,
  rightIcon,
  onRightIconPress,
  required = false,
  disabled = false,
  containerStyle,
  labelStyle,
  inputStyle,
  ...props
}, ref) => {
  const { colors, spacing, borderRadius, fontSize, fontWeight } = useEnhancedTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  const hasError = !!errorText;
  const hasValue = !!props.value || !!props.defaultValue;
  
  // Size configurations
  const sizeConfig = {
    sm: {
      height: 36,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      fontSize: fontSize.sm,
      iconSize: 16,
    },
    md: {
      height: 44,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      fontSize: fontSize.base,
      iconSize: 18,
    },
    lg: {
      height: 52,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
      fontSize: fontSize.lg,
      iconSize: 20,
    },
  };
  
  const config = sizeConfig[size];
  
  // Variant styles
  const getVariantStyles = () => {
    const baseStyles = {
      backgroundColor: disabled ? colors.surfaceTertiary : colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.border,
    };
    
    if (hasError) {
      baseStyles.borderColor = colors.error;
    } else if (isFocused) {
      baseStyles.borderColor = colors.primary;
    }
    
    switch (variant) {
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: disabled ? colors.surfaceTertiary : colors.surfaceSecondary,
          borderWidth: 0,
          borderBottomWidth: 2,
          borderRadius: borderRadius.md,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        };
      
      case 'outline':
        return {
          ...baseStyles,
          borderRadius: borderRadius.lg,
        };
      
      default:
        return {
          ...baseStyles,
          borderRadius: borderRadius.lg,
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  
  return (
    <View style={[{ width: '100%' }, containerStyle]}>
      {/* Label */}
      {label && (
        <View style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
          <Text
            style={[
              {
                fontSize: fontSize.sm,
                fontWeight: fontWeight.medium,
                color: hasError ? colors.error : colors.text,
              },
              labelStyle,
            ]}
          >
            {label}
          </Text>
          {required && (
            <Text style={{
              color: colors.error,
              fontSize: fontSize.sm,
              marginLeft: 2,
            }}>
              *
            </Text>
          )}
        </View>
      )}
      
      {/* Input Container */}
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: config.height,
            ...variantStyles,
          },
        ]}
      >
        {/* Left Icon */}
        {leftIcon && (
          <View style={{ paddingLeft: spacing.md }}>
            <Ionicons
              name={leftIcon as any}
              size={config.iconSize}
              color={hasError ? colors.error : isFocused ? colors.primary : colors.textSecondary}
            />
          </View>
        )}
        
        {/* Text Input */}
        <TextInput
          ref={ref}
          style={[
            {
              flex: 1,
              fontSize: config.fontSize,
              color: disabled ? colors.textTertiary : colors.text,
              paddingVertical: config.paddingVertical,
              paddingHorizontal: leftIcon || rightIcon ? spacing.sm : config.paddingHorizontal,
              paddingLeft: leftIcon ? spacing.sm : config.paddingHorizontal,
              paddingRight: rightIcon ? spacing.sm : config.paddingHorizontal,
            },
            inputStyle,
          ]}
          placeholderTextColor={colors.textTertiary}
          editable={!disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {/* Right Icon */}
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={{ paddingRight: spacing.md, padding: spacing.sm }}
          >
            <Ionicons
              name={rightIcon as any}
              size={config.iconSize}
              color={hasError ? colors.error : isFocused ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Helper Text / Error Text */}
      {(helperText || errorText) && (
        <View style={{ marginTop: spacing.xs }}>
          <Text
            style={{
              fontSize: fontSize.xs,
              color: hasError ? colors.error : colors.textSecondary,
              lineHeight: 16,
            }}
          >
            {errorText || helperText}
          </Text>
        </View>
      )}
    </View>
  );
});

Input.displayName = 'Input';

export default Input;