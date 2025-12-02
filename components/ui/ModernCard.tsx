import { useEnhancedTheme } from '@/hooks/useEnhancedTheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';
type CardSize = 'sm' | 'md' | 'lg' | 'xl';

interface BaseCardProps {
  children?: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  gradient?: boolean;
  gradientColors?: string[];
  style?: ViewStyle;
}

interface TouchableCardProps extends BaseCardProps {
  touchable: true;
  onPress: () => void;
  children?: React.ReactNode;
}

interface NonTouchableCardProps extends BaseCardProps {
  touchable?: false;
  onPress?: never;
}

type CardProps = TouchableCardProps | NonTouchableCardProps;

export default function ModernCard({
  children,
  variant = 'default',
  size = 'md',
  gradient = false,
  gradientColors,
  style,
  touchable = false,
  onPress,
  ...touchableProps
}: CardProps) {
  const { colors, spacing, borderRadius, shadows } = useEnhancedTheme();

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: spacing.md,
      borderRadius: borderRadius.md,
    },
    md: {
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
    },
    lg: {
      padding: spacing.xl,
      borderRadius: borderRadius.xl,
    },
    xl: {
      padding: spacing.xxl,
      borderRadius: borderRadius.xxl,
    },
  };

  const config = sizeConfig[size];

  // Variant configurations
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 0,
          ...shadows.lg,
        };
      
      case 'outlined':
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadows.sm,
        };
      
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      
      case 'default':
      default:
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 0,
          ...shadows.md,
        };
    }
  };

  const variantStyles = getVariantStyles();

  const cardStyle: ViewStyle = {
    borderRadius: config.borderRadius,
    overflow: 'hidden',
    ...variantStyles,
    ...style,
  };

  const contentStyle: ViewStyle = {
    padding: config.padding,
  };

  const renderContent = () => (
    <View style={contentStyle}>
      {children}
    </View>
  );

  if (gradient && gradientColors) {
    const CardComponent = touchable ? TouchableOpacity : View;
    
    return (
      <CardComponent
        style={cardStyle}
        onPress={touchable ? onPress : undefined}
        activeOpacity={touchable ? 0.8 : undefined}
        {...(touchable ? touchableProps : {})}
      >
        <LinearGradient
              colors={gradientColors as any}
              style={{ flex: 1 }}
            >
          {renderContent()}
        </LinearGradient>
      </CardComponent>
    );
  }

  if (touchable) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
        {...touchableProps}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {renderContent()}
    </View>
  );
}

// Additional Card variants for specific use cases
interface ActionCardProps extends BaseCardProps {
  onPress: () => void;
}

export function ActionCard(props: ActionCardProps) {
  return <ModernCard {...props} touchable={true} />;
}

interface GradientCardProps extends BaseCardProps {
  colors: string[];
}

export function GradientCard({ colors: gradientColors, ...props }: GradientCardProps) {
  return <ModernCard {...props} gradient={true} gradientColors={gradientColors} />;
}