import { useTheme } from '@/constants/Theme';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Text,
    View,
    ViewStyle,
} from 'react-native';

interface ProgressProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'linear' | 'circular';
  showLabel?: boolean;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  animated?: boolean;
  labelPosition?: 'inside' | 'outside' | 'none';
}

interface CircularProgressProps extends Omit<ProgressProps, 'variant'> {
  radius?: number;
  strokeWidth?: number;
}

export function Progress({
  value,
  size = 'md',
  variant = 'linear',
  showLabel = false,
  color,
  backgroundColor,
  style,
  animated = true,
  labelPosition = 'outside',
}: ProgressProps) {
  const theme = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  const clampedValue = Math.max(0, Math.min(100, value));
  
  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: clampedValue,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(clampedValue);
    }
  }, [clampedValue, animated]);

  const sizes = {
    sm: { height: 4, fontSize: theme.typography.fontSize.xs },
    md: { height: 8, fontSize: theme.typography.fontSize.sm },
    lg: { height: 12, fontSize: theme.typography.fontSize.base },
  };

  const progressColor = color || theme.colors.primary;
  const bgColor = backgroundColor || theme.colors.border;

  if (variant === 'circular') {
    return (
      <CircularProgress
        value={clampedValue}
        size={size}
        showLabel={showLabel}
        color={progressColor}
        backgroundColor={bgColor}
        style={style}
        animated={animated}
        labelPosition={labelPosition}
      />
    );
  }

  return (
    <View style={[{ width: '100%' }, style]}>
      {showLabel && labelPosition === 'outside' && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.xs,
        }}>
          <Text style={{
            fontSize: sizes[size].fontSize,
            color: theme.colors.text,
            fontWeight: '500',
          }}>
            Progress
          </Text>
          <Text style={{
            fontSize: sizes[size].fontSize,
            color: theme.colors.textSecondary,
            fontWeight: '600',
          }}>
            {clampedValue}%
          </Text>
        </View>
      )}
      
      <View style={{
        height: sizes[size].height,
        backgroundColor: bgColor,
        borderRadius: sizes[size].height / 2,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <Animated.View style={{
          height: '100%',
          backgroundColor: progressColor,
          borderRadius: sizes[size].height / 2,
          width: animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp',
          }),
        }} />
        
        {showLabel && labelPosition === 'inside' && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: sizes[size].fontSize,
              color: '#FFFFFF',
              fontWeight: '600',
              textShadowColor: 'rgba(0,0,0,0.3)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}>
              {clampedValue}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export function CircularProgress({
  value,
  size = 'md',
  showLabel = true,
  color,
  backgroundColor,
  style,
  animated = true,
  labelPosition = 'inside',
  radius = 40,
  strokeWidth = 8,
}: CircularProgressProps) {
  const theme = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  const clampedValue = Math.max(0, Math.min(100, value));
  
  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: clampedValue,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(clampedValue);
    }
  }, [clampedValue, animated]);

  const sizes = {
    sm: { radius: 30, strokeWidth: 6, fontSize: theme.typography.fontSize.sm },
    md: { radius: 40, strokeWidth: 8, fontSize: theme.typography.fontSize.base },
    lg: { radius: 50, strokeWidth: 10, fontSize: theme.typography.fontSize.lg },
  };

  const progressRadius = sizes[size].radius;
  const progressStrokeWidth = sizes[size].strokeWidth;
  const circumference = 2 * Math.PI * progressRadius;
  const progressColor = color || theme.colors.primary;
  const bgColor = backgroundColor || theme.colors.border;

  return (
    <View style={[
      {
        width: (progressRadius + progressStrokeWidth) * 2,
        height: (progressRadius + progressStrokeWidth) * 2,
        justifyContent: 'center',
        alignItems: 'center',
      },
      style
    ]}>
      {/* Background Circle */}
      <View style={{
        position: 'absolute',
        width: progressRadius * 2,
        height: progressRadius * 2,
        borderRadius: progressRadius,
        borderWidth: progressStrokeWidth,
        borderColor: bgColor,
      }} />
      
      {/* Progress Arc - This would need a proper SVG implementation */}
      {/* For now, using a simplified version with border */}
      <Animated.View style={{
        position: 'absolute',
        width: progressRadius * 2,
        height: progressRadius * 2,
        borderRadius: progressRadius,
        borderWidth: progressStrokeWidth,
        borderColor: 'transparent',
        borderTopColor: progressColor,
        transform: [{
          rotate: animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: ['0deg', '360deg'],
            extrapolate: 'clamp',
          }),
        }],
      }} />
      
      {showLabel && labelPosition === 'inside' && (
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: sizes[size].fontSize,
            color: theme.colors.text,
            fontWeight: '600',
          }}>
            {clampedValue}%
          </Text>
        </View>
      )}
      
      {showLabel && labelPosition === 'outside' && (
        <View style={{
          position: 'absolute',
          bottom: -30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: sizes[size].fontSize,
            color: theme.colors.text,
            fontWeight: '600',
          }}>
            {clampedValue}%
          </Text>
        </View>
      )}
    </View>
  );
}

// Skill Progress Bar Component
interface SkillProgressProps {
  skill: string;
  level: number; // 1-5
  progress: number; // 0-100 for current level
  style?: ViewStyle;
}

export function SkillProgress({
  skill,
  level,
  progress,
  style,
}: SkillProgressProps) {
  const theme = useTheme();
  
  const skillLevels = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert'];
  const levelColors = [
    '#FF3B30', // error (red-like)
    '#FF9500', // warning (orange-like)
    '#FFCC02', // yellow
    '#007AFF', // info (blue-like)
    '#34C759', // success (green-like)
  ];

  return (
    <View style={[
      {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      style
    ]}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
      }}>
        <Text style={{
          fontSize: theme.typography.fontSize.base,
          fontWeight: '600',
          color: theme.colors.text,
        }}>
          {skill}
        </Text>
        <Text style={{
          fontSize: theme.typography.fontSize.sm,
          fontWeight: '500',
          color: levelColors[level - 1],
        }}>
          {skillLevels[level - 1]}
        </Text>
      </View>
      
      {/* Level indicators */}
      <View style={{
        flexDirection: 'row',
        marginBottom: theme.spacing.sm,
        justifyContent: 'space-between',
      }}>
        {Array.from({ length: 5 }, (_, index) => (
          <View
            key={index}
            style={{
              flex: 1,
              height: 4,
              backgroundColor: index < level ? levelColors[index] : theme.colors.border,
              marginRight: index < 4 ? theme.spacing.xs : 0,
              borderRadius: 2,
            }}
          />
        ))}
      </View>
      
      {/* Current level progress */}
      <Progress
        value={progress}
        size="sm"
        color={levelColors[level - 1]}
        showLabel={true}
        labelPosition="outside"
      />
    </View>
  );
}
