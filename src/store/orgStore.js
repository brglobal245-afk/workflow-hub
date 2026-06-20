import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export const useOrgStore = create((set, get) => ({
  departments: [],
  teams: [],
  loading: false,

  fetchDepartments: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      set({ departments: data || [], loading: false });
    } catch (e) {
      console.error('Error fetching departments:', e);
      set({ loading: false });
    }
  },

  fetchTeams: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      set({ teams: data || [], loading: false });
    } catch (e) {
      console.error('Error fetching teams:', e);
      set({ loading: false });
    }
  },

  createDepartment: async (dept) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert([{
          id: dept.id || `d${Date.now()}`,
          name: dept.name,
          emoji: dept.emoji,
          color: dept.color,
          description: dept.description,
          budget: dept.budget,
        }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ departments: [...state.departments, data], loading: false }));
      return data;
    } catch (e) {
      console.error('Error creating department:', e);
      set({ loading: false });
      throw e;
    }
  },

  createTeam: async (team) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{
          id: team.id || `t${Date.now()}`,
          department_id: team.departmentId,
          name: team.name,
          color: team.color,
          description: team.description,
        }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ teams: [...state.teams, data], loading: false }));
      return data;
    } catch (e) {
      console.error('Error creating team:', e);
      set({ loading: false });
      throw e;
    }
  },
}));
