// src/contexts/NotificationsContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel;

    const start = async () => {
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
        return;
      }

      // Initial fetch
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data || []);
        setUnreadCount((data || []).filter(n => !n.is_read).length);
      }
      setLoading(false);

      // Realtime: INSERT + UPDATE
      channel = supabase
        .channel('notifications-ui')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          const row = payload.new;
          setNotifications(prev => [row, ...prev]);
          if (!row.is_read) setUnreadCount(c => c + 1);
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          const row = payload.new;
          setNotifications(prev => {
            const next = prev.map(n => n.id === row.id ? { ...n, ...row } : n);
            setUnreadCount(next.filter(n => !n.is_read).length);
            return next;
          });
        })
        .subscribe();
    };

    start();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [user]);

  // Persist a single read
  const markAsRead = async (notificationId) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select('*')
      .single();

    if (error) {
      console.error('Error marking notification as read:', error);
      return;
    }

    setNotifications(prev => {
      const next = prev.map(n => n.id === notificationId ? { ...n, ...data } : n);
      setUnreadCount(next.filter(n => !n.is_read).length);
      return next;
    });
  };

  // Persist all reads
  const markAllAsRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all as read:', error);
      return;
    }

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, loading, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationsProvider');
  return ctx;
};
