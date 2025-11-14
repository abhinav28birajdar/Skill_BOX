import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from 'react-native';

interface MessageInputProps {
  onSend: (message: string) => void;
  onAttach?: () => void;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onAttach,
  placeholder = 'Type a message...',
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F2F2F7',
        }}
      >
        {onAttach && (
          <TouchableOpacity onPress={onAttach} style={{ marginRight: 8 }}>
            <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
          </TouchableOpacity>
        )}

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F2F2F7',
            borderRadius: 20,
            paddingHorizontal: 16,
          }}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={placeholder}
            placeholderTextColor="#8E8E93"
            multiline
            maxLength={500}
            style={{
              flex: 1,
              fontSize: 16,
              color: '#1C1C1E',
              paddingVertical: 10,
              maxHeight: 100,
            }}
          />
        </View>

        <TouchableOpacity
          onPress={handleSend}
          disabled={!message.trim()}
          style={{
            marginLeft: 8,
            opacity: message.trim() ? 1 : 0.5,
          }}
        >
          <Ionicons name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
