import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { Building2, Bell, Shield, Moon, Sun, Globe, Save } from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { currentUser } = useAuthStore();
  const { updateEmployee } = useEmployeeStore();
  const [tab, setTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    tasks: true, messages: true, announcements: true, leaves: false,
  });

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Nav */}
        <div className="col-span-3">
          <div className="card">
            <div style={{ padding: '0.5rem' }}>
              {[
                { key: 'profile', label: 'My Profile', icon: '👤' },
                { key: 'notifications', label: 'Notifications', icon: '🔔' },
                { key: 'appearance', label: 'Appearance', icon: '🎨' },
                { key: 'security', label: 'Security', icon: '🔒' },
                { key: 'organization', label: 'Organization', icon: '🏢' },
              ].map(item => (
                <button key={item.key}
                  onClick={() => setTab(item.key)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 0.875rem', borderRadius: 8,
                    background: tab === item.key ? 'var(--primary-50)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem',
                    fontWeight: tab === item.key ? 600 : 400,
                    color: tab === item.key ? 'var(--primary-700)' : 'var(--gray-700)',
                    marginBottom: 2,
                  }}>
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="col-span-9">
          {tab === 'profile' && currentUser && (
            <div className="card">
              <div className="card-header"><span className="card-title">My Profile</span></div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', padding: '1.25rem', background: 'var(--gray-50)', borderRadius: 12 }}>
                  <Avatar name={`${currentUser.firstName} ${currentUser.lastName}`} color={currentUser.avatarColor} size="3xl" />
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                      {currentUser.firstName} {currentUser.lastName}
                    </h3>
                    <p style={{ color: 'var(--gray-500)', marginBottom: '0.5rem' }}>{currentUser.position} · {currentUser.employeeId}</p>
                    <button className="btn btn-secondary btn-sm">Change Photo</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-control" defaultValue={currentUser.firstName} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-control" defaultValue={currentUser.lastName} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" defaultValue={currentUser.email} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-control" defaultValue={currentUser.phone} />
                  </div>
                  <div className="form-group col-span-2">
                    <label className="form-label">Bio</label>
                    <textarea className="form-control" rows={3} defaultValue={currentUser.bio} />
                  </div>
                </div>
                <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={() => toast.success('Profile updated!')}>
                    <Save size={15} /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="card">
              <div className="card-header"><span className="card-title">Notification Preferences</span></div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'tasks', label: 'Task Updates', desc: 'Get notified when tasks are assigned or updated' },
                  { key: 'messages', label: 'New Messages', desc: 'Receive notifications for new direct messages' },
                  { key: 'announcements', label: 'Announcements', desc: 'Get notified about company announcements' },
                  { key: 'leaves', label: 'Leave Updates', desc: 'Receive updates on leave approvals and rejections' },
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--gray-50)', borderRadius: 10 }}>
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--gray-800)', marginBottom: '0.125rem' }}>{item.label}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{item.desc}</div>
                    </div>
                    <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
                      <input type="checkbox" checked={notifSettings[item.key]} onChange={e => setNotifSettings(s => ({...s, [item.key]: e.target.checked}))} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: notifSettings[item.key] ? 'var(--primary-600)' : 'var(--gray-300)', borderRadius: 12, transition: 'background 0.2s' }}>
                        <div style={{ position: 'absolute', top: 3, left: notifSettings[item.key] ? 22 : 3, width: 18, height: 18, background: '#fff', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', transition: 'left 0.2s' }} />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'appearance' && (
            <div className="card">
              <div className="card-header"><span className="card-title">Appearance</span></div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--gray-50)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                    <div>
                      <div style={{ fontWeight: 500 }}>Dark Mode</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Toggle dark/light theme</div>
                    </div>
                  </div>
                  <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
                    <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: darkMode ? 'var(--primary-600)' : 'var(--gray-300)', borderRadius: 12, transition: 'background 0.2s' }}>
                      <div style={{ position: 'absolute', top: 3, left: darkMode ? 22 : 3, width: 18, height: 18, background: '#fff', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', transition: 'left 0.2s' }} />
                    </div>
                  </label>
                </div>
                <div style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: 10 }}>
                  <div style={{ fontWeight: 500, marginBottom: '0.75rem' }}>Accent Color</div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {['#4f46e5','#059669','#7c3aed','#db2777','#0891b2','#d97706'].map(c => (
                      <div key={c} onClick={() => toast.success('Theme applied!')} style={{ width: 32, height: 32, borderRadius: '50%', background: c, cursor: 'pointer', border: c === '#4f46e5' ? '3px solid var(--gray-900)' : '3px solid transparent', transition: 'transform 0.15s' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="card">
              <div className="card-header"><span className="card-title">Security</span></div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: '1rem' }}>Change Password</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="form-group"><label className="form-label">Current Password</label><input className="form-control" type="password" /></div>
                    <div className="form-group"><label className="form-label">New Password</label><input className="form-control" type="password" /></div>
                    <div className="form-group"><label className="form-label">Confirm New Password</label><input className="form-control" type="password" /></div>
                    <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => toast.success('Password changed!')}>Update Password</button>
                  </div>
                </div>
                <hr style={{ borderColor: 'var(--border-color)' }} />
                <div>
                  <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Two-Factor Authentication</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>Add an extra layer of security to your account.</div>
                  <button className="btn btn-secondary btn-sm">Enable 2FA</button>
                </div>
              </div>
            </div>
          )}

          {tab === 'organization' && (
            <div className="card">
              <div className="card-header"><span className="card-title">Organization Settings</span></div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group"><label className="form-label">Organization Name</label><input className="form-control" defaultValue="Acme Technologies" /></div>
                <div className="form-group"><label className="form-label">Industry</label><input className="form-control" defaultValue="Technology & Software" /></div>
                <div className="form-group"><label className="form-label">Website</label><input className="form-control" defaultValue="https://acmetech.com" /></div>
                <div className="form-group"><label className="form-label">Timezone</label>
                  <select className="form-control">
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+5:30 (IST)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={() => toast.success('Organization settings saved!')}>
                    <Save size={15} /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
