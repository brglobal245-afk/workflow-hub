import React from 'react';
import { Bell, CheckSquare, MessageSquare, Calendar, Megaphone, X } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';

const ICONS = {
  task: { icon: CheckSquare, color: 'var(--primary-600)', bg: 'var(--primary-50)' },
  message: { icon: MessageSquare, color: 'var(--success-600)', bg: 'var(--success-50)' },
  leave: { icon: Calendar, color: 'var(--warning-600)', bg: 'var(--warning-50)' },
  announcement: { icon: Megaphone, color: 'var(--info-600)', bg: 'var(--info-50)' },
};

export default function NotificationDropdown({ userId, onClose }) {
  const { getForUser, markRead, markAllRead, getUnreadCount } = useNotificationStore();
  const notifications = getForUser(userId);
  const unread = getUnreadCount(userId);

  const relativeTime = (iso) => {
    try {
      const diff = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'just now';
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    } catch { return ''; }
  };

  return (
    <div
      className="dropdown-menu"
      style={{ width: 360, right: 0, maxHeight: '500px', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.9375rem' }}>
          Notifications
          {unread > 0 && (
            <span className="badge badge-primary" style={{ marginLeft: '0.5rem' }}>{unread}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {unread > 0 && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => markAllRead(userId)}
              style={{ fontSize: '0.75rem' }}
            >
              Mark all read
            </button>
          )}
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <X size={14} />
          </button>
        </div>
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
            No notifications
          </div>
        ) : (
          notifications.map(n => {
            const typeInfo = ICONS[n.type] || ICONS.task;
            const Icon = typeInfo.icon;
            return (
              <div
                key={n.id}
                className={`notification-item ${!n.read ? 'unread' : ''}`}
                onClick={() => markRead(n.id)}
              >
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: typeInfo.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color={typeInfo.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: !n.read ? 600 : 400, color: 'var(--gray-800)', lineHeight: 1.4 }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.125rem' }}>
                    {relativeTime(n.createdAt)}
                  </div>
                </div>
                {!n.read && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-500)', flexShrink: 0 }} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
