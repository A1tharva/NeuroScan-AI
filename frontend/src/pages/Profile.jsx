import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDoctorProfile, updateDoctorProfile } from '../api/doctorApi';

const Profile = () => {
  const { doctor, updateDoctor } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getDoctorProfile();
        setProfile(res.data.doctor);
        setForm(res.data.doctor);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'DR';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await updateDoctorProfile({
        name: form.name,
        phone: form.phone,
        specialization: form.specialization,
        registrationNumber: form.registrationNumber,
        hospital: form.hospital,
        yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined
      });
      setProfile(res.data.doctor);
      updateDoctor(res.data.doctor);
      setEditing(false);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Doctor Profile</h2>
        <p className="breadcrumb">
          <Link to="/dashboard">NeuroScan AI</Link> / Profile
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          {success}
        </div>
      )}

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 4 }}>
          Manage Clinical Profile
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
          Review your active hospital credentials, registration IDs, and contact parameters.
        </p>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">
            {getInitials(profile?.name)}
          </div>
          <div className="profile-info" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>Dr. {profile?.name || '—'}</h3>
                <p>{profile?.email || '—'}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {profile?.hospital && (
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    Verified Hospital Credentials
                  </span>
                )}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (editing) {
                      handleSave();
                    } else {
                      setForm({ ...profile });
                      setEditing(true);
                    }
                  }}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : editing ? 'Save Profile' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px', marginTop: 8 }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            {editing ? (
              <input
                name="name"
                className="form-input"
                value={form.name || ''}
                onChange={handleChange}
              />
            ) : (
              <p style={{ fontSize: '0.875rem', padding: '10px 0', color: 'var(--text)' }}>
                Dr. {profile?.name || '—'}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <p style={{ fontSize: '0.875rem', padding: '10px 0', color: 'var(--text-secondary)' }}>
              {profile?.email || '—'}
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            {editing ? (
              <input
                name="phone"
                className="form-input"
                value={form.phone || ''}
                onChange={handleChange}
              />
            ) : (
              <p style={{ fontSize: '0.875rem', padding: '10px 0', color: 'var(--text)' }}>
                {profile?.phone || '—'}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Primary Specialization</label>
            {editing ? (
              <select
                name="specialization"
                className="form-input"
                value={form.specialization || ''}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Neurology">Neurology</option>
                <option value="Neurosurgery">Neurosurgery</option>
                <option value="Radiology">Radiology</option>
                <option value="Neuroradiology">Neuroradiology</option>
                <option value="Oncology">Oncology</option>
                <option value="Neurologist & Clinical Neuroscientist">Neurologist & Clinical Neuroscientist</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            ) : (
              <p style={{ fontSize: '0.875rem', padding: '10px 0', color: 'var(--text)' }}>
                {profile?.specialization || '—'}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Registration ID</label>
            {editing ? (
              <input
                name="registrationNumber"
                className="form-input"
                value={form.registrationNumber || ''}
                onChange={handleChange}
              />
            ) : (
              <p style={{ fontSize: '0.875rem', padding: '10px 0', color: 'var(--text)' }}>
                {profile?.registrationNumber || '—'}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Affiliated Hospital</label>
            {editing ? (
              <input
                name="hospital"
                className="form-input"
                value={form.hospital || ''}
                onChange={handleChange}
              />
            ) : (
              <p style={{ fontSize: '0.875rem', padding: '10px 0', color: 'var(--text)' }}>
                {profile?.hospital || '—'}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            {editing ? (
              <input
                name="yearsOfExperience"
                type="number"
                className="form-input"
                value={form.yearsOfExperience || ''}
                onChange={handleChange}
                min="0"
              />
            ) : (
              <p style={{ fontSize: '0.875rem', padding: '10px 0', color: 'var(--text)' }}>
                {profile?.yearsOfExperience != null ? `${profile.yearsOfExperience} Years` : '—'}
              </p>
            )}
          </div>
        </div>

        {editing && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
            <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="disclaimer">
        <p>
          <strong>Note:</strong> AI-assisted screening tool — not a replacement for professional medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default Profile;
