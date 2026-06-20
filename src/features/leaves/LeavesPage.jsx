import React, { useState } from 'react';
import { Plus, Calendar, Check, X, Clock } from 'lucide-react';
import { useLeaveStore } from '../../store/leaveStore';
import { useAuthStore } from '../../store/authStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { PERMISSIONS } from '../../constants/permissions';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const LEAVE_TYPES = {
  casual: { label: 'Casual Leave', color: '#4f46e5', bg: '#eef2ff' },
  sick: { label: 'Sick Leave', color: '#ef4444', bg: '#fef2f2' },
  earned: { label: 'Earned Leave', color: '#22c55e', bg: '#f0fdf4' },
  maternity: { label: 'Maternity Leave', color: '#db2777', bg: '#fdf2f8' },
  paternity: { label: 'Paternity Leave', color: '#0891b2', bg: '#eff6ff' },
  custom: { label: 'Other', color: '#7c3aed', bg: '#f5f3ff' },
};

const STATUS_INFO = {
  pending:   { label: 'Pending',   badge: 'warning' },
  approved:  { label: 'Approved',  badge: 'success' },
  rejected:  { label: 'Rejected',  badge: 'danger' },
  cancelled: { label: 'Cancelled', badge: 'gray' },
};

export default function LeavesPage() {
  const { currentUser, hasPermission } = useAuthStore();
  const { requests, getUserRequests, getPendingRequests, applyLeave, approveLeave, rejectLeave } = useLeaveStore();
  const { employees, getEmployee } = useEmployeeStore();
  const [tab, setTab] = useState('my');
  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState({ type: 'casual', startDate: '', endDate: '', reason: '' });

  const canApprove = hasPermission(PERMISSIONS.APPROVE_LEAVE);
  const myRequests = getUserRequests(currentUser?.id);
  const pendingRequests = getPendingRequests();

  const balance = {
    casual: { total: 12, used: 0, pending: 0 },
    sick: { total: 10, used: 0, pending: 0 },
    earned: { total: 15, used: 0, pending: 0 },
  };

  myRequests.forEach(req => {
    if (balance[req.type]) {
      const days = req.days || 1;
      if (req.status === 'approved') {
        balance[req.type].used += days;
      } else if (req.status === 'pending') {
        balance[req.type].pending += days;
      }
    }
  });

  const handleApply = () => {
    if (!form.startDate || !form.endDate || !form.reason) { toast.error('Please fill all required fields'); return; }
    const days = Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1;
    applyLeave({ ...form, userId: currentUser?.id, days });
    toast.success('Leave request submitted!');
    setShowApply(false);
    setForm({ type: 'casual', startDate: '', endDate: '', reason: '' });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">Manage leave requests and approvals</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowApply(true)}>
          <Plus size={16} /> Apply for Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      {balance && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(LEAVE_TYPES).filter(([k]) => balance[k]).map(([type, info]) => {
            const bal = balance[type];
            return (
              <div key={type} className="card">
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-700)' }}>{info.label}</span>
                    <span className="badge" style={{ background: info.bg, color: info.color }}>
                      {bal.total - bal.used - bal.pending} remaining
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
                    {[['Total', bal.total, info.color], ['Used', bal.used, 'var(--gray-600)'], ['Pending', bal.pending, 'var(--warning-600)']].map(([l, v, c]) => (
                      <div key={l} style={{ background: 'var(--gray-50)', borderRadius: 8, padding: '0.5rem' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: c }}>{v}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${((bal.used + bal.pending) / bal.total) * 100}%`, background: info.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${tab === 'my' ? 'active' : ''}`} onClick={() => setTab('my')}>My Requests</button>
        {canApprove && (
          <button className={`tab-btn ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>
            Pending Approval
            {pendingRequests.length > 0 && <span className="badge badge-danger" style={{ marginLeft: '0.375rem' }}>{pendingRequests.length}</span>}
          </button>
        )}
      </div>

      {/* My Requests */}
      {tab === 'my' && (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Applied On</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>No leave requests</td></tr>
                ) : myRequests.map(req => {
                  const typeInfo = LEAVE_TYPES[req.type];
                  const statusInfo = STATUS_INFO[req.status];
                  return (
                    <tr key={req.id}>
                      <td>
                        <span className="badge" style={{ background: typeInfo?.bg, color: typeInfo?.color }}>
                          {typeInfo?.label}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--gray-700)' }}>
                        {req.startDate} {req.startDate !== req.endDate && `→ ${req.endDate}`}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{req.days} {req.days === 1 ? 'day' : 'days'}</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', maxWidth: 200 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.reason}</div>
                      </td>
                      <td><span className={`badge badge-${statusInfo?.badge} badge-dot`}>{statusInfo?.label}</span></td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{req.appliedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending for Approval */}
      {tab === 'pending' && canApprove && (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>No pending requests 🎉</td></tr>
                ) : pendingRequests.map(req => {
                  const emp = getEmployee(req.userId);
                  const typeInfo = LEAVE_TYPES[req.type];
                  return (
                    <tr key={req.id}>
                      <td>
                        {emp && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <Avatar name={`${emp.firstName} ${emp.lastName}`} color={emp.avatarColor} size="sm" />
                            <div>
                              <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{emp.firstName} {emp.lastName}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{emp.position}</div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td><span className="badge" style={{ background: typeInfo?.bg, color: typeInfo?.color }}>{typeInfo?.label}</span></td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--gray-700)' }}>{req.startDate} → {req.endDate}</td>
                      <td style={{ fontWeight: 600 }}>{req.days}d</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', maxWidth: 180 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.reason}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <button className="btn btn-success btn-sm" onClick={() => { approveLeave(req.id, currentUser?.id); toast.success('Leave approved!'); }}>
                            <Check size={13} /> Approve
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => { rejectLeave(req.id, currentUser?.id, ''); toast.error('Leave rejected'); }}>
                            <X size={13} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      <Modal isOpen={showApply} onClose={() => setShowApply(false)} title="Apply for Leave" size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowApply(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleApply}>Submit Request</button>
          </>
        }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Leave Type <span className="required">*</span></label>
            <select className="form-control" value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>
              {Object.entries(LEAVE_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Start Date <span className="required">*</span></label>
              <input className="form-control" type="date" value={form.startDate} onChange={e => setForm(f => ({...f, startDate: e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date <span className="required">*</span></label>
              <input className="form-control" type="date" value={form.endDate} onChange={e => setForm(f => ({...f, endDate: e.target.value}))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reason <span className="required">*</span></label>
            <textarea className="form-control" rows={4} placeholder="Please provide a reason for your leave..." value={form.reason} onChange={e => setForm(f => ({...f, reason: e.target.value}))} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
