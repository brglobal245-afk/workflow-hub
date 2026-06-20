import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, ArrowLeft, ArrowRight, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { toast, Toaster } from 'react-hot-toast';

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
  
  const [loading, setLoading] = useState(false);

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
    if (signUpPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await register(signUpEmail, signUpPassword, firstName, lastName);
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
          background: #090d16;
          color: #f8fafc;
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2rem;
          font-family: var(--font-sans);
          overflow-y: auto;
          background-image: radial-gradient(circle at center, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
        }

        .btn-back-home {
          position: absolute;
          top: 2rem;
          left: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #94a3b8;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: var(--transition-fast);
          z-index: 10;
        }
        .btn-back-home:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
        }

        .auth-card {
          background: rgba(15, 23, 42, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          width: 100%;
          max-width: 460px;
          padding: 3rem 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          position: relative;
        }

        .auth-logo-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .auth-logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
        }
        .auth-logo-text {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
        }

        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: rgba(255,255,255,0.04);
          padding: 0.25rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }
        .auth-tab-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .auth-tab-btn.active {
          background: rgba(255,255,255,0.08);
          color: #ffffff;
          box-shadow: var(--shadow-sm);
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
          color: #cbd5e1;
        }
        .auth-input-wrapper {
          position: relative;
        }
        .auth-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }
        .auth-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          color: #ffffff;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .auth-input:focus {
          border-color: var(--primary-500);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
        }

        .btn-auth-submit {
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
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
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
          transition: all 0.2s;
          margin-top: 0.5rem;
        }
        .btn-auth-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(99, 102, 241, 0.35);
        }
        .btn-auth-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .demo-toggle-container {
          margin-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 1.5rem;
          text-align: center;
        }
        .btn-demo-toggle {
          background: none;
          border: none;
          color: var(--primary-400);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
        }
        .btn-demo-toggle:hover {
          color: var(--primary-300);
          text-decoration: underline;
        }
        
        .demo-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
          text-align: left;
        }
        .demo-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.875rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
          transition: all 0.15s ease;
          width: 100%;
        }
        .demo-item:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.1);
        }
        .demo-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.75rem;
        }
        .demo-role-name {
          font-weight: 600;
          font-size: 0.8125rem;
          color: #f8fafc;
        }
        .demo-email {
          font-size: 0.6875rem;
          color: #94a3b8;
        }
      `}</style>

      {/* Back to Home */}
      <button className="btn-back-home" onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Back to Homepage
      </button>

      {/* Auth Card */}
      <div className="auth-card">
        <div className="auth-logo-box">
          <div className="auth-logo-icon">
            <Briefcase size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="auth-logo-text">WorkFlow Hub</span>
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
                  placeholder="name@company.com"
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
                  type="password" 
                  className="auth-input" 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required 
                />
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
                  Sign In <ArrowRight size={16} />
                </>
              )}
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

            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-icon" />
                <input 
                  type="password" 
                  className="auth-input" 
                  placeholder="At least 6 characters"
                  value={signUpPassword}
                  onChange={e => setSignUpPassword(e.target.value)}
                  required 
                />
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
  );
}
