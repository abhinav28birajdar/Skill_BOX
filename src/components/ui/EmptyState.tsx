import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'albums-outline',
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: '#F2F2F7',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Ionicons name={icon} size={40} color="#8E8E93" />
      </View>

      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          color: '#1C1C1E',
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      {description && (
        <Text
          style={{
            fontSize: 14,
            color: '#8E8E93',
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 20,
          }}
        >
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} size="md" />
      )}
    </View>
  );
};
