import React, { useState } from 'react';
import { Briefcase, User, Phone, CheckCircle2, ArrowRight, ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { toast } from 'react-hot-toast';
import animationVideo from '../../assets/animation.mp4';

const POSITION_SUGGESTIONS = [
  'Founder & CEO',
  'Co-Founder & CTO',
  'VP of Engineering',
  'HR Director',
  'Operations Manager',
  'Product Manager',
  'Senior Frontend Developer',
  'Business Analyst'
];

export default function OnboardingOverlay() {
  const { currentUser, roles, fetchUserProfile, logout } = useAuthStore();
  const { updateEmployee } = useEmployeeStore();

  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [position, setPosition] = useState('');
  const [roleId, setRoleId] = useState(currentUser?.roleId || 'r7');
  const [submitting, setSubmitting] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim()) {
        toast.error('First name and Last name are required.');
        return;
      }
    }
    if (step === 2) {
      if (!position.trim()) {
        toast.error('Please specify your position or job title.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !position.trim() || !roleId) {
      toast.error('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Update the employee details in the database
      await updateEmployee(currentUser.id, {
        firstName,
        lastName,
        phone,
        position,
        roleId,
      });

      // 2. Refresh profile inside the authStore to update effective permissions and clear onboarding position ('New Employee')
      await fetchUserProfile(currentUser.id);
      
      toast.success('Onboarding complete! Welcome to WorkFlow Hub.');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRole = roles.find(r => r.id === roleId);
  const canAddMembers = roleId === 'r1' || roleId === 'r5';

  return (
    <div className="onboarding-page-container">
      <style>{`
        .onboarding-page-container {
          background: #f8fafc;
          color: #0f172a;
          min-height: 100vh;
          width: 100vw;
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          font-family: var(--font-sans);
          overflow-y: auto;
          background-image: radial-gradient(circle at 12% 18%, rgba(99, 102, 241, 0.04) 0%, transparent 45%),
                            radial-gradient(circle at 88% 82%, rgba(99, 102, 241, 0.05) 0%, transparent 45%);
        }

        .btn-onboarding-logout {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #64748b;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: var(--transition-fast);
          z-index: 10000;
          box-shadow: var(--shadow-xs);
        }
        .btn-onboarding-logout:hover {
          color: var(--danger-600);
          background: var(--danger-50);
          border-color: var(--danger-100);
        }

        .onboarding-split-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          width: 100%;
          max-width: 1100px;
          min-height: 600px;
          box-shadow: var(--shadow-xl);
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          overflow: hidden;
          position: relative;
        }

        /* Left Side */
        .onboarding-animation-panel {
          background: #f1f5f9;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          border-right: 1px solid #e2e8f0;
          position: relative;
        }

        .onboarding-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .onboarding-brand-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
        }

        .onboarding-brand-text {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
        }

        .onboarding-video-wrapper {
          width: 100%;
          height: 320px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
          background: #ffffff;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin: 2rem 0;
        }

        .onboarding-video-element {
          width: 135%;
          height: 100%;
          object-fit: cover;
          object-position: left center;
          display: block;
        }

        .onboarding-welcome-message h3 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .onboarding-welcome-message p {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        /* Right Side Form */
        .onboarding-form-panel {
          padding: 3.5rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #ffffff;
          position: relative;
        }

        .onboarding-steps {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .onboarding-step-dot {
          height: 6px;
          border-radius: 3px;
          background: #cbd5e1;
          flex: 1;
          transition: all 0.3s;
        }

        .onboarding-step-dot.active {
          background: var(--primary-600);
          flex: 1.8;
        }

        .onboarding-step-dot.completed {
          background: var(--success-500);
        }

        .onboarding-form-header {
          margin-bottom: 2rem;
        }

        .onboarding-form-title {
          font-family: var(--font-display);
          font-size: 1.625rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .onboarding-form-subtitle {
          font-size: 0.875rem;
          color: #64748b;
        }

        .onboarding-form-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          flex: 1;
        }

        .suggestion-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .suggestion-tag {
          font-size: 0.75rem;
          background: #f1f5f9;
          color: #475569;
          padding: 0.375rem 0.75rem;
          border-radius: 99px;
          cursor: pointer;
          transition: all 0.15s;
          border: 1px solid transparent;
        }
        .suggestion-tag:hover {
          background: var(--primary-50);
          color: var(--primary-700);
          border-color: var(--primary-200);
        }

        .role-option-card {
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          position: relative;
        }
        .role-option-card:hover {
          border-color: var(--primary-300);
          background: #fdfdfd;
        }
        .role-option-card.selected {
          border-color: var(--primary-600);
          background: var(--primary-50);
        }

        .role-indicator-badge {
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 0.25rem;
          display: inline-block;
        }

        .role-info-pill {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.25rem;
          margin-top: 1rem;
          box-shadow: var(--shadow-sm);
        }

        .role-permission-tip {
          display: flex;
          align-items: flex-start;
          gap: 0.625rem;
          font-size: 0.8125rem;
          line-height: 1.4;
          color: #475569;
        }

        .onboarding-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }

        @media (max-width: 900px) {
          .onboarding-split-card {
            grid-template-columns: 1fr;
            max-width: 480px;
          }
          .onboarding-animation-panel {
            display: none;
          }
          .onboarding-form-panel {
            padding: 3rem 2rem;
          }
        }
      `}</style>

      {/* Logout button to exit if they logged in by mistake */}
      <button className="btn-onboarding-logout" onClick={() => logout()}>
        Log Out
      </button>

      <div className="onboarding-split-card">
        {/* Left Panel */}
        <div className="onboarding-animation-panel">
          <div className="onboarding-brand">
            <div className="onboarding-brand-icon">
              <Sparkles size={18} color="#ffffff" />
            </div>
            <span className="onboarding-brand-text">WorkFlow Hub</span>
          </div>

          <div className="onboarding-video-wrapper">
            <video
              src={animationVideo}
              autoPlay
              loop
              muted
              playsInline
              className="onboarding-video-element"
            />
          </div>

          <div className="onboarding-welcome-message">
            <h3>Organize Your Workspace</h3>
            <p>Define your organizational role and position. Add other team members to get everyone working in perfect coordination.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="onboarding-form-panel">
          <div>
            {/* Step Stepper Indicator */}
            <div className="onboarding-steps">
              <div className={`onboarding-step-dot ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`} />
              <div className={`onboarding-step-dot ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`} />
              <div className={`onboarding-step-dot ${step === 3 ? 'active' : ''}`} />
            </div>

            {/* Step 1: Contact details */}
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="onboarding-form-header">
                  <h2 className="onboarding-form-title">
                    <User size={24} className="text-primary" /> Let's verify your name
                  </h2>
                  <p className="onboarding-form-subtitle">Confirm how you would like your name to appear in the directory.</p>
                </div>
                <div className="onboarding-form-body">
                  <div className="form-group">
                    <label className="form-label">First Name <span className="required">*</span></label>
                    <input
                      className="form-control"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Jane"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name <span className="required">*</span></label>
                    <input
                      className="form-control"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <div className="input-group">
                      <Phone size={16} className="input-icon" />
                      <input
                        className="form-control"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Position */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="onboarding-form-header">
                  <h2 className="onboarding-form-title">
                    <Briefcase size={24} className="text-primary" /> What is your job title?
                  </h2>
                  <p className="onboarding-form-subtitle">Enter your official position inside the organization.</p>
                </div>
                <div className="onboarding-form-body">
                  <div className="form-group">
                    <label className="form-label">Position / Job Title <span className="required">*</span></label>
                    <input
                      className="form-control"
                      value={position}
                      onChange={e => setPosition(e.target.value)}
                      placeholder="e.g. Founder & CEO, Operations Lead"
                      required
                    />
                  </div>

                  <div style={{ marginTop: '0.5rem' }}>
                    <label className="form-label">Popular Suggestions</label>
                    <div className="suggestion-tags">
                      {POSITION_SUGGESTIONS.map(sug => (
                        <span
                          key={sug}
                          className="suggestion-tag"
                          onClick={() => setPosition(sug)}
                        >
                          {sug}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: System Role selection */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="animate-fade-in">
                <div className="onboarding-form-header">
                  <h2 className="onboarding-form-title">
                    <Shield size={24} className="text-primary" /> {currentUser?.roleId === 'r1' ? 'Confirm your system role' : 'Your system role'}
                  </h2>
                  <p className="onboarding-form-subtitle">
                    {currentUser?.roleId === 'r1' 
                      ? 'Verify the administrative authorization level for your new organization.' 
                      : 'Your role assigned by the organization configuration.'}
                  </p>
                </div>
                <div className="onboarding-form-body">
                  <div className="form-group">
                    <label className="form-label">System Role <span className="required">*</span></label>
                    <select
                      className="form-control"
                      value={roleId}
                      onChange={e => setRoleId(e.target.value)}
                      required
                      disabled={currentUser?.roleId !== 'r1'}
                    >
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name} (Authority Level: {r.authority_level})
                        </option>
                      ))}
                    </select>
                    {currentUser?.roleId !== 'r1' && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--warning-600)', marginTop: '0.25rem', display: 'block' }}>
                        ⚠️ Role selection is locked for standard employees. Contact your admin to request promotions.
                      </span>
                    )}
                  </div>

                  {selectedRole && (
                    <div className="role-info-pill">
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>{selectedRole.name} Details</span>
                        <span 
                          style={{ 
                            fontSize: '0.75rem', 
                            background: selectedRole.color + '20', 
                            color: selectedRole.color,
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          Level {selectedRole.authority_level}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.875rem' }}>
                        {selectedRole.description || 'Standard permissions assignment.'}
                      </p>

                      <div className="role-permission-tip">
                        {canAddMembers ? (
                          <>
                            <Sparkles size={16} style={{ color: 'var(--success-600)', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <strong className="text-success">Management Access:</strong> Under this role, you can add other members, assign their roles/departments, and manage organizational workflows.
                            </div>
                          </>
                        ) : (
                          <>
                            <Shield size={16} style={{ color: 'var(--warning-600)', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <strong className="text-warning">View & Restrict Access:</strong> Under this role, you cannot invite or add other organization members. You must be added or elevated by an Administrator.
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Wizard Navigation Footer */}
          <div className="onboarding-form-footer">
            {step > 1 ? (
              <button className="btn btn-secondary" onClick={handleBack} disabled={submitting}>
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <div /> // Placeholder
            )}

            {step < 3 ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn btn-primary" 
                onClick={handleSubmit} 
                disabled={submitting}
                style={{ background: 'var(--success-600)', borderColor: 'var(--success-600)' }}
              >
                {submitting ? (
                  <>
                    <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Finalizing setup...
                  </>
                ) : (
                  <>
                    Complete Setup <CheckCircle2 size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
