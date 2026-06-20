import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export const useDocumentStore = create((set, get) => ({
  documents: [],
  loading: false,

  fetchDocuments: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      // Map snake_case columns
      const mapped = (data || []).map(d => ({
        id: d.id,
        title: d.title,
        category: d.category,
        type: d.type,
        size: d.size,
        uploadedBy: d.uploaded_by,
        uploadedAt: d.uploaded_at,
        url: d.url,
        accessLevel: d.access_level,
        format: d.type, // UI uses format as well
      }));

      set({ documents: mapped, loading: false });
    } catch (e) {
      console.error('Error fetching documents:', e);
      set({ loading: false });
    }
  },

  uploadDocument: async (doc) => {
    set({ loading: true });
    try {
      const dbDoc = {
        title: doc.title,
        category: doc.category || 'policy',
        type: doc.type || 'pdf',
        size: doc.size || '1.2 MB',
        uploaded_by: doc.uploadedBy,
        access_level: doc.accessLevel || 'all',
        url: doc.url || '#',
      };

      const { data, error } = await supabase
        .from('documents')
        .insert([dbDoc])
        .select()
        .single();

      if (error) throw error;

      const newDoc = {
        id: data.id,
        title: data.title,
        category: data.category,
        type: data.type,
        size: data.size,
        uploadedBy: data.uploaded_by,
        uploadedAt: data.uploaded_at,
        url: data.url,
        accessLevel: data.access_level,
        format: data.type,
      };

      set(state => ({ documents: [newDoc, ...state.documents], loading: false }));
      return newDoc;
    } catch (e) {
      console.error('Error uploading document:', e);
      set({ loading: false });
      throw e;
    }
  },
}));
