import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { useAuthStore } from '../../store/authStore';
import { Toaster } from 'react-hot-toast';

export default function AppLayout() {
  const { isAuthenticated } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
        onClose={() => {}}
      />
      <main className={`app-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <TopNav onMenuToggle={() => setCollapsed(v => !v)} />
        <div className="app-content">
          <Outlet />
        </div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'var(--font-sans)', fontSize: '0.875rem', borderRadius: '10px' },
          success: { iconTheme: { primary: 'var(--success-600)', secondary: '#fff' } },
          error: { iconTheme: { primary: 'var(--danger-600)', secondary: '#fff' } },
        }}
      />
    </div>
  );
}
