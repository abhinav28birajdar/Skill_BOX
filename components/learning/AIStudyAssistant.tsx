import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIStudyAssistantProps {
  courseId?: string;
  lessonId?: string;
}

export function AIStudyAssistant({ courseId, lessonId }: AIStudyAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI study assistant. I can help you understand concepts, answer questions, and provide explanations. What would you like to learn about?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about "${input}". Let me help you with that...\n\n` +
                 `Here's a detailed explanation:\n` +
                 `1. The concept relates to fundamental principles in the subject\n` +
                 `2. You can apply this by following these steps\n` +
                 `3. Common mistakes to avoid include...\n\n` +
                 `Would you like me to explain any specific part in more detail?`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const quickActions = [
    { id: '1', icon: 'bulb-outline', text: 'Explain concept', action: 'Explain the main concept of this lesson' },
    { id: '2', icon: 'help-circle-outline', text: 'Quiz me', action: 'Create a quiz based on this content' },
    { id: '3', icon: 'book-outline', text: 'Summary', action: 'Provide a summary of key points' },
    { id: '4', icon: 'flash-outline', text: 'Quick tips', action: 'Give me quick study tips' },
  ];

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="p-4 bg-blue-500 dark:bg-blue-600">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="chatbubbles" size={24} color="white" />
            <Text className="ml-2 text-lg font-bold text-white">AI Study Assistant</Text>
          </View>
          <View className="bg-green-400 px-2 py-1 rounded-full">
            <Text className="text-xs text-white font-semibold">Online</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="p-4 bg-gray-50 dark:bg-gray-800">
        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Quick Actions
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              onPress={() => setInput(action.action)}
              className="mr-2 bg-white dark:bg-gray-700 rounded-lg p-3 flex-row items-center border border-gray-200 dark:border-gray-600"
            >
              <Ionicons name={action.icon as any} size={20} color="#3B82F6" />
              <Text className="ml-2 text-sm text-gray-700 dark:text-gray-300">{action.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages */}
      <ScrollView className="flex-1 p-4">
        {messages.map(message => (
          <View
            key={message.id}
            className={`mb-4 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <View
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <Text
                className={`text-sm ${
                  message.role === 'user'
                    ? 'text-white'
                    : 'text-gray-800 dark:text-gray-200'
                }`}
              >
                {message.content}
              </Text>
              <Text
                className={`text-xs mt-1 ${
                  message.role === 'user'
                    ? 'text-blue-100'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString()}
              </Text>
            </View>
          </View>
        ))}
        {isLoading && (
          <View className="items-start mb-4">
            <View className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
              <ActivityIndicator size="small" color="#3B82F6" />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <View className="flex-row items-center">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask me anything..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-3 text-gray-900 dark:text-white"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!input.trim() || isLoading}
            className={`ml-2 w-12 h-12 rounded-full items-center justify-center ${
              input.trim() && !isLoading ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            <Ionicons
              name="send"
              size={20}
              color={input.trim() && !isLoading ? 'white' : '#9CA3AF'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
