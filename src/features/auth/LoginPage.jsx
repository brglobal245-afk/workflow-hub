import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, ArrowLeft, ArrowRight, Mail, Lock, User, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { toast, Toaster } from 'react-hot-toast';
import animationVideo from '../../assets/animation.mp4';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, register } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  
  // Login form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Sign up form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  
  // Organization setup fields
  const [isCompanyOwner, setIsCompanyOwner] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [signUpOrgId, setSignUpOrgId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Set active tab based on query params (e.g. ?signup=true)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('signup') === 'true') {
      setActiveTab('signup');
    } else {
      setActiveTab('login');
    }
  }, [location]);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Signed in successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to sign in. Verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !signUpEmail || !signUpPassword) {
      toast.error('All fields are required.');
      return;
    }
    if (isCompanyOwner && !companyName.trim()) {
      toast.error('Company Name is required.');
      return;
    }
    if (!isCompanyOwner && !signUpOrgId.trim()) {
      toast.error('Organization ID is required.');
      return;
    }
    if (signUpPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await register(
        signUpEmail, 
        signUpPassword, 
        firstName, 
        lastName,
        isCompanyOwner ? companyName.trim() : null,
        !isCompanyOwner ? signUpOrgId.trim() : null
      );
      if (res?.session) {
        toast.success('Account created successfully!');
      } else {
        toast.success('Registration successful! Please check your email for confirmation.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <Toaster position="top-right" />
      <style>{`
        .auth-page-container {
          background: #f8fafc;
          color: #0f172a;
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2.5rem;
          font-family: var(--font-sans);
          overflow-y: auto;
          background-image: radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
                            radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.04) 0%, transparent 50%);
        }

        .btn-back-home {
          position: absolute;
          top: 2rem;
          left: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #64748b;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: var(--transition-fast);
          z-index: 10;
          box-shadow: var(--shadow-xs);
        }
        .btn-back-home:hover {
          color: #0f172a;
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .auth-split-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          width: 100%;
          max-width: 1080px;
          min-height: 600px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          overflow: hidden;
          position: relative;
        }

        /* Left panel for animation */
        .auth-animation-panel {
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          border-right: 1px solid #e2e8f0;
          position: relative;
        }

        .auth-video-wrapper {
          width: 100%;
          height: 100%;
          min-height: 420px;
          max-height: 520px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.04);
          background: #ffffff;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .auth-video-element {
          width: 135%;
          height: 100%;
          object-fit: cover;
          object-position: left center;
          display: block;
        }

        /* Right panel for form */
        .auth-form-panel {
          padding: 3.5rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          background: #ffffff;
        }

        .auth-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
          text-align: center;
        }

        .auth-avatar-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          box-shadow: 0 8px 16px rgba(37, 99, 235, 0.15);
        }

        .auth-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #f1f5f9;
          padding: 0.25rem;
          border-radius: 10px;
          margin-bottom: 2rem;
        }
        .auth-tab-btn {
          background: transparent;
          border: none;
          color: #64748b;
          padding: 0.625rem;
          font-weight: 600;
          font-size: 0.875rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .auth-tab-btn.active {
          background: #ffffff;
          color: #2563eb;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .auth-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .auth-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
        }
        .auth-input-wrapper {
          position: relative;
        }
        .auth-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .auth-input {
          width: 100%;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 0.75rem 2.5rem;
          color: #0f172a;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .auth-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        .password-toggle-btn {
          position: absolute;
          right: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .password-toggle-btn:hover {
          color: #475569;
        }

        .btn-auth-submit {
          background: #2563eb;
          color: #ffffff;
          border: none;
          padding: 0.875rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
          transition: all 0.2s;
          margin-top: 0.5rem;
        }
        .btn-auth-submit:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
        }
        .btn-auth-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-footer-link {
          display: block;
          text-align: center;
          font-size: 0.875rem;
          color: #2563eb;
          text-decoration: none;
          margin-top: 1.25rem;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
        }
        .auth-footer-link:hover {
          text-decoration: underline;
          color: #1d4ed8;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive styling */
        @media (max-width: 900px) {
          .auth-split-card {
            grid-template-columns: 1fr;
            max-width: 480px;
          }
          .auth-animation-panel {
            display: none;
          }
          .auth-form-panel {
            padding: 3rem 2rem;
          }
        }
      `}</style>

      {/* Back to Home */}
      <button className="btn-back-home" onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Back to Homepage
      </button>

      {/* Auth Card */}
      <div className="auth-split-card">
        {/* Left Side: Video Animation */}
        <div className="auth-animation-panel">
          <div className="auth-video-wrapper">
            <video 
              src={animationVideo} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="auth-video-element"
            />
          </div>
        </div>

        {/* Right Side: Authentication Forms */}
        <div className="auth-form-panel">
          <div className="auth-header">
            <div className="auth-avatar-circle">
              <User size={36} color="#ffffff" fill="#ffffff" />
            </div>
            <span className="auth-title">
              {activeTab === 'login' ? 'Login' : 'Sign Up'}
            </span>
          </div>

          {/* Tab switcher */}
          <div className="auth-tabs">
            <button 
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button 
              className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In form */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="auth-input-group">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-icon" />
                  <input 
                    type="email" 
                    className="auth-input" 
                    placeholder="Username"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="auth-input" 
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required 
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-auth-submit" disabled={loading}>
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Signing in...
                  </>
                ) : (
                  <>
                    Log In <ArrowRight size={16} />
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                className="auth-footer-link"
                onClick={() => navigate('/')}
              >
                Forget an password?
              </button>
            </form>
          ) : (
            /* Sign Up form */
            <form onSubmit={handleSignUpSubmit} className="auth-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="auth-input-group">
                  <label className="auth-label">First Name</label>
                  <div className="auth-input-wrapper">
                    <User size={16} className="auth-icon" />
                    <input 
                      type="text" 
                      className="auth-input" 
                      placeholder="Jane"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      required 
                      style={{ paddingLeft: '2.25rem' }}
                    />
                  </div>
                </div>
                <div className="auth-input-group">
                  <label className="auth-label">Last Name</label>
                  <div className="auth-input-wrapper">
                    <User size={16} className="auth-icon" />
                    <input 
                      type="text" 
                      className="auth-input" 
                      placeholder="Doe"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      required 
                      style={{ paddingLeft: '2.25rem' }}
                    />
                  </div>
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-icon" />
                  <input 
                    type="email" 
                    className="auth-input" 
                    placeholder="name@company.com"
                    value={signUpEmail}
                    onChange={e => setSignUpEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              {/* Organization selection */}
              <div className="auth-input-group">
                <label className="auth-label">Registration Type</label>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem', marginBottom: '0.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="regType" 
                      checked={isCompanyOwner} 
                      onChange={() => setIsCompanyOwner(true)} 
                    />
                    Create New Organization
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="regType" 
                      checked={!isCompanyOwner} 
                      onChange={() => setIsCompanyOwner(false)} 
                    />
                    Join Existing Organization
                  </label>
                </div>
              </div>

              {isCompanyOwner ? (
                <div className="auth-input-group">
                  <label className="auth-label">Company / Organization Name</label>
                  <div className="auth-input-wrapper">
                    <Briefcase size={16} className="auth-icon" />
                    <input 
                      type="text" 
                      className="auth-input" 
                      placeholder="e.g. Reliance, OYO"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      required={isCompanyOwner}
                    />
                  </div>
                </div>
              ) : (
                <div className="auth-input-group">
                  <label className="auth-label">Organization ID</label>
                  <div className="auth-input-wrapper">
                    <Briefcase size={16} className="auth-icon" />
                    <input 
                      type="text" 
                      className="auth-input" 
                      placeholder="e.g. ORG-123456"
                      value={signUpOrgId}
                      onChange={e => setSignUpOrgId(e.target.value)}
                      required={!isCompanyOwner}
                    />
                  </div>
                </div>
              )}

              <div className="auth-input-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="auth-input" 
                    placeholder="At least 6 characters"
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                    required 
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-auth-submit" disabled={loading}>
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account <CheckCircle2 size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
