import React, { useState } from 'react';
import { Send, Inbox, Star, MessageSquare, Plus, ChevronRight } from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import { useAuthStore } from '../../store/authStore';
import { useEmployeeStore } from '../../store/employeeStore';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const PRIORITY_INFO = {
  normal:  { label: 'Normal',  badge: 'gray' },
  high:    { label: 'High',    badge: 'warning' },
  urgent:  { label: 'Urgent',  badge: 'danger' },
};

const MSG_TYPES = {
  feedback:   { label: 'Feedback',  emoji: '💬' },
  concern:    { label: 'Concern',   emoji: '⚠️' },
  suggestion: { label: 'Suggestion', emoji: '💡' },
  escalation: { label: 'Escalation', emoji: '🔺' },
};

export default function LeadershipInboxPage() {
  const { currentUser } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { leadershipMessages, sendLeadershipMessage, respondToLeadershipMessage } = useMessageStore();
  const [tab, setTab] = useState('inbox');
  const [selected, setSelected] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [response, setResponse] = useState('');
  const [form, setForm] = useState({ recipientId: '', subject: '', content: '', type: 'feedback', priority: 'normal' });

  const myInbox = leadershipMessages.filter(m => m.recipientId === currentUser?.id);
  const mySent = leadershipMessages.filter(m => m.senderId === currentUser?.id);
  const messages = tab === 'inbox' ? myInbox : mySent;

  const getSender = (id) => employees.find(e => e.id === id);
  const getRecipient = (id) => employees.find(e => e.id === id);

  const relTime = (iso) => {
    try {
      const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      return `${days}d ago`;
    } catch { return ''; }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leadership Inbox</h1>
          <p className="page-subtitle">Direct channel to leadership — private and secure</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCompose(true)}>
          <Plus size={16} /> Compose Message
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Message List */}
        <div className="col-span-4">
          <div className="card" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="tabs-pill" style={{ margin: 0 }}>
                <button className={`tab-btn ${tab === 'inbox' ? 'active' : ''}`} onClick={() => setTab('inbox')}>
                  <Inbox size={14} /> Inbox
                  {myInbox.filter(m => m.status === 'unread').length > 0 && (
                    <span className="badge badge-danger">{myInbox.filter(m => m.status === 'unread').length}</span>
                  )}
                </button>
                <button className={`tab-btn ${tab === 'sent' ? 'active' : ''}`} onClick={() => setTab('sent')}>
                  <Send size={14} /> Sent
                </button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {messages.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <p style={{ color: 'var(--gray-400)', textAlign: 'center', fontSize: '0.875rem' }}>
                    {tab === 'inbox' ? 'No messages in your inbox' : 'No sent messages'}
                  </p>
                </div>
              ) : messages.map(msg => {
                const sender = getSender(msg.senderId);
                const isSelected = selected?.id === msg.id;
                const isUnread = msg.status === 'unread' && tab === 'inbox';
                const typeInfo = MSG_TYPES[msg.type] || MSG_TYPES.feedback;
                return (
                  <div key={msg.id}
                    onClick={() => setSelected(msg)}
                    style={{
                      padding: '0.875rem 1rem',
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--primary-50)' : 'transparent',
                      borderLeft: isUnread ? '3px solid var(--primary-500)' : '3px solid transparent',
                      transition: 'background 0.15s',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: isUnread ? 700 : 500, fontSize: '0.875rem', color: 'var(--gray-900)' }}>
                        {typeInfo.emoji} {msg.subject}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--gray-400)', flexShrink: 0, marginLeft: '0.5rem' }}>{relTime(msg.sentAt)}</span>
                    </div>
                    {sender && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
                        {tab === 'inbox' ? 'From' : 'To'}: {sender.firstName} {sender.lastName}
                      </div>
                    )}
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {msg.content}
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.375rem' }}>
                      <span className={`badge badge-${PRIORITY_INFO[msg.priority]?.badge}`} style={{ fontSize: '0.6875rem' }}>{msg.priority}</span>
                      <span className={`badge badge-${msg.status === 'responded' ? 'success' : 'gray'}`} style={{ fontSize: '0.6875rem' }}>{msg.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="col-span-8">
          <div className="card" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {!selected ? (
              <div className="empty-state" style={{ flex: 1 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📬</div>
                <p className="empty-state-title">Select a message</p>
                <p className="empty-state-text">Choose a message from the list to view its contents</p>
              </div>
            ) : (
              <>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', flex: '0 0 auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                    <span className="badge badge-primary">{MSG_TYPES[selected.type]?.emoji} {MSG_TYPES[selected.type]?.label}</span>
                    <span className={`badge badge-${PRIORITY_INFO[selected.priority]?.badge}`}>{selected.priority}</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
                    {selected.subject}
                  </h2>
                  {(() => {
                    const sender = getSender(selected.senderId);
                    return sender && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                        <Avatar name={`${sender.firstName} ${sender.lastName}`} color={sender.avatarColor} size="xs" />
                        <span>From {sender.firstName} {sender.lastName} · {new Date(selected.sentAt).toLocaleDateString()}</span>
                      </div>
                    );
                  })()}
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                  <p style={{ color: 'var(--gray-700)', lineHeight: 1.8, fontSize: '0.9375rem', marginBottom: '1.5rem' }}>{selected.content}</p>

                  {selected.response && (
                    <div style={{ background: 'var(--primary-50)', borderRadius: 10, padding: '1.25rem', border: '1px solid var(--primary-100)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary-700)', marginBottom: '0.5rem' }}>📝 Response</div>
                      <p style={{ color: 'var(--primary-800)', lineHeight: 1.7 }}>{selected.response}</p>
                    </div>
                  )}

                  {/* Respond (for recipient) */}
                  {selected.recipientId === currentUser?.id && !selected.response && (
                    <div style={{ marginTop: '1.25rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-700)', marginBottom: '0.625rem' }}>Your Response</div>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Write your response..."
                        value={response}
                        onChange={e => setResponse(e.target.value)}
                        style={{ marginBottom: '0.75rem' }}
                      />
                      <button className="btn btn-primary" onClick={() => {
                        if (!response.trim()) { toast.error('Write a response first'); return; }
                        respondToLeadershipMessage(selected.id, response);
                        setResponse('');
                        setSelected(m => ({ ...m, response, status: 'responded' }));
                        toast.success('Response sent!');
                      }}>
                        <Send size={15} /> Send Response
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      <Modal isOpen={showCompose} onClose={() => setShowCompose(false)} title="Compose Leadership Message" size="lg"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowCompose(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => {
            if (!form.recipientId || !form.subject || !form.content) { toast.error('Fill all required fields'); return; }
            sendLeadershipMessage(currentUser?.id, form.recipientId, form.subject, form.content, form.type, form.priority);
            setShowCompose(false);
            setForm({ recipientId: '', subject: '', content: '', type: 'feedback', priority: 'normal' });
            toast.success('Message sent!');
          }}>Send</button>
        </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Recipient <span className="required">*</span></label>
            <select className="form-control" value={form.recipientId} onChange={e => setForm(f => ({...f, recipientId: e.target.value}))}>
              <option value="">Select recipient</option>
              {employees.filter(e => e.id !== currentUser?.id && ['Manager', 'Department Head', 'HR Manager', 'CEO', 'CTO', 'COO'].some(r => e.position.includes(r.split(' ')[0]))).map(e => (
                <option key={e.id} value={e.id}>{e.firstName} {e.lastName} — {e.position}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-control" value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>
                {Object.entries(MSG_TYPES).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-control" value={form.priority} onChange={e => setForm(f => ({...f, priority: e.target.value}))}>
                {Object.entries(PRIORITY_INFO).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Subject <span className="required">*</span></label>
            <input className="form-control" placeholder="Message subject" value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Message <span className="required">*</span></label>
            <textarea className="form-control" rows={5} placeholder="Write your message..." value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
