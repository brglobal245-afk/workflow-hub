import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export const useAnnouncementStore = create((set, get) => ({
  announcements: [],
  loading: false,

  fetchAnnouncements: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      // Map snake_case to camelCase
      const mapped = (data || []).map(a => ({
        id: a.id,
        title: a.title,
        content: a.content,
        type: a.type,
        date: a.date,
        authorId: a.author_id,
        pinned: a.pinned,
        reads: a.reads || 0,
      }));

      set({ announcements: mapped, loading: false });
    } catch (e) {
      console.error('Error fetching announcements:', e);
      set({ loading: false });
    }
  },

  createAnnouncement: async (ann) => {
    set({ loading: true });
    try {
      const dbAnn = {
        title: ann.title,
        content: ann.content,
        type: ann.type || 'general',
        date: ann.date || new Date().toISOString().split('T')[0],
        author_id: ann.authorId,
        pinned: ann.pinned || false,
      };

      const { data, error } = await supabase
        .from('announcements')
        .insert([dbAnn])
        .select()
        .single();

      if (error) throw error;

      const newAnn = {
        id: data.id,
        title: data.title,
        content: data.content,
        type: data.type,
        date: data.date,
        authorId: data.author_id,
        pinned: data.pinned,
        reads: data.reads || 0,
      };

      set(state => ({ announcements: [newAnn, ...state.announcements], loading: false }));
      return newAnn;
    } catch (e) {
      console.error('Error creating announcement:', e);
      set({ loading: false });
      throw e;
    }
  },
}));
