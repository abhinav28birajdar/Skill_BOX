import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

export interface RoleCardProps {
  role: 'student' | 'instructor' | 'creator' | 'organization';
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const ROLE_COLORS = {
  student: {
    primary: '#6366F1',
    light: '#E0E7FF',
    gradient: ['#6366F1', '#8B5CF6'],
  },
  instructor: {
    primary: '#F59E0B',
    light: '#FEF3C7',
    gradient: ['#F59E0B', '#EF4444'],
  },
  creator: {
    primary: '#EC4899',
    light: '#FCE7F3',
    gradient: ['#EC4899', '#8B5CF6'],
  },
  organization: {
    primary: '#10B981',
    light: '#D1FAE5',
    gradient: ['#10B981', '#059669'],
  },
};

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  title,
  description,
  icon,
  selected,
  onPress,
  style,
}) => {
  const scale = useSharedValue(1);
  const colors = ROLE_COLORS[role];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      <Animated.View
        style={[
          styles.card,
          selected && styles.selectedCard,
          selected && { borderColor: colors.primary },
          animatedStyle,
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: selected ? colors.primary : colors.light },
          ]}
        >
          <Ionicons
            name={icon}
            size={32}
            color={selected ? '#FFFFFF' : colors.primary}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View
          style={[
            styles.checkbox,
            selected && styles.checkedBox,
            selected && { backgroundColor: colors.primary },
          ]}
        >
          {selected && (
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 3,
    shadowOpacity: 0.15,
    elevation: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkedBox: {
    borderColor: 'transparent',
  },
});
