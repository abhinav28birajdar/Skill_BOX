import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface StreakCounterProps {
  streak: number;
  maxStreak?: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streak,
  maxStreak = 365,
}) => {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    rotate.value = withSequence(
      withTiming(10, { duration: 200, easing: Easing.ease }),
      withTiming(-10, { duration: 200, easing: Easing.ease }),
      withTiming(0, { duration: 200, easing: Easing.ease })
    );
  }, [streak]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const getStreakMessage = () => {
    if (streak === 0) return 'Start your streak today!';
    if (streak === 1) return 'Great start! Keep it up!';
    if (streak < 7) return 'Building momentum!';
    if (streak < 30) return 'You\'re on fire! 🔥';
    if (streak < 100) return 'Incredible dedication!';
    return 'Legendary streak! 👑';
  };

  const getStreakColor = () => {
    if (streak < 7) return ['#F59E0B', '#F97316'];
    if (streak < 30) return ['#EF4444', '#DC2626'];
    return ['#8B5CF6', '#6366F1'];
  };

  return (
    <LinearGradient
      colors={getStreakColor()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Flame Icon */}
        <Animated.View style={animatedStyle}>
          <Ionicons
            name={streak > 0 ? 'flame' : 'flame-outline'}
            size={40}
            color="#fff"
          />
        </Animated.View>

        {/* Streak Info */}
        <View style={styles.textContainer}>
          <View style={styles.streakRow}>
            <Text style={styles.streakNumber}>{streak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
          <Text style={styles.message}>{getStreakMessage()}</Text>
        </View>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressBar,
              { width: `${Math.min((streak / maxStreak) * 100, 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {streak}/{maxStreak} days
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginRight: 8,
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  message: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  progressContainer: {
    gap: 6,
  },
  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    textAlign: 'right',
  },
});
