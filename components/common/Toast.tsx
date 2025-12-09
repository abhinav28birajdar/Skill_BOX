/**
 * Toast Notification Component
 * Modern, animated toast messages for user feedback
 */

import { useTheme } from '@/lib/theme';
import React, { useEffect } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  visible: boolean;
}

const ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  visible,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = React.useRef(new Animated.Value(-100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      handleClose();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.primary;
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + 16,
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleClose}
        style={styles.content}
      >
        <Text style={styles.icon}>{ICONS[type]}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// Toast Manager Hook
// ============================================

interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
}

let toastCallback: ((config: ToastConfig) => void) | null = null;

export const setToastCallback = (callback: (config: ToastConfig) => void) => {
  toastCallback = callback;
};

export const showToast = (config: ToastConfig | string) => {
  if (toastCallback) {
    const toastConfig = typeof config === 'string' ? { message: config } : config;
    toastCallback(toastConfig);
  }
};

export const toast = {
  success: (message: string, duration?: number) =>
    showToast({ message, type: 'success', duration }),
  error: (message: string, duration?: number) =>
    showToast({ message, type: 'error', duration }),
  warning: (message: string, duration?: number) =>
    showToast({ message, type: 'warning', duration }),
  info: (message: string, duration?: number) =>
    showToast({ message, type: 'info', duration }),
};

// ============================================
// Toast Provider Component
// ============================================

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastConfig, setToastConfig] = React.useState<ToastConfig | null>(null);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    setToastCallback((config) => {
      setToastConfig(config);
      setVisible(true);
    });

    return () => {
      setToastCallback(() => {});
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setToastConfig(null);
    }, 300);
  };

  return (
    <>
      {children}
      {toastConfig && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          duration={toastConfig.duration}
          onClose={handleClose}
          visible={visible}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default Toast;
