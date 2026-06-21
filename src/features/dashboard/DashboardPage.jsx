import React from 'react';
import { useAuthStore } from '../../store/authStore';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import { PERMISSIONS } from '../../constants/permissions';

export default function DashboardPage() {
  const { hasPermission, getAuthorityLevel } = useAuthStore();
  const level = getAuthorityLevel();

  if (hasPermission('create_user') || level >= 90) return <AdminDashboard />;
  if (level >= 60) return <ManagerDashboard />;
  return <EmployeeDashboard />;
}
