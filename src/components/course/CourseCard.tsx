import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface CourseCardProps {
  course: any; // CourseWithDetails
  onPress: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card padding={0} style={{ marginBottom: 16 }}>
        {/* Cover Image */}
        <Image
          source={{ uri: course.cover_url || 'https://via.placeholder.com/400x200' }}
          style={{
            width: '100%',
            height: 180,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
          resizeMode="cover"
        />

        <View style={{ padding: 16 }}>
          {/* Category & Level */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            {course.categories && (
              <Badge text={course.categories.name} variant="primary" size="sm" />
            )}
            {course.skill_level && (
              <Badge
                text={course.skill_level}
                variant="info"
                size="sm"
                style={{ marginLeft: 8 }}
              />
            )}
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#1C1C1E',
              marginBottom: 8,
            }}
            numberOfLines={2}
          >
            {course.title}
          </Text>

          {/* Teacher */}
          {course.profiles && (
            <Text
              style={{
                fontSize: 14,
                color: '#8E8E93',
                marginBottom: 12,
              }}
            >
              by {course.profiles.full_name}
            </Text>
          )}

          {/* Stats */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Rating */}
              {course.average_rating > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                  <Ionicons name="star" size={16} color="#FF9F0A" />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#1C1C1E',
                      marginLeft: 4,
                    }}
                  >
                    {course.average_rating.toFixed(1)}
                  </Text>
                </View>
              )}

              {/* Students */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="people-outline" size={16} color="#8E8E93" />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#8E8E93',
                    marginLeft: 4,
                  }}
                >
                  {course.students_count || 0}
                </Text>
              </View>
            </View>

            {/* Price */}
            {course.price > 0 ? (
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#007AFF',
                }}
              >
                ${course.price}
              </Text>
            ) : (
              <Badge text="Free" variant="success" size="sm" />
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
