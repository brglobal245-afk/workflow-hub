import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import EmployeeDirectory from './features/employees/EmployeeDirectory';
import EmployeeProfile from './features/employees/EmployeeProfile';
import DepartmentsPage from './features/departments/DepartmentsPage';
import TeamsPage from './features/teams/TeamsPage';
import TaskBoard from './features/tasks/TaskBoard';
import TaskDetail from './features/tasks/TaskDetail';
import MessagingPage from './features/messaging/MessagingPage';
import AnnouncementsPage from './features/announcements/AnnouncementsPage';
import AttendancePage from './features/attendance/AttendancePage';
import LeavesPage from './features/leaves/LeavesPage';
import DocumentsPage from './features/documents/DocumentsPage';
import PerformancePage from './features/performance/PerformancePage';
import ReportsPage from './features/reports/ReportsPage';
import LeadershipInboxPage from './features/leadership/LeadershipInboxPage';
import RolesPermissionsPage from './features/settings/RolesPermissionsPage';
import SettingsPage from './features/settings/SettingsPage';
import LandingPage from './features/landing/LandingPage';
import './styles/index.css';
import './styles/components.css';

import { useAuthStore } from './store/authStore';
import { useEmployeeStore } from './store/employeeStore';
import { useTaskStore } from './store/taskStore';
import { useLeaveStore } from './store/leaveStore';
import { useAttendanceStore } from './store/attendanceStore';
import { useMessageStore } from './store/messageStore';
import { useNotificationStore } from './store/notificationStore';
import { useOrgStore } from './store/orgStore';
import { useAnnouncementStore } from './store/announcementStore';
import { useDocumentStore } from './store/documentStore';
import { usePerformanceStore } from './store/performanceStore';

function AppContent() {
  const { initialize, isAuthenticated, loading: authLoading, currentUser } = useAuthStore();
  const { fetchEmployees } = useEmployeeStore();
  const { fetchTasks } = useTaskStore();
  const { fetchLeaves } = useLeaveStore();
  const { fetchAttendance, syncTodayStatus } = useAttendanceStore();
  const { fetchMessages, fetchLeadershipMessages } = useMessageStore();
  const { fetchNotifications } = useNotificationStore();
  const { fetchDepartments, fetchTeams } = useOrgStore();
  const { fetchAnnouncements } = useAnnouncementStore();
  const { fetchDocuments } = useDocumentStore();
  const { fetchGoals } = usePerformanceStore();

  const [dataLoaded, setDataLoaded] = useState(false);

  // 1. Initialize Auth on Mount
  useEffect(() => {
    initialize();
  }, []);

  // 2. Fetch Data when Authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const loadAllData = async () => {
        try {
          await Promise.all([
            fetchEmployees(),
            fetchTasks(),
            fetchLeaves(),
            fetchAttendance(),
            fetchMessages(),
            fetchLeadershipMessages(),
            fetchNotifications(),
            fetchDepartments(),
            fetchTeams(),
            fetchAnnouncements(),
            fetchDocuments(),
            fetchGoals(),
          ]);
          syncTodayStatus(currentUser.id);
          setDataLoaded(true);
        } catch (e) {
          console.error("Failed to load database data:", e);
          setDataLoaded(true); // fall back
        }
      };
      loadAllData();
    } else {
      setDataLoaded(false);
    }
  }, [isAuthenticated, currentUser]);

  if (authLoading || (isAuthenticated && !dataLoaded)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: 'var(--content-bg)',
        gap: '1rem',
        fontFamily: 'var(--font-sans)',
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
          animation: 'pulse 1.8s infinite ease-in-out',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--gray-900)' }}>
          WorkFlow Hub
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <div style={{ width: 12, height: 12, border: '2.5px solid var(--primary-100)', borderTopColor: 'var(--primary-600)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          Loading secure workspace...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/" element={<AppLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="employees" element={<EmployeeDirectory />} />
        <Route path="employees/:id" element={<EmployeeProfile />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="tasks" element={<TaskBoard />} />
        <Route path="tasks/:id" element={<TaskDetail />} />
        <Route path="messages" element={<MessagingPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="leaves" element={<LeavesPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="leadership" element={<LeadershipInboxPage />} />
        <Route path="settings/roles" element={<RolesPermissionsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
