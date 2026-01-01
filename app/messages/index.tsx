/**
 * Messaging/Chat Page
 * Features: Conversations list, direct messages
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const CONVERSATIONS = [
  {
    id: 1,
    name: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Thanks for the help with React hooks!',
    timestamp: '2m',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastMessage: 'Can you review my code?',
    timestamp: '1h',
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    lastMessage: 'See you in the study group!',
    timestamp: '3h',
    unread: 1,
    online: false,
  },
  {
    id: 4,
    name: 'Alex Kumar',
    avatar: 'https://i.pravatar.cc/150?img=4',
    lastMessage: 'Great session today!',
    timestamp: '1d',
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: 'React Native Group',
    avatar: 'https://picsum.photos/seed/group1/150/150',
    lastMessage: 'John: Anyone up for a code review?',
    timestamp: '2d',
    unread: 5,
    online: false,
    isGroup: true,
  },
];

export default function MessagingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {CONVERSATIONS.map((conversation, index) => (
          <Animated.View key={conversation.id} entering={FadeInDown.delay(index * 50)}>
            <TouchableOpacity style={styles.conversationCard}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: conversation.avatar }} style={styles.avatar} />
                {conversation.online && <View style={styles.onlineDot} />}
                {conversation.isGroup && (
                  <View style={styles.groupBadge}>
                    <Ionicons name="people" size={12} color="#fff" />
                  </View>
                )}
              </View>

              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.conversationName}>{conversation.name}</Text>
                  <Text style={styles.timestamp}>{conversation.timestamp}</Text>
                </View>
                <View style={styles.conversationFooter}>
                  <Text
                    style={[
                      styles.lastMessage,
                      conversation.unread > 0 && styles.unreadMessage,
                    ]}
                    numberOfLines={1}
                  >
                    {conversation.lastMessage}
                  </Text>
                  {conversation.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{conversation.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', margin: 20, padding: 12, backgroundColor: '#fff', borderRadius: 12, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#1F2937' },
  content: { flex: 1 },
  conversationCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 12 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#fff' },
  groupBadge: { position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderRadius: 10, backgroundColor: '#6366F1', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  conversationContent: { flex: 1 },
  conversationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  conversationName: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  timestamp: { fontSize: 12, color: '#9CA3AF' },
  conversationFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { flex: 1, fontSize: 14, color: '#6B7280' },
  unreadMessage: { fontWeight: '600', color: '#1F2937' },
  unreadBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#6366F1', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  unreadText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  bottomSpacing: { height: 40 },
});
