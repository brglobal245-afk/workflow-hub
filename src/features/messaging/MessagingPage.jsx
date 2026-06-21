import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Search } from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import { useAuthStore } from '../../store/authStore';
import { useEmployeeStore } from '../../store/employeeStore';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import { supabase } from '../../lib/supabaseClient';

const relTime = (iso) => {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    if (isNaN(diff)) return '';
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  } catch { return ''; }
};

export default function MessagingPage() {
  const { currentUser } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { getConversationList, getConversation, sendMessage, markAsRead, fetchMessages } = useMessageStore();
  const [search, setSearch] = useState('');
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [showNewMsgModal, setShowNewMsgModal] = useState(false);
  const [newMsgSearch, setNewMsgSearch] = useState('');

  const conversations = getConversationList(currentUser?.id);

  const partner = activePartnerId ? employees.find(e => e.id === activePartnerId) : null;
  const messages = activePartnerId ? getConversation(currentUser?.id, activePartnerId) : [];

  // Mount/polling/realtime fetch
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    const channel = supabase
      .channel('realtime:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (activePartnerId) markAsRead(activePartnerId, currentUser?.id);
  }, [messages.length, activePartnerId]);

  const handleSend = () => {
    if (!message.trim() || !activePartnerId) return;
    sendMessage(currentUser?.id, activePartnerId, message.trim());
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // All employees we can start a conversation with
  const otherEmployees = employees.filter(e =>
    e.id !== currentUser?.id && e.status !== 'suspended' &&
    (e.firstName + ' ' + e.lastName).toLowerCase().includes(search.toLowerCase())
  );

  const displayConversations = search
    ? otherEmployees.map(emp => {
        const convo = conversations.find(c => c.partnerId === emp.id);
        return convo || { partnerId: emp.id, lastMessage: null, unreadCount: 0 };
      })
    : conversations;

  return (
    <div className="animate-fade-in-up">
      <div className="page-header mb-0" style={{ marginBottom: '1.25rem' }}>
        <h1 className="page-title">Messages</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowNewMsgModal(true)}>
          <Plus size={15} /> New Message
        </button>
      </div>

      <div className="chat-layout">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <div className="search-bar">
              <Search size={14} color="var(--gray-400)" />
              <input placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="chat-list">
            {displayConversations.map(convo => {
              const emp = employees.find(e => e.id === convo.partnerId);
              if (!emp) return null;
              return (
                <div key={convo.partnerId}
                  className={`chat-item ${activePartnerId === convo.partnerId ? 'active' : ''}`}
                  onClick={() => setActivePartnerId(convo.partnerId)}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar name={`${emp.firstName} ${emp.lastName}`} color={emp.avatarColor} size="md" />
                    {emp.status === 'active' && (
                      <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: 'var(--success-500)', border: '2px solid white' }} />
                    )}
                  </div>
                  <div className="chat-item-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span className="chat-item-name">{emp.firstName} {emp.lastName}</span>
                      {convo.lastMessage && <span className="chat-item-time">{relTime(convo.lastMessage.sentAt)}</span>}
                    </div>
                    <div className="chat-item-preview">
                      {convo.lastMessage
                        ? (convo.lastMessage.senderId === currentUser?.id ? 'You: ' : '') + convo.lastMessage.content
                        : emp.position}
                    </div>
                  </div>
                  {convo.unreadCount > 0 && (
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--primary-600)', color: '#fff', fontSize: '0.6875rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {convo.unreadCount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Main */}
        <div className="chat-main">
          {!activePartnerId ? (
            <div className="empty-state" style={{ flex: 1 }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💬</div>
              <p className="empty-state-title">Select a conversation</p>
              <p className="empty-state-text">Choose from the list or search for a colleague to start chatting</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div style={{ position: 'relative' }}>
                  <Avatar name={partner ? `${partner.firstName} ${partner.lastName}` : '?'} color={partner?.avatarColor} size="md" />
                  {partner?.status === 'active' && (
                    <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: 'var(--success-500)', border: '2px solid white' }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.9375rem' }}>
                    {partner?.firstName} {partner?.lastName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: partner?.status === 'active' ? 'var(--success-600)' : 'var(--gray-400)' }}>
                    {partner?.status === 'active' ? '● Online' : partner?.position}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', margin: 'auto 0', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                    No messages yet. Say hello! 👋
                  </div>
                ) : messages.map(msg => {
                  const isOwn = msg.senderId === currentUser?.id;
                  return (
                    <div key={msg.id} className={`message-bubble ${isOwn ? 'own' : ''}`}>
                      {!isOwn && (
                        <Avatar name={partner ? `${partner.firstName} ${partner.lastName}` : '?'} color={partner?.avatarColor} size="xs" />
                      )}
                      <div>
                        <div className={`message-content ${isOwn ? 'sent' : 'received'}`}>
                          {msg.content}
                        </div>
                        <div className="message-time" style={{ textAlign: isOwn ? 'right' : 'left' }}>
                          {relTime(msg.sentAt)}
                          {isOwn && <span style={{ marginLeft: '0.25rem' }}>{msg.readAt ? ' ✓✓' : ' ✓'}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="chat-input-area">
                <button className="btn btn-ghost btn-icon btn-sm" title="Attach file">📎</button>
                <input
                  className="chat-input"
                  placeholder={`Message ${partner?.firstName}...`}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="btn btn-primary btn-icon"
                  onClick={handleSend}
                  disabled={!message.trim()}
                  title="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      <Modal
        isOpen={showNewMsgModal}
        onClose={() => {
          setShowNewMsgModal(false);
          setNewMsgSearch('');
        }}
        title="New Message"
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="search-bar" style={{ margin: 0 }}>
            <Search size={14} color="var(--gray-400)" />
            <input 
              placeholder="Search employees..." 
              value={newMsgSearch} 
              onChange={e => setNewMsgSearch(e.target.value)} 
            />
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
            {otherEmployees
              .filter(emp => (emp.firstName + ' ' + emp.lastName).toLowerCase().includes(newMsgSearch.toLowerCase()))
              .map(emp => (
                <div 
                  key={emp.id} 
                  className="chat-item" 
                  style={{ borderRadius: '8px', cursor: 'pointer', padding: '0.625rem', display: 'flex', alignItems: 'center' }}
                  onClick={() => {
                    setActivePartnerId(emp.id);
                    setShowNewMsgModal(false);
                    setNewMsgSearch('');
                  }}
                >
                  <Avatar name={`${emp.firstName} ${emp.lastName}`} color={emp.avatarColor} size="sm" />
                  <div style={{ flex: 1, marginLeft: '0.75rem' }}>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--gray-800)' }}>{emp.firstName} {emp.lastName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{emp.position}</div>
                  </div>
                </div>
              ))
            }
            {otherEmployees.filter(emp => (emp.firstName + ' ' + emp.lastName).toLowerCase().includes(newMsgSearch.toLowerCase())).length === 0 && (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                No employees found.
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
