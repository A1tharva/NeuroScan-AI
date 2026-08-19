import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPredictionById, updatePredictionNotes } from '../api/predictionApi';
import { createReport } from '../api/reportApi';
import { NODE_BASE_URL } from '../api/api';

const ScanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [doctorNotes, setDoctorNotes] = useState('');
  const [clinicalObs, setClinicalObs] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchScan = async () => {
      try {
        const res = await getPredictionById(id);
        const pred = res.data.prediction;
        setScan(pred);
        setDoctorNotes(pred.doctorNotes || '');
        setClinicalObs(pred.clinicalObservations || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load scan');
      } finally {
        setLoading(false);
      }
    };
    fetchScan();
  }, [id]);

  const formatConfidence = (val) => {
    if (!val && val !== 0) return '—';
    const pct = val <= 1 ? val * 100 : val;
    return pct.toFixed(1);
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : '—';

  const getProbabilityClass = (val) => {
    const pct = val <= 1 ? val * 100 : val;
    if (pct >= 50) return 'high';
    if (pct >= 20) return 'medium';
    return 'low';
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updatePredictionNotes(id, { doctorNotes, clinicalObservations: clinicalObs });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const patientId = scan.patientId?._id || scan.patientId;
      const res = await createReport({
        patientId,
        predictionId: scan._id,
        title: `MRI Analysis Report`,
        doctorNotes,
        clinicalObservations: clinicalObs
      });
      navigate(`/reports/${res.data.report._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create report');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading scan details...</p>
      </div>
    );
  }

  if (error || !scan) {
    return <div className="alert alert-danger">{error || 'Scan not found'}</div>;
  }

  const patient = scan.patientId || {};
  const probabilities = scan.probabilities || {};

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Scan Detail</h2>
            <p className="breadcrumb">
              <Link to="/dashboard">NeuroScan AI</Link> /{' '}
              <Link to={`/patients/${patient._id || ''}`}>{patient.name || 'Patient'}</Link> /{' '}
              {formatDate(scan.createdAt)} / Scan
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link
              to={patient._id ? `/patients/${patient._id}/scans` : '#'}
              className="btn btn-secondary btn-sm"
            >
              Back to Scan History
            </Link>
            <button className="btn btn-primary btn-sm" onClick={handleGenerateReport}>
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* MRI Images */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="card-title" style={{ marginBottom: 4 }}>
          Visual Evidence (T1-Weighted MRI Scan)
        </h3>
        <div className="image-comparison" style={{ marginTop: 16 }}>
          <div className="image-box">
            <img
              src={`${NODE_BASE_URL}${scan.originalImage}`}
              alt="Original MRI"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="image-label">Original T1-Weighted MRI</div>
          </div>
          <div className="image-box">
            <img
              src={scan.gradcamImage}
              alt="Grad-CAM"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="image-label">Grad-CAM Activation Heatmap</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Prediction Summary */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 16 }}>Prediction Summary</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'capitalize' }}>
              {scan.prediction}
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
              {formatConfidence(scan.confidence)}%
            </span>
            <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
              EfficientNetB4
            </span>
          </div>

          <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 12 }}>Class Probability Distribution</h4>
          <div className="probability-bar-group">
            {Object.entries(probabilities).map(([cls, val]) => (
              <div className="probability-item" key={cls}>
                <span className="probability-label">{cls}</span>
                <div className="probability-track">
                  <div
                    className={`probability-fill ${getProbabilityClass(val)}`}
                    style={{ width: `${(val <= 1 ? val * 100 : val)}%` }}
                  />
                </div>
                <span className="probability-value">{formatConfidence(val)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative & Doctor Notes */}
        <div>
          {/* AI Diagnostic Narrative */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 className="card-title" style={{ marginBottom: 8 }}>AI Diagnostic Narrative</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {scan.aiSummary || 'No AI summary available.'}
            </p>
          </div>

          {/* Doctor Notes */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: 12 }}>
              Reviewer / Clinical Notes
            </h3>
            <div className="form-group">
              <textarea
                className="form-input"
                rows={3}
                placeholder="Doctor's clinical notes..."
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Clinical Observations</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="Clinical observations..."
                value={clinicalObs}
                onChange={(e) => setClinicalObs(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSaveNotes}
              disabled={saving}
            >
              {saving ? 'Saving...' : saved ? 'Saved' : 'Save Notes'}
            </button>
          </div>
        </div>
      </div>

      <div className="disclaimer">
        <p>
          <strong>Note:</strong> AI-assisted screening tool — not a replacement for professional medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default ScanDetail;
