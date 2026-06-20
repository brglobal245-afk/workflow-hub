import React, { useState } from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import { useEmployeeStore } from '../../store/employeeStore';
import { useTaskStore } from '../../store/taskStore';
import { useOrgStore } from '../../store/orgStore';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

export default function DepartmentsPage() {
  const { employees } = useEmployeeStore();
  const { tasks } = useTaskStore();
  const { departments, createDepartment } = useOrgStore();
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [headId, setHeadId] = useState('');

  const getDeptHead = (headId) => employees.find(e => e.id === headId);
  const getDeptEmployees = (deptId) => employees.filter(e => e.departmentId === deptId);
  const getDeptTasks = (deptId) => tasks.filter(t => t.departmentId === deptId);

  const handleCreate = async () => {
    if (!name) {
      toast.error('Department name is required.');
      return;
    }
    try {
      await createDepartment({
        name,
        description,
        headId: headId || null,
        emoji: '🏢',
        color: '#4f46e5',
      });
      toast.success('Department created successfully!');
      setShowCreate(false);
      setName('');
      setDescription('');
      setHeadId('');
    } catch (e) {
      toast.error('Failed to create department.');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">{departments.length} departments · {employees.length} total employees</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Create Department
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {departments.map(dept => {
          const head = getDeptHead(dept.head_id);
          const deptEmps = getDeptEmployees(dept.id);
          const deptTasks = getDeptTasks(dept.id);
          const completedTasks = deptTasks.filter(t => t.status === 'completed').length;
          const completion = deptTasks.length ? Math.round((completedTasks / deptTasks.length) * 100) : 0;
          const color = dept.color || '#4f46e5';

          return (
            <div key={dept.id} className="dept-card" onClick={() => setSelected(dept)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div className="dept-card-icon" style={{ background: `${color}15`, marginBottom: 0 }}>
                  <span style={{ fontSize: '1.5rem' }}>{dept.emoji || '🏢'}</span>
                </div>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={e => e.stopPropagation()}>
                  <MoreVertical size={15} />
                </button>
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
                {dept.name}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: '1rem', lineHeight: 1.5 }}>
                {dept.description}
              </p>

              {/* Head */}
              {head && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.625rem', background: 'var(--gray-50)', borderRadius: 8 }}>
                  <Avatar name={`${head.firstName} ${head.lastName}`} color={head.avatarColor} size="xs" />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-700)' }}>{head.firstName} {head.lastName}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)' }}>Department Head</div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '1rem' }}>
                {[
                  { label: 'Employees', value: deptEmps.length },
                  { label: 'Tasks', value: deptTasks.length },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '0.5rem', background: 'var(--gray-50)', borderRadius: 8 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: color }}>{s.value}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Task completion */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Task Completion</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: color }}>{completion}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${completion}%`, background: color }} />
                </div>
              </div>

              {/* Employee Avatars */}
              {deptEmps.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', gap: '0.5rem' }}>
                  <div className="avatar-group">
                    {deptEmps.slice(0, 5).map(e => (
                      <Avatar key={e.id} name={`${e.firstName} ${e.lastName}`} color={e.avatarColor} size="xs" style={{ border: '2px solid #fff' }} />
                    ))}
                  </div>
                  {deptEmps.length > 5 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>+{deptEmps.length - 5} more</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Department Detail Modal */}
      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`${selected.emoji || '🏢'} ${selected.name} Department`} size="lg"
          footer={<button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.6 }}>{selected.description}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Members', value: getDeptEmployees(selected.id).length },
                { label: 'Open Tasks', value: getDeptTasks(selected.id).filter(t => t.status !== 'completed').length },
                { label: 'Budget', value: selected.budget || 'N/A' },
                { label: 'Status', value: selected.status },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--gray-50)', borderRadius: 8, padding: '0.875rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>{item.label}</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gray-900)', textTransform: 'capitalize' }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-700)', marginBottom: '0.75rem' }}>Team Members</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 250, overflowY: 'auto' }}>
                {getDeptEmployees(selected.id).map(emp => (
                  <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem', background: 'var(--gray-50)', borderRadius: 8 }}>
                    <Avatar name={`${emp.firstName} ${emp.lastName}`} color={emp.avatarColor} size="sm" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{emp.firstName} {emp.lastName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{emp.position}</div>
                    </div>
                    <span className={`badge badge-${emp.status === 'active' ? 'success' : 'gray'} badge-dot`}>{emp.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Department" size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Create</button>
          </>
        }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Department Name <span className="required">*</span></label>
            <input className="form-control" placeholder="e.g. Customer Support" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" placeholder="What does this department do?" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Department Head</label>
            <select className="form-control" value={headId} onChange={e => setHeadId(e.target.value)}>
              <option value="">Select head</option>
              {employees.filter(e => e.status === 'active').map(e => (
                <option key={e.id} value={e.id}>{e.firstName} {e.lastName} — {e.position}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
