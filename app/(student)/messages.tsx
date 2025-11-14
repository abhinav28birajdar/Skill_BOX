import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatList } from '../../src/components/chat/ChatList';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { useAuth } from '../../src/hooks/useAuth';
import { useChat } from '../../src/hooks/useChat';

export default function MessagesScreen() {
  const { profile } = useAuth();
  const { threads, loading, refresh } = useChat(profile?.id || '');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading messages..." />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: '#1C1C1E',
          }}
        >
          Messages
        </Text>
      </View>

      {/* Chat List */}
      {threads.length === 0 ? (
        <EmptyState
          icon="chatbubbles-outline"
          title="No messages yet"
          description="Start a conversation with your teachers"
        />
      ) : (
        <ChatList
          threads={threads}
          currentUserId={profile?.id || ''}
          onThreadPress={(threadId) => router.push('/(student)/messages')}
        />
      )}
    </SafeAreaView>
  );
}
