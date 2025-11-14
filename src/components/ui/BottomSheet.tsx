import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    ModalProps,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from 'react-native';

interface BottomSheetProps extends Omit<ModalProps, 'transparent' | 'animationType'> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  height?: number | string;
  showHandle?: boolean;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  height = '50%',
  showHandle = true,
  children,
  containerStyle,
  ...props
}) => {
  return (
    <Modal
      {...props}
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={[
                {
                  backgroundColor: '#FFFFFF',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  height: height as any,
                  paddingBottom: 20,
                },
                containerStyle,
              ]}
            >
              {/* Handle */}
              {showHandle && (
                <View
                  style={{
                    width: 40,
                    height: 4,
                    backgroundColor: '#E5E5EA',
                    borderRadius: 2,
                    alignSelf: 'center',
                    marginTop: 12,
                    marginBottom: 8,
                  }}
                />
              )}

              {/* Header */}
              {title && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F2F2F7',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: '#1C1C1E',
                    }}
                  >
                    {title}
                  </Text>
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Content */}
              <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }}>
                {children}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
