import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getPatientPredictions } from '../api/predictionApi';
import { compareScans as compareScansFn } from '../api/predictionApi';
import { getPatients } from '../api/patientApi';
import { NODE_BASE_URL } from '../api/api';

const CompareScans = () => {
  const [searchParams] = useSearchParams();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [scans, setScans] = useState([]);
  const [scan1Id, setScan1Id] = useState(searchParams.get('scan1') || '');
  const [scan2Id, setScan2Id] = useState(searchParams.get('scan2') || '');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingScans, setLoadingScans] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await getPatients();
        setPatients(res.data.patients || []);
      } catch (err) {
        setError('Failed to load patients');
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchScans(selectedPatient);
    }
  }, [selectedPatient]);

  const fetchScans = async (patientId) => {
    setLoadingScans(true);
    try {
      const res = await getPatientPredictions(patientId);
      setScans(res.data.predictions || []);
    } catch (err) {
      setError('Failed to load scans');
    } finally {
      setLoadingScans(false);
    }
  };

  const handleCompare = async () => {
    if (!scan1Id || !scan2Id) {
      setError('Please select two scans to compare');
      return;
    }
    if (scan1Id === scan2Id) {
      setError('Please select two different scans');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await compareScansFn(scan1Id, scan2Id);
      setComparison(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to compare scans');
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

  const renderScanSide = (scan, label) => {
    if (!scan) return null;
    return (
      <div className="card">
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>
          {label}
        </h4>
        <div className="image-comparison">
          <div className="image-box">
            <img
              src={`${NODE_BASE_URL}${scan.originalImage}`}
              alt="MRI"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="image-label">Original MRI</div>
          </div>
          <div className="image-box">
            <img
              src={scan.gradcamImage}
              alt="Grad-CAM"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="image-label">Grad-CAM</div>
          </div>
        </div>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <span className="badge badge-info" style={{ textTransform: 'capitalize', marginRight: 8 }}>
            {scan.prediction}
          </span>
          <span className="badge badge-success">
            {formatConfidence(scan.confidence)}
          </span>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
            {formatDate(scan.createdAt)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h2>Compare MRI Analyses</h2>
        <p className="breadcrumb">
          <Link to="/dashboard">NeuroScan AI</Link> / Compare Scans
        </p>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 24 }}>
        <span>
          Visual and numerical comparison to assist clinical review. It does not replace independent radiological evaluation by qualified professionals.
        </span>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Selection Controls */}
      {!comparison && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="card-title" style={{ marginBottom: 16 }}>Select Scans to Compare</h3>

          <div className="form-group">
            <label className="form-label">Select Patient</label>
            <select
              className="form-input"
              value={selectedPatient}
              onChange={(e) => {
                setSelectedPatient(e.target.value);
                setScan1Id('');
                setScan2Id('');
                setComparison(null);
              }}
            >
              <option value="">Choose a patient...</option>
              {patients.filter(p => p.status === 'active').map(p => (
                <option key={p._id} value={p._id}>{p.name} ({p.patientId})</option>
              ))}
            </select>
          </div>

          {loadingScans ? (
            <div className="loading-container" style={{ padding: 20 }}>
              <div className="spinner"></div>
            </div>
          ) : scans.length > 0 && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Scan 1 (Previous)</label>
                  <select
                    className="form-input"
                    value={scan1Id}
                    onChange={(e) => setScan1Id(e.target.value)}
                  >
                    <option value="">Select scan...</option>
                    {scans.map(s => (
                      <option key={s._id} value={s._id}>
                        {formatDate(s.createdAt)} — {s.prediction} ({formatConfidence(s.confidence)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Scan 2 (Current)</label>
                  <select
                    className="form-input"
                    value={scan2Id}
                    onChange={(e) => setScan2Id(e.target.value)}
                  >
                    <option value="">Select scan...</option>
                    {scans.map(s => (
                      <option key={s._id} value={s._id}>
                        {formatDate(s.createdAt)} — {s.prediction} ({formatConfidence(s.confidence)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleCompare}
                disabled={!scan1Id || !scan2Id || loading}
              >
                {loading ? 'Comparing...' : 'Compare Scans'}
              </button>
            </>
          )}

          {selectedPatient && scans.length === 0 && !loadingScans && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              This patient has no scans to compare.
            </p>
          )}

          {selectedPatient && scans.length === 1 && (
            <p style={{ color: 'var(--warning)', fontSize: '0.875rem' }}>
              This patient only has 1 scan. At least 2 scans are needed for comparison.
            </p>
          )}
        </div>
      )}

      {comparison && (
        <>
          <div style={{ marginBottom: 16 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setComparison(null)}>
              Select Different Scans
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            {renderScanSide(comparison.scan1, 'Previous Scan')}
            {renderScanSide(comparison.scan2, 'Current Scan')}
          </div>

          {/* Comparison Table */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 className="card-title" style={{ marginBottom: 16 }}>
              Quantitative Volumetric & Radiomics Data Analysis
            </h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Scan 1 (Previous)</th>
                    <th>Scan 2 (Current)</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Prediction</td>
                    <td style={{ textTransform: 'capitalize' }}>{comparison.scan1?.prediction}</td>
                    <td style={{ textTransform: 'capitalize' }}>{comparison.scan2?.prediction}</td>
                    <td>
                      {comparison.scan1?.prediction === comparison.scan2?.prediction
                        ? <span className="badge badge-success">Same</span>
                        : <span className="badge badge-warning">Changed</span>
                      }
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Confidence</td>
                    <td>{formatConfidence(comparison.scan1?.confidence)}</td>
                    <td>{formatConfidence(comparison.scan2?.confidence)}</td>
                    <td>
                      {(() => {
                        const c1 = (comparison.scan1?.confidence <= 1 ? comparison.scan1?.confidence * 100 : comparison.scan1?.confidence) || 0;
                        const c2 = (comparison.scan2?.confidence <= 1 ? comparison.scan2?.confidence * 100 : comparison.scan2?.confidence) || 0;
                        const diff = (c2 - c1).toFixed(1);
                        return (
                          <span style={{ color: diff >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {diff >= 0 ? '+' : ''}{diff}%
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Scan Date</td>
                    <td>{formatDate(comparison.scan1?.createdAt)}</td>
                    <td>{formatDate(comparison.scan2?.createdAt)}</td>
                    <td style={{ color: 'var(--text-muted)' }}>—</td>
                  </tr>
                  {['glioma', 'meningioma', 'notumor', 'pituitary'].map(cls => (
                    <tr key={cls}>
                      <td style={{ fontWeight: 600, textTransform: 'capitalize' }}>{cls} Probability</td>
                      <td>{formatConfidence(comparison.scan1?.probabilities?.[cls])}</td>
                      <td>{formatConfidence(comparison.scan2?.probabilities?.[cls])}</td>
                      <td>
                        {(() => {
                          const v1 = comparison.scan1?.probabilities?.[cls] || 0;
                          const v2 = comparison.scan2?.probabilities?.[cls] || 0;
                          const p1 = v1 <= 1 ? v1 * 100 : v1;
                          const p2 = v2 <= 1 ? v2 * 100 : v2;
                          const diff = (p2 - p1).toFixed(2);
                          return (
                            <span style={{ color: Math.abs(diff) < 1 ? 'var(--text-muted)' : diff > 0 ? 'var(--danger)' : 'var(--success)', fontSize: '0.8125rem' }}>
                              {diff >= 0 ? '+' : ''}{diff}%
                            </span>
                          );
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="disclaimer">
        <p>
          <strong>Note:</strong> AI-assisted screening tool — not a replacement for professional medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default CompareScans;
