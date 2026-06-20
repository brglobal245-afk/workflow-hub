import React, { useState } from 'react';
import { Plus, Pin, Eye, Paperclip } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { useAnnouncementStore } from '../../store/announcementStore';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const TYPE_INFO = {
  general:   { label: 'General',   badge: 'primary', emoji: '📢' },
  hr:        { label: 'HR Update', badge: 'success', emoji: '👥' },
  policy:    { label: 'Policy',    badge: 'warning', emoji: '📋' },
  emergency: { label: 'Emergency', badge: 'danger',  emoji: '⚠️' },
  event:     { label: 'Event',     badge: 'purple',  emoji: '🎉' },
};

export default function AnnouncementsPage() {
  const { currentUser, hasPermission } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { announcements, createAnnouncement } = useAnnouncementStore();
  const [activeType, setActiveType] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('general');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  // Define static permission name (for checking)
  const canBroadcast = hasPermission('broadcast_announcements');

  const filtered = announcements.filter(a =>
    activeType === 'all' || a.type === activeType
  ).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const getAuthor = (id) => employees.find(e => e.id === id);

  const relTime = (iso) => {
    try {
      const diff = Date.now() - new Date(iso).getTime();
      const hours = Math.floor(diff / 3600000);
      if (hours < 1) return 'Just now';
      if (hours < 24) return `${hours} hours ago`;
      const days = Math.floor(hours / 24);
      return days === 1 ? 'Yesterday' : `${days} days ago`;
    } catch { return ''; }
  };

  const handlePublish = async () => {
    if (!title || !content) {
      toast.error('Title and Content are required.');
      return;
    }
    try {
      await createAnnouncement({
        title,
        content,
        type,
        pinned: isPinned,
        authorId: currentUser?.id,
        date: new Date().toISOString(),
      });
      toast.success('Announcement published successfully!');
      setShowCreate(false);
      setTitle('');
      setContent('');
      setType('general');
      setIsPinned(false);
    } catch (e) {
      toast.error('Failed to publish announcement.');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Announcements</h1>
          <p className="page-subtitle">{announcements.length} announcements · {announcements.filter(a => a.pinned).length} pinned</p>
        </div>
        {canBroadcast && (
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> New Announcement
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        {[['all','All'], ...Object.entries(TYPE_INFO).map(([k,v]) => [k, `${v.emoji} ${v.label}`])].map(([k, l]) => (
          <button key={k} className={`tab-btn ${activeType === k ? 'active' : ''}`} onClick={() => setActiveType(k)}>{l}</button>
        ))}
      </div>

      {/* Announcements */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filtered.length === 0 ? (
          <div className="empty-state"><p className="empty-state-title">No announcements</p></div>
        ) : filtered.map(ann => {
          const author = getAuthor(ann.authorId);
          const typeInfo = TYPE_INFO[ann.type] || TYPE_INFO.general;
          return (
            <div key={ann.id} className="announcement-card" style={{ cursor: 'pointer' }} onClick={() => setSelected(ann)}>
              <div className={`announcement-stripe ${ann.type}`} />
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                      {ann.pinned && <Pin size={14} color="var(--primary-500)" />}
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)' }}>{ann.title}</h3>
                    </div>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {ann.content}
                    </p>
                  </div>
                  <span className={`badge badge-${typeInfo.badge}`} style={{ flexShrink: 0 }}>
                    {typeInfo.emoji} {typeInfo.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    {author && (
                      <>
                        <Avatar name={`${author.firstName} ${author.lastName}`} color={author.avatarColor} size="xs" />
                        <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                          {author.firstName} {author.lastName} · {relTime(ann.date)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected.title} size="lg"
          footer={<button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className={`badge badge-${TYPE_INFO[selected.type]?.badge}`}>{TYPE_INFO[selected.type]?.emoji} {TYPE_INFO[selected.type]?.label}</span>
              {selected.pinned && <span className="badge badge-primary">📌 Pinned</span>}
            </div>
            <p style={{ color: 'var(--gray-700)', lineHeight: 1.8, fontSize: '0.9375rem', whiteSpace: 'pre-line' }}>{selected.content}</p>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
              Published {new Date(selected.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </Modal>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Announcement" size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handlePublish}>Publish</button>
          </>
        }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Title <span className="required">*</span></label>
            <input className="form-control" placeholder="Announcement title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
              {Object.entries(TYPE_INFO).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Content <span className="required">*</span></label>
            <textarea className="form-control" rows={6} placeholder="Write the announcement content..." value={content} onChange={e => setContent(e.target.value)} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-700)', cursor: 'pointer' }}>
            <input type="checkbox" checked={isPinned} onChange={e => setIsPinned(e.target.checked)} /> Pin this announcement to the top
          </label>
        </div>
      </Modal>
    </div>
  );
}
