import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface DailyChallengeProps {
  title: string;
  description: string;
  xp: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeRemaining: string;
  onPress: () => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({
  title,
  description,
  xp,
  difficulty,
  timeRemaining,
  onPress,
}) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'hard':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getDifficultyIcon = () => {
    switch (difficulty) {
      case 'easy':
        return 'chevron-up';
      case 'medium':
        return 'chevron-up-outline';
      case 'hard':
        return 'chevron-up-circle';
      default:
        return 'chevron-up';
    }
  };

  return (
    <Animated.View entering={FadeInRight.springify()}>
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="trophy" size={24} color="#FCD34D" />
              <Text style={styles.headerTitle}>Daily Challenge</Text>
            </View>
            <View style={styles.xpBadge}>
              <Ionicons name="flash" size={14} color="#FCD34D" />
              <Text style={styles.xpText}>+{xp} XP</Text>
            </View>
          </View>

          {/* Content */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.difficultyBadge}>
              <Ionicons
                name={getDifficultyIcon()}
                size={16}
                color={getDifficultyColor()}
              />
              <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
                {difficulty.toUpperCase()}
              </Text>
            </View>

            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.timeText}>{timeRemaining}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Start Challenge</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
});
