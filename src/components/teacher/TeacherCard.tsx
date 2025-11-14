import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from '../ui/Avatar';
import { Card } from '../ui/Card';

interface TeacherCardProps {
  teacher: any;
  onPress: () => void;
  showStats?: boolean;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  onPress,
  showStats = true,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card padding={16} style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar
            uri={teacher.avatar_url}
            name={teacher.full_name}
            size={60}
          />

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#1C1C1E',
                marginBottom: 4,
              }}
              numberOfLines={1}
            >
              {teacher.full_name}
            </Text>

            {teacher.bio && (
              <Text
                style={{
                  fontSize: 14,
                  color: '#8E8E93',
                  marginBottom: 8,
                }}
                numberOfLines={2}
              >
                {teacher.bio}
              </Text>
            )}

            {showStats && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                  <Ionicons name="book-outline" size={16} color="#8E8E93" />
                  <Text style={{ fontSize: 12, color: '#8E8E93', marginLeft: 4 }}>
                    {teacher.courses_count || 0} courses
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="people-outline" size={16} color="#8E8E93" />
                  <Text style={{ fontSize: 12, color: '#8E8E93', marginLeft: 4 }}>
                    {teacher.students_count || 0} students
                  </Text>
                </View>
              </View>
            )}
          </View>

          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </View>
      </Card>
    </TouchableOpacity>
  );
};
