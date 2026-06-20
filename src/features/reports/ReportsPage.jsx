import React, { useState } from 'react';
import { Download, BarChart2, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { useEmployeeStore } from '../../store/employeeStore';
import { useTaskStore } from '../../store/taskStore';
import { useOrgStore } from '../../store/orgStore';
import toast from 'react-hot-toast';

const COLORS = ['#4f46e5','#22c55e','#f59e0b','#ef4444','#0891b2','#7c3aed'];

const ATTENDANCE_DATA = [
  { month: 'Jan', present: 22, absent: 1, late: 2 },
  { month: 'Feb', present: 20, absent: 2, late: 3 },
  { month: 'Mar', present: 23, absent: 0, late: 1 },
  { month: 'Apr', present: 21, absent: 1, late: 2 },
  { month: 'May', present: 22, absent: 2, late: 1 },
  { month: 'Jun', present: 18, absent: 1, late: 3 },
];

const TASK_TREND = [
  { month: 'Jan', created: 18, completed: 15 },
  { month: 'Feb', created: 22, completed: 19 },
  { month: 'Mar', created: 15, completed: 14 },
  { month: 'Apr', created: 28, completed: 24 },
  { month: 'May', created: 20, completed: 18 },
  { month: 'Jun', created: 12, completed: 8 },
];

const HEADCOUNT_TREND = [
  { month: 'Jan', count: 20 },
  { month: 'Feb', count: 21 },
  { month: 'Mar', count: 22 },
  { month: 'Apr', count: 22 },
  { month: 'May', count: 25 },
  { month: 'Jun', count: 26 },
];

export default function ReportsPage() {
  const { employees } = useEmployeeStore();
  const { tasks, getStats } = useTaskStore();
  const { departments } = useOrgStore();
  const taskStats = getStats();
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('6m');

  const deptData = departments.map(d => ({
    name: d.name,
    employees: employees.filter(e => e.departmentId === d.id).length,
    tasks: tasks.filter(t => t.departmentId === d.id).length,
  }));

  const taskPieData = [
    { name: 'Completed', value: taskStats.completed, color: '#22c55e' },
    { name: 'In Progress', value: taskStats.in_progress, color: '#4f46e5' },
    { name: 'Review', value: taskStats.under_review, color: '#f59e0b' },
    { name: 'Not Started', value: taskStats.not_started, color: '#94a3b8' },
    { name: 'Rejected', value: taskStats.rejected, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const empTypePie = [
    { name: 'Full Time', value: employees.filter(e => e.employmentType === 'full_time').length, color: '#4f46e5' },
    { name: 'Part Time', value: employees.filter(e => e.employmentType === 'part_time').length, color: '#059669' },
    { name: 'Contract', value: employees.filter(e => e.employmentType === 'contract').length, color: '#f59e0b' },
    { name: 'Intern', value: employees.filter(e => e.employmentType === 'intern').length, color: '#7c3aed' },
  ].filter(d => d.value > 0);

  const REPORT_TYPES = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'employees', label: '👥 Employees' },
    { key: 'tasks', label: '✅ Tasks' },
    { key: 'attendance', label: '🕐 Attendance' },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Organizational insights and performance data</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select className="form-control form-control-sm" style={{ width: 130 }} value={dateRange} onChange={e => setDateRange(e.target.value)}>
            {[['1m','Last Month'],['3m','Last 3 Months'],['6m','Last 6 Months'],['1y','Last Year']].map(([k,l]) => (
              <option key={k} value={k}>{l}</option>
            ))}
          </select>
          <button className="btn btn-secondary" onClick={() => toast.success('Report exported!')}>
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="tabs-pill mb-6">
        {REPORT_TYPES.map(r => (
          <button key={r.key} className={`tab-btn ${reportType === r.key ? 'active' : ''}`} onClick={() => setReportType(r.key)}>{r.label}</button>
        ))}
      </div>

      {/* Overview */}
      {reportType === 'overview' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Total Employees', value: employees.length, sub: `${employees.filter(e=>e.status==='active').length} active` },
              { label: 'Total Tasks', value: tasks.length, sub: `${taskStats.completed} completed` },
              { label: 'Departments', value: departments.length, sub: `${departments.filter(d => d.status !== 'inactive').length} active` },
              { label: 'Completion Rate', value: `${tasks.length ? Math.round((taskStats.completed/tasks.length)*100) : 0}%`, sub: 'Tasks this month' },
            ].map((s, i) => (
              <div key={i} className="card">
                <div style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--primary-600)', marginBottom: '0.25rem' }}>{s.value}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-700)', marginBottom: '0.125rem' }}>{s.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-5">
            <div className="card col-span-8">
              <div className="card-header"><span className="card-title">Headcount Growth</span></div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={HEADCOUNT_TREND}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--gray-500)' }} axisLine={false} tickLine={false} domain={[18, 28]} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 12 }} />
                    <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2.5} fill="url(#areaGrad)" name="Employees" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card col-span-4">
              <div className="card-header"><span className="card-title">Department Headcount</span></div>
              <div className="card-body">
                {deptData.map((d, i) => (
                  <div key={d.name} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--gray-600)' }}>{d.name}</span>
                      <span style={{ fontWeight: 600, color: COLORS[i % COLORS.length] }}>{d.employees}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${(d.employees / employees.length) * 100}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Employees Report */}
      {reportType === 'employees' && (
        <div className="grid grid-cols-12 gap-5">
          <div className="card col-span-6">
            <div className="card-header"><span className="card-title">Employment Types</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={empTypePie} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                    {empTypePie.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                {empTypePie.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--gray-600)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card col-span-6">
            <div className="card-header"><span className="card-title">Employees by Department</span></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deptData} layout="vertical" barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 12 }} />
                  <Bar dataKey="employees" fill="#4f46e5" radius={[0,4,4,0]} name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Report */}
      {reportType === 'tasks' && (
        <div className="grid grid-cols-12 gap-5">
          <div className="card col-span-8">
            <div className="card-header"><span className="card-title">Task Completion Trend</span></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={TASK_TREND} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--gray-500)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="completed" fill="#22c55e" radius={[4,4,0,0]} name="Completed" />
                  <Bar dataKey="created" fill="#94a3b8" radius={[4,4,0,0]} name="Created" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card col-span-4">
            <div className="card-header"><span className="card-title">Task Status Distribution</span></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={taskPieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" paddingAngle={2}>
                    {taskPieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              {taskPieData.map(d => (
                <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.375rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-600)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                    {d.name}
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Report */}
      {reportType === 'attendance' && (
        <div className="grid grid-cols-1 gap-5">
          <div className="card">
            <div className="card-header"><span className="card-title">Monthly Attendance Overview</span></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ATTENDANCE_DATA} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--gray-500)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="present" fill="#22c55e" radius={[4,4,0,0]} name="Present" />
                  <Bar dataKey="late" fill="#f59e0b" radius={[4,4,0,0]} name="Late" />
                  <Bar dataKey="absent" fill="#ef4444" radius={[4,4,0,0]} name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
