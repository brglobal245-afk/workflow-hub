import React, { useState } from 'react';
import { FileText, Download, Eye, Upload, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { useDocumentStore } from '../../store/documentStore';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const DOC_TYPES = {
  policy:    { label: 'Policy',     badge: 'primary', icon: '📋' },
  report:    { label: 'Report',     badge: 'warning', icon: '📊' },
  contract:  { label: 'Contract',   badge: 'danger',  icon: '📝' },
  guide:     { label: 'Guide',      badge: 'success', icon: '📚' },
  technical: { label: 'Technical',  badge: 'info',    icon: '⚙️' },
};

const FORMAT_COLORS = { pdf: '#ef4444', docx: '#2563eb', xlsx: '#16a34a', pptx: '#f59e0b' };

export default function DocumentsPage() {
  const { currentUser } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { documents, uploadDocument } = useDocumentStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('policy');
  const [type, setType] = useState('pdf');
  const [accessLevel, setAccessLevel] = useState('all');

  const filtered = documents.filter(d =>
    (!search || d.title.toLowerCase().includes(search.toLowerCase())) &&
    (!filterType || d.category === filterType)
  );

  const getOwner = (id) => employees.find(e => e.id === id);

  const handleUpload = async () => {
    if (!title) {
      toast.error('Document title is required.');
      return;
    }
    try {
      await uploadDocument({
        title,
        category,
        type,
        size: '1.4 MB',
        uploadedBy: currentUser?.id,
        accessLevel,
      });
      toast.success('Document uploaded successfully!');
      setShowUpload(false);
      setTitle('');
      setCategory('policy');
      setType('pdf');
      setAccessLevel('all');
    } catch (e) {
      toast.error('Failed to upload document.');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">{documents.length} documents across the organization</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
          <Upload size={16} /> Upload Document
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-5">
        <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
            <Search size={15} color="var(--gray-400)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." />
          </div>
          <select className="form-control form-control-sm" style={{ width: 160 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Categories</option>
            {Object.entries(DOC_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(doc => {
          const typeInfo = DOC_TYPES[doc.category] || DOC_TYPES.policy;
          const owner = getOwner(doc.uploadedBy);
          const fmtColor = FORMAT_COLORS[doc.type] || 'var(--gray-500)';

          return (
            <div key={doc.id} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '0.875rem' }}>
                  <div style={{ width: 44, height: 52, background: `${fmtColor}15`, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={20} color={fmtColor} />
                    <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: fmtColor, textTransform: 'uppercase', marginTop: '0.125rem' }}>{doc.type}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-900)', lineHeight: 1.4, marginBottom: '0.25rem' }}>{doc.title}</div>
                    <span className={`badge badge-${typeInfo?.badge}`}>{typeInfo?.icon} {typeInfo?.label}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1rem', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--gray-400)' }}>Size:</span> {doc.size}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--gray-400)' }}>Uploaded:</span> {new Date(doc.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  {owner && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span style={{ color: 'var(--gray-400)' }}>By:</span>
                      <Avatar name={`${owner.firstName} ${owner.lastName}`} color={owner.avatarColor} size="xs" />
                      <span>{owner.firstName} {owner.lastName}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => toast.success('Opening document...')}>
                    <Eye size={13} /> View
                  </button>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => toast.success('Download started!')}>
                    <Download size={13} /> Download
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p className="empty-state-title">No documents found</p>
          <p className="empty-state-text">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload Document" size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
          </>
        }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Document Title <span className="required">*</span></label>
            <input className="form-control" placeholder="e.g. Employee Guidelines 2026" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
              {Object.entries(DOC_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Format Type</label>
            <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
              <option value="xlsx">XLSX</option>
              <option value="pptx">PPTX</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Access Level</label>
            <select className="form-control" value={accessLevel} onChange={e => setAccessLevel(e.target.value)}>
              <option value="all">All Employees</option>
              <option value="department">Department Only</option>
              <option value="hr">HR Only</option>
              <option value="admin">Admin Only</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
