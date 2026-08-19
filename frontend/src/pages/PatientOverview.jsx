import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatientById, updatePatient } from '../api/patientApi';
import { getPatientPredictions } from '../api/predictionApi';
import { NODE_BASE_URL } from '../api/api';

const PatientOverview = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [patientRes, predRes] = await Promise.all([
        getPatientById(id),
        getPatientPredictions(id)
      ]);
      setPatient(patientRes.data.patient);
      setPredictions(predRes.data.predictions || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load patient');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : '—';

  const formatConfidence = (val) => {
    if (!val && val !== 0) return '—';
    const pct = val <= 1 ? val * 100 : val;
    return `${pct.toFixed(1)}%`;
  };

  const handleEdit = () => {
    setEditForm({ ...patient });
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const res = await updatePatient(id, {
        name: editForm.name,
        age: Number(editForm.age),
        gender: editForm.gender,
        phone: editForm.phone,
        email: editForm.email,
        medicalHistory: editForm.medicalHistory,
        currentSymptoms: editForm.currentSymptoms,
        previousDiagnosis: editForm.previousDiagnosis,
        additionalNotes: editForm.additionalNotes
      });
      setPatient(res.data.patient);
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const latestScan = predictions[0] || null;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading patient...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="alert alert-danger">
        {error || 'Patient not found'}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Patient Overview</h2>
        <p className="breadcrumb">
          <Link to="/dashboard">NeuroScan AI</Link> /{' '}
          <Link to="/patients">Patients</Link> / {patient.name}
        </p>
      </div>

      {/* Patient Header */}
      <div className="patient-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="patient-name">
              {patient.name}
              <span className={`badge badge-${patient.status === 'active' ? 'active' : 'archived'}`}>
                {patient.status}
              </span>
            </div>
            <div className="patient-meta">
              Patient ID: {patient.patientId} &nbsp;·&nbsp; Age: {patient.age} &nbsp;·&nbsp; Gender: {patient.gender}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={handleEdit}>
              Edit Patient
            </button>
            <Link to={`/patients/${id}/scan`} className="btn btn-primary btn-sm">
              + New MRI Scan
            </Link>
          </div>
        </div>

        <div className="patient-stats">
          <div className="patient-stat">
            <div className="ps-label">Total Scans</div>
            <div className="ps-value">{predictions.length}</div>
          </div>
          <div className="patient-stat">
            <div className="ps-label">Last Scan Date</div>
            <div className="ps-value" style={{ fontSize: '0.9375rem' }}>
              {latestScan ? formatDate(latestScan.createdAt) : '—'}
            </div>
          </div>
          <div className="patient-stat">
            <div className="ps-label">Latest Prediction</div>
            <div className="ps-value" style={{ fontSize: '0.9375rem', textTransform: 'capitalize' }}>
              {latestScan?.prediction || '—'}
            </div>
          </div>
          <div className="patient-stat">
            <div className="ps-label">Latest Confidence</div>
            <div className="ps-value" style={{ fontSize: '0.9375rem', color: 'var(--primary)' }}>
              {latestScan ? formatConfidence(latestScan.confidence) : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`tab ${activeTab === 'scans' ? 'active' : ''}`} onClick={() => setActiveTab('scans')}>
          Scan History
        </button>
        <button className={`tab ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
          Reports
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Patient Information */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: 16 }}>Patient Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 16px', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Date of Birth</span>
              <span>{formatDate(patient.dateOfBirth)}</span>
              <span style={{ color: 'var(--text-muted)' }}>Phone Number</span>
              <span>{patient.phone || '—'}</span>
              <span style={{ color: 'var(--text-muted)' }}>Contact Email</span>
              <span>{patient.email || '—'}</span>
              <span style={{ color: 'var(--text-muted)' }}>Blood Type</span>
              <span>—</span>
            </div>

            {patient.medicalHistory && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 8 }}>Medical History</h4>
                <ul style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', paddingLeft: 16, listStyle: 'disc' }}>
                  {patient.medicalHistory.split('\n').map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            {patient.currentSymptoms && (
              <div style={{ marginTop: 16 }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 8 }}>Current Symptoms</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{patient.currentSymptoms}</p>
              </div>
            )}
          </div>

          {/* Recent MRI Analysis */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent MRI Analysis</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {latestScan ? formatDate(latestScan.createdAt) : ''}
              </span>
            </div>

            {latestScan ? (
              <>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                    Prediction: {latestScan.prediction}
                  </span>
                  <span className="badge badge-success">
                    {formatConfidence(latestScan.confidence)} Conf
                  </span>
                </div>

                <div className="image-comparison" style={{ marginBottom: 16 }}>
                  <div className="image-box">
                    <img
                      src={`${NODE_BASE_URL}${latestScan.originalImage}`}
                      alt="Original MRI"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="image-label">Original MRI</div>
                  </div>
                  <div className="image-box">
                    <img
                      src={latestScan.gradcamImage}
                      alt="Grad-CAM"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="image-label">Grad-CAM Overlay</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                  {latestScan.aiSummary || 'AI analysis completed.'}
                </p>

                <Link to={`/scans/${latestScan._id}`} className="btn btn-primary btn-sm btn-block">
                  View Full Analysis
                </Link>
              </>
            ) : (
              <div className="empty-state" style={{ padding: 30 }}>
                <h3>No scans yet</h3>
                <p>Upload the first MRI scan for this patient.</p>
                <Link to={`/patients/${id}/scan`} className="btn btn-primary btn-sm">
                  + New MRI Scan
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'scans' && (
        <div>
          {predictions.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <h3>No scans yet</h3>
                <p>Upload an MRI to get started.</p>
                <Link to={`/patients/${id}/scan`} className="btn btn-primary btn-sm">
                  + New MRI Scan
                </Link>
              </div>
            </div>
          ) : (
            predictions.map(scan => (
              <div className="scan-card" key={scan._id}>
                <img
                  className="scan-thumbnail"
                  src={`${NODE_BASE_URL}${scan.originalImage}`}
                  alt="MRI"
                  onError={(e) => { e.target.src = ''; e.target.style.background = 'var(--bg)'; }}
                />
                <div className="scan-info">
                  <div className="scan-date">{formatDate(scan.createdAt)}</div>
                  <div className="scan-prediction">
                    <span style={{ textTransform: 'capitalize' }}>• {scan.prediction}</span>
                    <span style={{ marginLeft: 12 }}>Confidence: {formatConfidence(scan.confidence)}</span>
                  </div>
                </div>
                <div className="scan-actions">
                  <Link to={`/scans/${scan._id}`} className="btn btn-sm btn-primary">
                    View Analysis
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="card">
          <div className="empty-state">
            <h3>Patient Reports</h3>
            <p>Visit the reports page to create and manage reports for this patient.</p>
            <Link to="/reports" className="btn btn-primary btn-sm">
              Go to Reports
            </Link>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Patient</h3>
              <button className="modal-close" onClick={() => setEditing(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    className="form-input"
                    value={editForm.name || ''}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editForm.age || ''}
                    onChange={e => setEditForm({ ...editForm, age: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-input"
                    value={editForm.gender || ''}
                    onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-input"
                    value={editForm.phone || ''}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Medical History</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={editForm.medicalHistory || ''}
                  onChange={e => setEditForm({ ...editForm, medicalHistory: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Current Symptoms</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={editForm.currentSymptoms || ''}
                  onChange={e => setEditForm({ ...editForm, currentSymptoms: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveEdit} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="disclaimer">
        <p>
          <strong>Note:</strong> AI-assisted screening tool — not a replacement for professional medical diagnosis. Decisions must be verified with clinical judgement.
        </p>
      </div>
    </div>
  );
};

export default PatientOverview;
