import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface LoadingProps {
  overlay?: boolean;
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  visible?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  overlay = false,
  size = 'large',
  color,
  text,
  visible = true,
}) => {
  const { theme } = useTheme();

  if (!visible) return null;

  const content = (
    <View style={[
      styles.container,
      overlay && styles.overlay,
      { backgroundColor: overlay ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }
    ]}>
      <View style={[
        styles.content,
        { backgroundColor: overlay ? theme.colors.surface : 'transparent' }
      ]}>
        <ActivityIndicator
          size={size}
          color={color || theme.colors.primary}
        />
        {text && (
          <Text style={[
            styles.text,
            { color: theme.colors.text, marginTop: 12 }
          ]}>
            {text}
          </Text>
        )}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
      >
        {content}
      </Modal>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  content: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Loading;
