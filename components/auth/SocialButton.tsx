import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

export interface SocialButtonProps {
  provider: 'google' | 'apple' | 'github' | 'facebook';
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const PROVIDER_CONFIG = {
  google: {
    label: 'Continue with Google',
    icon: 'logo-google' as const,
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    iconColor: '#EA4335',
  },
  apple: {
    label: 'Continue with Apple',
    icon: 'logo-apple' as const,
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    iconColor: '#FFFFFF',
  },
  github: {
    label: 'Continue with GitHub',
    icon: 'logo-github' as const,
    backgroundColor: '#24292E',
    textColor: '#FFFFFF',
    iconColor: '#FFFFFF',
  },
  facebook: {
    label: 'Continue with Facebook',
    icon: 'logo-facebook' as const,
    backgroundColor: '#1877F2',
    textColor: '#FFFFFF',
    iconColor: '#FFFFFF',
  },
};

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  disabled = false,
  loading = false,
}) => {
  const config = PROVIDER_CONFIG[provider];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: config.backgroundColor },
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={config.textColor} />
      ) : (
        <>
          <Ionicons
            name={config.icon}
            size={20}
            color={config.iconColor}
            style={styles.icon}
          />
          <Text style={[styles.text, { color: config.textColor }]}>
            {config.label}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
