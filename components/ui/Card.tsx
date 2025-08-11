import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewProps,
    ViewStyle
} from 'react-native';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outline' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  onPress?: () => void;
  disabled?: boolean;
  touchable?: boolean;
}

export function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  onPress,
  disabled = false,
  touchable = false,
  style,
  ...props
}: CardProps) {
  const { theme } = useTheme();
  
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.card,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        };
      case 'outline':
        return {
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'filled':
        return {
          backgroundColor: theme.colors.cardSecondary,
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.card,
        };
    }
  };

  const getPaddingStyle = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return {};
      case 'sm':
        return { padding: theme.spacing.sm };
      case 'md':
        return { padding: theme.spacing.md };
      case 'lg':
        return { padding: theme.spacing.lg };
      case 'xl':
        return { padding: theme.spacing.xl };
      default:
        return {};
    }
  };
  
  const cardStyle = [
    styles.card,
    getVariantStyle(),
    getPaddingStyle(),
    style,
  ];

  if (onPress || touchable) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

// Content Card Component for Learning Content
interface ContentCardProps extends Omit<CardProps, 'children'> {
  title: string;
  description?: string;
  imageUrl?: string;
  duration?: string;
  level?: string;
  rating?: number;
  instructor?: string;
  price?: number;
  isBookmarked?: boolean;
  onBookmarkPress?: () => void;
  onPress?: () => void;
}

export function ContentCard({
  title,
  description,
  imageUrl,
  duration,
  level,
  rating,
  instructor,
  price,
  isBookmarked = false,
  onBookmarkPress,
  onPress,
  style,
  ...props
}: ContentCardProps) {
  const { theme } = useTheme();

  const cardStyle = StyleSheet.flatten([{ width: 280 }, style]);

  return (
    <Card style={cardStyle} onPress={onPress} {...props}>
      {/* Image */}
      {imageUrl && (
        <View style={{
          height: 160,
          backgroundColor: theme.colors.cardSecondary,
          borderRadius: 12,
          marginBottom: 16,
          position: 'relative',
        }}>
          {/* Placeholder for image - you'd use Image component here */}
          <View style={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}>
            <TouchableOpacity
              onPress={onBookmarkPress}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'rgba(0,0,0,0.5)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: 'white' }}>
                {isBookmarked ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {duration && (
            <View style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              backgroundColor: 'rgba(0,0,0,0.7)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}>
              <Text style={{
                color: 'white',
                fontSize: 12,
                fontWeight: '500',
              }}>
                {duration}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Content */}
      <View style={{ flex: 1 }}>
        {/* Level Badge */}
        {level && (
          <View style={{
            alignSelf: 'flex-start',
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 999,
            marginBottom: 8,
          }}>
            <Text style={{
              color: 'white',
              fontSize: 12,
              fontWeight: '500',
              textTransform: 'uppercase',
            }}>
              {level}
            </Text>
          </View>
        )}

        {/* Title */}
        <Text 
          numberOfLines={2}
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          {title}
        </Text>

        {/* Description */}
        {description && (
          <Text 
            numberOfLines={3}
            style={{
              fontSize: 14,
              color: theme.colors.textSecondary,
              lineHeight: 20,
              marginBottom: 16,
            }}
          >
            {description}
          </Text>
        )}

        {/* Instructor */}
        {instructor && (
          <Text style={{
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 8,
          }}>
            By {instructor}
          </Text>
        )}

        {/* Rating and Price Row */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {rating && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Text style={{ color: '#FFD700', marginRight: 4 }}>⭐</Text>
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: theme.colors.text,
              }}>
                {rating.toFixed(1)}
              </Text>
            </View>
          )}

          {price !== undefined && (
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: theme.colors.primary,
            }}>
              {price === 0 ? 'Free' : `$${price}`}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
}

// Teacher Card Component
interface TeacherCardProps extends Omit<CardProps, 'children'> {
  name: string;
  bio?: string;
  profileImage?: string;
  rating?: number;
  studentsCount?: number;
  coursesCount?: number;
  skills?: string[];
  isFollowing?: boolean;
  onFollowPress?: () => void;
  onPress?: () => void;
}

export function TeacherCard({
  name,
  bio,
  profileImage,
  rating,
  studentsCount,
  coursesCount,
  skills = [],
  isFollowing = false,
  onFollowPress,
  onPress,
  style,
  ...props
}: TeacherCardProps) {
  const { theme } = useTheme();
  
  const cardStyle = StyleSheet.flatten([{ width: 280 }, style]);

  return (
    <Card style={cardStyle} onPress={onPress} {...props}>
      {/* Profile Section */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        {/* Profile Image */}
        <View style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: theme.colors.cardSecondary,
          marginRight: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 24 }}>👤</Text>
        </View>

        {/* Name and Rating */}
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 4,
          }}>
            {name}
          </Text>
          
          {rating && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Text style={{ color: '#FFD700', marginRight: 4 }}>⭐</Text>
              <Text style={{
                fontSize: 14,
                color: theme.colors.textSecondary,
              }}>
                {rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Follow Button */}
        {onFollowPress && (
          <TouchableOpacity
            onPress={onFollowPress}
            style={{
              backgroundColor: isFollowing ? theme.colors.cardSecondary : theme.colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: isFollowing ? 1 : 0,
              borderColor: theme.colors.border,
            }}
          >
            <Text style={{
              color: isFollowing ? theme.colors.text : 'white',
              fontSize: 14,
              fontWeight: '500',
            }}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bio */}
      {bio && (
        <Text 
          numberOfLines={3}
          style={{
            fontSize: 14,
            color: theme.colors.textSecondary,
            lineHeight: 20,
            marginBottom: 16,
          }}
        >
          {bio}
        </Text>
      )}

      {/* Stats */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        paddingVertical: 8,
        backgroundColor: theme.colors.cardSecondary,
        borderRadius: 12,
      }}>
        {studentsCount !== undefined && (
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: theme.colors.text,
            }}>
              {studentsCount}
            </Text>
            <Text style={{
              fontSize: 12,
              color: theme.colors.textSecondary,
            }}>
              Students
            </Text>
          </View>
        )}

        {coursesCount !== undefined && (
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: theme.colors.text,
            }}>
              {coursesCount}
            </Text>
            <Text style={{
              fontSize: 12,
              color: theme.colors.textSecondary,
            }}>
              Courses
            </Text>
          </View>
        )}
      </View>

      {/* Skills */}
      {skills.length > 0 && (
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 4,
        }}>
          {skills.slice(0, 3).map((skill, index) => (
            <View
              key={index}
              style={{
                backgroundColor: theme.colors.primary + '20',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text style={{
                fontSize: 12,
                color: theme.colors.primary,
                fontWeight: '500',
              }}>
                {skill}
              </Text>
            </View>
          ))}
          {skills.length > 3 && (
            <View style={{
              backgroundColor: theme.colors.cardSecondary,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}>
              <Text style={{
                fontSize: 12,
                color: theme.colors.textSecondary,
                fontWeight: '500',
              }}>
                +{skills.length - 3}
              </Text>
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginVertical: 4,
  },
});
