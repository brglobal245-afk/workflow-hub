import { create } from 'zustand';
import { supabase, createTempClient } from '../lib/supabaseClient';

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
  const dbObj = {};
  if (e.firstName !== undefined) dbObj.first_name = e.firstName;
  if (e.lastName !== undefined) dbObj.last_name = e.lastName;
  if (e.email !== undefined) dbObj.email = e.email;
  // Always provide or generate employee_id to satisfy not-null constraint on insert
  dbObj.employee_id = e.employeeId || ('ACM-' + Math.floor(Math.random() * 9000 + 1000));
  if (e.phone !== undefined) dbObj.phone = e.phone;
  if (e.departmentId !== undefined) dbObj.department_id = e.departmentId;
  if (e.teamId !== undefined) dbObj.team_id = e.teamId;
  if (e.managerId !== undefined) dbObj.manager_id = e.managerId;
  if (e.roleId !== undefined) dbObj.role_id = e.roleId;
  if (e.joiningDate !== undefined) dbObj.joining_date = e.joiningDate;
  if (e.employmentType !== undefined) dbObj.type = e.employmentType;
  if (e.status !== undefined) dbObj.status = e.status;
  if (e.avatarColor !== undefined) dbObj.avatar_url = e.avatarColor;
  if (e.bio !== undefined) dbObj.bio = e.bio;
  if (e.skills !== undefined) dbObj.skills = e.skills;
  if (e.position !== undefined) dbObj.position = e.position;
  if (e.location !== undefined) dbObj.location = e.location;
  return dbObj;
};

const generateRandomPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let pass = '';
  for (let i = 0; i < 12; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
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
      const tempSupabase = createTempClient();
      const randomPassword = generateRandomPassword();
      const { data: signUpData, error: signUpError } = await tempSupabase.auth.signUp({
        email: employee.email,
        password: randomPassword,
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

      // Send password setup link to their email immediately
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(employee.email, {
        redirectTo: window.location.origin + window.location.pathname + '#/login'
      });
      if (resetError) {
        console.warn('Could not send password reset email automatically:', resetError);
      }

      const empData = {
        ...mapEmployeeToDb(employee),
        id: newUserId,
      };

      const { data, error } = await supabase
        .from('employees')
        .upsert([empData])
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
