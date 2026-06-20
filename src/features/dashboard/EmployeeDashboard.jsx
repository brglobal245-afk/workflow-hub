import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, MessageSquare, Megaphone, Star, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { useAttendanceStore } from '../../store/attendanceStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useAnnouncementStore } from '../../store/announcementStore';
import { usePerformanceStore } from '../../store/performanceStore';
import { useNavigate } from 'react-router-dom';

const ANNOUNCE_COLORS = { general: 'primary', hr: 'success', policy: 'warning', emergency: 'danger', event: 'purple' };

export default function EmployeeDashboard() {
  const { currentUser } = useAuthStore();
  const { tasks } = useTaskStore();
  const { getTodayRecord, checkIn, checkOut, startBreak, endBreak, breakStarted } = useAttendanceStore();
  const { getForUser } = useNotificationStore();
  const { announcements } = useAnnouncementStore();
  const { goals } = usePerformanceStore();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const myTasks = tasks.filter(t => t.assigneeId === currentUser?.id);
  const pendingTasks = myTasks.filter(t => !['completed','rejected'].includes(t.status));
  const completedTasks = myTasks.filter(t => t.status === 'completed');
  const todayRecord = getTodayRecord(currentUser?.id);
  const notifications = getForUser(currentUser?.id).filter(n => !n.read);
  const userGoals = goals.filter(g => g.userId === currentUser?.id);

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const STATUS_COLORS = { not_started: '#94a3b8', in_progress: '#4f46e5', under_review: '#f59e0b', completed: '#22c55e', rejected: '#ef4444' };
  const PRIORITY_BADGE = { critical: 'danger', high: 'warning', medium: 'primary', low: 'success' };

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Good {time.getHours() < 12 ? 'Morning' : time.getHours() < 17 ? 'Afternoon' : 'Evening'}, {currentUser?.firstName}! 👋</h1>
          <p className="page-subtitle">{dateStr}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        {/* Check-in Widget */}
        <div className="col-span-4">
          <div className="checkin-widget">
            <div className="checkin-clock">{timeStr}</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '1.5rem' }}>{dateStr}</div>
            {!todayRecord ? (
              <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', width: '100%', justifyContent: 'center' }}
                onClick={() => checkIn(currentUser?.id)}>
                <CheckCircle size={18} /> Check In
              </button>
            ) : !todayRecord.checkOut ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem' }}>
                  ✅ Checked in at <strong>{todayRecord.checkIn}</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-sm" style={{ flex: 1, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', justifyContent: 'center' }}
                    onClick={() => breakStarted ? endBreak(currentUser?.id) : startBreak(currentUser?.id)}>
                    {breakStarted ? '▶ End Break' : '⏸ Break'}
                  </button>
                  <button className="btn btn-sm" style={{ flex: 1, background: 'rgba(255,100,100,0.3)', color: '#fff', border: '1px solid rgba(255,100,100,0.3)', justifyContent: 'center' }}
                    onClick={() => checkOut(currentUser?.id)}>
                    Check Out
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem' }}>
                ✅ {todayRecord.checkIn} → {todayRecord.checkOut} · Day Complete
              </div>
            )}
          </div>
        </div>

        {/* My Tasks */}
        <div className="card col-span-8">
          <div className="card-header">
            <span className="card-title">My Tasks</span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="badge badge-primary">{pendingTasks.length} pending</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tasks')}>View all <ArrowRight size={13} /></button>
            </div>
          </div>
          <div style={{ padding: 0 }}>
            {myTasks.length === 0 ? (
              <div className="empty-state"><p>No tasks assigned yet.</p></div>
            ) : myTasks.slice(0, 4).map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
                onClick={() => navigate(`/tasks/${task.id}`)}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[task.status], flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <div className="progress-bar" style={{ width: 80 }}>
                      <div className="progress-bar-fill" style={{ width: `${task.progress}%`, background: task.status === 'completed' ? 'var(--success-500)' : undefined }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{task.progress}%</span>
                  </div>
                </div>
                <span className={`badge badge-${PRIORITY_BADGE[task.priority]}`}>{task.priority}</span>
                <span style={{ fontSize: '0.75rem', color: task.deadline < new Date().toISOString().split('T')[0] ? 'var(--danger-600)' : 'var(--gray-400)', fontWeight: 500 }}>
                  {task.deadline}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        {/* Announcements */}
        <div className="card col-span-7">
          <div className="card-header">
            <span className="card-title">Latest Announcements</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/announcements')}>View all</button>
          </div>
          <div style={{ padding: '0.5rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {announcements.length === 0 ? (
              <div className="empty-state" style={{ minHeight: 120 }}><p>No announcements yet.</p></div>
            ) : announcements.slice(0, 3).map(ann => (
              <div key={ann.id} className="announcement-card">
                <div className={`announcement-stripe ${ann.type}`} />
                <div style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-900)' }}>{ann.title}</span>
                    <span className={`badge badge-${ANNOUNCE_COLORS[ann.type] || 'primary'}`} style={{ flexShrink: 0 }}>{ann.type}</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ann.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Goals */}
        <div className="card col-span-5">
          <div className="card-header">
            <span className="card-title">My Goals</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/performance')}>View all</button>
          </div>
          <div className="card-body">
            {userGoals.length === 0 ? (
              <div className="empty-state" style={{ minHeight: 120 }}><p>No goals set yet.</p></div>
            ) : userGoals.slice(0, 3).map(g => {
              const pct = Math.min(100, Math.round((g.current / g.target) * 100));
              const isCompleted = g.status === 'completed';
              return (
                <div key={g.id} className="goal-item">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-800)', flex: 1, marginRight: '0.5rem' }}>
                      {g.title}
                    </span>
                    {isCompleted && <CheckCircle size={16} color="var(--success-600)" />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className={`progress-bar-fill ${isCompleted ? 'success' : ''}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isCompleted ? 'var(--success-600)' : 'var(--primary-600)', minWidth: 32, textAlign: 'right' }}>{pct}%</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Due: {g.dueDate}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
