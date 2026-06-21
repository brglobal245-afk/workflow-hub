import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, Users } from 'lucide-react';
import { useEmployeeStore } from '../../store/employeeStore';
import { useTaskStore } from '../../store/taskStore';
import { useOrgStore } from '../../store/orgStore';
import { useAuthStore } from '../../store/authStore';
import { usePerformanceStore } from '../../store/performanceStore';
import Avatar from '../../components/common/Avatar';
import toast from 'react-hot-toast';

const EMP_TYPES = { full_time: 'Full Time', part_time: 'Part Time', contract: 'Contract', freelancer: 'Freelancer', intern: 'Intern' };
const STATUS_BADGE = { active: 'success', on_leave: 'warning', suspended: 'danger', resigned: 'gray' };

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployee, deleteEmployee } = useEmployeeStore();
  const { getTasksByAssignee } = useTaskStore();
  const { departments, teams } = useOrgStore();
  const { roles, hasPermission, currentUser } = useAuthStore();
  const { goals } = usePerformanceStore();
  const [deleting, setDeleting] = useState(false);
  const emp = getEmployee(id);

  if (!emp) return (
    <div className="empty-state">
      <p className="empty-state-title">Employee not found</p>
      <button className="btn btn-primary mt-4" onClick={() => navigate('/employees')}>Back to Directory</button>
    </div>
  );

  const dept = departments.find(d => d.id === emp.departmentId);
  const team = teams.find(t => t.id === emp.teamId);
  const role = roles.find(r => r.id === emp.roleId);
  const manager = emp.managerId ? getEmployee(emp.managerId) : null;
  const tasks = getTasksByAssignee(emp.id);
  const userGoals = goals.filter(g => g.userId === emp.id);

  const STATUS_COLORS = { not_started: '#94a3b8', in_progress: '#4f46e5', under_review: '#f59e0b', completed: '#22c55e', rejected: '#ef4444' };

  const canDelete = hasPermission('delete_user') && emp.id !== currentUser?.id;

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove ${emp.firstName} ${emp.lastName} from the organization? This will revoke all system access.`)) {
      setDeleting(true);
      try {
        await deleteEmployee(emp.id);
        toast.success('Employee removed successfully.');
        navigate('/employees');
      } catch (e) {
        console.error(e);
        toast.error(`Failed to remove employee: ${e.message}`);
        setDeleting(false);
      }
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
            <span style={{ cursor: 'pointer', color: 'var(--primary-600)' }} onClick={() => navigate('/employees')}>Employees</span>
            {' / '}{emp.firstName} {emp.lastName}
          </span>
        </div>
        {canDelete && (
          <button 
            className="btn btn-danger btn-sm" 
            onClick={handleDelete} 
            disabled={deleting}
          >
            {deleting ? 'Removing...' : 'Remove Employee'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Profile Card */}
        <div className="card col-span-4" style={{ alignSelf: 'start' }}>
          <div style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
            <Avatar name={`${emp.firstName} ${emp.lastName}`} color={emp.avatarColor} size="3xl" style={{ margin: '0 auto 1.25rem' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
              {emp.firstName} {emp.lastName}
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '0.875rem' }}>{emp.position}</p>
            <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span className={`badge badge-${STATUS_BADGE[emp.status] || 'gray'} badge-dot`} style={{ textTransform: 'capitalize' }}>{emp.status.replace('_', ' ')}</span>
              <span className="badge badge-gray">{EMP_TYPES[emp.employmentType] || emp.employmentType}</span>
              {role && <span className="badge badge-primary">{role.name}</span>}
            </div>
          </div>

          <div style={{ padding: '1.25rem' }}>
            {[
              { icon: Mail, label: emp.email },
              { icon: Phone, label: emp.phone },
              { icon: MapPin, label: emp.location },
              { icon: Calendar, label: `Joined ${new Date(emp.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` },
              { icon: Briefcase, label: emp.employeeId },
            ].map((item, i) => item.label && (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <item.icon size={15} color="var(--gray-400)" strokeWidth={1.8} />
                <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {emp.bio && (
            <div style={{ padding: '1rem 1.25rem', background: 'var(--gray-50)', borderTop: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>{emp.bio}</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Org Info */}
          <div className="card">
            <div className="card-header"><span className="card-title">Organizational Details</span></div>
            <div className="card-body">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Department', value: dept?.name || '—', emoji: dept?.emoji },
                  { label: 'Team', value: team?.name || '—' },
                  { label: 'Role', value: role?.name || '—', badge: true, color: role?.color },
                  { label: 'Manager', value: manager ? `${manager.firstName} ${manager.lastName}` : '—' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--gray-800)' }}>
                      {item.emoji && <span style={{ marginRight: '0.375rem' }}>{item.emoji}</span>}
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Assigned Tasks</span>
              <span className="badge badge-primary">{tasks.length}</span>
            </div>
            <div>
              {tasks.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}><p>No tasks assigned</p></div>
              ) : tasks.slice(0, 4).map(task => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[task.status] || '#94a3b8', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--gray-800)' }}>{task.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <div className="progress-bar" style={{ width: 80 }}><div className="progress-bar-fill" style={{ width: `${task.progress}%` }} /></div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{task.progress}% · Due {task.deadline}</span>
                    </div>
                  </div>
                  <span className={`badge badge-${task.priority === 'critical' ? 'danger' : task.priority === 'high' ? 'warning' : 'gray'}`}>{task.priority}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          {userGoals.length > 0 && (
            <div className="card">
              <div className="card-header"><span className="card-title">Performance Goals</span></div>
              <div className="card-body">
                {userGoals.map(g => {
                  const pct = Math.min(100, Math.round((g.current / g.target) * 100));
                  return (
                    <div key={g.id} className="goal-item" style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-800)' }}>{g.title}</span>
                        <span className={`badge badge-${g.status === 'completed' ? 'success' : 'primary'}`}>{g.status.replace('_', ' ')}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className={`progress-bar-fill ${g.status === 'completed' ? 'success' : ''}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-600)' }}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
