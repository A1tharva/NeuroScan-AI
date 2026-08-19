import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatientById } from '../api/patientApi';
import { getPatientPredictions } from '../api/predictionApi';
import { NODE_BASE_URL } from '../api/api';
import { useAuth } from '../context/AuthContext';

const ScanHistory = () => {
  const { id } = useParams();
  const { doctor } = useAuth();
  const [patient, setPatient] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, sRes] = await Promise.all([
          getPatientById(id),
          getPatientPredictions(id)
        ]);
        setPatient(pRes.data.patient);
        setPredictions(sRes.data.predictions || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : '—';

  const formatConfidence = (val) => {
    if (!val && val !== 0) return '—';
    const pct = val <= 1 ? val * 100 : val;
    return `${pct.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading scan history...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Scan History</h2>
        <p className="breadcrumb">
          <Link to="/dashboard">NeuroScan AI</Link> /{' '}
          <Link to="/patients">Patients</Link> /{' '}
          <Link to={`/patients/${id}`}>{patient?.name}</Link> / Scan History
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Patient Header */}
      {patient && (
        <div className="patient-header" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="patient-name">
                {patient.name}
                <span className={`badge badge-${patient.status === 'active' ? 'active' : 'archived'}`}>
                  {patient.status}
                </span>
              </div>
              <div className="patient-meta">
                Patient ID: {patient.patientId} · Age: {patient.age} · Gender: {patient.gender}
              </div>
            </div>
            <Link to={`/patients/${id}/scan`} className="btn btn-primary btn-sm">
              New MRI Scan
            </Link>
          </div>
        </div>
      )}

      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>
        Historical Record ({predictions.length} MRI Scans)
      </h3>

      {predictions.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>No scans yet</h3>
            <p>Upload the first MRI for this patient.</p>
            <Link to={`/patients/${id}/scan`} className="btn btn-primary btn-sm">
              + New MRI Scan
            </Link>
          </div>
        </div>
      ) : (
        predictions.map((scan) => (
          <div className="scan-card" key={scan._id}>
            <img
              className="scan-thumbnail"
              src={`${NODE_BASE_URL}${scan.originalImage}`}
              alt="MRI"
              onError={(e) => { e.target.style.background = 'var(--bg)'; e.target.src = ''; }}
            />
            <div className="scan-info" style={{ flex: 1 }}>
              <div className="scan-date">
                {formatDate(scan.createdAt)}
              </div>
              <div className="scan-prediction">
                <span style={{ textTransform: 'capitalize' }}>• {scan.prediction}</span>
                <span style={{ marginLeft: 16 }}>Confidence: {formatConfidence(scan.confidence)}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                MRI Brain Scan · Dr. {doctor?.name || 'Doctor'}
              </div>
            </div>
            <div className="scan-actions" style={{ display: 'flex', gap: 8 }}>
              <span className="badge badge-success">Reviewed</span>
              <Link to={`/scans/${scan._id}`} className="btn btn-sm btn-primary">
                View Analysis
              </Link>
            </div>
          </div>
        ))
      )}

      <div className="disclaimer">
        <p>
          <strong>Note:</strong> AI-assisted screening tool — not a replacement for professional medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default ScanHistory;
