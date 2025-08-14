import { useAI } from '@/context/AIModelContext';
import { useTheme } from '@/context/ThemeContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'concept' | 'quiz';
  metadata?: any;
}

interface AITutorChatProps {
  contentContext?: string;
  onClose?: () => void;
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

export function AITutorChat({
  contentContext,
  onClose,
  minimized = false,
  onToggleMinimize,
}: AITutorChatProps) {
  const { theme } = useTheme();
  const { isAIEnabled, generateContent, analyzeEngagement } = useAI();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const animatedHeight = useRef(new Animated.Value(minimized ? 60 : 400)).current;

  useEffect(() => {
    if (isAIEnabled && contentContext) {
      initializeChat();
    }
  }, [isAIEnabled, contentContext]);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: minimized ? 60 : 400,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [minimized]);

  const initializeChat = useCallback(async () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `Hi! I'm your AI tutor. I'm here to help you understand ${contentContext || 'this topic'} better. Feel free to ask me any questions!`,
      isUser: false,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages([welcomeMessage]);
    
    // Generate contextual suggestions
    setSuggestions([
      'Explain this concept simply',
      'Give me an example',
      'What should I learn next?',
      'Test my understanding',
    ]);
  }, [contentContext]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !isAIEnabled) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aiResponse = await generateContent(
        `User question: "${text}" in context of: ${contentContext}`,
        'text'
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update suggestions based on conversation context
      updateSuggestions(text);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble processing that right now. Could you try rephrasing your question?",
        isUser: false,
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [isAIEnabled, contentContext, generateContent]);

  const updateSuggestions = (lastMessage: string) => {
    const lowerMessage = lastMessage.toLowerCase();
    
    if (lowerMessage.includes('explain') || lowerMessage.includes('what')) {
      setSuggestions([
        'Can you give me an example?',
        'How is this used in practice?',
        'What are the key points?',
        'Quiz me on this',
      ]);
    } else if (lowerMessage.includes('example')) {
      setSuggestions([
        'Show me more examples',
        'How would I apply this?',
        'What are common mistakes?',
        'Test my understanding',
      ]);
    } else {
      setSuggestions([
        'Explain this differently',
        'Give me practice problems',
        'What should I learn next?',
        'Summarize key points',
      ]);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage,
    ]}>
      <View style={[
        styles.messageBubble,
        {
          backgroundColor: item.isUser ? theme.colors.primary : theme.colors.surface,
          borderColor: theme.colors.border,
        }
      ]}>
        <Text style={[
          styles.messageText,
          { color: item.isUser ? '#FFFFFF' : theme.colors.text }
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timestamp,
          { color: item.isUser ? 'rgba(255,255,255,0.7)' : theme.colors.textTertiary }
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  const renderSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.suggestionChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => handleSuggestionPress(item)}
    >
      <Text style={[styles.suggestionText, { color: theme.colors.textSecondary }]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  if (!isAIEnabled) {
    return (
      <View style={[styles.disabledContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.disabledText, { color: theme.colors.textSecondary }]}>
          AI Tutor is disabled. Enable AI features in settings to use this feature.
        </Text>
      </View>
    );
  }

  return (
    <Animated.View style={[
      styles.container,
      {
        height: animatedHeight,
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border,
      }
    ]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.aiIndicator, { backgroundColor: theme.colors.success }]} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>AI Tutor</Text>
        </View>
        <View style={styles.headerRight}>
          {onToggleMinimize && (
            <TouchableOpacity onPress={onToggleMinimize} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>{minimized ? '▲' : '▼'}</Text>
            </TouchableOpacity>
          )}
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!minimized && (
        <>
          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            showsVerticalScrollIndicator={false}
          />

          {/* Typing Indicator */}
          {isTyping && (
            <View style={[styles.typingContainer, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.typingDots}>
                <View style={[styles.typingDot, { backgroundColor: theme.colors.textTertiary }]} />
                <View style={[styles.typingDot, { backgroundColor: theme.colors.textTertiary }]} />
                <View style={[styles.typingDot, { backgroundColor: theme.colors.textTertiary }]} />
              </View>
              <Text style={[styles.typingText, { color: theme.colors.textSecondary }]}>
                AI is thinking...
              </Text>
            </View>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                horizontal
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={renderSuggestion}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionsContent}
              />
            </View>
          )}

          {/* Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}
          >
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                }
              ]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              maxLength={500}
              onSubmitEditing={() => sendMessage(inputText)}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: inputText.trim() ? theme.colors.primary : theme.colors.border,
                }
              ]}
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  disabledText: {
    textAlign: 'center',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 4,
    marginLeft: 8,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#666',
  },
  messagesList: {
    flex: 1,
    maxHeight: 200,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  typingDots: {
    flexDirection: 'row',
    marginRight: 8,
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  suggestionsContent: {
    padding: 12,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 80,
    fontSize: 14,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
