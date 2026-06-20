import React from 'react';
import {
  Users, Building2, CheckSquare, TrendingUp, TrendingDown,
  Clock, Star, ArrowUpRight, AlertTriangle, Activity,
  UserCheck, Calendar, BarChart2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { useEmployeeStore } from '../../store/employeeStore';
import { useTaskStore } from '../../store/taskStore';
import { useLeaveStore } from '../../store/leaveStore';
import { useOrgStore } from '../../store/orgStore';
import Avatar from '../../components/common/Avatar';

const DEPT_COLORS = ['#4f46e5','#db2777','#7c3aed','#059669','#0891b2','#d97706'];

const TASK_TREND = [
  { week: 'W1', completed: 8, created: 10 },
  { week: 'W2', completed: 12, created: 14 },
  { week: 'W3', completed: 9, created: 11 },
  { week: 'W4', completed: 15, created: 12 },
  { week: 'W5', completed: 18, created: 16 },
  { week: 'W6', completed: 14, created: 13 },
];

const ACTIVITY_FEED = [
  { id: 1, icon: UserCheck, color: 'var(--success-600)', bg: 'var(--success-50)', text: 'Olivia Thompson submitted task "Implement Dark Mode"', time: '5m ago' },
  { id: 2, icon: Calendar, color: 'var(--warning-600)', bg: 'var(--warning-50)', text: 'Zoe Nguyen applied for 3 days of earned leave', time: '22m ago' },
  { id: 3, icon: Users, color: 'var(--primary-600)', bg: 'var(--primary-50)', text: 'Marcus Rodriguez added Hassan Mirza to DevOps Team', time: '1h ago' },
  { id: 4, icon: CheckSquare, color: 'var(--info-600)', bg: 'var(--info-50)', text: 'Task "Employee Handbook Update 2026" marked complete', time: '2h ago' },
  { id: 5, icon: AlertTriangle, color: 'var(--danger-600)', bg: 'var(--danger-50)', text: 'Critical task "API Rate Limiting" deadline approaching', time: '3h ago' },
  { id: 6, icon: Star, color: '#7c3aed', bg: '#f5f3ff', text: 'Q2 Performance reviews opened for Engineering dept.', time: '5h ago' },
];

export default function AdminDashboard() {
  const { employees } = useEmployeeStore();
  const { tasks, getStats } = useTaskStore();
  const { requests: leaves } = useLeaveStore();
  const { departments, teams } = useOrgStore();
  const taskStats = getStats();

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const onLeave = employees.filter(e => e.status === 'on_leave').length;
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
  const criticalTasks = tasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length;

  const deptData = departments.map(d => ({
    name: d.name.slice(0, 4),
    fullName: d.name,
    members: employees.filter(e => e.departmentId === d.id).length,
    tasks: tasks.filter(t => t.departmentId === d.id).length,
  }));

  const statusPie = [
    { name: 'Active', value: activeEmployees, color: '#22c55e' },
    { name: 'On Leave', value: onLeave, color: '#f59e0b' },
    { name: 'Suspended', value: employees.filter(e => e.status === 'suspended').length, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const taskPie = [
    { name: 'Completed', value: taskStats.completed, color: '#22c55e' },
    { name: 'In Progress', value: taskStats.in_progress, color: '#4f46e5' },
    { name: 'Review', value: taskStats.under_review, color: '#f59e0b' },
    { name: 'Not Started', value: taskStats.not_started, color: '#94a3b8' },
    { name: 'Rejected', value: taskStats.rejected, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Organization Dashboard</h1>
          <p className="page-subtitle">Acme Technologies · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm">
            <BarChart2 size={15} /> Export Report
          </button>
          <button className="btn btn-primary btn-sm">
            <Users size={15} /> Add Employee
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6 stagger-children">
        {[
          { label: 'Total Employees', value: employees.length, icon: Users, variant: 'primary', change: '+3', dir: 'up', sub: 'This quarter' },
          { label: 'Active Today', value: activeEmployees, icon: UserCheck, variant: 'success', change: `${Math.round(activeEmployees/employees.length*100)}%`, dir: 'up', sub: 'Attendance rate' },
          { label: 'Active Tasks', value: taskStats.in_progress + taskStats.under_review, icon: CheckSquare, variant: 'warning', change: `${criticalTasks} critical`, dir: 'down', sub: 'Across all teams' },
          { label: 'Pending Leaves', value: pendingLeaves, icon: Calendar, variant: 'danger', change: 'Needs review', dir: 'down', sub: 'Awaiting approval' },
        ].map((card, i) => (
          <div key={i} className={`stat-card ${card.variant} animate-fade-in-up`} style={{ animationDelay: `${i * 0.08}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className={`stat-card-icon ${card.variant}`}>
                <card.icon size={20} strokeWidth={1.8} />
              </div>
              <div className={`stat-card-change ${card.dir}`}>
                {card.dir === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {card.change}
              </div>
            </div>
            <div>
              <div className="stat-card-value">{card.value}</div>
              <div className="stat-card-label">{card.label}</div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-12 gap-5 mb-5">
        {/* Task Trend */}
        <div className="card col-span-8">
          <div className="card-header">
            <span className="card-title">Task Completion Trend</span>
            <span className="badge badge-success badge-dot">Live</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={TASK_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--gray-500)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="completed" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4, fill: '#4f46e5' }} name="Completed" />
                <Line type="monotone" dataKey="created" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Created" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Status Pie */}
        <div className="card col-span-4">
          <div className="card-header">
            <span className="card-title">Employee Status</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={statusPie} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {statusPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%', marginTop: '0.5rem' }}>
              {statusPie.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
                    <span style={{ color: 'var(--gray-600)' }}>{s.name}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-12 gap-5 mb-5">
        {/* Dept Bar Chart */}
        <div className="card col-span-7">
          <div className="card-header">
            <span className="card-title">Department Overview</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deptData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--gray-500)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 12 }}
                  formatter={(v, n) => [v, n === 'members' ? 'Employees' : 'Tasks']}
                  labelFormatter={(l, p) => p?.[0]?.payload?.fullName || l}
                />
                <Bar dataKey="members" fill="#4f46e5" radius={[4,4,0,0]} name="members" />
                <Bar dataKey="tasks" fill="#a5b4fc" radius={[4,4,0,0]} name="tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Pie */}
        <div className="card col-span-5">
          <div className="card-header">
            <span className="card-title">Task Status</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{tasks.length} total</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={taskPie} cx="50%" cy="50%" outerRadius={60} dataKey="value" paddingAngle={2}>
                  {taskPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {taskPie.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                  {s.name} ({s.value})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-12 gap-5">
        {/* Activity Feed */}
        <div className="card col-span-7">
          <div className="card-header">
            <span className="card-title">Recent Activity</span>
            <button className="btn btn-ghost btn-sm">View all</button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="activity-feed" style={{ padding: '0 1.5rem' }}>
              {ACTIVITY_FEED.map(item => (
                <div key={item.id} className="activity-item">
                  <div className="activity-icon" style={{ background: item.bg }}>
                    <item.icon size={15} color={item.color} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">{item.text}</div>
                    <div className="activity-time">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card col-span-5">
          <div className="card-header">
            <span className="card-title">Platform Stats</span>
          </div>
          <div className="card-body">
            {[
              { label: 'Departments', value: departments.length, color: 'var(--primary-600)' },
              { label: 'Teams', value: teams.length, color: 'var(--success-600)' },
              { label: 'Tasks Completed This Month', value: taskStats.completed, color: 'var(--warning-600)' },
              { label: 'Overdue Tasks', value: taskStats.overdue, color: 'var(--danger-600)' },
              { label: 'Employees on Leave', value: onLeave, color: 'var(--info-600)' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{s.label}</span>
                <span style={{ fontWeight: 700, fontSize: '1.125rem', color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
