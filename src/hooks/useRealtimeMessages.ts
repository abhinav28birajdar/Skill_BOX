/**
 * Custom hook for real-time messaging
 */

import { useEffect, useState } from 'react';
import realtimeMessagingService from '../services/realtime-messaging';
import type { Message } from '../types/database';

export const useRealtimeMessages = (threadId: string | null | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!threadId) return;

    setIsConnected(true);

    const unsubscribe = realtimeMessagingService.subscribeToThread(
      threadId,
      (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      },
      (err) => {
        setError(err);
        setIsConnected(false);
      }
    );

    return () => {
      unsubscribe();
      setIsConnected(false);
    };
  }, [threadId]);

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isConnected,
    error,
    clearMessages,
  };
};
