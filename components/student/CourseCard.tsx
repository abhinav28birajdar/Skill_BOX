import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  price?: string;
  thumbnail: string;
  category: string;
  progress?: number;
  duration?: string;
  onPress: () => void;
  index?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  instructor,
  rating,
  students,
  price,
  thumbnail,
  category,
  progress,
  duration,
  onPress,
  index = 0,
}) => {
  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
        {/* Course Thumbnail */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: thumbnail }} style={styles.image} />
          
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>

          {/* Progress Bar (if enrolled) */}
          {progress !== undefined && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
              </View>
            </View>
          )}
        </View>

        {/* Course Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          
          <Text style={styles.instructor} numberOfLines={1}>
            {instructor}
          </Text>

          <View style={styles.metaContainer}>
            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>

            {/* Students Count */}
            <View style={styles.studentsContainer}>
              <Ionicons name="people" size={14} color="#6B7280" />
              <Text style={styles.studentsText}>
                {students >= 1000 ? `${(students / 1000).toFixed(1)}k` : students}
              </Text>
            </View>

            {/* Duration */}
            {duration && (
              <View style={styles.durationContainer}>
                <Ionicons name="time-outline" size={14} color="#6B7280" />
                <Text style={styles.durationText}>{duration}</Text>
              </View>
            )}
          </View>

          {/* Price */}
          {price && (
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{price}</Text>
            </View>
          )}

          {/* Continue Learning Button (if progress exists) */}
          {progress !== undefined && (
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButton}
            >
              <Text style={styles.continueText}>Continue Learning</Text>
              <Ionicons name="play-circle" size={18} color="#fff" />
            </LinearGradient>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  progressBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 24,
  },
  instructor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  studentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  studentsText: {
    fontSize: 13,
    color: '#6B7280',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 13,
    color: '#6B7280',
  },
  priceContainer: {
    marginTop: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#6366F1',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  continueText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
