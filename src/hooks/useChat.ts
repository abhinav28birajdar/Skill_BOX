import { useEffect, useState } from 'react';
import chatService from '../services/chat';

export const useChat = (userId: string) => {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreads();
  }, [userId]);

  const loadThreads = async () => {
    setLoading(true);
    const data = await chatService.getThreads(userId);
    setThreads(data);
    setLoading(false);
  };

  return {
    threads,
    loading,
    refresh: loadThreads,
  };
};

export const useMessages = (threadId: string, userId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();

    // Subscribe to new messages
    const channel = chatService.subscribeToMessages(threadId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      
      // Mark as read if not sender
      if (newMessage.sender_id !== userId) {
        chatService.markAsRead(threadId, userId);
      }
    });

    return () => {
      chatService.unsubscribeFromMessages(threadId);
    };
  }, [threadId]);

  const loadMessages = async () => {
    setLoading(true);
    const data = await chatService.getMessages(threadId);
    setMessages(data);
    await chatService.markAsRead(threadId, userId);
    setLoading(false);
  };

  const sendMessage = async (body: string) => {
    const newMessage = await chatService.sendMessage(threadId, userId, body);
    if (newMessage) {
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    refresh: loadMessages,
  };
};
