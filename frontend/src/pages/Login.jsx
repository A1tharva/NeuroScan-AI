import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginDoctor } from '../api/authApi';

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const BrainPulseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a5 5 0 0 0-5 5v1a4 4 0 0 0-2 3.5c0 1.6.9 3 2.2 3.7.1.6.4 1.2.8 1.8A5 5 0 0 0 12 22a5 5 0 0 0 4-2c.4-.6.7-1.2.8-1.8 1.3-.7 2.2-2.1 2.2-3.7 0-1.5-.8-2.8-2-3.5V7a5 5 0 0 0-5-5z" />
    <path d="M12 6v4" />
    <path d="M9 10h6" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await loginDoctor({ email, password });
      login(res.data.token, res.data.doctor);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left 60% Hero Section */}
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-brand-badge">
            <span className="auth-brand-logo">NS</span>
            <div className="auth-brand-text">
              <span className="auth-brand-title">NeuroScan AI</span>
              <span className="auth-brand-sub">Clinical MRI Diagnostics</span>
            </div>
          </div>

          <h1 className="auth-hero-heading">
            Precision Brain MRI Diagnostics
          </h1>

          <p className="auth-hero-desc">
            Explainable deep learning assistance for clinical neuroimaging workflows and MRI analysis.
          </p>

          {/* Visual Hero Image Container using user uploaded image */}
          <div className="auth-hero-image-card">
            <img
              src="/hero-doctor.jpg"
              alt="NeuroScan Doctor MRI Analysis"
              className="auth-hero-img"
            />
            <div className="auth-hero-img-overlay">
              <div className="img-overlay-tag">
                <span className="visual-pulse-dot"></span>
                <span>NeuroScan Engine Active</span>
              </div>
              <span className="visual-badge">Explainable AI</span>
            </div>
          </div>

          <div className="auth-hero-footer">
            <div className="stat-badge">
              <span className="stat-val">4 Diagnostic Classes</span>
              <span className="stat-sub">Glioma · Meningioma · Pituitary · Healthy</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-badge">
              <span className="stat-val">Grad-CAM Overlay</span>
              <span className="stat-sub">Visual Heatmaps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right 50% Form Section */}
      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Sign In</h2>
            <p className="auth-subtitle">
              Enter your verified clinical credentials to access your patient dashboard.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Professional Email Address <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="input-icon"><MailIcon /></span>
                <input
                  id="login-email"
                  type="email"
                  className="form-input has-icon"
                  placeholder="dr.name@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="input-icon"><LockIcon /></span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input has-icon has-toggle"
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember this device
              </label>
              <span className="forgot-password" style={{ cursor: 'pointer' }}>
                Forgot password?
              </span>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-block btn-lg auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, marginRight: 8 }}></div>
                  Authenticating...
                </>
              ) : (
                'Sign in to Workspace'
              )}
            </button>

            <div className="auth-footer-links">
              <span>New to NeuroScan AI?</span>
              <Link to="/register" className="auth-signup-link">Create Doctor Account</Link>
            </div>
          </form>

          <div className="auth-disclaimer-card">
            <div className="disclaimer-text">
              <strong>Note:</strong> AI-assisted screening tool — not a replacement for professional medical diagnosis. Decisions must be verified with clinical judgement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
