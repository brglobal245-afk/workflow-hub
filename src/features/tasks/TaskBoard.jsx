import React, { useState } from 'react';
import { Plus, List, Columns, Calendar, Paperclip, MessageCircle } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { useOrgStore } from '../../store/orgStore';
import Avatar from '../../components/common/Avatar';
import CreateTaskModal from './CreateTaskModal';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const COLUMNS = [
  { key: 'not_started',  label: 'Not Started',  color: '#94a3b8', bg: '#f8fafc' },
  { key: 'in_progress',  label: 'In Progress',   color: '#4f46e5', bg: '#eef2ff' },
  { key: 'under_review', label: 'Under Review',  color: '#f59e0b', bg: '#fffbeb' },
  { key: 'completed',    label: 'Completed',     color: '#22c55e', bg: '#f0fdf4' },
  { key: 'rejected',     label: 'Rejected',      color: '#ef4444', bg: '#fef2f2' },
];

const PRIORITY_BADGES = { critical: 'danger', high: 'warning', medium: 'primary', low: 'success' };

export default function TaskBoard() {
  const { tasks, updateTaskStatus } = useTaskStore();
  const { currentUser, hasPermission } = useAuthStore();
  const { getEmployee } = useEmployeeStore();
  const { departments } = useOrgStore();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('kanban');
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('all');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const canCreate = hasPermission('create_task');

  const filtered = tasks.filter(t => {
    if (filter === 'mine') return t.assigneeId === currentUser?.id;
    if (filter === 'created') return t.creatorId === currentUser?.id;
    return true;
  }).filter(t => !filterPriority || t.priority === filterPriority)
    .filter(t => !filterDept || t.departmentId === filterDept);

  const getTasksForCol = (status) => filtered.filter(t => t.status === status);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      toast.success(`Task moved to ${newStatus.replace('_', ' ')}`);
    } catch (e) {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Task Management</h1>
          <p className="page-subtitle">{filtered.length} tasks · {getTasksForCol('in_progress').length} in progress</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className={`btn btn-icon ${viewMode === 'kanban' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('kanban')} title="Kanban view">
            <Columns size={16} />
          </button>
          <button className={`btn btn-icon ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('list')} title="List view">
            <List size={16} />
          </button>
          {canCreate && (
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={16} /> Create Task
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-5">
        <div style={{ padding: '0.875rem 1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="tabs-pill" style={{ margin: 0 }}>
            {[['all','All Tasks'],['mine','My Tasks'],['created','Created by Me']].map(([k,l]) => (
              <button key={k} className={`tab-btn ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <select className="form-control form-control-sm" style={{ width: 130 }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
              <option value="">All Priorities</option>
              {['critical','high','medium','low'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
            </select>
            <select className="form-control form-control-sm" style={{ width: 150 }} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' ? (
        <div className="kanban-board">
          {COLUMNS.map(col => {
            const colTasks = getTasksForCol(col.key);
            return (
              <div key={col.key} className="kanban-column">
                <div className="kanban-column-header" style={{ borderBottom: `3px solid ${col.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                    <span style={{ color: 'var(--gray-700)' }}>{col.label}</span>
                  </div>
                  <span className="badge" style={{ background: `${col.color}20`, color: col.color }}>{colTasks.length}</span>
                </div>
                <div className="kanban-cards">
                  {colTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', color: 'var(--gray-300)', fontSize: '0.8125rem' }}>
                      No tasks here
                    </div>
                  ) : colTasks.map(task => {
                    const assignee = getEmployee(task.assigneeId);
                    const isOverdue = task.deadline && task.deadline < new Date().toISOString().split('T')[0] && task.status !== 'completed';
                    return (
                      <div key={task.id} className="kanban-card" onClick={() => navigate(`/tasks/${task.id}`)}>
                        {/* Priority indicator */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span className={`badge badge-${PRIORITY_BADGES[task.priority] || 'primary'}`} style={{ fontSize: '0.6875rem' }}>
                            {task.priority === 'critical' && '🔴 '}{task.priority}
                          </span>
                          {task.deadline && (
                            <span style={{ fontSize: '0.6875rem', color: isOverdue ? 'var(--danger-600)' : 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 2, fontWeight: isOverdue ? 600 : 400 }}>
                              <Calendar size={10} /> {task.deadline}
                            </span>
                          )}
                        </div>

                        <div className="kanban-card-title">{task.title}</div>

                        {/* Progress */}
                        {task.progress > 0 && (
                          <div style={{ margin: '0.5rem 0' }}>
                            <div className="progress-bar" style={{ height: 4 }}>
                              <div className="progress-bar-fill" style={{ width: `${task.progress}%` }} />
                            </div>
                          </div>
                        )}

                        <div className="kanban-card-meta">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.6875rem', color: 'var(--gray-400)' }}>
                            {task.attachments > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}><Paperclip size={11} /> {task.attachments}</span>}
                            {task.comments > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}><MessageCircle size={11} /> {task.comments}</span>}
                          </div>
                          {assignee && (
                            <Avatar name={`${assignee.firstName} ${assignee.lastName}`} color={assignee.avatarColor} size="xs" />
                          )}
                        </div>

                        {/* Quick status change */}
                        {col.key !== 'completed' && col.key !== 'rejected' && (
                          <div style={{ marginTop: '0.625rem', display: 'flex', gap: '0.375rem' }} onClick={e => e.stopPropagation()}>
                            {col.key === 'not_started' && (
                              <button className="btn btn-primary btn-sm" style={{ fontSize: '0.6875rem', padding: '2px 8px' }} onClick={() => handleStatusChange(task.id, 'in_progress')}>Start →</button>
                            )}
                            {col.key === 'in_progress' && (
                              <button className="btn btn-warning btn-sm" style={{ fontSize: '0.6875rem', padding: '2px 8px', background: 'var(--warning-500)', color: '#fff', border: 'none' }} onClick={() => handleStatusChange(task.id, 'under_review')}>Review →</button>
                            )}
                            {col.key === 'under_review' && hasPermission('review_task') && (
                              <>
                                <button className="btn btn-success btn-sm" style={{ fontSize: '0.6875rem', padding: '2px 8px' }} onClick={() => handleStatusChange(task.id, 'completed')}>✓ Approve</button>
                                <button className="btn btn-danger btn-sm" style={{ fontSize: '0.6875rem', padding: '2px 8px' }} onClick={() => handleStatusChange(task.id, 'rejected')}>✗ Reject</button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Deadline</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>No tasks found</td></tr>
                ) : filtered.map(task => {
                  const assignee = getEmployee(task.assigneeId);
                  const dept = departments.find(d => d.id === task.departmentId);
                  const col = COLUMNS.find(c => c.key === task.status);
                  const isOverdue = task.deadline && task.deadline < new Date().toISOString().split('T')[0] && task.status !== 'completed';
                  return (
                    <tr key={task.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/tasks/${task.id}`)}>
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--gray-900)', maxWidth: 280 }}>{task.title}</div>
                      </td>
                      <td><span className={`badge badge-${PRIORITY_BADGES[task.priority] || 'primary'}`}>{task.priority}</span></td>
                      <td>
                        {assignee ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar name={`${assignee.firstName} ${assignee.lastName}`} color={assignee.avatarColor} size="xs" />
                            <span style={{ fontSize: '0.8125rem', color: 'var(--gray-700)' }}>{assignee.firstName}</span>
                          </div>
                        ) : '—'}
                      </td>
                      <td>
                        <span className="badge" style={{ background: `${col?.color}20`, color: col?.color }}>
                          {col?.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="progress-bar" style={{ width: 60, height: 5 }}>
                            <div className="progress-bar-fill" style={{ width: `${task.progress}%` }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{task.progress}%</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', color: isOverdue ? 'var(--danger-600)' : 'var(--gray-500)', fontWeight: isOverdue ? 600 : 400 }}>
                          {task.deadline}
                        </span>
                      </td>
                      <td>{dept ? <span className="badge badge-gray">{dept.name}</span> : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreateTaskModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
