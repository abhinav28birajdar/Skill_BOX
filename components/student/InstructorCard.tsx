import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface InstructorCardProps {
  id: string;
  name: string;
  title: string;
  avatar: string;
  students: number;
  courses: number;
  rating: number;
  specialization: string;
  onPress: () => void;
}

export const InstructorCard: React.FC<InstructorCardProps> = ({
  id,
  name,
  title,
  avatar,
  students,
  courses,
  rating,
  specialization,
  onPress,
}) => {
  return (
    <Animated.View entering={FadeInRight.springify()}>
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
        {/* Avatar with Badge */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.specialization} numberOfLines={1}>
            {specialization}
          </Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.statText}>{rating.toFixed(1)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={14} color="#6B7280" />
              <Text style={styles.statText}>
                {students >= 1000 ? `${(students / 1000).toFixed(1)}k` : students}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="book" size={14} color="#6B7280" />
              <Text style={styles.statText}>{courses}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  infoContainer: {
    width: '100%',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 2,
  },
  specialization: {
    fontSize: 12,
    color: '#6366F1',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
    gap: 2,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
});
