// src/contexts/NotificationsContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Hold the current Realtime channel so we can clean it up between mounts/users
  const channelRef = useRef(null);

  useEffect(() => {
    let disposed = false;

    const setup = async () => {
      // Clean up any previous channel first (prevents multi-subscribe)
      if (channelRef.current) {
        try {
          await supabase.removeChannel(channelRef.current);
        } catch (e) {
          console.warn('removeChannel failed (ignored):', e);
        }
        channelRef.current = null;
      }

      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
        return;
      }

      // Initial load
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (disposed) return;

      if (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
        setUnreadCount(0);
      } else {
        setNotifications(data || []);
        setUnreadCount((data || []).filter(n => !n.is_read).length);
      }
      setLoading(false);

      // ----- Realtime -----
      const channelName = `notifications:${user.id}`; // unique per user/session

      // Reuse an existing channel with the same topic if it exists
      const existing =
        typeof supabase.getChannels === 'function'
          ? supabase.getChannels().find((c) => c.topic === channelName)
          : null;

      const channel = existing || supabase.channel(channelName);

      // Attach handlers (attaching more than once is fine; we destroy the channel on cleanup)
      channel
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
            const next = prev.map(n => (n.id === row.id ? { ...n, ...row } : n));
            setUnreadCount(next.filter(n => !n.is_read).length);
            return next;
          });
        });

      // Subscribe only if not already joining/joined
      if (!['joining', 'joined'].includes(channel.state)) {
        channel.subscribe((status, err) => {
          if (err) console.error('Realtime subscribe error:', err);
        });
      }

      channelRef.current = channel;
    };

    setup();

    return () => {
      disposed = true;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]);

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
      const next = prev.map(n => (n.id === notificationId ? { ...n, ...data } : n));
      setUnreadCount(next.filter(n => !n.is_read).length);
      return next;
    });
  };

  // Persist mark-all-read
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
