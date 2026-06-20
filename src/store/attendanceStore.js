import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

const fmt = (d) => d.toISOString().split('T')[0];
const timeNow = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};

export const mapAttendanceFromDb = (a) => {
  if (!a) return null;
  return {
    id: a.id,
    userId: a.user_id,
    date: a.date,
    checkIn: a.check_in,
    checkOut: a.check_out,
    status: a.status,
    type: a.type,
    breakStart: a.break_start,
    breakEnd: a.break_end,
    breakMinutes: a.break_minutes || 0,
  };
};

export const mapAttendanceToDb = (a) => {
  return {
    user_id: a.userId,
    date: a.date,
    check_in: a.checkIn,
    check_out: a.checkOut,
    status: a.status,
    type: a.type || 'office',
    break_start: a.breakStart,
    break_end: a.breakEnd,
    break_minutes: a.breakMinutes || 0,
  };
};

export const useAttendanceStore = create((set, get) => ({
  records: [],
  todayCheckedIn: false,
  todayCheckedOut: false,
  breakStarted: false,
  loading: false,

  fetchAttendance: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      set({ records: (data || []).map(mapAttendanceFromDb), loading: false });
    } catch (e) {
      console.error('Error fetching attendance:', e);
      set({ loading: false });
    }
  },

  syncTodayStatus: (userId) => {
    const today = fmt(new Date());
    const todayRec = get().records.find(r => r.userId === userId && r.date === today);
    set({
      todayCheckedIn: !!todayRec,
      todayCheckedOut: !!(todayRec && todayRec.checkOut),
      breakStarted: !!(todayRec && todayRec.breakStart && !todayRec.breakEnd),
    });
  },

  getTodayRecord: (userId) => {
    const today = fmt(new Date());
    return get().records.find(r => r.userId === userId && r.date === today);
  },

  getUserRecords: (userId) =>
    get().records.filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date)),

  checkIn: async (userId) => {
    set({ loading: true });
    try {
      const today = fmt(new Date());
      const existing = get().records.find(r => r.userId === userId && r.date === today);
      if (existing) {
        set({ loading: false });
        return;
      }
      const hour = new Date().getHours();
      const status = hour > 9 ? 'late' : 'present';
      const dbRec = mapAttendanceToDb({
        userId,
        date: today,
        checkIn: timeNow(),
        checkOut: null,
        status,
        type: 'office',
      });

      const { data, error } = await supabase
        .from('attendance')
        .insert([dbRec])
        .select()
        .single();

      if (error) throw error;
      const newRecord = mapAttendanceFromDb(data);
      set(state => ({
        records: [newRecord, ...state.records],
        todayCheckedIn: true,
        loading: false,
      }));
    } catch (e) {
      console.error('Error checking in:', e);
      set({ loading: false });
      throw e;
    }
  },

  checkOut: async (userId) => {
    set({ loading: true });
    try {
      const today = fmt(new Date());
      const existing = get().getTodayRecord(userId);
      if (!existing) {
        set({ loading: false });
        return;
      }

      const dbUpdates = {
        check_out: timeNow(),
        break_start: null,
        break_end: null,
      };

      const { data, error } = await supabase
        .from('attendance')
        .update(dbUpdates)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      const updatedRecord = mapAttendanceFromDb(data);
      set(state => ({
        records: state.records.map(r => r.id === existing.id ? updatedRecord : r),
        todayCheckedOut: true,
        breakStarted: false,
        loading: false,
      }));
    } catch (e) {
      console.error('Error checking out:', e);
      set({ loading: false });
      throw e;
    }
  },

  startBreak: async (userId) => {
    const today = fmt(new Date());
    const existing = get().getTodayRecord(userId);
    if (!existing) return;

    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('attendance')
        .update({ break_start: timeNow() })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      const updatedRecord = mapAttendanceFromDb(data);
      set(state => ({
        records: state.records.map(r => r.id === existing.id ? updatedRecord : r),
        breakStarted: true,
        loading: false,
      }));
    } catch (e) {
      console.error('Error starting break:', e);
      set({ loading: false });
    }
  },

  endBreak: async (userId) => {
    const today = fmt(new Date());
    const existing = get().getTodayRecord(userId);
    if (!existing || !existing.breakStart) return;

    set({ loading: true });
    try {
      // Calculate break duration
      const nowStr = timeNow();
      const [startH, startM] = existing.breakStart.split(':').map(Number);
      const [endH, endM] = nowStr.split(':').map(Number);
      const diffMins = (endH * 60 + endM) - (startH * 60 + startM);
      const accumulatedMins = (existing.breakMinutes || 0) + (diffMins > 0 ? diffMins : 0);

      const { data, error } = await supabase
        .from('attendance')
        .update({
          break_start: null,
          break_end: null,
          break_minutes: accumulatedMins,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      const updatedRecord = mapAttendanceFromDb(data);
      set(state => ({
        records: state.records.map(r => r.id === existing.id ? updatedRecord : r),
        breakStarted: false,
        loading: false,
      }));
    } catch (e) {
      console.error('Error ending break:', e);
      set({ loading: false });
    }
  },

  getMonthStats: (userId) => {
    const records = get().getUserRecords(userId);
    return {
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      wfh: records.filter(r => r.type === 'wfh').length,
      halfDay: records.filter(r => r.status === 'half_day').length,
    };
  },
}));
