import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateDoctorProfile } from '../api/doctorApi';

const ProfileSetup = () => {
  const { doctor, updateDoctor } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: doctor?.name || '',
    phone: doctor?.phone || '',
    specialization: doctor?.specialization || '',
    registrationNumber: doctor?.registrationNumber || '',
    hospital: doctor?.hospital || '',
    yearsOfExperience: doctor?.yearsOfExperience || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Calculate profile completeness
  const filledFields = Object.values(form).filter(v => v !== '' && v !== null && v !== undefined).length;
  const totalFields = Object.keys(form).length;
  const completeness = Math.round((filledFields / totalFields) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await updateDoctorProfile({
        ...form,
        yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined
      });
      updateDoctor(res.data.doctor);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <header className="register-header">
        <div className="brand">
          <span className="brand-icon">NS</span>
          NeuroScan AI
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Step 2 of 2
          </span>
          <span
            className="badge badge-info"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            Skip & Complete Later
          </span>
        </div>
      </header>

      <div className="register-body">
        <div className="register-card" style={{ maxWidth: 720 }}>
          <h2>Complete Your Professional Profile</h2>
          <p className="register-subtitle">
            Your verified clinical profile on personalized diagnostic MRI reports for traceability.
          </p>

          {/* Progress bar */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
                fontSize: '0.8125rem'
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>Profile Setup</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{completeness}% Complete</span>
            </div>
            <div
              style={{
                height: 6,
                background: 'var(--border-light)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${completeness}%`,
                  background: 'var(--primary)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Verified Professional Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="Your full name as verified"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Primary Specialization</label>
                <select
                  name="specialization"
                  className="form-input"
                  value={form.specialization}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select specialization</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Neurosurgery">Neurosurgery</option>
                  <option value="Neuroradiology Specialist">Neuroradiology Specialist</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Neurologist & Clinical Neuroscientist">Neurologist & Clinical Neuroscientist</option>
                  <option value="General Medicine">General Medicine</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Verified Registration Number</label>
                <input
                  name="registrationNumber"
                  type="text"
                  className="form-input"
                  placeholder="MR-XXXXXXX"
                  value={form.registrationNumber}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hospital / Organization</label>
                <input
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

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  className="form-input"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input
                  name="yearsOfExperience"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 12"
                  min="0"
                  value={form.yearsOfExperience}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
              style={{ marginTop: 12, background: '#0a1628' }}
            >
              {loading ? 'Saving...' : 'Complete Profile & Enter Platform'}
            </button>
          </form>

          <div className="disclaimer" style={{ marginTop: 32 }}>
            <p>
              <strong>Note:</strong> AI-assisted screening tool — not a replacement for professional
              medical diagnosis. Decisions must be verified with clinical judgement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
