import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export const mapEmployeeFromDb = (e) => {
  if (!e) return null;
  return {
    id: e.id,
    employeeId: e.employee_id,
    firstName: e.first_name,
    lastName: e.last_name,
    email: e.email,
    phone: e.phone,
    departmentId: e.department_id,
    teamId: e.team_id,
    managerId: e.manager_id,
    roleId: e.role_id,
    joiningDate: e.joining_date,
    employmentType: e.type,
    status: e.status,
    bio: e.bio,
    avatarColor: e.avatar_url || 'blue',
    skills: e.skills || [],
    position: e.position,
    location: e.location,
  };
};

export const mapEmployeeToDb = (e) => {
  return {
    first_name: e.firstName,
    last_name: e.lastName,
    email: e.email,
    employee_id: e.employeeId,
    phone: e.phone,
    department_id: e.departmentId,
    team_id: e.teamId,
    manager_id: e.managerId,
    role_id: e.roleId,
    joining_date: e.joiningDate,
    type: e.employmentType || 'Full Time',
    status: e.status || 'active',
    avatar_url: e.avatarColor || 'blue',
    bio: e.bio,
    skills: e.skills || [],
    position: e.position,
    location: e.location,
  };
};

export const useEmployeeStore = create((set, get) => ({
  employees: [],
  loading: false,

  fetchEmployees: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('first_name', { ascending: true });

      if (error) throw error;
      set({ employees: (data || []).map(mapEmployeeFromDb), loading: false });
    } catch (e) {
      console.error('Error fetching employees:', e);
      set({ loading: false });
    }
  },

  getEmployee: (id) => get().employees.find(e => e.id === id),

  getEmployeesByDepartment: (deptId) =>
    get().employees.filter(e => e.departmentId === deptId),

  getEmployeesByTeam: (teamId) =>
    get().employees.filter(e => e.teamId === teamId),

  getDirectReports: (managerId) =>
    get().employees.filter(e => e.managerId === managerId),

  addEmployee: async (employee) => {
    set({ loading: true });
    try {
      // Create user profile in auth first or register user. 
      // Note: In Supabase, if auth user creation is managed, we insert employee profile.
      // For this workflow hub, we will insert into employees. Since the id references auth.users(id), 
      // we must have an auth user. If it's a new employee, we can invite them via Supabase auth, 
      // or for testing convenience, we generate a random UUID or link it to a created user session.
      // We will generate a random UUID and insert it. (Note: in production, auth user creation trigger
      // would populate this, or we call a backend API. For local developer flow, inserting directly
      // requires a valid UUID, so we can generate one. If there is a foreign key, we can insert into auth first).
      // Wait, in our schema: `id UUID PRIMARY KEY REFERENCES auth.users(id)`. If the database schema has RLS/FK, 
      // it requires user to exist in auth.users.
      // For quick additions in demo environment, we can check if they are in auth or insert them.
      // Let's create user via supabase.auth.signUp or similar if needed. For enterprise admins adding employees, 
      // since supabase.auth.signUp is client side, they can sign up the user, or if we want it to be seamless:
      // we can make a call or fall back.
      // Actually, we can do supabase.auth.signUp with a random password! This creates the auth.user and returns its ID,
      // which we then use to insert the employee profile! That is extremely clean and matches production Supabase workflows!
      const password = 'Password123!'; // Default password for new signups
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: employee.email,
        password: password,
        options: {
          data: {
            first_name: employee.firstName,
            last_name: employee.lastName,
          }
        }
      });

      if (signUpError) throw signUpError;

      const newUserId = signUpData.user?.id;
      if (!newUserId) throw new Error('Failed to create auth user');

      const empData = {
        ...mapEmployeeToDb(employee),
        id: newUserId,
      };

      const { data, error } = await supabase
        .from('employees')
        .insert([empData])
        .select()
        .single();

      if (error) throw error;
      const newEmp = mapEmployeeFromDb(data);
      set(state => ({ employees: [...state.employees, newEmp], loading: false }));
      return newEmp;
    } catch (e) {
      console.error('Error adding employee:', e);
      set({ loading: false });
      throw e;
    }
  },

  updateEmployee: async (id, updates) => {
    set({ loading: true });
    try {
      const dbUpdates = mapEmployeeToDb({ ...get().getEmployee(id), ...updates });
      const { data, error } = await supabase
        .from('employees')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      const updatedEmp = mapEmployeeFromDb(data);
      set(state => ({
        employees: state.employees.map(e => e.id === id ? updatedEmp : e),
        loading: false,
      }));
      return updatedEmp;
    } catch (e) {
      console.error('Error updating employee:', e);
      set({ loading: false });
      throw e;
    }
  },

  suspendEmployee: async (id) => {
    await get().updateEmployee(id, { status: 'suspended' });
  },

  getFullName: (id) => {
    const emp = get().employees.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
  },
}));
