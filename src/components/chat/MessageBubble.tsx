import React from 'react';
import { Text, View } from 'react-native';
import type { MessageWithSender } from '../../types/database';
import { Avatar } from '../ui/Avatar';

interface MessageBubbleProps {
  message: MessageWithSender;
  isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 16,
        paddingHorizontal: 16,
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
      }}
    >
      {!isOwnMessage && (
        <Avatar
          uri={message.sender?.avatar_url || undefined}
          name={message.sender?.name || undefined}
          size={32}
          style={{ marginRight: 8 }}
        />
      )}

      <View
        style={{
          maxWidth: '70%',
        }}
      >
        {!isOwnMessage && (
          <Text
            style={{
              fontSize: 12,
              color: '#8E8E93',
              marginBottom: 4,
              marginLeft: 12,
            }}
          >
            {message.sender?.name}
          </Text>
        )}

        <View
          style={{
            backgroundColor: isOwnMessage ? '#007AFF' : '#F2F2F7',
            borderRadius: 16,
            padding: 12,
            borderBottomRightRadius: isOwnMessage ? 4 : 16,
            borderBottomLeftRadius: isOwnMessage ? 16 : 4,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: isOwnMessage ? '#FFFFFF' : '#1C1C1E',
              lineHeight: 22,
            }}
          >
            {message.body}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 11,
            color: '#8E8E93',
            marginTop: 4,
            marginLeft: 12,
            textAlign: isOwnMessage ? 'right' : 'left',
          }}
        >
          {formatTime(message.created_at)}
        </Text>
      </View>

      {isOwnMessage && (
        <Avatar
          uri={message.sender?.avatar_url || undefined}
          name={message.sender?.name || undefined}
          size={32}
          style={{ marginLeft: 8 }}
        />
      )}
    </View>
  );
};
