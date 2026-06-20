import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Paperclip, MessageCircle, User, Building2, Users, Tag, CheckCircle, X } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { useAuthStore } from '../../store/authStore';
import { useOrgStore } from '../../store/orgStore';
import { PERMISSIONS } from '../../constants/permissions';
import Avatar from '../../components/common/Avatar';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { key: 'not_started', label: 'Not Started', color: '#94a3b8' },
  { key: 'in_progress', label: 'In Progress', color: '#4f46e5' },
  { key: 'under_review', label: 'Under Review', color: '#f59e0b' },
  { key: 'completed', label: 'Completed', color: '#22c55e' },
  { key: 'rejected', label: 'Rejected', color: '#ef4444' },
];

const PRIORITY_BADGES = { critical: 'danger', high: 'warning', medium: 'primary', low: 'success' };
const PROGRESS_STEPS = [0,10,20,30,40,50,60,70,80,90,100];

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTask, updateTask, updateTaskStatus } = useTaskStore();
  const { getEmployee } = useEmployeeStore();
  const { currentUser, hasPermission } = useAuthStore();
  const { departments, teams } = useOrgStore();
  const task = getTask(id);

  if (!task) return (
    <div className="empty-state">
      <p className="empty-state-title">Task not found</p>
      <button className="btn btn-primary mt-4" onClick={() => navigate('/tasks')}>Back to Tasks</button>
    </div>
  );

  const assignee = getEmployee(task.assigneeId);
  const creator = getEmployee(task.creatorId);
  const dept = departments.find(d => d.id === task.departmentId);
  const team = teams.find(t => t.id === task.teamId);
  const curStatus = STATUS_OPTIONS.find(s => s.key === task.status);

  const isAssignee = task.assigneeId === currentUser?.id;
  const canReview = hasPermission(PERMISSIONS.REVIEW_TASK);

  const handleStatusChange = (status) => {
    updateTaskStatus(id, status);
    toast.success(`Status updated to "${status.replace('_', ' ')}"`);
  };

  const handleProgressChange = (progress) => {
    updateTask(id, { progress: parseInt(progress) });
    toast.success(`Progress updated to ${progress}%`);
  };

  return (
    <div className="animate-fade-in-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
          <span style={{ cursor: 'pointer', color: 'var(--primary-600)' }} onClick={() => navigate('/tasks')}>Tasks</span>
          {' / '} {task.title}
        </span>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Main Content */}
        <div className="col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header */}
          <div className="card">
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1rem' }}>
                <span className={`badge badge-${PRIORITY_BADGES[task.priority]}`} style={{ marginTop: '0.1rem' }}>
                  {task.priority === 'critical' && '🔴 '}{task.priority}
                </span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--gray-900)', flex: 1, lineHeight: 1.3 }}>
                  {task.title}
                </h1>
              </div>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
                {task.description}
              </p>
              {task.tags && (
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                  {task.tags.map(tag => (
                    <span key={tag} style={{ padding: '0.25rem 0.625rem', background: 'var(--primary-50)', color: 'var(--primary-600)', borderRadius: 20, fontSize: '0.8125rem', fontWeight: 500 }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Progress & Status */}
          <div className="card">
            <div className="card-header"><span className="card-title">Progress & Status</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Progress */}
              {(isAssignee || canReview) && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--gray-700)' }}>Task Progress</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{task.progress}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 10, marginBottom: '0.75rem' }}>
                    <div className="progress-bar-fill" style={{ width: `${task.progress}%` }} />
                  </div>
                  {isAssignee && (
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                      {PROGRESS_STEPS.map(p => (
                        <button key={p}
                          onClick={() => handleProgressChange(p)}
                          className={`btn btn-sm ${task.progress === p ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                          {p}%
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Status Flow */}
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--gray-700)', marginBottom: '0.75rem' }}>Status</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {STATUS_OPTIONS.map(opt => (
                    <button key={opt.key}
                      onClick={() => (isAssignee || canReview) && handleStatusChange(opt.key)}
                      disabled={!isAssignee && !canReview}
                      style={{
                        padding: '0.5rem 1rem', borderRadius: 8,
                        background: task.status === opt.key ? opt.color : 'var(--gray-100)',
                        color: task.status === opt.key ? '#fff' : 'var(--gray-600)',
                        border: `2px solid ${task.status === opt.key ? opt.color : 'transparent'}`,
                        fontWeight: task.status === opt.key ? 600 : 400,
                        fontSize: '0.8125rem', cursor: (isAssignee || canReview) ? 'pointer' : 'default',
                        transition: 'all 0.15s',
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submission Box (for assignee) */}
              {isAssignee && task.status === 'in_progress' && (
                <div style={{ background: 'var(--primary-50)', borderRadius: 10, padding: '1rem', border: '1px solid var(--primary-100)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary-700)', marginBottom: '0.75rem' }}>Submit Work for Review</div>
                  <textarea className="form-control" rows={3} placeholder="Add notes about your submission..." style={{ marginBottom: '0.75rem' }} />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm">📎 Attach File</button>
                    <button className="btn btn-primary btn-sm" onClick={() => {
                      handleStatusChange('under_review');
                      toast.success('Work submitted for review!');
                    }}>Submit for Review →</button>
                  </div>
                </div>
              )}

              {/* Review box */}
              {canReview && task.status === 'under_review' && (
                <div style={{ background: 'var(--warning-50)', borderRadius: 10, padding: '1rem', border: '1px solid var(--warning-100)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--warning-700)', marginBottom: '0.75rem' }}>Review Submission</div>
                  <textarea className="form-control" rows={2} placeholder="Add reviewer comments..." style={{ marginBottom: '0.75rem' }} />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-success btn-sm" onClick={() => { handleStatusChange('completed'); toast.success('Task approved!'); }}>
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => { handleStatusChange('rejected'); toast.error('Task rejected'); }}>
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Details */}
          <div className="card">
            <div className="card-header"><span className="card-title">Details</span></div>
            <div style={{ padding: '1rem 1.25rem' }}>
              {[
                { icon: User, label: 'Assignee', content: assignee ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Avatar name={`${assignee.firstName} ${assignee.lastName}`} color={assignee.avatarColor} size="xs" />
                    <span>{assignee.firstName} {assignee.lastName}</span>
                  </div>
                ) : '—' },
                { icon: User, label: 'Created By', content: creator ? `${creator.firstName} ${creator.lastName}` : '—' },
                { icon: Building2, label: 'Department', content: dept?.name || '—' },
                { icon: Users, label: 'Team', content: team?.name || '—' },
                { icon: Calendar, label: 'Deadline', content: task.deadline || '—' },
                { icon: Calendar, label: 'Created', content: task.createdAt || '—' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '0.75rem', padding: '0.625rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <item.icon size={15} color="var(--gray-400)" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '0.125rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-700)', fontWeight: 500 }}>{item.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status badge */}
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${curStatus?.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: curStatus?.color }} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: curStatus?.color }}>{curStatus?.label}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginTop: '0.25rem' }}>Current status</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
