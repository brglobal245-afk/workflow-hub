import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export const mapMessageFromDb = (m) => {
  if (!m) return null;
  return {
    id: m.id,
    senderId: m.sender_id,
    receiverId: m.recipient_id,
    content: m.content,
    sentAt: m.created_at,
    readAt: m.is_read ? m.created_at : null, // simulate read time for frontend
    type: m.type || 'text',
    groupId: m.group_id,
  };
};

export const mapLeadershipMessageFromDb = (lm) => {
  if (!lm) return null;
  return {
    id: lm.id,
    senderId: lm.sender_id,
    recipientId: lm.recipient_id,
    subject: lm.subject,
    content: lm.content,
    type: lm.type,
    priority: lm.priority,
    sentAt: lm.sent_at,
    status: lm.status,
    response: lm.response,
  };
};

export const useMessageStore = create((set, get) => ({
  messages: [],
  leadershipMessages: [],
  loading: false,

  fetchMessages: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ messages: (data || []).map(mapMessageFromDb), loading: false });
    } catch (e) {
      console.error('Error fetching messages:', e);
      set({ loading: false });
    }
  },

  fetchLeadershipMessages: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('leadership_messages')
        .select('*')
        .order('sent_at', { ascending: false });

      if (error) throw error;
      set({ leadershipMessages: (data || []).map(mapLeadershipMessageFromDb), loading: false });
    } catch (e) {
      console.error('Error fetching leadership messages:', e);
      set({ loading: false });
    }
  },

  getConversation: (userId1, userId2) =>
    get().messages.filter(
      m => (m.senderId === userId1 && m.receiverId === userId2) ||
           (m.senderId === userId2 && m.receiverId === userId1)
    ).sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt)),

  getConversationList: (userId) => {
    const msgs = get().messages;
    const partnerIds = new Set();
    msgs.forEach(m => {
      if (m.senderId === userId) partnerIds.add(m.receiverId);
      if (m.receiverId === userId) partnerIds.add(m.senderId);
    });
    return Array.from(partnerIds).map(partnerId => {
      const convoMsgs = get().getConversation(userId, partnerId)
        .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
      const lastMsg = convoMsgs[0];
      const unread = convoMsgs.filter(m => m.receiverId === userId && !m.readAt).length;
      return { partnerId, lastMessage: lastMsg, unreadCount: unread };
    }).sort((a, b) => new Date(b.lastMessage?.sentAt) - new Date(a.lastMessage?.sentAt));
  },

  sendMessage: async (senderId, receiverId, content) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: senderId,
          recipient_id: receiverId,
          content: content,
          is_read: false,
        }])
        .select()
        .single();

      if (error) throw error;
      const newMsg = mapMessageFromDb(data);
      set(state => ({ messages: [...state.messages, newMsg], loading: false }));
      return newMsg;
    } catch (e) {
      console.error('Error sending message:', e);
      set({ loading: false });
      throw e;
    }
  },

  markAsRead: async (senderId, receiverId) => {
    try {
      // Find unread messages from receiverId to senderId
      const unreadIds = get().messages
        .filter(m => m.senderId === senderId && m.receiverId === receiverId && !m.readAt)
        .map(m => m.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .in('id', unreadIds);

      if (error) throw error;

      set(state => ({
        messages: state.messages.map(m =>
          m.senderId === senderId && m.receiverId === receiverId && !m.readAt
            ? { ...m, readAt: new Date().toISOString() }
            : m
        ),
      }));
    } catch (e) {
      console.error('Error marking messages as read:', e);
    }
  },

  sendLeadershipMessage: async (senderId, recipientId, subject, content, type, priority) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('leadership_messages')
        .insert([{
          sender_id: senderId,
          recipient_id: recipientId,
          subject,
          content,
          type,
          priority,
          status: 'unread',
        }])
        .select()
        .single();

      if (error) throw error;
      const newMsg = mapLeadershipMessageFromDb(data);
      set(state => ({ leadershipMessages: [newMsg, ...state.leadershipMessages], loading: false }));
      return newMsg;
    } catch (e) {
      console.error('Error sending leadership message:', e);
      set({ loading: false });
      throw e;
    }
  },

  respondToLeadershipMessage: async (id, response) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('leadership_messages')
        .update({ response, status: 'responded' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      const updatedMsg = mapLeadershipMessageFromDb(data);
      set(state => ({
        leadershipMessages: state.leadershipMessages.map(m => m.id === id ? updatedMsg : m),
        loading: false,
      }));
    } catch (e) {
      console.error('Error responding to leadership message:', e);
      set({ loading: false });
      throw e;
    }
  },

  getUnreadCount: (userId) =>
    get().messages.filter(m => m.receiverId === userId && !m.readAt).length,
}));
