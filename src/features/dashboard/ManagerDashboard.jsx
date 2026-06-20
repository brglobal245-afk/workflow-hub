import React from 'react';
import { CheckSquare, Users, Clock, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { useEmployeeStore } from '../../store/employeeStore';
import Avatar from '../../components/common/Avatar';
import { useNavigate } from 'react-router-dom';

const RADAR_DATA = [
  { subject: 'Delivery', A: 88 }, { subject: 'Quality', A: 76 },
  { subject: 'Communication', A: 90 }, { subject: 'Velocity', A: 72 },
  { subject: 'Collaboration', A: 85 },
];

const WEEKLY_DATA = [
  { day: 'Mon', done: 3 }, { day: 'Tue', done: 5 }, { day: 'Wed', done: 2 },
  { day: 'Thu', done: 6 }, { day: 'Fri', done: 4 },
];

export default function ManagerDashboard() {
  const { currentUser } = useAuthStore();
  const { tasks, getTasksByAssignee } = useTaskStore();
  const { employees, getDirectReports } = useEmployeeStore();
  const navigate = useNavigate();
  const myTeam = getDirectReports(currentUser?.id);
  const myTasks = tasks.filter(t => t.creatorId === currentUser?.id || t.teamId === 't1');
  const pendingReviews = myTasks.filter(t => t.status === 'under_review');
  const inProgress = myTasks.filter(t => t.status === 'in_progress');

  const PRIORITY_COLORS = { critical: '#ef4444', high: '#f59e0b', medium: '#4f46e5', low: '#22c55e' };
  const STATUS_COLORS = { not_started: '#94a3b8', in_progress: '#4f46e5', under_review: '#f59e0b', completed: '#22c55e', rejected: '#ef4444' };

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manager Dashboard</h1>
          <p className="page-subtitle">Welcome back, {currentUser?.firstName}! Here's your team overview.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-6 stagger-children">
        {[
          { label: 'Team Members', value: myTeam.length, icon: Users, variant: 'primary' },
          { label: 'Active Tasks', value: inProgress.length, icon: CheckSquare, variant: 'warning' },
          { label: 'Pending Reviews', value: pendingReviews.length, icon: Clock, variant: 'danger' },
          { label: 'Completed This Week', value: 4, icon: Star, variant: 'success' },
        ].map((card, i) => (
          <div key={i} className={`stat-card ${card.variant}`}>
            <div className={`stat-card-icon ${card.variant}`}>
              <card.icon size={20} strokeWidth={1.8} />
            </div>
            <div>
              <div className="stat-card-value">{card.value}</div>
              <div className="stat-card-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        {/* Pending Reviews */}
        <div className="card col-span-7">
          <div className="card-header">
            <span className="card-title">Tasks Pending Review</span>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/tasks')}>View All</button>
          </div>
          <div style={{ padding: '0 1.5rem 1.5rem' }}>
            {pendingReviews.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <p style={{ color: 'var(--gray-400)' }}>No tasks pending review 🎉</p>
              </div>
            ) : pendingReviews.map(task => {
              const assignee = employees.find(e => e.id === task.assigneeId);
              return (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
                  onClick={() => navigate(`/tasks/${task.id}`)}>
                  <Avatar name={assignee ? `${assignee.firstName} ${assignee.lastName}` : '?'} color={assignee?.avatarColor} size="sm" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--gray-800)' }}>{task.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Submitted by {assignee?.firstName}</div>
                  </div>
                  <span className={`badge badge-${task.priority === 'critical' ? 'danger' : task.priority === 'high' ? 'warning' : 'gray'}`}>
                    {task.priority}
                  </span>
                  <button className="btn btn-primary btn-sm">Review</button>
                </div>
              );
            })}
            {myTasks.filter(t => t.status === 'in_progress').slice(0, 3).map(task => {
              const assignee = employees.find(e => e.id === task.assigneeId);
              return (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
                  <Avatar name={assignee ? `${assignee.firstName} ${assignee.lastName}` : '?'} color={assignee?.avatarColor} size="sm" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--gray-800)' }}>{task.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <div className="progress-bar" style={{ width: 100 }}>
                        <div className="progress-bar-fill" style={{ width: `${task.progress}%` }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{task.progress}%</span>
                    </div>
                  </div>
                  <span className="badge badge-primary">{task.status.replace('_',' ')}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Members */}
        <div className="card col-span-5">
          <div className="card-header">
            <span className="card-title">My Team</span>
            <span className="badge badge-primary">{myTeam.length} members</span>
          </div>
          <div style={{ padding: '0 1.5rem 1.5rem' }}>
            {myTeam.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                Your direct reports will appear here
              </div>
            ) : myTeam.slice(0, 5).map(emp => (
              <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
                onClick={() => navigate(`/employees/${emp.id}`)}>
                <Avatar name={`${emp.firstName} ${emp.lastName}`} color={emp.avatarColor} size="sm" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--gray-800)' }}>{emp.firstName} {emp.lastName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{emp.position}</div>
                </div>
                <span className={`badge badge-${emp.status === 'active' ? 'success' : emp.status === 'on_leave' ? 'warning' : 'gray'} badge-dot`}>
                  {emp.status === 'active' ? 'Active' : emp.status === 'on_leave' ? 'On Leave' : emp.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Delivery & Radar */}
      <div className="grid grid-cols-12 gap-5">
        <div className="card col-span-7">
          <div className="card-header"><span className="card-title">Weekly Task Delivery</span></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={WEEKLY_DATA} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--gray-500)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 12 }} />
                <Bar dataKey="done" fill="#4f46e5" radius={[6,6,0,0]} name="Tasks Done" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card col-span-5">
          <div className="card-header"><span className="card-title">Team Performance Radar</span></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="var(--gray-200)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--gray-500)' }} />
                <Radar name="Team" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
