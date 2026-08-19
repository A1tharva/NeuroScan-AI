import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerDoctor } from '../api/authApi';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    hospital: '',
    registrationNumber: '',
    phone: ''
  });
  const [certified, setCertified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password) {
      setError('Full name, email and password are required');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!certified) {
      setError('Please certify that you are a licensed practitioner');
      return;
    }

    setLoading(true);
    try {
      await registerDoctor({
        name: form.name,
        email: form.email,
        password: form.password,
        specialization: form.specialization,
        hospital: form.hospital,
        registrationNumber: form.registrationNumber,
        phone: form.phone
      });
      navigate('/login', {
        state: { message: 'Registration successful! Please sign in.' }
      });
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
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
            NeuroScan AI Diagnostic Platform
          </h1>
          
          <p className="auth-hero-desc">
            Explainable deep learning assistance for clinical neuroimaging workflows and brain MRI analysis.
          </p>

          {/* Visual Hero Image Container using user uploaded image */}
          <div className="auth-hero-image-card">
            <img
              src="/hero-doctor.jpg"
              alt="NeuroScan MRI Diagnostics Specialist"
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
            <div className="stat-divider"></div>
            <div className="stat-badge">
              <span className="stat-val">HIPAA Compliant</span>
              <span className="stat-sub">Clinical Standard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right 40% Registration Form Section (No changes to form inputs) */}
      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Create Doctor Account</h2>
            <p className="auth-subtitle">
              Verify your medical credentials for doctor access to our explainable MRI analysis platform.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="register-name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="Dr. Full Name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="register-regnum">
                  Medical Registration Number
                </label>
                <input
                  id="register-regnum"
                  name="registrationNumber"
                  type="text"
                  className="form-input"
                  placeholder="MR-XXXXX"
                  value={form.registrationNumber}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="register-specialization">
                  Clinical Specialization
                </label>
                <select
                  id="register-specialization"
                  name="specialization"
                  className="form-input"
                  value={form.specialization}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select specialization</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Neurosurgery">Neurosurgery</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Neuroradiology">Neuroradiology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="register-hospital">
                  Hospital / Affiliated Organization
                </label>
                <input
                  id="register-hospital"
                  name="hospital"
                  type="text"
                  className="form-input"
                  placeholder="Hospital name"
                  value={form.hospital}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">
                Professional Email <span className="required">*</span>
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="dr.name@hospital.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-phone">
                Direct Contact Phone
              </label>
              <input
                id="register-phone"
                name="phone"
                type="tel"
                className="form-input"
                placeholder="+1 (XXX) XXX-XXXX"
                value={form.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="register-password">
                  Create Secure Password <span className="required">*</span>
                </label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="register-confirm-password">
                  Confirm Password <span className="required">*</span>
                </label>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  className="form-input"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="checkbox-group">
              <input
                id="register-certify"
                type="checkbox"
                checked={certified}
                onChange={(e) => setCertified(e.target.checked)}
              />
              <label htmlFor="register-certify">
                I certify that I am a licensed medical practitioner and agree to follow all HIPAA regulations regarding patient diagnostic privacy.
              </label>
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn btn-primary btn-block btn-lg auth-submit-btn"
              disabled={loading || !certified}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, marginRight: 8 }}></div>
                  Creating Account...
                </>
              ) : (
                'Submit and Create Doctor Account'
              )}
            </button>

            <div className="auth-footer-links">
              <span>Already registered?</span>
              <Link to="/login" className="auth-signup-link">Login here</Link>
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

export default Register;
