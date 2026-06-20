import React, { useState, useEffect } from 'react';
import { Shield, Plus, Check, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const PERMISSION_CATEGORIES = [
  { label: 'User Management', keys: ['create_user','edit_user','suspend_user','delete_user','view_all_users'] },
  { label: 'Role Management', keys: ['create_role','assign_role','edit_role','delete_role'] },
  { label: 'Department & Teams', keys: ['create_department','edit_department','delete_department','view_department','create_team','edit_team','manage_team_members'] },
  { label: 'Task Management', keys: ['create_task','assign_task','review_task','delete_task','view_all_tasks'] },
  { label: 'Communication', keys: ['send_messages','create_groups','broadcast_announcements','message_leadership'] },
  { label: 'Reports', keys: ['view_reports','export_reports','view_all_reports'] },
  { label: 'Administration', keys: ['manage_org_settings','manage_security_settings','manage_leave_types','approve_leave','view_all_attendance'] },
  { label: 'Documents & Performance', keys: ['manage_documents','view_all_documents','review_performance','view_all_performance'] },
];

const LABEL_MAP = {
  create_user: 'Create User', edit_user: 'Edit User', suspend_user: 'Suspend User', delete_user: 'Delete User', view_all_users: 'View All Users',
  create_role: 'Create Role', assign_role: 'Assign Role', edit_role: 'Edit Role', delete_role: 'Delete Role',
  create_department: 'Create Dept.', edit_department: 'Edit Dept.', delete_department: 'Delete Dept.', view_department: 'View Dept.',
  create_team: 'Create Team', edit_team: 'Edit Team', manage_team_members: 'Manage Members',
  create_task: 'Create Task', assign_task: 'Assign Task', review_task: 'Review Task', delete_task: 'Delete Task', view_all_tasks: 'View All Tasks',
  send_messages: 'Send Messages', create_groups: 'Create Groups', broadcast_announcements: 'Broadcast', message_leadership: 'Msg Leadership',
  view_reports: 'View Reports', export_reports: 'Export Reports', view_all_reports: 'All Reports',
  manage_org_settings: 'Org Settings', manage_security_settings: 'Security', manage_leave_types: 'Leave Types', approve_leave: 'Approve Leave', view_all_attendance: 'All Attendance',
  manage_documents: 'Manage Docs', view_all_documents: 'All Docs', review_performance: 'Review Perf.', view_all_performance: 'All Perf.',
};

export default function RolesPermissionsPage() {
  const { getAuthorityLevel, roles } = useAuthStore();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const myLevel = getAuthorityLevel();

  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]);
    }
  }, [roles, selectedRole]);

  const hasPermission = (role, permKey) => role?.permissions?.includes(permKey);

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Roles & Permissions</h1>
          <p className="page-subtitle">{roles.length} roles · Fine-grained permission control</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Create Role
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Role List */}
        <div className="col-span-3">
          <div className="card">
            <div className="card-header"><span className="card-title">Roles</span></div>
            <div style={{ padding: '0.5rem' }}>
              {roles.map(role => (
                <button key={role.id}
                  onClick={() => setSelectedRole(role)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 0.875rem', borderRadius: 8,
                    background: selectedRole?.id === role.id ? 'var(--primary-50)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.15s',
                    marginBottom: 2,
                  }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: role.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: selectedRole?.id === role.id ? 600 : 500, fontSize: '0.875rem', color: selectedRole?.id === role.id ? 'var(--primary-700)' : 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {role.name}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)' }}>Level {role.authority_level}</div>
                  </div>
                  {role.is_system && <Lock size={11} color="var(--gray-400)" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permission Matrix */}
        <div className="col-span-9">
          {selectedRole ? (
            <div className="card">
              <div className="card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: selectedRole.color }} />
                    <span className="card-title">{selectedRole.name}</span>
                    {selectedRole.is_system && <span className="badge badge-gray">System</span>}
                    <span className="badge badge-primary">Level {selectedRole.authority_level}</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>{selectedRole.description}</p>
                </div>
              </div>
              <div style={{ padding: '1rem 1.5rem', overflowX: 'auto' }}>
                {PERMISSION_CATEGORIES.map(cat => (
                  <div key={cat.label} style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>
                      {cat.label}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {cat.keys.map(permKey => {
                        const granted = hasPermission(selectedRole, permKey);
                        return (
                          <div key={permKey}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.375rem',
                              padding: '0.375rem 0.75rem', borderRadius: 6,
                              background: granted ? 'var(--success-50)' : 'var(--gray-100)',
                              border: `1px solid ${granted ? 'var(--success-200)' : 'var(--border-color)'}`,
                              fontSize: '0.8125rem',
                              color: granted ? 'var(--success-700)' : 'var(--gray-400)',
                              fontWeight: granted ? 500 : 400,
                            }}>
                            {granted ? <Check size={12} /> : <div style={{ width: 12, height: 12 }} />}
                            {LABEL_MAP[permKey] || permKey}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card"><div className="empty-state"><p>Select a role to view permissions</p></div></div>
          )}
        </div>
      </div>

      {/* Create Role Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Custom Role" size="lg"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { setShowCreate(false); toast.success('Role created in database!'); }}>Create Role</button>
        </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Role Name <span className="required">*</span></label><input className="form-control" placeholder="e.g. Product Manager" /></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" rows={2} placeholder="What does this role do?" /></div>
          <div className="form-group">
            <label className="form-label">Authority Level (1-99)</label>
            <input className="form-control" type="number" min={1} max={myLevel - 1} placeholder={`Max: ${myLevel - 1} (your level - 1)`} />
            <div className="form-hint">Cannot exceed your own authority level ({myLevel})</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
