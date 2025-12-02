import { useEnhancedTheme } from '@/hooks/useEnhancedTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ActivityIndicator,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  gradient?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
}

export default function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  gradient = false,
  style,
  textStyle,
  onPress,
  ...props
}: ButtonProps) {
  const { colors, spacing, borderRadius, fontSize, fontWeight, shadows } = useEnhancedTheme();

  // Size configurations
  const sizeConfig = {
    sm: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      fontSize: fontSize.sm,
      iconSize: 16,
      height: 36,
    },
    md: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      fontSize: fontSize.base,
      iconSize: 18,
      height: 44,
    },
    lg: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      fontSize: fontSize.lg,
      iconSize: 20,
      height: 52,
    },
    xl: {
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.xxl,
      fontSize: fontSize.xl,
      iconSize: 22,
      height: 60,
    },
  };

  // Variant configurations
  const getVariantStyles = () => {
    const isDisabled = disabled || loading;
    
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: isDisabled ? colors.borderSecondary : colors.primary,
          borderWidth: 0,
          textColor: colors.buttonText,
          gradientColors: isDisabled 
            ? [colors.borderSecondary, colors.borderSecondary]
            : colors.primaryGradient,
        };
      
      case 'secondary':
        return {
          backgroundColor: isDisabled ? colors.borderSecondary : colors.secondary,
          borderWidth: 0,
          textColor: colors.buttonText,
          gradientColors: isDisabled 
            ? [colors.borderSecondary, colors.borderSecondary]
            : colors.secondaryGradient,
        };
      
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: isDisabled ? colors.borderSecondary : colors.primary,
          textColor: isDisabled ? colors.textTertiary : colors.primary,
          gradientColors: ['transparent', 'transparent'],
        };
      
      case 'ghost':
        return {
          backgroundColor: isDisabled ? colors.surfaceSecondary : colors.surfaceSecondary,
          borderWidth: 0,
          textColor: isDisabled ? colors.textTertiary : colors.text,
          gradientColors: ['transparent', 'transparent'],
        };
      
      case 'danger':
        return {
          backgroundColor: isDisabled ? colors.borderSecondary : colors.error,
          borderWidth: 0,
          textColor: colors.buttonText,
          gradientColors: isDisabled 
            ? [colors.borderSecondary, colors.borderSecondary]
            : [colors.error, '#DC2626'],
        };
      
      default:
        return getVariantStyles();
    }
  };

  const variantStyles = getVariantStyles();
  const config = sizeConfig[size];
  const isDisabled = disabled || loading;

  const buttonContent = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: config.height,
        paddingVertical: config.paddingVertical,
        paddingHorizontal: config.paddingHorizontal,
      }}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variantStyles.textColor}
          style={{ marginRight: spacing.sm }}
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <Ionicons
          name={icon as any}
          size={config.iconSize}
          color={variantStyles.textColor}
          style={{ marginRight: spacing.sm }}
        />
      )}
      
      <Text
        style={[
          {
            fontSize: config.fontSize,
            fontWeight: fontWeight.semibold,
            color: variantStyles.textColor,
            textAlign: 'center',
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
      
      {!loading && icon && iconPosition === 'right' && (
        <Ionicons
          name={icon as any}
          size={config.iconSize}
          color={variantStyles.textColor}
          style={{ marginLeft: spacing.sm }}
        />
      )}
    </View>
  );

  const containerStyle: ViewStyle = {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    opacity: isDisabled ? 0.6 : 1,
    width: fullWidth ? '100%' : undefined,
    ...shadows.md,
    ...style,
  };

  const touchableStyle: ViewStyle = {
    backgroundColor: variantStyles.backgroundColor,
    borderWidth: variantStyles.borderWidth || 0,
    borderColor: variantStyles.borderColor,
  };

  if (gradient && (variant === 'primary' || variant === 'secondary' || variant === 'danger')) {
    return (
      <View style={containerStyle}>
        <TouchableOpacity
          disabled={isDisabled}
          onPress={onPress}
          activeOpacity={0.8}
          {...props}
        >
          <LinearGradient
            colors={variantStyles.gradientColors as any}
            style={touchableStyle}
          >
            {buttonContent}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[containerStyle, touchableStyle]}
      disabled={isDisabled}
      onPress={onPress}
      activeOpacity={0.8}
      {...props}
    >
      {buttonContent}
    </TouchableOpacity>
  );
}