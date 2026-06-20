import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export const mapLeaveFromDb = (l) => {
  if (!l) return null;
  const start = new Date(l.start_date);
  const end = new Date(l.end_date);
  const diffTime = Math.abs(end - start);
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return {
    id: l.id,
    userId: l.user_id,
    type: l.type,
    startDate: l.start_date,
    endDate: l.end_date,
    days: isNaN(days) ? 1 : days,
    reason: l.reason,
    status: l.status,
    appliedAt: l.applied_date,
    rejectionReason: l.rejection_reason,
    approverId: l.approver_id,
  };
};

export const mapLeaveToDb = (l) => {
  return {
    user_id: l.userId,
    type: l.type,
    start_date: l.startDate,
    end_date: l.endDate,
    reason: l.reason,
    status: l.status || 'pending',
    applied_date: l.appliedAt || new Date().toISOString().split('T')[0],
    rejection_reason: l.rejectionReason,
    approver_id: l.approverId,
  };
};

export const useLeaveStore = create((set, get) => ({
  requests: [],
  loading: false,

  fetchLeaves: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('leaves')
        .select('*')
        .order('applied_date', { ascending: false });

      if (error) throw error;
      set({ requests: (data || []).map(mapLeaveFromDb), loading: false });
    } catch (e) {
      console.error('Error fetching leaves:', e);
      set({ loading: false });
    }
  },

  getUserRequests: (userId) =>
    get().requests.filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)),

  getPendingRequests: () =>
    get().requests.filter(r => r.status === 'pending'),

  applyLeave: async (request) => {
    set({ loading: true });
    try {
      const dbReq = mapLeaveToDb({
        ...request,
        status: 'pending',
        appliedAt: new Date().toISOString().split('T')[0],
      });
      const { data, error } = await supabase
        .from('leaves')
        .insert([dbReq])
        .select()
        .single();

      if (error) throw error;
      const newReq = mapLeaveFromDb(data);
      set(state => ({ requests: [newReq, ...state.requests], loading: false }));
      return newReq;
    } catch (e) {
      console.error('Error applying leave:', e);
      set({ loading: false });
      throw e;
    }
  },

  approveLeave: async (id, approverId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('leaves')
        .update({ status: 'approved', approver_id: approverId })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      const updatedReq = mapLeaveFromDb(data);
      set(state => ({
        requests: state.requests.map(r => r.id === id ? updatedReq : r),
        loading: false,
      }));
    } catch (e) {
      console.error('Error approving leave:', e);
      set({ loading: false });
      throw e;
    }
  },

  rejectLeave: async (id, approverId, reason) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('leaves')
        .update({ status: 'rejected', approver_id: approverId, rejection_reason: reason })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      const updatedReq = mapLeaveFromDb(data);
      set(state => ({
        requests: state.requests.map(r => r.id === id ? updatedReq : r),
        loading: false,
      }));
    } catch (e) {
      console.error('Error rejecting leave:', e);
      set({ loading: false });
      throw e;
    }
  },

  cancelLeave: async (id) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('leaves')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      const updatedReq = mapLeaveFromDb(data);
      set(state => ({
        requests: state.requests.map(r => r.id === id ? updatedReq : r),
        loading: false,
      }));
    } catch (e) {
      console.error('Error cancelling leave:', e);
      set({ loading: false });
      throw e;
    }
  },
}));
