/**
 * Modal Components
 * Reusable modals for common actions
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

// Base Modal Component
interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  height?: number;
}

export function BaseModal({ visible, onClose, children, title, height: modalHeight }: BaseModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(200)} style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalBackdrop} onPress={onClose} activeOpacity={1} />
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={[styles.modalContainer, modalHeight && { height: modalHeight }]}
        >
          {title && (
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// Confirmation Modal
interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'danger' | 'success';
}

export function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default',
}: ConfirmModalProps) {
  const colors = {
    default: ['#6366F1', '#8B5CF6'],
    danger: ['#EF4444', '#DC2626'],
    success: ['#10B981', '#059669'],
  };

  const icons = {
    default: 'help-circle',
    danger: 'warning',
    success: 'checkmark-circle',
  };

  const iconBg = {
    default: '#EEF2FF',
    danger: '#FEE2E2',
    success: '#D1FAE5',
  };

  const iconColor = {
    default: '#6366F1',
    danger: '#EF4444',
    success: '#10B981',
  };

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.confirmContent}>
        <View style={[styles.confirmIcon, { backgroundColor: iconBg[type] }]}>
          <Ionicons name={icons[type] as any} size={48} color={iconColor[type]} />
        </View>
        <Text style={styles.confirmTitle}>{title}</Text>
        <Text style={styles.confirmMessage}>{message}</Text>
        <View style={styles.confirmActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>{cancelText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <LinearGradient colors={colors[type]} style={styles.confirmButtonGradient}>
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </BaseModal>
  );
}

// Bottom Sheet Modal
interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  snapPoint?: number;
}

export function BottomSheet({ visible, onClose, title, children, snapPoint = 0.5 }: BottomSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(200)} style={styles.sheetOverlay}>
        <TouchableOpacity style={styles.sheetBackdrop} onPress={onClose} activeOpacity={1} />
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={[styles.sheetContainer, { height: height * snapPoint }]}
        >
          <View style={styles.sheetHandle} />
          {title && <Text style={styles.sheetTitle}>{title}</Text>}
          <ScrollView style={styles.sheetContent} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// Action Sheet Modal
interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  actions: Array<{
    label: string;
    icon?: string;
    onPress: () => void;
    destructive?: boolean;
  }>;
}

export function ActionSheet({ visible, onClose, title, actions }: ActionSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} snapPoint={0.4}>
      {title && <Text style={styles.actionSheetTitle}>{title}</Text>}
      <View style={styles.actionsList}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionItem, index > 0 && styles.actionItemBorder]}
            onPress={() => {
              action.onPress();
              onClose();
            }}
          >
            {action.icon && (
              <View style={styles.actionIcon}>
                <Ionicons
                  name={action.icon as any}
                  size={20}
                  color={action.destructive ? '#EF4444' : '#6366F1'}
                />
              </View>
            )}
            <Text
              style={[styles.actionLabel, action.destructive && styles.actionLabelDestructive]}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheet>
  );
}

// Success Modal
interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export function SuccessModal({
  visible,
  onClose,
  title,
  message,
  buttonText = 'Continue',
}: SuccessModalProps) {
  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.successContent}>
        <LinearGradient colors={['#10B981', '#059669']} style={styles.successIcon}>
          <Ionicons name="checkmark" size={64} color="#fff" />
        </LinearGradient>
        <Text style={styles.successTitle}>{title}</Text>
        <Text style={styles.successMessage}>{message}</Text>
        <TouchableOpacity style={styles.successButton} onPress={onClose}>
          <LinearGradient colors={['#10B981', '#059669']} style={styles.successButtonGradient}>
            <Text style={styles.successButtonText}>{buttonText}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  // Base Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },

  // Confirm Modal
  confirmContent: {
    padding: 32,
    alignItems: 'center',
  },
  confirmIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },

  // Bottom Sheet
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheetBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Action Sheet
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
    paddingHorizontal: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  actionsList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  actionItemBorder: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  actionLabelDestructive: {
    color: '#EF4444',
  },

  // Success Modal
  successContent: {
    padding: 32,
    alignItems: 'center',
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  successButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  successButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
});
