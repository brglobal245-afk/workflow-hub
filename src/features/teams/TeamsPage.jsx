import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useOrgStore } from '../../store/orgStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { useTaskStore } from '../../store/taskStore';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const TEAM_COLORS = ['#4f46e5','#059669','#7c3aed','#db2777','#0891b2','#d97706'];

export default function TeamsPage() {
  const { employees } = useEmployeeStore();
  const { tasks } = useTaskStore();
  const { teams, departments, createTeam } = useOrgStore();
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState(null);

  // Form states
  const [teamName, setTeamName] = useState('');
  const [deptId, setDeptId] = useState('');
  const [leaderId, setLeaderId] = useState('');
  const [description, setDescription] = useState('');

  const getLeader = (id) => employees.find(e => e.id === id);
  const getMembers = (teamId) => employees.filter(e => e.teamId === teamId);
  const getDept = (id) => departments.find(d => d.id === id);
  const getTeamTasks = (teamId) => tasks.filter(t => t.teamId === teamId);

  const handleCreate = async () => {
    if (!teamName) {
      toast.error('Team name is required.');
      return;
    }
    try {
      await createTeam({
        name: teamName,
        departmentId: deptId || null,
        leaderId: leaderId || null,
        description,
      });
      toast.success('Team created successfully!');
      setShowCreate(false);
      // Reset
      setTeamName('');
      setDeptId('');
      setLeaderId('');
      setDescription('');
    } catch (e) {
      toast.error('Failed to create team.');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Teams</h1>
          <p className="page-subtitle">{teams.length} teams across the organization</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Create Team
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {teams.map((team, i) => {
          const leader = getLeader(team.leader_id);
          const members = getMembers(team.id);
          const dept = getDept(team.department_id);
          const teamTasks = getTeamTasks(team.id);
          const color = team.color || TEAM_COLORS[i % TEAM_COLORS.length];

          return (
            <div key={team.id} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', overflow: 'visible' }}
              onClick={() => setSelected({ team, leader, members, dept, teamTasks, color })}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
              <div style={{ height: 6, background: color, borderRadius: '14px 14px 0 0' }} />
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)', marginBottom: '0.25rem' }}>{team.name}</h3>
                    {dept && <span className="badge badge-gray">{dept.name}</span>}
                  </div>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {team.description}
                </p>

                {/* Leader */}
                {leader && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem 0.75rem', background: `${color}08`, borderRadius: 8, border: `1px solid ${color}20` }}>
                    <Avatar name={`${leader.firstName} ${leader.lastName}`} color={leader.avatarColor} size="xs" />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: color, fontWeight: 600 }}>Team Lead: </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-700)', fontWeight: 500 }}>{leader.firstName} {leader.lastName}</span>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color }}>{members.length}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Members</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color }}>{teamTasks.length}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tasks</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color }}>{teamTasks.filter(t => t.status === 'completed').length}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Done</div>
                  </div>
                </div>

                {/* Members */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="avatar-group">
                    {members.slice(0, 4).map(m => (
                      <Avatar key={m.id} name={`${m.firstName} ${m.lastName}`} color={m.avatarColor} size="xs" style={{ border: '2px solid white' }} />
                    ))}
                  </div>
                  {members.length > 4 && <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>+{members.length - 4}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Detail Modal */}
      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected.team.name} size="lg"
          footer={<button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.6 }}>{selected.team.description}</p>
            {selected.dept && <div><span className="badge badge-primary">{selected.dept.name} Department</span></div>}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-700)', marginBottom: '0.75rem' }}>
                Team Members ({selected.members.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selected.members.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem', background: 'var(--gray-50)', borderRadius: 8 }}>
                    <Avatar name={`${m.firstName} ${m.lastName}`} color={m.avatarColor} size="sm" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                        {m.firstName} {m.lastName}
                        {m.id === selected.team.leader_id && <span className="badge badge-primary" style={{ marginLeft: '0.5rem' }}>Lead</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{m.position}</div>
                    </div>
                    <span className={`badge badge-${m.status === 'active' ? 'success' : 'warning'} badge-dot`}>{m.status}</span>
                  </div>
                ))}
              </div>
            </div>
            {selected.teamTasks.length > 0 && (
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-700)', marginBottom: '0.75rem' }}>Active Tasks</div>
                {selected.teamTasks.filter(t => t.status !== 'completed').slice(0, 4).map(task => (
                  <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: task.priority === 'critical' ? '#ef4444' : task.priority === 'high' ? '#f59e0b' : '#4f46e5', flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: '0.875rem', color: 'var(--gray-700)' }}>{task.title}</div>
                    <span className={`badge badge-${task.status === 'under_review' ? 'warning' : 'primary'}`}>{task.status.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Team" size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Create Team</button>
          </>
        }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Team Name <span className="required">*</span></label>
            <input className="form-control" placeholder="e.g. Platform Team" value={teamName} onChange={e => setTeamName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-control" value={deptId} onChange={e => setDeptId(e.target.value)}>
              <option value="">Select department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Team Lead</label>
            <select className="form-control" value={leaderId} onChange={e => setLeaderId(e.target.value)}>
              <option value="">Select lead</option>
              {employees.filter(e => e.status === 'active').map(e => (
                <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={3} placeholder="Team purpose and responsibilities" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
