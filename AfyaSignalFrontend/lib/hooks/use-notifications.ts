'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationResponse,
} from '@/lib/api';

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) return;

    try {
      const [notificationData, unreadCountData] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);

      setNotifications(notificationData);
      setUnreadCount(unreadCountData);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refetch();

    const intervalId = window.setInterval(() => {
      void refetch();
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [refetch]);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await markNotificationAsRead(id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      } finally {
        await refetch();
      }
    },
    [refetch]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    } finally {
      await refetch();
    }
  }, [refetch]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch,
  };
}
