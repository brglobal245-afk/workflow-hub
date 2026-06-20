import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import Avatar from '../common/Avatar';
import NotificationDropdown from '../notifications/NotificationDropdown';
import toast from 'react-hot-toast';

const DEMO_USERS = [
  { id: 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a1', email: 'alexandra.chen@acmetech.com', label: 'Organization Admin', description: 'Full access', color: '#4f46e5' },
  { id: 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a2', email: 'marcus.rodriguez@acmetech.com', label: 'Department Head', description: 'Engineering VP view', color: '#0891b2' },
  { id: 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a3', email: 'sarah.kim@acmetech.com', label: 'Team Lead', description: 'Frontend team lead view', color: '#7c3aed' },
  { id: 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a4', email: 'priya.sharma@acmetech.com', label: 'HR Manager', description: 'HR operations view', color: '#db2777' },
  { id: 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a5', email: 'james.patel@acmetech.com', label: 'Employee', description: 'Standard employee view', color: '#64748b' },
];

export default function TopNav({ onMenuToggle }) {
  const { currentUser, switchRole, logout } = useAuthStore();
  const { getUnreadCount } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const roleRef = useRef(null);
  const unreadCount = getUnreadCount(currentUser?.id);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
      if (roleRef.current && !roleRef.current.contains(e.target)) setShowRoleSwitcher(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleRoleSwitch = async (demo) => {
    try {
      await switchRole(demo.email);
      setShowRoleSwitcher(false);
      navigate('/dashboard');
      toast.success(`Logged in as ${demo.label}`);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to switch demo role: ${e.message}`);
    }
  };

  const currentRole = DEMO_USERS.find(d => d.id === currentUser?.id);

  return (
    <header className="app-topnav">
      <button
        className="topnav-icon-btn"
        onClick={onMenuToggle}
        style={{ display: 'flex' }}
        title="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="topnav-search">
        <div className="search-bar" style={{ width: '100%' }}>
          <Search size={15} color="var(--gray-400)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employees, tasks, documents..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="topnav-actions">
        {/* Role Switcher */}
        <div ref={roleRef} className="dropdown">
          <button
            className="role-switcher"
            onClick={() => setShowRoleSwitcher(v => !v)}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Demo:</span>
            <span style={{ fontWeight: 600, color: 'var(--primary-600)' }}>
              {currentRole?.label || 'Select Role'}
            </span>
            <ChevronDown size={13} color="var(--gray-500)" />
          </button>
          {showRoleSwitcher && (
            <div className="dropdown-menu dropdown-menu-left" style={{ minWidth: 250 }}>
              <div className="dropdown-header">Switch Demo Role</div>
              {DEMO_USERS.map(demo => (
                <button
                  key={demo.id}
                  className={`dropdown-item ${demo.id === currentUser?.id ? 'active' : ''}`}
                  onClick={() => handleRoleSwitch(demo)}
                  style={demo.id === currentUser?.id ? { background: 'var(--primary-50)', color: 'var(--primary-700)' } : {}}
                >
                  <Avatar name={demo.label} color="blue" size="xs" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{demo.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{demo.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="topnav-divider" />

        {/* Notifications */}
        <div ref={notifRef} className="dropdown">
          <button
            className="topnav-icon-btn"
            onClick={() => setShowNotifications(v => !v)}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-dot" />}
          </button>
          {showNotifications && (
            <NotificationDropdown
              userId={currentUser?.id}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        {/* User Menu */}
        <div ref={userRef} className="dropdown">
          <button
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
            onClick={() => setShowUserMenu(v => !v)}
          >
            <Avatar
              name={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'U'}
              color={currentUser?.avatarColor}
              size="sm"
            />
            <ChevronDown size={14} color="var(--gray-500)" />
          </button>
          {showUserMenu && (
            <div className="dropdown-menu">
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-900)' }}>
                  {currentUser?.firstName} {currentUser?.lastName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{currentUser?.email}</div>
              </div>
              <button className="dropdown-item" onClick={() => { navigate(`/employees/${currentUser?.id}`); setShowUserMenu(false); }}>
                <User size={15} /> My Profile
              </button>
              <button className="dropdown-item" onClick={() => { navigate('/settings'); setShowUserMenu(false); }}>
                <Settings size={15} /> Settings
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item danger" onClick={logout}>
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
