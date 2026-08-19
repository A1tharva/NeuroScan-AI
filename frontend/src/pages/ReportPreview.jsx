import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReportById, finalizeReport, downloadReport } from '../api/reportApi';
import { useAuth } from '../context/AuthContext';
import { NODE_BASE_URL } from '../api/api';

const ReportPreview = () => {
  const { id } = useParams();
  const { doctor } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [finalizing, setFinalizing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await getReportById(id);
        setReport(res.data.report);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleFinalize = async () => {
    if (!confirm('Are you sure you want to finalize this report? This action cannot be undone.')) return;
    setFinalizing(true);
    try {
      const res = await finalizeReport(id);
      setReport(res.data.report);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to finalize');
    } finally {
      setFinalizing(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await downloadReport(id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download PDF');
    } finally {
      setDownloading(false);
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading report...</p>
      </div>
    );
  }

  if (error || !report) {
    return <div className="alert alert-danger">{error || 'Report not found'}</div>;
  }

  const patient = report.patientId || {};
  const prediction = report.predictionId || {};
  const probabilities = prediction.probabilities || {};

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Report Preview</h2>
            <p className="breadcrumb">
              <Link to="/dashboard">NeuroScan AI</Link> /{' '}
              <Link to="/reports">Reports</Link> / Preview
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {report.reportStatus === 'draft' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleFinalize}
                disabled={finalizing}
              >
                {finalizing ? 'Finalizing...' : 'Finalize Report'}
              </button>
            )}
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          RPT-{report._id.slice(-6).toUpperCase()} Detail Preview
        </span>
        <span className={`badge badge-${report.reportStatus}`}>{report.reportStatus}</span>
        {report.reportStatus === 'final' && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Report is finalized and cannot be edited.</span>
        )}
      </div>

      {/* Report Document */}
      <div className="report-document">
        <div className="report-header-section">
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.05em' }}>
            {doctor?.hospital ? doctor.hospital.toUpperCase() : 'NEUROLOGICAL DIAGNOSTIC CENTER'}
          </p>
          <h3>AI-ASSISTED BRAIN MRI ANALYSIS REPORT</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Automated Clinical Decision Support
          </p>
        </div>

        {/* Doctor Information */}
        <div className="report-section">
          <h4>Doctor Information</h4>
          <div className="report-grid">
            <span className="label">Doctor Name</span>
            <span className="value">Dr. {doctor?.name || '—'}</span>
            <span className="label">Specialization</span>
            <span className="value">{doctor?.specialization || '—'}</span>
            <span className="label">Hospital</span>
            <span className="value">{doctor?.hospital || '—'}</span>
            <span className="label">Report Date</span>
            <span className="value">{formatDate(report.createdAt)}</span>
          </div>
        </div>

        {/* Patient Information */}
        <div className="report-section">
          <h4>Patient Information</h4>
          <div className="report-grid">
            <span className="label">Patient Name</span>
            <span className="value">{patient.name || '—'}</span>
            <span className="label">Patient ID</span>
            <span className="value">{patient.patientId || '—'}</span>
            <span className="label">Age / Gender</span>
            <span className="value">{patient.age || '—'} / {patient.gender || '—'}</span>
            <span className="label">Date of Birth</span>
            <span className="value">{formatDate(patient.dateOfBirth)}</span>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="report-section">
          <h4>AI Analysis Results</h4>
          <div className="report-grid" style={{ marginBottom: 16 }}>
            <span className="label">Prediction</span>
            <span className="value" style={{ textTransform: 'capitalize', fontWeight: 600 }}>
              {prediction.prediction || '—'}
            </span>
            <span className="label">Confidence</span>
            <span className="value" style={{ fontWeight: 600, color: 'var(--primary)' }}>
              {formatConfidence(prediction.confidence)}
            </span>
            <span className="label">Analysis Date</span>
            <span className="value">{formatDate(prediction.createdAt)}</span>
          </div>

          {/* Class Probabilities */}
          <h5 style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 8 }}>
            CLASS PROBABILITY DISTRIBUTION
          </h5>
          <div className="probability-bar-group" style={{ maxWidth: 400 }}>
            {Object.entries(probabilities).map(([cls, val]) => (
              <div className="probability-item" key={cls}>
                <span className="probability-label">{cls}</span>
                <div className="probability-track">
                  <div
                    className="probability-fill"
                    style={{ width: `${(val <= 1 ? val * 100 : val)}%` }}
                  />
                </div>
                <span className="probability-value">{formatConfidence(val)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MRI Images */}
        {prediction.originalImage && (
          <div className="report-section">
            <h4>MRI Scan & Grad-CAM Analysis</h4>
            <div className="image-comparison" style={{ marginTop: 12 }}>
              <div className="image-box">
                <img
                  src={`${NODE_BASE_URL}${prediction.originalImage}`}
                  alt="Original MRI"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="image-label">Original MRI</div>
              </div>
              <div className="image-box">
                <img
                  src={prediction.gradcamImage}
                  alt="Grad-CAM"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="image-label">Grad-CAM Overlay</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Summary */}
        {prediction.aiSummary && (
          <div className="report-section">
            <h4>AI-Generated Summary</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {prediction.aiSummary}
            </p>
          </div>
        )}

        {/* Doctor Notes */}
        {(report.doctorNotes || report.clinicalObservations) && (
          <div className="report-section">
            <h4>Clinical Notes & Observations</h4>
            {report.doctorNotes && (
              <div style={{ marginBottom: 12 }}>
                <strong style={{ fontSize: '0.75rem' }}>Doctor Notes:</strong>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.6 }}>
                  {report.doctorNotes}
                </p>
              </div>
            )}
            {report.clinicalObservations && (
              <div>
                <strong style={{ fontSize: '0.75rem' }}>Clinical Observations:</strong>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.6 }}>
                  {report.clinicalObservations}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ borderTop: '2px solid var(--sidebar-bg)', paddingTop: 16, marginTop: 24 }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--danger)', textAlign: 'center', lineHeight: 1.6, fontStyle: 'italic' }}>
            AI-ASSISTED SCREENING DISCLAIMER: This report was generated using AI-assisted analysis.
            The AI output is not a definitive medical diagnosis and should be interpreted by a qualified
            healthcare professional. All clinical decisions should be verified with independent diagnostic methods.
          </p>
        </div>
      </div>

      <div className="disclaimer" style={{ marginTop: 24 }}>
        <p>
          <strong>Note:</strong> AI-assisted screening tool — not a replacement for professional medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default ReportPreview;
