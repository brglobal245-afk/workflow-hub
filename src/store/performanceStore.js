import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export const usePerformanceStore = create((set, get) => ({
  goals: [],
  loading: false,

  fetchGoals: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('performance_goals')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;

      // Map columns
      const mapped = (data || []).map(g => ({
        id: g.id,
        userId: g.user_id,
        title: g.title,
        kpi: g.kpi,
        target: g.target,
        current: g.current,
        dueDate: g.due_date,
        status: g.status,
      }));

      set({ goals: mapped, loading: false });
    } catch (e) {
      console.error('Error fetching performance goals:', e);
      set({ loading: false });
    }
  },

  addGoal: async (goal) => {
    set({ loading: true });
    try {
      const dbGoal = {
        user_id: goal.userId,
        title: goal.title,
        kpi: goal.kpi,
        target: goal.target || 100,
        current: goal.current || 0,
        due_date: goal.dueDate,
        status: goal.status || 'on_track',
      };

      const { data, error } = await supabase
        .from('performance_goals')
        .insert([dbGoal])
        .select()
        .single();

      if (error) throw error;

      const newGoal = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        kpi: data.kpi,
        target: data.target,
        current: data.current,
        dueDate: data.due_date,
        status: data.status,
      };

      set(state => ({ goals: [...state.goals, newGoal], loading: false }));
      return newGoal;
    } catch (e) {
      console.error('Error adding performance goal:', e);
      set({ loading: false });
      throw e;
    }
  },

  updateGoalProgress: async (id, current, status) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('performance_goals')
        .update({ current, status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updated = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        kpi: data.kpi,
        target: data.target,
        current: data.current,
        dueDate: data.due_date,
        status: data.status,
      };

      set(state => ({
        goals: state.goals.map(g => g.id === id ? updated : g),
        loading: false,
      }));
    } catch (e) {
      console.error('Error updating goal progress:', e);
      set({ loading: false });
    }
  },
}));
