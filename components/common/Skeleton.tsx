/**
 * Loading Skeleton Component
 * Animated placeholders for loading states
 */

import { useTheme } from '@/lib/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const theme = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height: height as any,
          borderRadius: borderRadius as any,
          backgroundColor: theme.isDark ? '#334155' : '#E5E7EB',
          opacity,
        },
        style,
      ]}
    />
  );
};

// ============================================
// Skeleton Presets
// ============================================

export const SkeletonCard: React.FC = () => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing['4'],
        },
      ]}
    >
      <Skeleton width="100%" height={160} borderRadius={12} style={{ marginBottom: 12 }} />
      <Skeleton width="80%" height={24} style={{ marginBottom: 8 }} />
      <Skeleton width="100%" height={16} style={{ marginBottom: 6 }} />
      <Skeleton width="90%" height={16} style={{ marginBottom: 12 }} />
      <View style={styles.row}>
        <Skeleton width={80} height={32} borderRadius={16} />
        <Skeleton width={60} height={32} borderRadius={16} />
      </View>
    </View>
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonListItem key={index} />
      ))}
    </View>
  );
};

export const SkeletonListItem: React.FC = () => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.listItem,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing['3'],
          marginBottom: theme.spacing['3'],
        },
      ]}
    >
      <View style={styles.row}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <View style={styles.flex}>
          <Skeleton width="70%" height={18} style={{ marginBottom: 8 }} />
          <Skeleton width="50%" height={14} />
        </View>
      </View>
    </View>
  );
};

export const SkeletonProfile: React.FC = () => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.profile,
        {
          padding: theme.spacing['6'],
          alignItems: 'center',
        },
      ]}
    >
      <Skeleton width={100} height={100} borderRadius={50} style={{ marginBottom: 16 }} />
      <Skeleton width={150} height={24} style={{ marginBottom: 8 }} />
      <Skeleton width={200} height={16} style={{ marginBottom: 20 }} />
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Skeleton width={60} height={32} style={{ marginBottom: 8 }} />
          <Skeleton width={80} height={14} />
        </View>
        <View style={styles.statItem}>
          <Skeleton width={60} height={32} style={{ marginBottom: 8 }} />
          <Skeleton width={80} height={14} />
        </View>
        <View style={styles.statItem}>
          <Skeleton width={60} height={32} style={{ marginBottom: 8 }} />
          <Skeleton width={80} height={14} />
        </View>
      </View>
    </View>
  );
};

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <View style={styles.textContainer}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? '60%' : '100%'}
          height={16}
          style={{ marginBottom: 8 }}
        />
      ))}
    </View>
  );
};

export const SkeletonGrid: React.FC<{ columns?: number; rows?: number }> = ({
  columns = 2,
  rows = 2,
}) => {
  const theme = useTheme();
  return (
    <View style={styles.grid}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View key={rowIndex} style={styles.gridRow}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <View
              key={colIndex}
              style={[
                styles.gridItem,
                {
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.borderRadius.md,
                  padding: theme.spacing['3'],
                  flex: 1,
                  marginHorizontal: theme.spacing['2'],
                  marginBottom: theme.spacing['3'],
                },
              ]}
            >
              <Skeleton width="100%" height={120} borderRadius={8} style={{ marginBottom: 8 }} />
              <Skeleton width="80%" height={16} style={{ marginBottom: 6 }} />
              <Skeleton width="60%" height={14} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  card: {
    marginBottom: 16,
  },
  list: {
    paddingVertical: 8,
  },
  listItem: {
    // Styles applied dynamically
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  profile: {
    // Styles applied dynamically
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  textContainer: {
    paddingVertical: 8,
  },
  grid: {
    paddingHorizontal: 8,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridItem: {
    // Styles applied dynamically
  },
});

export default Skeleton;
