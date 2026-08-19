import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPatient } from '../api/patientApi';

const AddPatient = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientId: `PT-${Date.now().toString().slice(-4)}`,
    name: '',
    age: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    medicalHistory: '',
    currentSymptoms: '',
    previousDiagnosis: '',
    additionalNotes: ''
  });
  const [certified, setCertified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.patientId || !form.name || !form.age || !form.gender) {
      setError('Patient ID, name, age and gender are required');
      return;
    }

    if (!certified) {
      setError('Please certify the medical history information');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        age: Number(form.age)
      };
      const res = await createPatient(payload);
      navigate(`/patients/${res.data.patient._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Add New Patient</h2>
        <p className="breadcrumb">
          <Link to="/dashboard">NeuroScan AI</Link> /{' '}
          <Link to="/patients">Patients</Link> / Add New Patient
        </p>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 4 }}>Add New Patient Record</h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 28 }}>
          Provide patient bio and clinical background details below.
        </p>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
            {/* LEFT COLUMN — Personal Information */}
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Personal Information
              </h4>

              <div className="form-group">
                <label className="form-label">Patient ID</label>
                <input
                  name="patientId"
                  type="text"
                  className="form-input"
                  value={form.patientId}
                  onChange={handleChange}
                  disabled={loading}
                  style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Auto-generated</span>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="Patient full name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Age <span className="required">*</span></label>
                  <input
                    name="age"
                    type="number"
                    className="form-input"
                    placeholder="Age"
                    min="0"
                    max="150"
                    value={form.age}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender <span className="required">*</span></label>
                  <select
                    name="gender"
                    className="form-input"
                    value={form.gender}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  name="dateOfBirth"
                  type="date"
                  className="form-input"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  className="form-input"
                  placeholder="+1 (XXX) XXX-XXXX"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="patient@email.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* RIGHT COLUMN — Clinical Information */}
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Clinical Information
              </h4>

              <div className="form-group">
                <label className="form-label">Medical History</label>
                <textarea
                  name="medicalHistory"
                  className="form-input"
                  placeholder="Prior medical history, conditions, surgeries..."
                  value={form.medicalHistory}
                  onChange={handleChange}
                  disabled={loading}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Symptoms</label>
                <textarea
                  name="currentSymptoms"
                  className="form-input"
                  placeholder="Current symptoms, complaints..."
                  value={form.currentSymptoms}
                  onChange={handleChange}
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Previous Diagnosis (if any)</label>
                <textarea
                  name="previousDiagnosis"
                  className="form-input"
                  placeholder="Prior diagnoses, findings..."
                  value={form.previousDiagnosis}
                  onChange={handleChange}
                  disabled={loading}
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Additional Notes</label>
                <textarea
                  name="additionalNotes"
                  className="form-input"
                  placeholder="Additional relevant information..."
                  value={form.additionalNotes}
                  onChange={handleChange}
                  disabled={loading}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 8 }}>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="certify-patient"
                checked={certified}
                onChange={(e) => setCertified(e.target.checked)}
              />
              <label htmlFor="certify-patient">
                I certify that all medical history and symptoms supplied strictly align with verified clinical intake documents under HIPAA.
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Link to="/patients" className="btn btn-secondary">Cancel</Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !certified}
              >
                {loading ? 'Saving...' : 'Save Patient'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="disclaimer">
        <p>
          <strong>Note:</strong> AI-assisted screening tool — not a replacement for professional
          medical diagnosis. Decisions must be verified with clinical judgement.
        </p>
      </div>
    </div>
  );
};

export default AddPatient;
