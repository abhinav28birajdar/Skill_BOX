/**
 * AI Tutor Chat Interface
 * Features: Chat with AI tutor, code help, explanations
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  codeBlock?: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    text: "Hello! I'm your AI tutor. How can I help you today?",
    sender: 'ai',
    timestamp: '10:30 AM',
  },
  {
    id: 2,
    text: "Can you explain how React hooks work?",
    sender: 'user',
    timestamp: '10:31 AM',
  },
  {
    id: 3,
    text: "Of course! React Hooks are functions that let you use state and other React features in functional components. The most common hooks are useState for managing state and useEffect for side effects.",
    sender: 'ai',
    timestamp: '10:31 AM',
    codeBlock: `const [count, setCount] = useState(0);\n\nuseEffect(() => {\n  document.title = \`Count: \${count}\`;\n}, [count]);`,
  },
];

const QUICK_ACTIONS = [
  { icon: 'bulb-outline', label: 'Explain Concept', color: '#F59E0B' },
  { icon: 'code-slash-outline', label: 'Debug Code', color: '#8B5CF6' },
  { icon: 'help-circle-outline', label: 'Quiz Me', color: '#3B82F6' },
  { icon: 'checkmark-circle-outline', label: 'Review', color: '#10B981' },
];

export default function AITutorScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setInputText('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: "That's a great question! Let me help you with that...",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>AI Tutor</Text>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            {QUICK_ACTIONS.map((action, index) => (
              <Animated.View key={index} entering={FadeInDown.delay(index * 100)}>
                <TouchableOpacity style={styles.quickActionButton}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Messages */}
          <View style={styles.messagesList}>
            {messages.map((message, index) => (
              <Animated.View
                key={message.id}
                entering={FadeInDown.delay(index * 50)}
                style={[
                  styles.messageWrapper,
                  message.sender === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper,
                ]}
              >
                {message.sender === 'ai' && (
                  <View style={styles.aiAvatar}>
                    <Ionicons name="sparkles" size={16} color="#6366F1" />
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    message.sender === 'user' ? styles.userBubble : styles.aiBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.sender === 'user' ? styles.userText : styles.aiText,
                    ]}
                  >
                    {message.text}
                  </Text>
                  {message.codeBlock && (
                    <View style={styles.codeBlock}>
                      <View style={styles.codeHeader}>
                        <Text style={styles.codeLanguage}>JavaScript</Text>
                        <TouchableOpacity>
                          <Ionicons name="copy-outline" size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.codeText}>{message.codeBlock}</Text>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.timestamp,
                      message.sender === 'user' ? styles.userTimestamp : styles.aiTimestamp,
                    ]}
                  >
                    {message.timestamp}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.sendGradient}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4 },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  onlineText: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  content: { flex: 1 },
  messagesContainer: { flex: 1 },
  quickActions: { flexDirection: 'row', padding: 20, gap: 12 },
  quickActionButton: { flex: 1, alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 12, gap: 6 },
  quickActionLabel: { fontSize: 11, fontWeight: '600', color: '#6B7280', textAlign: 'center' },
  messagesList: { paddingHorizontal: 20, paddingBottom: 20, gap: 16 },
  messageWrapper: { flexDirection: 'row', gap: 8 },
  userMessageWrapper: { justifyContent: 'flex-end' },
  aiMessageWrapper: { justifyContent: 'flex-start' },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  messageBubble: { maxWidth: '75%', padding: 12, borderRadius: 16 },
  userBubble: { backgroundColor: '#6366F1' },
  aiBubble: { backgroundColor: '#fff' },
  messageText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#fff' },
  aiText: { color: '#1F2937' },
  codeBlock: { marginTop: 12, backgroundColor: '#1F2937', borderRadius: 8, padding: 12 },
  codeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  codeLanguage: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  codeText: { fontSize: 13, color: '#E5E7EB', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  timestamp: { fontSize: 11, marginTop: 4 },
  userTimestamp: { color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
  aiTimestamp: { color: '#9CA3AF' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 12 },
  attachButton: { padding: 8 },
  input: { flex: 1, maxHeight: 100, fontSize: 15, color: '#1F2937' },
  sendButton: { borderRadius: 20, overflow: 'hidden' },
  sendGradient: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
});
