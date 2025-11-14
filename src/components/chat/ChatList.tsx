import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

interface Thread {
  id: string;
  last_message: string;
  last_message_at: string;
  participant_profiles: any[];
  unread_count?: number;
}

interface ChatListProps {
  threads: Thread[];
  currentUserId: string;
  onThreadPress: (threadId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  threads,
  currentUserId,
  onThreadPress,
}) => {
  const getOtherUser = (thread: Thread) => {
    return thread.participant_profiles?.find(p => p.id !== currentUserId);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const renderThread = ({ item }: { item: Thread }) => {
    const otherUser = getOtherUser(item);

    return (
      <TouchableOpacity
        onPress={() => onThreadPress(item.id)}
        style={{
          flexDirection: 'row',
          padding: 16,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F2F2F7',
        }}
      >
        <Avatar
          uri={otherUser?.avatar_url}
          name={otherUser?.full_name}
          size={50}
        />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#1C1C1E',
                flex: 1,
              }}
              numberOfLines={1}
            >
              {otherUser?.full_name || 'Unknown User'}
            </Text>
            <Text style={{ fontSize: 12, color: '#8E8E93', marginLeft: 8 }}>
              {formatTime(item.last_message_at)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 14,
                color: '#8E8E93',
                flex: 1,
              }}
              numberOfLines={1}
            >
              {item.last_message || 'No messages yet'}
            </Text>
            {item.unread_count && item.unread_count > 0 && (
              <Badge
                text={item.unread_count.toString()}
                variant="primary"
                size="sm"
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={threads}
      renderItem={renderThread}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};
