import {
    Button,
    Card,
    Input,
    NotificationProvider,
    SkillBoxNotifications,
    useNotifications,
} from '@/components/ui';
import { useTheme } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';
import {
    useClassPresence,
    useRealtimeChat,
    useRealtimeNotifications,
    useUserPresence,
} from '@/hooks/useRealtime';
import { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// Real-time Dashboard Component
function RealtimeDashboard() {
  const theme = useTheme();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  // Real-time hooks
  const { notifications } = useRealtimeNotifications();
  const { onlineUsers } = useUserPresence();
  const [selectedClassId, setSelectedClassId] = useState('demo-class-123');
  const { participants } = useClassPresence(selectedClassId);
  const { messages, sendMessage } = useRealtimeChat('demo-chat-123');
  
  // Local state
  const [messageText, setMessageText] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    // Simulate connection status
    const timer = setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    try {
      await sendMessage(messageText);
      setMessageText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const simulateNotification = () => {
    addNotification(
      SkillBoxNotifications.classReminder(
        'React Native Masterclass',
        '5 minutes',
        () => console.log('Join class')
      )
    );
  };

  const simulateAchievement = () => {
    addNotification(
      SkillBoxNotifications.achievement(
        'Fast Learner',
        () => console.log('View achievement')
      )
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Real-time SkillBox Dashboard
          </Text>
          <View style={[
            styles.statusBadge,
            {
              backgroundColor: connectionStatus === 'connected' 
                ? theme.colors.success 
                : theme.colors.warning
            }
          ]}>
            <Text style={styles.statusText}>
              {connectionStatus === 'connected' ? '🟢 Connected' : '🟡 Connecting...'}
            </Text>
          </View>
        </View>

        {/* Connection Status */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Real-time Features Status
          </Text>
          <View style={styles.featureList}>
            <Text style={[styles.featureItem, { color: theme.colors.textSecondary }]}>
              ✅ Live notifications
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.textSecondary }]}>
              ✅ User presence tracking
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.textSecondary }]}>
              ✅ Live chat messaging
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.textSecondary }]}>
              ✅ Class participation
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.textSecondary }]}>
              ✅ Progress synchronization
            </Text>
          </View>
        </Card>

        {/* Online Users */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Online Users ({onlineUsers.length})
          </Text>
          {onlineUsers.length > 0 ? (
            <View style={styles.userList}>
              {onlineUsers.slice(0, 5).map((user, index) => (
                <View key={index} style={styles.userItem}>
                  <View style={[styles.userAvatar, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.userInitial}>
                      {user.full_name ? user.full_name[0].toUpperCase() : '?'}
                    </Text>
                  </View>
                  <Text style={[styles.userName, { color: theme.colors.text }]}>
                    {user.full_name || user.username || 'Anonymous'}
                  </Text>
                  <View style={[styles.onlineIndicator, { backgroundColor: theme.colors.success }]} />
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No other users online
            </Text>
          )}
        </Card>

        {/* Class Participants */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Live Class: React Native Basics
          </Text>
          <Text style={[styles.participantCount, { color: theme.colors.textSecondary }]}>
            {participants.length} participants in class
          </Text>
          {participants.length > 0 && (
            <View style={styles.participantList}>
              {participants.map((participant, index) => (
                <View key={index} style={styles.participantItem}>
                  <Text style={[styles.participantName, { color: theme.colors.text }]}>
                    👨‍🎓 {participant.full_name || participant.username}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Live Chat */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Live Chat
          </Text>
          
          <View style={styles.chatContainer}>
            <ScrollView style={styles.messageList} nestedScrollEnabled>
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <View key={index} style={styles.messageItem}>
                    <Text style={[styles.messageAuthor, { color: theme.colors.primary }]}>
                      {message.sender?.full_name || 'Anonymous'}:
                    </Text>
                    <Text style={[styles.messageContent, { color: theme.colors.text }]}>
                      {message.content}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  No messages yet. Start the conversation!
                </Text>
              )}
            </ScrollView>
            
            <View style={styles.messageInput}>
              <View style={styles.textInput}>
                <Input
                  placeholder="Type your message..."
                  value={messageText}
                  onChangeText={setMessageText}
                />
              </View>
              <Button
                title="Send"
                onPress={handleSendMessage}
                disabled={!messageText.trim()}
                style={styles.sendButton}
              />
            </View>
          </View>
        </Card>

        {/* Notification Simulators */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Test Real-time Notifications
          </Text>
          <View style={styles.buttonRow}>
            <Button
              title="Simulate Class Reminder"
              onPress={simulateNotification}
              variant="secondary"
              style={styles.testButton}
            />
            <Button
              title="Simulate Achievement"
              onPress={simulateAchievement}
              variant="success"
              style={styles.testButton}
            />
          </View>
        </Card>

        {/* Recent Notifications */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Recent Real-time Notifications
          </Text>
          {notifications.length > 0 ? (
            <View style={styles.notificationList}>
              {notifications.slice(0, 3).map((notification, index) => (
                <View key={index} style={styles.notificationItem}>
                  <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>
                    📱 {notification.title}
                  </Text>
                  <Text style={[styles.notificationMessage, { color: theme.colors.textSecondary }]}>
                    {notification.message}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No recent notifications
            </Text>
          )}
        </Card>

        {/* Real-time Stats */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Real-time Platform Stats
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {onlineUsers.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Online Now
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.success }]}>
                {participants.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                In Live Classes
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.warning }]}>
                {messages.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Chat Messages
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.error }]}>
                {notifications.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Notifications
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

// Main component with notification provider
export default function RealtimeDemo() {
  return (
    <NotificationProvider>
      <RealtimeDashboard />
    </NotificationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    lineHeight: 20,
  },
  userList: {
    gap: 12,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitial: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  userName: {
    flex: 1,
    fontSize: 14,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  participantCount: {
    fontSize: 14,
    marginBottom: 8,
  },
  participantList: {
    gap: 8,
  },
  participantItem: {
    paddingVertical: 4,
  },
  participantName: {
    fontSize: 14,
  },
  chatContainer: {
    height: 200,
  },
  messageList: {
    flex: 1,
    marginBottom: 12,
  },
  messageItem: {
    marginBottom: 8,
  },
  messageAuthor: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageContent: {
    fontSize: 14,
    marginTop: 2,
  },
  messageInput: {
    flexDirection: 'row',
    gap: 8,
  },
  textInput: {
    flex: 1,
  },
  sendButton: {
    paddingHorizontal: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  testButton: {
    flex: 1,
  },
  notificationList: {
    gap: 12,
  },
  notificationItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 12,
    lineHeight: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 8,
  },
});
