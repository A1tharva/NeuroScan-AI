import { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { getPredictionById, updatePredictionNotes } from '../api/predictionApi';
import { createReport } from '../api/reportApi';
import { NODE_BASE_URL } from '../api/api';

const AnalysisResult = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [scan, setScan] = useState(location.state?.analysisData || null);
  const [patient, setPatient] = useState(location.state?.patient || null);
  const [loading, setLoading] = useState(!scan);
  const [error, setError] = useState('');

  const [doctorNotes, setDoctorNotes] = useState('');
  const [clinicalObs, setClinicalObs] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!scan) {
      fetchScan();
    }
  }, [id]);

  const fetchScan = async () => {
    try {
      const res = await getPredictionById(id);
      const pred = res.data.prediction;
      setScan({
        predictionId: pred._id,
        patientId: pred.patientId?._id || pred.patientId,
        prediction: pred.prediction,
        confidence: pred.confidence,
        probabilities: pred.probabilities,
        originalImage: pred.originalImage,
        gradcamImage: pred.gradcamImage,
        aiSummary: pred.aiSummary,
        createdAt: pred.createdAt
      });
      setPatient(pred.patientId);
      setDoctorNotes(pred.doctorNotes || '');
      setClinicalObs(pred.clinicalObservations || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  const formatConfidence = (val) => {
    if (!val && val !== 0) return '—';
    const pct = val <= 1 ? val * 100 : val;
    return pct.toFixed(1);
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : '';

  const handleSaveNotes = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updatePredictionNotes(scan.predictionId || id, {
        doctorNotes,
        clinicalObservations: clinicalObs
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const res = await createReport({
        patientId: scan.patientId?._id || scan.patientId,
        predictionId: scan.predictionId || id,
        title: `MRI Analysis Report — ${patient?.name || 'Patient'}`,
        doctorNotes,
        clinicalObservations: clinicalObs
      });
      navigate(`/reports/${res.data.report._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create report');
    } finally {
      setGenerating(false);
    }
  };

  const getProbabilityClass = (val) => {
    const pct = val <= 1 ? val * 100 : val;
    if (pct >= 50) return 'high';
    if (pct >= 20) return 'medium';
    return 'low';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading analysis result...</p>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="alert alert-danger">
        {error || 'Analysis not found'}
      </div>
    );
  }

  const probabilities = scan.probabilities || {};

  return (
    <div>
      <div className="page-header">
        <h2>AI Analysis Result</h2>
        <p className="breadcrumb">
          <Link to="/dashboard">NeuroScan AI</Link> / Scan Analysis / Result
        </p>
      </div>

      <div className="card" style={{ marginBottom: 8, padding: '16px 24px' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <strong>AI Analysis Result</strong>
          <br />
          Patient: <strong>{patient?.name || '—'}</strong> — {patient?.patientId || '—'} — Analysis Date: {formatDate(scan.createdAt)}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Left — Prediction & Probabilities */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 4 }}>
            AI Prediction: <span style={{ textTransform: 'uppercase', color: 'var(--danger)' }}>{scan.prediction}</span>
            <span style={{ marginLeft: 8, color: 'var(--primary)' }}>({formatConfidence(scan.confidence)}%)</span>
          </h3>
          <span className="badge badge-success" style={{ marginBottom: 20, display: 'inline-block' }}>CONFIRMED</span>

          <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 12 }}>Class Probabilities</h4>
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

        {/* Right — MRI Images */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Model Explainability</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visual Evidence</span>
          </div>
          <div className="image-comparison">
            <div className="image-box">
              <img
                src={`${NODE_BASE_URL}${scan.originalImage}`}
                alt="Original MRI"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="image-label">Original MRI</div>
            </div>
            <div className="image-box">
              <img
                src={scan.gradcamImage}
                alt="Grad-CAM Heatmap"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="image-label">Grad-CAM Heatmap</div>
            </div>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 8 }}>
            <strong>Grad-CAM Note:</strong> Grad-CAM highlights image regions that influenced the AI prediction. It is not a tumor segmentation.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* AI Summary */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <h3 className="card-title">AI Summary</h3>
            <span className="badge badge-info">AI-GENERATED</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {scan.aiSummary || 'No AI summary available.'}
          </p>
        </div>

        {/* Doctor Notes */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 16 }}>Clinical Verification & Report</h3>

          <div className="form-group">
            <label className="form-label">Doctor Notes / Comments</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Enter your clinical observations and comments..."
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Observations</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Describe clinical observation details..."
              value={clinicalObs}
              onChange={(e) => setClinicalObs(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="btn btn-secondary"
              onClick={handleSaveNotes}
              disabled={saving}
            >
              {saving ? 'Saving...' : saved ? 'Saved' : 'Save Notes'}
            </button>
            <button
              className="btn btn-primary"
              onClick={handleGenerateReport}
              disabled={generating}
            >
              {generating ? 'Creating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      <div className="disclaimer">
        <p>
          <strong>Note:</strong> AI-assisted screening tool — not a replacement for professional medical diagnosis.
          Decisions must be verified with clinical judgement.
        </p>
      </div>
    </div>
  );
};

export default AnalysisResult;
