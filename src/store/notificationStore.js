import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export const mapNotificationFromDb = (n) => {
  if (!n) return null;
  return {
    id: n.id,
    userId: n.user_id,
    type: n.type,
    title: n.title,
    message: n.message,
    read: n.read,
    createdAt: n.created_at,
    link: n.type === 'task' ? '/tasks' : n.type === 'leave' ? '/leaves' : n.type === 'message' ? '/messages' : '/announcements', // default route mapping
  };
};

export const mapNotificationToDb = (n) => {
  return {
    user_id: n.userId,
    type: n.type,
    title: n.title,
    message: n.message,
    read: n.read || false,
  };
};

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ notifications: (data || []).map(mapNotificationFromDb), loading: false });
    } catch (e) {
      console.error('Error fetching notifications:', e);
      set({ loading: false });
    }
  },

  getForUser: (userId) =>
    get().notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),

  getUnreadCount: (userId) =>
    get().notifications.filter(n => n.userId === userId && !n.read).length,

  markRead: async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  },

  markAllRead: async (userId) => {
    try {
      const unreadIds = get().notifications
        .filter(n => n.userId === userId && !n.read)
        .map(n => n.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds);

      if (error) throw error;

      set(state => ({
        notifications: state.notifications.map(n =>
          n.userId === userId ? { ...n, read: true } : n
        ),
      }));
    } catch (e) {
      console.error('Error marking all notifications as read:', e);
    }
  },

  addNotification: async (notification) => {
    try {
      const dbNotif = mapNotificationToDb(notification);
      const { data, error } = await supabase
        .from('notifications')
        .insert([dbNotif])
        .select()
        .single();

      if (error) throw error;
      const newN = mapNotificationFromDb(data);
      set(state => ({ notifications: [newN, ...state.notifications] }));
    } catch (e) {
      console.error('Error adding notification:', e);
    }
  },
}));
