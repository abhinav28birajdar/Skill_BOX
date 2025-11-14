import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { Lesson } from '../../types/database';
import { Card } from '../ui/Card';

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  onPress: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  index,
  isCompleted = false,
  isLocked = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.7}
      style={{ marginBottom: 12 }}
    >
      <Card
        variant="outlined"
        padding={16}
        style={{
          opacity: isLocked ? 0.5 : 1,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Status Icon */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isCompleted
                ? '#34C759'
                : isLocked
                ? '#F2F2F7'
                : '#007AFF15',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            {isCompleted ? (
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            ) : isLocked ? (
              <Ionicons name="lock-closed" size={18} color="#8E8E93" />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#007AFF',
                }}
              >
                {index + 1}
              </Text>
            )}
          </View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#1C1C1E',
                marginBottom: 4,
              }}
              numberOfLines={1}
            >
              {lesson.title}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Video indicator */}
              {lesson.video_url && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="play-circle-outline" size={16} color="#8E8E93" />
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#8E8E93',
                      marginLeft: 4,
                    }}
                  >
                    Video
                  </Text>
                </View>
              )}

              {/* Document indicator */}
              {lesson.document_url && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="document-outline" size={16} color="#8E8E93" />
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#8E8E93',
                      marginLeft: 4,
                    }}
                  >
                    PDF
                  </Text>
                </View>
              )}

              {/* Duration */}
              {lesson.duration && (
                <Text
                  style={{
                    fontSize: 12,
                    color: '#8E8E93',
                  }}
                >
                  {Math.floor(lesson.duration / 60)} min
                </Text>
              )}
            </View>
          </View>

          {/* Arrow */}
          {!isLocked && (
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};
