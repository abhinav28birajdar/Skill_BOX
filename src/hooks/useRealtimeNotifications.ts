/**
 * Custom hook for real-time notifications
 */

import { useEffect, useState } from 'react';
import realtimeNotificationsService from '../services/realtime-notifications';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: string;
}

export const useRealtimeNotifications = (userId: string | null | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    setIsConnected(true);

    const unsubscribe = realtimeNotificationsService.subscribeToNotifications(
      userId,
      (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
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
  }, [userId]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  return {
    notifications,
    isConnected,
    error,
    clearNotifications,
    removeNotification,
  };
};
