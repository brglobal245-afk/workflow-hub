import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  effectivePermissions: new Set(),
  roles: [],
  loading: true,

  initialize: async () => {
    // 1. Fetch static or database roles
    const { data: rolesData, error: rolesError } = await supabase.from('roles').select('*');
    if (rolesData) {
      set({ roles: rolesData });
    }

    // 2. Fetch current session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await get().fetchUserProfile(session.user.id);
    } else {
      set({ currentUser: null, isAuthenticated: false, loading: false });
    }

    // 3. Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await get().fetchUserProfile(session.user.id);
      } else {
        set({ currentUser: null, isAuthenticated: false, effectivePermissions: new Set(), loading: false });
      }
    });
  },

  fetchUserProfile: async (userId) => {
    try {
      const { data: employee, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !employee) {
        set({ currentUser: null, isAuthenticated: false, effectivePermissions: new Set(), loading: false });
        return;
      }

      // Compute permissions based on roles
      const roles = get().roles;
      const userRole = roles.find(r => r.id === employee.role_id);
      const permissions = userRole ? new Set(userRole.permissions) : new Set();

      // Convert snake_case from DB to camelCase for UI compatibility
      const camelCaseEmployee = {
        id: employee.id,
        employeeId: employee.employee_id,
        firstName: employee.first_name,
        lastName: employee.last_name,
        email: employee.email,
        phone: employee.phone,
        departmentId: employee.department_id,
        teamId: employee.team_id,
        managerId: employee.manager_id,
        roleId: employee.role_id,
        joiningDate: employee.joining_date,
        employmentType: employee.type,
        status: employee.status,
        avatarColor: employee.avatar_url || 'blue',
        bio: employee.bio,
        skills: employee.skills || [],
        position: employee.position,
        location: employee.location,
      };

      set({
        currentUser: camelCaseEmployee,
        isAuthenticated: true,
        effectivePermissions: permissions,
        loading: false,
      });
    } catch (e) {
      console.error('Error fetching user profile:', e);
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      set({ loading: false });
      throw error;
    }
    await get().fetchUserProfile(data.user.id);
    return data;
  },

  register: async (email, password, firstName, lastName) => {
    set({ loading: true });
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      if (authError) throw authError;
      if (!data?.user) throw new Error('User creation failed.');

      // If the email confirmation is turned off, the session is active immediately
      if (data.session) {
        await get().fetchUserProfile(data.user.id);
      } else {
        // If confirmation is active, they will receive an email verification link
        toast.success('Registration successful! Please check your email for confirmation.');
      }
      return data;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  switchRole: async (email) => {
    set({ loading: true });
    await supabase.auth.signOut();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: 'Password123!',
    });
    if (error) {
      set({ loading: false });
      throw error;
    }
    await get().fetchUserProfile(data.user.id);
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ currentUser: null, isAuthenticated: false, effectivePermissions: new Set() });
  },

  hasPermission: (permission) => {
    const { effectivePermissions } = get();
    return effectivePermissions.has(permission);
  },

  hasAnyPermission: (permissions) => {
    const { effectivePermissions } = get();
    return permissions.some(p => effectivePermissions.has(p));
  },

  getCurrentRole: () => {
    const { currentUser, roles } = get();
    if (!currentUser) return null;
    return roles.find(r => r.id === currentUser.roleId);
  },

  getAuthorityLevel: () => {
    const { currentUser, roles } = get();
    if (!currentUser) return 0;
    const role = roles.find(r => r.id === currentUser.roleId);
    return role ? role.authority_level : 0;
  },
}));
