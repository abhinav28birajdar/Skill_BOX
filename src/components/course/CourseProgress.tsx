import React from 'react';
import { Text, View } from 'react-native';

interface CourseProgressProps {
  completedLessons: number;
  totalLessons: number;
  showPercentage?: boolean;
}

export const CourseProgress: React.FC<CourseProgressProps> = ({
  completedLessons,
  totalLessons,
  showPercentage = true,
}) => {
  const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <View>
      {showPercentage && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: '#8E8E93',
            }}
          >
            Progress
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#007AFF',
            }}
          >
            {Math.round(percentage)}%
          </Text>
        </View>
      )}

      {/* Progress Bar */}
      <View
        style={{
          height: 8,
          backgroundColor: '#F2F2F7',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: '#007AFF',
            borderRadius: 4,
          }}
        />
      </View>

      {/* Lesson Count */}
      <Text
        style={{
          fontSize: 12,
          color: '#8E8E93',
          marginTop: 4,
        }}
      >
        {completedLessons} of {totalLessons} lessons completed
      </Text>
    </View>
  );
};
