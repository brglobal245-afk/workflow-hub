import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, Users2, CheckSquare,
  MessageSquare, Megaphone, Clock, Calendar, FileText,
  BarChart3, Settings, ChevronLeft, ChevronRight,
  Briefcase, Shield, Star, Send, LogOut, X
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { PERMISSIONS } from '../../constants/permissions';
import Avatar from '../common/Avatar';

const NAV_ITEMS = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', permission: null },
    ],
  },
  {
    section: 'People',
    items: [
      { label: 'Employees', icon: Users, path: '/employees', permission: PERMISSIONS.VIEW_ALL_USERS },
      { label: 'Departments', icon: Building2, path: '/departments', permission: PERMISSIONS.VIEW_DEPARTMENT },
      { label: 'Teams', icon: Users2, path: '/teams', permission: PERMISSIONS.VIEW_DEPARTMENT },
    ],
  },
  {
    section: 'Work',
    items: [
      { label: 'Tasks', icon: CheckSquare, path: '/tasks', permission: null, badgeKey: 'tasks' },
      { label: 'Messages', icon: MessageSquare, path: '/messages', permission: PERMISSIONS.SEND_MESSAGES, badgeKey: 'messages' },
      { label: 'Announcements', icon: Megaphone, path: '/announcements', permission: null },
    ],
  },
  {
    section: 'HR',
    items: [
      { label: 'Attendance', icon: Clock, path: '/attendance', permission: null },
      { label: 'Leaves', icon: Calendar, path: '/leaves', permission: null, badgeKey: 'leaves' },
      { label: 'Documents', icon: FileText, path: '/documents', permission: null },
    ],
  },
  {
    section: 'Insights',
    items: [
      { label: 'Performance', icon: Star, path: '/performance', permission: null },
      { label: 'Reports', icon: BarChart3, path: '/reports', permission: PERMISSIONS.VIEW_REPORTS },
    ],
  },
  {
    section: 'Admin',
    items: [
      { label: 'Leadership Inbox', icon: Send, path: '/leadership', permission: null },
      { label: 'Roles & Permissions', icon: Shield, path: '/settings/roles', permission: PERMISSIONS.CREATE_ROLE },
      { label: 'Settings', icon: Settings, path: '/settings', permission: PERMISSIONS.MANAGE_ORG },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle, onClose }) {
  const { currentUser, hasPermission, logout } = useAuthStore();
  const { getUnreadCount } = useNotificationStore();
  const unread = getUnreadCount(currentUser?.id);

  const isItemVisible = (item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  };

  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Briefcase size={18} color="#fff" strokeWidth={2.5} />
        </div>
        <span className="sidebar-logo-text">WorkFlow Hub</span>
        <button
          onClick={onToggle}
          style={{
            marginLeft: 'auto', color: 'rgba(255,255,255,0.4)',
            background: 'transparent', border: 'none', cursor: 'pointer',
            flexShrink: 0, display: 'flex', alignItems: 'center',
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(section => {
          const visibleItems = section.items.filter(isItemVisible);
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.section} className="sidebar-nav-section">
              <div className="sidebar-nav-label">{section.section}</div>
              {visibleItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-nav-item ${isActive ? 'active' : ''}`
                  }
                  title={collapsed ? item.label : ''}
                  onClick={onClose}
                >
                  <span className="sidebar-nav-icon">
                    <item.icon size={18} strokeWidth={1.8} />
                  </span>
                  <span className="sidebar-nav-text">{item.label}</span>
                  {item.badgeKey === 'messages' && unread > 0 && (
                    <span className="sidebar-nav-badge">{unread}</span>
                  )}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* User Section */}
      {currentUser && (
        <div className="sidebar-user" onClick={logout} title="Logout">
          <Avatar
            name={`${currentUser.firstName} ${currentUser.lastName}`}
            color={currentUser.avatarColor}
            size="sm"
          />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {currentUser.firstName} {currentUser.lastName}
            </div>
            <div className="sidebar-user-role">{currentUser.position}</div>
          </div>
          <LogOut size={14} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
        </div>
      )}
    </aside>
  );
}
