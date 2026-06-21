import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, Grid, List, MoreVertical } from 'lucide-react';
import { useEmployeeStore } from '../../store/employeeStore';
import { useAuthStore } from '../../store/authStore';
import { useOrgStore } from '../../store/orgStore';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const EMP_TYPES = { full_time: 'Full Time', part_time: 'Part Time', contract: 'Contract', freelancer: 'Freelancer', intern: 'Intern' };
const STATUS_INFO = {
  active: { label: 'Active', badge: 'success' },
  on_leave: { label: 'On Leave', badge: 'warning' },
  suspended: { label: 'Suspended', badge: 'danger' },
  resigned: { label: 'Resigned', badge: 'gray' },
};
const TYPE_BADGE = { full_time: 'primary', part_time: 'info', contract: 'orange', freelancer: 'purple', intern: 'yellow' };

export default function EmployeeDirectory() {
  const { employees, addEmployee } = useEmployeeStore();
  const { hasPermission, roles } = useAuthStore();
  const { departments } = useOrgStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // grid | list
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('add') === 'true' && hasPermission('create_user')) {
      setShowAddModal(true);
    }
  }, [location, hasPermission]);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deptId, setDeptId] = useState('');
  const [empType, setEmpType] = useState('full_time');
  const [position, setPosition] = useState('');
  const [roleId, setRoleId] = useState('');
  const [joiningDate, setJoiningDate] = useState('');

  const filtered = employees.filter(e => {
    const name = `${e.firstName} ${e.lastName}`.toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()) || e.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchDept = !filterDept || e.departmentId === filterDept;
    const matchStatus = !filterStatus || e.status === filterStatus;
    const matchType = !filterType || e.employmentType === filterType;
    return matchSearch && matchDept && matchStatus && matchType;
  }).sort((a, b) => {
    if (sortBy === 'name') return `${a.firstName}${a.lastName}`.localeCompare(`${b.firstName}${b.lastName}`);
    if (sortBy === 'joined') return new Date(b.joiningDate) - new Date(a.joiningDate);
    return 0;
  });

  const getDeptName = (id) => departments.find(d => d.id === id)?.name || '—';
  const getRoleName = (id) => roles.find(r => r.id === id)?.name || '—';

  // Static strings for permissions to verify RLS limits
  const canAdd = hasPermission('create_user');

  const handleAddEmployee = async () => {
    if (!firstName || !lastName || !email) {
      toast.error('First name, Last name, and Email are required.');
      return;
    }
    try {
      await addEmployee({
        firstName,
        lastName,
        email,
        phone,
        departmentId: deptId || null,
        employmentType: empType,
        position,
        roleId: roleId || 'r7', // standard Employee role by default
        joiningDate: joiningDate || new Date().toISOString().split('T')[0],
        status: 'active',
        skills: [],
        bio: '',
        location: 'San Francisco, CA',
        avatarColor: 'blue',
      });
      toast.success('Employee created successfully! A password setup link has been sent to their email.');
      setShowAddModal(false);
      // Reset
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setDeptId('');
      setEmpType('full_time');
      setPosition('');
      setRoleId('');
      setJoiningDate('');
    } catch (e) {
      toast.error(`Failed to add employee: ${e.message}`);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Directory</h1>
          <p className="page-subtitle">{filtered.length} of {employees.length} employees</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className={`btn btn-icon btn-secondary ${viewMode === 'grid' ? 'btn-primary' : ''}`}
            onClick={() => setViewMode('grid')} title="Grid view"
          ><Grid size={16} /></button>
          <button
            className={`btn btn-icon btn-secondary ${viewMode === 'list' ? 'btn-primary' : ''}`}
            onClick={() => setViewMode('list')} title="List view"
          ><List size={16} /></button>
          {canAdd && (
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Add Employee
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-5">
        <div className="card-body" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
            <Search size={15} color="var(--gray-400)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or ID..." />
          </div>
          <select className="form-control form-control-sm" style={{ width: 160 }} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select className="form-control form-control-sm" style={{ width: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {Object.entries(STATUS_INFO).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select className="form-control form-control-sm" style={{ width: 140 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {Object.entries(EMP_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select className="form-control form-control-sm" style={{ width: 130 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="name">Sort: Name</option>
            <option value="joined">Sort: Newest</option>
          </select>
          {(search || filterDept || filterStatus || filterType) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setFilterDept(''); setFilterStatus(''); setFilterType(''); }}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-4 gap-4">
          {filtered.map(emp => (
            <div key={emp.id} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', padding: 0 }}
              onClick={() => navigate(`/employees/${emp.id}`)}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
                <Avatar name={`${emp.firstName} ${emp.lastName}`} color={emp.avatarColor} size="2xl" style={{ margin: '0 auto 1rem' }} />
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--gray-900)', marginBottom: '0.25rem' }}>{emp.firstName} {emp.lastName}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: '0.625rem' }}>{emp.position}</div>
                <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <span className={`badge badge-${STATUS_INFO[emp.status]?.badge || 'gray'} badge-dot`}>{STATUS_INFO[emp.status]?.label || emp.status}</span>
                  <span className={`badge badge-${TYPE_BADGE[emp.employmentType] || 'gray'}`}>{EMP_TYPES[emp.employmentType] || emp.employmentType}</span>
                </div>
              </div>
              <div style={{ padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', gap: '0.375rem' }}>
                  <span style={{ color: 'var(--gray-400)' }}>Dept:</span>
                  <span style={{ fontWeight: 500, color: 'var(--gray-700)' }}>{getDeptName(emp.departmentId)}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', gap: '0.375rem' }}>
                  <span style={{ color: 'var(--gray-400)' }}>ID:</span>
                  <span style={{ fontWeight: 500, color: 'var(--gray-700)' }}>{emp.employeeId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List/Table View */
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>ID</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>No employees found</td></tr>
                ) : filtered.map(emp => (
                  <tr key={emp.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/employees/${emp.id}`)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Avatar name={`${emp.firstName} ${emp.lastName}`} color={emp.avatarColor} size="sm" />
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--gray-900)' }}>{emp.firstName} {emp.lastName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--gray-600)' }}>{emp.employeeId}</span></td>
                    <td>
                      {emp.departmentId ? (
                        <span className="badge badge-gray">{getDeptName(emp.departmentId)}</span>
                      ) : <span style={{ color: 'var(--gray-400)', fontSize: '0.8125rem' }}>—</span>}
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{getRoleName(emp.roleId)}</td>
                    <td><span className={`badge badge-${TYPE_BADGE[emp.employmentType] || 'gray'}`}>{EMP_TYPES[emp.employmentType] || emp.employmentType}</span></td>
                    <td><span className={`badge badge-${STATUS_INFO[emp.status]?.badge || 'gray'} badge-dot`}>{STATUS_INFO[emp.status]?.label || emp.status}</span></td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{new Date(emp.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-icon btn-sm"><MoreVertical size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Employee" size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddEmployee}>Add Employee</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">First Name <span className="required">*</span></label>
            <input className="form-control" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name <span className="required">*</span></label>
            <input className="form-control" placeholder="Smith" value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email <span className="required">*</span></label>
            <input className="form-control" type="email" placeholder="john.smith@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-control" placeholder="+1 (555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-control" value={deptId} onChange={e => setDeptId(e.target.value)}>
              <option value="">Select department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Employment Type</label>
            <select className="form-control" value={empType} onChange={e => setEmpType(e.target.value)}>
              {Object.entries(EMP_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Position / Title</label>
            <input className="form-control" placeholder="Software Engineer" value={position} onChange={e => setPosition(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">System Role</label>
            <select className="form-control" value={roleId} onChange={e => setRoleId(e.target.value)}>
              <option value="">Select system role</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Joining Date</label>
            <input className="form-control" type="date" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
