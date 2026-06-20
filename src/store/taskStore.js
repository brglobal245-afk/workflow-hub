import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export const mapTaskFromDb = (t) => {
  if (!t) return null;
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    priority: t.priority,
    status: t.status,
    progress: t.progress,
    deadline: t.deadline,
    createdAt: t.created_at,
    creatorId: t.creator_id,
    assigneeId: t.assignee_id,
    teamId: t.team_id,
    departmentId: t.department_id,
    comments: t.comments_count || 0,
    attachments: t.attachments_count || 0,
    notes: t.notes,
    submissionNotes: t.submission_notes,
  };
};

export const mapTaskToDb = (t) => {
  return {
    title: t.title,
    description: t.description,
    priority: t.priority || 'medium',
    status: t.status || 'not_started',
    progress: t.progress || 0,
    deadline: t.deadline,
    creator_id: t.creatorId,
    assignee_id: t.assigneeId,
    team_id: t.teamId,
    department_id: t.departmentId,
    comments_count: t.comments || 0,
    attachments_count: t.attachments || 0,
    notes: t.notes,
    submission_notes: t.submissionNotes,
  };
};

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ tasks: (data || []).map(mapTaskFromDb), loading: false });
    } catch (e) {
      console.error('Error fetching tasks:', e);
      set({ loading: false });
    }
  },

  getTask: (id) => get().tasks.find(t => t.id === id),

  getTasksByAssignee: (userId) =>
    get().tasks.filter(t => t.assigneeId === userId),

  getTasksByDepartment: (deptId) =>
    get().tasks.filter(t => t.departmentId === deptId),

  getTasksByTeam: (teamId) =>
    get().tasks.filter(t => t.teamId === teamId),

  getTasksByStatus: (status) =>
    get().tasks.filter(t => t.status === status),

  createTask: async (task) => {
    set({ loading: true });
    try {
      const dbTask = mapTaskToDb(task);
      const { data, error } = await supabase
        .from('tasks')
        .insert([dbTask])
        .select()
        .single();

      if (error) throw error;
      const newTask = mapTaskFromDb(data);
      set(state => ({ tasks: [newTask, ...state.tasks], loading: false }));
      return newTask;
    } catch (e) {
      console.error('Error creating task:', e);
      set({ loading: false });
      throw e;
    }
  },

  updateTask: async (id, updates) => {
    set({ loading: true });
    try {
      const currentTask = get().getTask(id);
      const dbUpdates = mapTaskToDb({ ...currentTask, ...updates });
      const { data, error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      const updatedTask = mapTaskFromDb(data);
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? updatedTask : t),
        loading: false,
      }));
      return updatedTask;
    } catch (e) {
      console.error('Error updating task:', e);
      set({ loading: false });
      throw e;
    }
  },

  updateTaskStatus: async (id, status) => {
    const progress = status === 'completed' ? 100 : undefined;
    await get().updateTask(id, { status, ...(progress !== undefined ? { progress } : {}) });
  },

  deleteTask: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        tasks: state.tasks.filter(t => t.id !== id),
        loading: false,
      }));
    } catch (e) {
      console.error('Error deleting task:', e);
      set({ loading: false });
      throw e;
    }
  },

  getStats: () => {
    const tasks = get().tasks;
    const todayStr = new Date().toISOString().split('T')[0];
    return {
      total: tasks.length,
      not_started: tasks.filter(t => t.status === 'not_started').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      under_review: tasks.filter(t => t.status === 'under_review').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      rejected: tasks.filter(t => t.status === 'rejected').length,
      critical: tasks.filter(t => t.priority === 'critical').length,
      overdue: tasks.filter(t => t.deadline < todayStr && t.status !== 'completed').length,
    };
  },
}));
