import { cardVariants, useTheme } from '@/constants/Theme';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outline';
  style?: ViewStyle | ViewStyle[];
  onPress?: TouchableOpacityProps['onPress'];
  disabled?: boolean;
}

export function Card({
  children,
  variant = 'default',
  style,
  onPress,
  disabled = false,
  ...props
}: CardProps) {
  const theme = useTheme();
  
  const variantStyles = cardVariants[variant](theme);
  
  const cardStyle = [
    variantStyles,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
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
  const theme = useTheme();

  const cardStyle = StyleSheet.flatten([{ width: 280 }, style]);

  return (
    <Card style={cardStyle} onPress={onPress} {...props}>
      {/* Image */}
      {imageUrl && (
        <View style={{
          height: 160,
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.borderRadius.md,
          marginBottom: theme.spacing.md,
          position: 'relative',
        }}>
          {/* Placeholder for image - you'd use Image component here */}
          <View style={{
            position: 'absolute',
            top: theme.spacing.sm,
            right: theme.spacing.sm,
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
              bottom: theme.spacing.sm,
              left: theme.spacing.sm,
              backgroundColor: 'rgba(0,0,0,0.7)',
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.xs,
              borderRadius: theme.borderRadius.sm,
            }}>
              <Text style={{
                color: 'white',
                fontSize: theme.typography.fontSize.xs,
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
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            borderRadius: theme.borderRadius.full,
            marginBottom: theme.spacing.sm,
          }}>
            <Text style={{
              color: 'white',
              fontSize: theme.typography.fontSize.xs,
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
            fontSize: theme.typography.fontSize.lg,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: theme.spacing.sm,
          }}
        >
          {title}
        </Text>

        {/* Description */}
        {description && (
          <Text 
            numberOfLines={3}
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
              lineHeight: 20,
              marginBottom: theme.spacing.md,
            }}
          >
            {description}
          </Text>
        )}

        {/* Instructor */}
        {instructor && (
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.textTertiary,
            marginBottom: theme.spacing.sm,
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
                fontSize: theme.typography.fontSize.sm,
                fontWeight: '500',
                color: theme.colors.text,
              }}>
                {rating.toFixed(1)}
              </Text>
            </View>
          )}

          {price !== undefined && (
            <Text style={{
              fontSize: theme.typography.fontSize.lg,
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
  const theme = useTheme();
  
  const cardStyle = StyleSheet.flatten([{ width: 280 }, style]);

  return (
    <Card style={cardStyle} onPress={onPress} {...props}>
      {/* Profile Section */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
      }}>
        {/* Profile Image */}
        <View style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: theme.colors.backgroundSecondary,
          marginRight: theme.spacing.md,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 24 }}>👤</Text>
        </View>

        {/* Name and Rating */}
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
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
                fontSize: theme.typography.fontSize.sm,
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
              backgroundColor: isFollowing ? theme.colors.backgroundSecondary : theme.colors.primary,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.md,
              borderWidth: isFollowing ? 1 : 0,
              borderColor: theme.colors.border,
            }}
          >
            <Text style={{
              color: isFollowing ? theme.colors.text : 'white',
              fontSize: theme.typography.fontSize.sm,
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
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.textSecondary,
            lineHeight: 20,
            marginBottom: theme.spacing.md,
          }}
        >
          {bio}
        </Text>
      )}

      {/* Stats */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.md,
      }}>
        {studentsCount !== undefined && (
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: '700',
              color: theme.colors.text,
            }}>
              {studentsCount}
            </Text>
            <Text style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.textTertiary,
            }}>
              Students
            </Text>
          </View>
        )}

        {coursesCount !== undefined && (
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: '700',
              color: theme.colors.text,
            }}>
              {coursesCount}
            </Text>
            <Text style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.textTertiary,
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
          gap: theme.spacing.xs,
        }}>
          {skills.slice(0, 3).map((skill, index) => (
            <View
              key={index}
              style={{
                backgroundColor: theme.colors.primary + '20',
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xs,
                borderRadius: theme.borderRadius.sm,
              }}
            >
              <Text style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.primary,
                fontWeight: '500',
              }}>
                {skill}
              </Text>
            </View>
          ))}
          {skills.length > 3 && (
            <View style={{
              backgroundColor: theme.colors.backgroundSecondary,
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.xs,
              borderRadius: theme.borderRadius.sm,
            }}>
              <Text style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.textTertiary,
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
