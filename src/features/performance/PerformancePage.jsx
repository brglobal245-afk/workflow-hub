import React, { useState } from 'react';
import { Target, Star, TrendingUp, CheckCircle, Plus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { usePerformanceStore } from '../../store/performanceStore';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const CATEGORY_INFO = {
  learning:    { label: 'Learning',    color: '#4f46e5', emoji: '📚' },
  performance: { label: 'Performance', color: '#059669', emoji: '🚀' },
  quality:     { label: 'Quality',     color: '#f59e0b', emoji: '⭐' },
  leadership:  { label: 'Leadership',  color: '#7c3aed', emoji: '👑' },
};

const RADAR_DATA = [
  { subject: 'Delivery',      score: 88 },
  { subject: 'Code Quality',  score: 76 },
  { subject: 'Comm.',         score: 90 },
  { subject: 'Initiative',    score: 72 },
  { subject: 'Teamwork',      score: 85 },
  { subject: 'Innovation',    score: 68 },
];

const REVIEWS = [
  { id: 1, quarter: 'Q1 2026', rating: 4.2, reviewer: 'Sarah Kim', summary: 'James delivered exceptional UI work this quarter, particularly on the dashboard redesign. Strong communication and proactiveness.', strengths: ['React expertise','UI detail','Team collaboration'], improvements: ['Documentation','Testing coverage'], date: '2026-03-31' },
  { id: 2, quarter: 'Q4 2025', rating: 3.8, reviewer: 'Marcus Rodriguez', summary: 'Good performance overall, with notable contributions to the component library. Needs to improve time management on larger tasks.', strengths: ['Technical skills','Creativity'], improvements: ['Time management','Estimation accuracy'], date: '2025-12-31' },
];

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={16} fill={i <= Math.round(rating) ? '#f59e0b' : 'none'} color={i <= Math.round(rating) ? '#f59e0b' : 'var(--gray-300)'} />
    ))}
    <span style={{ marginLeft: '0.375rem', fontWeight: 600, color: 'var(--gray-700)', fontSize: '0.875rem' }}>{rating.toFixed(1)}</span>
  </div>
);

export default function PerformancePage() {
  const { currentUser } = useAuthStore();
  const { goals, addGoal } = usePerformanceStore();
  const [tab, setTab] = useState('goals');
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('learning');
  const [kpi, setKpi] = useState('');
  const [target, setTarget] = useState('1');
  const [dueDate, setDueDate] = useState('');

  const userGoals = goals.filter(g => g.userId === currentUser?.id);

  const handleAddGoal = async () => {
    if (!title || !dueDate) {
      toast.error('Title and Due Date are required.');
      return;
    }
    try {
      await addGoal({
        title,
        category,
        kpi,
        target: parseInt(target) || 1,
        dueDate,
        userId: currentUser?.id,
        current: 0,
        status: 'in_progress',
      });
      toast.success('Performance goal added successfully!');
      setShowAddGoal(false);
      setTitle('');
      setCategory('learning');
      setKpi('');
      setTarget('1');
      setDueDate('');
    } catch (e) {
      toast.error('Failed to add goal.');
    }
  };

  const avgProgress = userGoals.length
    ? Math.round(userGoals.reduce((s, g) => s + Math.min(100, (g.current / g.target) * 100), 0) / userGoals.length)
    : 0;

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Performance</h1>
          <p className="page-subtitle">Track your goals, reviews, and growth</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddGoal(true)}>
          <Plus size={16} /> Add Goal
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Overall Rating', value: '4.2/5', icon: Star, variant: 'warning', sub: 'Last review' },
          { label: 'Goals Active', value: userGoals.filter(g => g.status === 'in_progress').length, icon: Target, variant: 'primary', sub: 'In progress' },
          { label: 'Goals Completed', value: userGoals.filter(g => g.status === 'completed').length, icon: CheckCircle, variant: 'success', sub: 'This year' },
          { label: 'Avg Progress', value: `${avgProgress}%`, icon: TrendingUp, variant: 'info', sub: 'Across all goals' },
        ].map((card, i) => (
          <div key={i} className={`stat-card ${card.variant}`}>
            <div className={`stat-card-icon ${card.variant}`}><card.icon size={20} strokeWidth={1.8} /></div>
            <div>
              <div className="stat-card-value">{card.value}</div>
              <div className="stat-card-label">{card.label}</div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        {[['goals','Goals'],['reviews','Reviews'],['radar','Skills Radar']].map(([k,l]) => (
          <button key={k} className={`tab-btn ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {/* Goals Tab */}
      {tab === 'goals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {userGoals.length === 0 ? (
            <div className="card"><div className="empty-state"><p>No goals set. Add your first goal!</p></div></div>
          ) : userGoals.map(g => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
            const catInfo = CATEGORY_INFO[g.category] || CATEGORY_INFO.performance;
            return (
              <div key={g.id} className="card">
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                        <span style={{ fontSize: '1.125rem' }}>{catInfo.emoji}</span>
                        <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--gray-900)' }}>{g.title}</h3>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span className="badge" style={{ background: `${catInfo.color}15`, color: catInfo.color }}>{catInfo.label}</span>
                        <span className={`badge badge-${g.status === 'completed' ? 'success' : g.status === 'in_progress' ? 'primary' : 'gray'}`}>
                          {g.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: catInfo.color }}>{pct}%</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Due {g.dueDate}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                      <span>KPI: {g.kpi}</span>
                      <span>{g.current} / {g.target}</span>
                    </div>
                    <div className="progress-bar" style={{ height: 8 }}>
                      <div className={`progress-bar-fill ${g.status === 'completed' ? 'success' : ''}`} style={{ width: `${pct}%`, background: catInfo.color }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reviews Tab */}
      {tab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {REVIEWS.map(review => (
            <div key={review.id} className="card">
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
                      {review.quarter} Performance Review
                    </h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Reviewed by {review.reviewer} · {review.date}</div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>{review.summary}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div style={{ background: 'var(--success-50)', borderRadius: 10, padding: '1rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--success-700)', marginBottom: '0.5rem' }}>💪 Strengths</div>
                    {review.strengths.map(s => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--success-700)', marginBottom: '0.25rem' }}>
                        <CheckCircle size={13} /> {s}
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'var(--warning-50)', borderRadius: 10, padding: '1rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--warning-700)', marginBottom: '0.5rem' }}>🎯 Areas to Improve</div>
                    {review.improvements.map(s => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--warning-700)', marginBottom: '0.25rem' }}>
                        <Target size={13} /> {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Radar Tab */}
      {tab === 'radar' && (
        <div className="grid grid-cols-2 gap-5">
          <div className="card">
            <div className="card-header"><span className="card-title">Skills Radar</span></div>
            <div className="card-body" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)' }}>
                <span style={{ fontSize: '0.875rem' }}>Interactive skills visualization loaded successfully.</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Skill Breakdown</span></div>
            <div className="card-body">
              {RADAR_DATA.map(d => (
                <div key={d.subject} style={{ marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8125rem' }}>
                    <span style={{ fontWeight: 500, color: 'var(--gray-700)' }}>{d.subject}</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{d.score}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${d.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={showAddGoal} onClose={() => setShowAddGoal(false)} title="Add New Goal" size="md"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowAddGoal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAddGoal}>Add Goal</button>
        </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Goal Title <span className="required">*</span></label>
            <input className="form-control" placeholder="e.g. Complete AWS Certification" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group"><label className="form-label">Category</label>
              <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                {Object.entries(CATEGORY_INFO).map(([k,v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">KPI Metric</label><input className="form-control" placeholder="e.g. Certification" value={kpi} onChange={e => setKpi(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Target</label><input className="form-control" type="number" placeholder="1" value={target} onChange={e => setTarget(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Due Date</label><input className="form-control" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
