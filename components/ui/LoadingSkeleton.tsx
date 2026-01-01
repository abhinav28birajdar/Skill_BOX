/**
 * Loading Skeleton Components
 * Reusable skeleton loaders for different content types
 */

import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Animated Skeleton Base
function SkeletonBase({ width: w, height: h, style }: any) {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.ease }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: w, height: h },
        animatedStyle,
        style,
      ]}
    />
  );
}

// Course Card Skeleton
export function CourseCardSkeleton() {
  return (
    <View style={styles.courseCard}>
      <SkeletonBase width="100%" height={180} style={styles.courseImage} />
      <View style={styles.courseContent}>
        <SkeletonBase width="60%" height={16} style={{ marginBottom: 8 }} />
        <SkeletonBase width="100%" height={14} style={{ marginBottom: 4 }} />
        <SkeletonBase width="80%" height={14} style={{ marginBottom: 12 }} />
        <View style={styles.courseFooter}>
          <SkeletonBase width={60} height={12} />
          <SkeletonBase width={80} height={20} />
        </View>
      </View>
    </View>
  );
}

// List Item Skeleton
export function ListItemSkeleton() {
  return (
    <View style={styles.listItem}>
      <SkeletonBase width={48} height={48} style={styles.listIcon} />
      <View style={styles.listContent}>
        <SkeletonBase width="70%" height={16} style={{ marginBottom: 6 }} />
        <SkeletonBase width="40%" height={12} />
      </View>
    </View>
  );
}

// Profile Header Skeleton
export function ProfileHeaderSkeleton() {
  return (
    <View style={styles.profileHeader}>
      <SkeletonBase width={80} height={80} style={styles.profileAvatar} />
      <View style={styles.profileInfo}>
        <SkeletonBase width={120} height={20} style={{ marginBottom: 8 }} />
        <SkeletonBase width={180} height={14} style={{ marginBottom: 12 }} />
        <View style={styles.profileStats}>
          <SkeletonBase width={60} height={12} />
          <SkeletonBase width={60} height={12} />
          <SkeletonBase width={60} height={12} />
        </View>
      </View>
    </View>
  );
}

// Text Block Skeleton
export function TextBlockSkeleton() {
  return (
    <View style={styles.textBlock}>
      <SkeletonBase width="100%" height={14} style={{ marginBottom: 6 }} />
      <SkeletonBase width="100%" height={14} style={{ marginBottom: 6 }} />
      <SkeletonBase width="100%" height={14} style={{ marginBottom: 6 }} />
      <SkeletonBase width="60%" height={14} />
    </View>
  );
}

// Grid Skeleton (e.g., for course grids)
export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.gridItem}>
          <CourseCardSkeleton />
        </View>
      ))}
    </View>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <View style={styles.statsCard}>
      <SkeletonBase width={48} height={48} style={styles.statsIcon} />
      <SkeletonBase width="60%" height={24} style={{ marginTop: 12, marginBottom: 4 }} />
      <SkeletonBase width="80%" height={12} />
    </View>
  );
}

// Comment Skeleton
export function CommentSkeleton() {
  return (
    <View style={styles.comment}>
      <SkeletonBase width={44} height={44} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <SkeletonBase width={100} height={14} style={{ marginBottom: 8 }} />
        <SkeletonBase width="100%" height={12} style={{ marginBottom: 4 }} />
        <SkeletonBase width="80%" height={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  courseImage: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  courseContent: {
    padding: 16,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
  },
  listIcon: {
    borderRadius: 24,
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileAvatar: {
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileStats: {
    flexDirection: 'row',
    gap: 16,
  },
  textBlock: {
    padding: 20,
    backgroundColor: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  gridItem: {
    width: (width - 44) / 2,
  },
  statsCard: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
  },
  statsIcon: {
    borderRadius: 24,
  },
  comment: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
  },
  commentAvatar: {
    borderRadius: 22,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
});

export default {
  CourseCardSkeleton,
  ListItemSkeleton,
  ProfileHeaderSkeleton,
  TextBlockSkeleton,
  GridSkeleton,
  StatsCardSkeleton,
  CommentSkeleton,
};
