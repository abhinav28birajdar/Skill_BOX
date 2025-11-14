import React from 'react';
import { ActivityIndicator, Text, View, ViewStyle } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#007AFF',
  text,
  fullScreen = false,
  style,
}) => {
  const Container = fullScreen ? View : React.Fragment;
  const containerProps = fullScreen
    ? {
        style: {
          flex: 1,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          backgroundColor: '#FFFFFF',
        },
      }
    : {};

  return (
    <Container {...containerProps}>
      <View
        style={[
          {
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            padding: 20,
          },
          !fullScreen && style,
        ]}
      >
        <ActivityIndicator size={size} color={color} />
        {text && (
          <Text
            style={{
              marginTop: 12,
              fontSize: 14,
              color: '#8E8E93',
            }}
          >
            {text}
          </Text>
        )}
      </View>
    </Container>
  );
};
