import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { useOrgStore } from '../../store/orgStore';
import toast from 'react-hot-toast';

export default function CreateTaskModal({ isOpen, onClose }) {
  const { createTask } = useTaskStore();
  const { currentUser } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { departments, teams } = useOrgStore();
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium', deadline: '',
    assigneeId: '', teamId: '', departmentId: '', tags: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    createTask({
      ...form,
      creatorId: currentUser?.id,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
    });
    toast.success('Task created successfully!');
    setForm({ title: '', description: '', priority: 'medium', deadline: '', assigneeId: '', teamId: '', departmentId: '', tags: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="lg"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Create Task</button>
        </>
      }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Title <span className="required">*</span></label>
          <input className="form-control" placeholder="Enter task title" value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows={3} placeholder="Describe the task in detail..." value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-control" value={form.priority} onChange={e => set('priority', e.target.value)}>
              {['critical','high','medium','low'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input className="form-control" type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Assignee</label>
            <select className="form-control" value={form.assigneeId} onChange={e => set('assigneeId', e.target.value)}>
              <option value="">Select assignee</option>
              {employees.filter(e => e.status === 'active').map(e => (
                <option key={e.id} value={e.id}>{e.firstName} {e.lastName} — {e.position}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-control" value={form.departmentId} onChange={e => set('departmentId', e.target.value)}>
              <option value="">Select department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Team</label>
            <select className="form-control" value={form.teamId} onChange={e => set('teamId', e.target.value)}>
              <option value="">Select team</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tags</label>
            <input className="form-control" placeholder="frontend, ui, urgent (comma-separated)" value={form.tags} onChange={e => set('tags', e.target.value)} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
