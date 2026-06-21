import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import Avatar from '../common/Avatar';
import NotificationDropdown from '../notifications/NotificationDropdown';
import toast from 'react-hot-toast';

export default function TopNav({ onMenuToggle }) {
  const { currentUser, logout } = useAuthStore();
  const { getUnreadCount } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const unreadCount = getUnreadCount(currentUser?.id);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
