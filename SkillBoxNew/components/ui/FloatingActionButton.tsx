import { useTheme } from '@/constants/Theme';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle
} from 'react-native';

interface FloatingActionButtonProps extends TouchableOpacityProps {
  icon?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'custom';
  style?: ViewStyle;
  extended?: boolean;
  iconStyle?: TextStyle;
  labelStyle?: TextStyle;
}

interface SpeedDialProps {
  mainButton: FloatingActionButtonProps;
  actions: Array<{
    icon: string;
    label?: string;
    onPress: () => void;
    color?: string;
  }>;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  direction?: 'up' | 'down' | 'left' | 'right';
  style?: ViewStyle;
}

export function FloatingActionButton({
  icon = '+',
  label,
  size = 'md',
  variant = 'primary',
  position = 'bottom-right',
  style,
  extended = false,
  iconStyle,
  labelStyle,
  ...props
}: FloatingActionButtonProps) {
  const theme = useTheme();

  const sizes = {
    sm: { width: 40, height: 40, fontSize: 16 },
    md: { width: 56, height: 56, fontSize: 20 },
    lg: { width: 72, height: 72, fontSize: 24 },
  };

  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: '#FFFFFF',
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      color: '#FFFFFF',
    },
    success: {
      backgroundColor: theme.colors.success,
      color: '#FFFFFF',
    },
    warning: {
      backgroundColor: theme.colors.warning,
      color: '#FFFFFF',
    },
    error: {
      backgroundColor: theme.colors.error,
      color: '#FFFFFF',
    },
  };

  const positions = {
    'bottom-right': {
      position: 'absolute' as const,
      bottom: theme.spacing.xl,
      right: theme.spacing.xl,
    },
    'bottom-left': {
      position: 'absolute' as const,
      bottom: theme.spacing.xl,
      left: theme.spacing.xl,
    },
    'bottom-center': {
      position: 'absolute' as const,
      bottom: theme.spacing.xl,
      alignSelf: 'center' as const,
    },
    custom: {},
  };

  const isExtended = extended && label;
  const fabWidth = isExtended ? 'auto' : sizes[size].width;

  return (
    <TouchableOpacity
      style={[
        {
          width: fabWidth,
          height: sizes[size].height,
          backgroundColor: variants[variant].backgroundColor,
          borderRadius: isExtended ? theme.borderRadius.full : sizes[size].height / 2,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: isExtended ? theme.spacing.lg : 0,
          ...theme.shadows.lg,
          elevation: 8,
        },
        positions[position],
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      {/* Icon */}
      <Text
        style={[
          {
            fontSize: sizes[size].fontSize,
            color: variants[variant].color,
            fontWeight: '600',
          },
          iconStyle,
        ]}
      >
        {icon}
      </Text>

      {/* Label for extended FAB */}
      {isExtended && (
        <Text
          style={[
            {
              marginLeft: theme.spacing.sm,
              fontSize: theme.typography.fontSize.base,
              color: variants[variant].color,
              fontWeight: '600',
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export function SpeedDial({
  mainButton,
  actions,
  open = false,
  onToggle,
  direction = 'up',
  style,
}: SpeedDialProps) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const getActionPosition = (index: number) => {
    const spacing = 72; // Distance between actions
    const offset = (index + 1) * spacing;

    switch (direction) {
      case 'up':
        return { bottom: offset };
      case 'down':
        return { top: offset };
      case 'left':
        return { right: offset };
      case 'right':
        return { left: offset };
      default:
        return { bottom: offset };
    }
  };

  return (
    <View style={style}>
      {/* Action Buttons */}
      {isOpen &&
        actions.map((action, index) => (
          <View
            key={index}
            style={[
              {
                position: 'absolute',
                ...getActionPosition(index),
              },
            ]}
          >
            {/* Action Label */}
            {action.label && direction === 'up' && (
              <View
                style={{
                  position: 'absolute',
                  right: 72,
                  top: '50%',
                  transform: [{ translateY: -12 }],
                  backgroundColor: theme.colors.surface,
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.borderRadius.sm,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  ...theme.shadows.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text,
                    fontWeight: '500',
                  }}
                >
                  {action.label}
                </Text>
              </View>
            )}

            {/* Action Button */}
            <FloatingActionButton
              icon={action.icon}
              size="sm"
              variant="secondary"
              position="custom"
              onPress={action.onPress}
              style={{
                backgroundColor: action.color || theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            />
          </View>
        ))}

      {/* Main Button */}
      <FloatingActionButton
        {...mainButton}
        onPress={handleToggle}
        icon={isOpen ? '✕' : mainButton.icon}
        style={StyleSheet.flatten([
          {
            transform: [{ rotate: isOpen ? '45deg' : '0deg' }],
          },
          mainButton.style,
        ])}
      />

      {/* Backdrop */}
      {isOpen && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: -1000,
            left: -1000,
            right: -1000,
            bottom: -1000,
            backgroundColor: 'transparent',
            zIndex: -1,
          }}
          onPress={handleToggle}
          activeOpacity={1}
        />
      )}
    </View>
  );
}

// Quick Action FABs for common SkillBox actions
export function CreateCourseFAB(props: Omit<FloatingActionButtonProps, 'icon' | 'label'>) {
  return (
    <FloatingActionButton
      icon="📚"
      label="Create Course"
      extended
      variant="primary"
      {...props}
    />
  );
}

export function JoinClassFAB(props: Omit<FloatingActionButtonProps, 'icon' | 'label'>) {
  return (
    <FloatingActionButton
      icon="🎓"
      label="Join Class"
      extended
      variant="success"
      {...props}
    />
  );
}

export function MessageFAB(props: Omit<FloatingActionButtonProps, 'icon' | 'label'>) {
  return (
    <FloatingActionButton
      icon="💬"
      variant="secondary"
      {...props}
    />
  );
}

export function HelpFAB(props: Omit<FloatingActionButtonProps, 'icon' | 'label'>) {
  return (
    <FloatingActionButton
      icon="❓"
      variant="warning"
      {...props}
    />
  );
}

// SkillBox specific Speed Dial for Teachers
export function TeacherSpeedDial(props: Omit<SpeedDialProps, 'mainButton' | 'actions'>) {
  const actions = [
    {
      icon: '📚',
      label: 'Create Course',
      onPress: () => console.log('Create Course'),
    },
    {
      icon: '🎥',
      label: 'Start Live Class',
      onPress: () => console.log('Start Live Class'),
    },
    {
      icon: '📝',
      label: 'Create Assignment',
      onPress: () => console.log('Create Assignment'),
    },
    {
      icon: '💬',
      label: 'Message Students',
      onPress: () => console.log('Message Students'),
    },
  ];

  return (
    <SpeedDial
      mainButton={{
        icon: '+',
        variant: 'primary',
        position: 'bottom-right',
      }}
      actions={actions}
      {...props}
    />
  );
}

// SkillBox specific Speed Dial for Students
export function StudentSpeedDial(props: Omit<SpeedDialProps, 'mainButton' | 'actions'>) {
  const actions = [
    {
      icon: '🔍',
      label: 'Browse Courses',
      onPress: () => console.log('Browse Courses'),
    },
    {
      icon: '🎓',
      label: 'Join Class',
      onPress: () => console.log('Join Class'),
    },
    {
      icon: '❓',
      label: 'Ask Question',
      onPress: () => console.log('Ask Question'),
    },
    {
      icon: '💬',
      label: 'Study Group',
      onPress: () => console.log('Study Group'),
    },
  ];

  return (
    <SpeedDial
      mainButton={{
        icon: '+',
        variant: 'primary',
        position: 'bottom-right',
      }}
      actions={actions}
      {...props}
    />
  );
}
