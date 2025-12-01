import { useEnhancedTheme } from '@/hooks/useEnhancedTheme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | `${number}%` | '100%';
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 4, style }: SkeletonProps) {
  const { colors, isDark } = useEnhancedTheme();
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedValue.value, [0, 1], [0.3, 0.7]);
    return { opacity };
  });

  const gradientColors = isDark
    ? [colors.surface, colors.surfaceSecondary, colors.surface] as const
    : [colors.surfaceSecondary, colors.surfaceTertiary, colors.surfaceSecondary] as const;

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          overflow: 'hidden',
          backgroundColor: colors.surfaceSecondary,
        },
        style,
      ]}
    >
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

interface SkeletonTextProps {
  lines?: number;
  lineHeight?: number;
  lastLineWidth?: string;
  style?: ViewStyle;
}

export function SkeletonText({ 
  lines = 3, 
  lineHeight = 16, 
  lastLineWidth = '60%', 
  style 
}: SkeletonTextProps) {
  return (
    <View style={style}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          height={lineHeight}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          style={{ marginBottom: index < lines - 1 ? 8 : 0 }}
        />
      ))}
    </View>
  );
}

interface SkeletonCardProps {
  showAvatar?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  style?: ViewStyle;
}

export function SkeletonCard({ 
  showAvatar = true, 
  showTitle = true, 
  showDescription = true,
  style 
}: SkeletonCardProps) {
  const { spacing, borderRadius } = useEnhancedTheme();

  return (
    <View
      style={[
        {
          padding: spacing.lg,
          borderRadius: borderRadius.lg,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', marginBottom: spacing.md }}>
        {showAvatar && (
          <Skeleton
            width={40}
            height={40}
            borderRadius={20}
            style={{ marginRight: spacing.md }}
          />
        )}
        <View style={{ flex: 1 }}>
          {showTitle && (
            <Skeleton
              height={20}
              width="70%"
              style={{ marginBottom: spacing.sm }}
            />
          )}
          <Skeleton height={16} width="50%" />
        </View>
      </View>
      
      {showDescription && (
        <SkeletonText
          lines={3}
          lineHeight={16}
          lastLineWidth="80%"
        />
      )}
    </View>
  );
}

interface SkeletonListProps {
  items?: number;
  renderItem?: () => React.ReactNode;
  style?: ViewStyle;
}

export function SkeletonList({ items = 5, renderItem, style }: SkeletonListProps) {
  const defaultItem = () => <SkeletonCard />;
  
  return (
    <View style={style}>
      {Array.from({ length: items }, (_, index) => (
        <View key={index}>
          {renderItem ? renderItem() : defaultItem()}
        </View>
      ))}
    </View>
  );
}