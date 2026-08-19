import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../api/dashboardApi';
import { NODE_BASE_URL } from '../api/api';

const statIcons = {
  patients: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  scans: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  analyses: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  pending: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
};

const Dashboard = () => {
  const { doctor } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard();
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatConfidence = (val) => {
    if (!val && val !== 0) return '—';
    const pct = val <= 1 ? val * 100 : val;
    return `${pct.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  const stats = data?.statistics || {};
  const recentPatients = data?.recentPatients || [];
  const recentAnalyses = data?.recentAnalyses || [];

  return (
    <div>
      <div className="page-header">
        <h2>{getGreeting()}, Dr. {doctor?.name || 'Doctor'}</h2>
        <p className="breadcrumb">
          Review your patients and recent MRI analyses
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon patients">{statIcons.patients}</div>
          <div className="stat-label">Total Patients</div>
          <div className="stat-value">{stats.totalPatients || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon scans">{statIcons.scans}</div>
          <div className="stat-label">Total MRI Scans</div>
          <div className="stat-value">{stats.totalScans || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon analyses">{statIcons.analyses}</div>
          <div className="stat-label">Recent Analyses</div>
          <div className="stat-value">{recentAnalyses.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">{statIcons.pending}</div>
          <div className="stat-label">Pending Reviews</div>
          <div className="stat-value">{stats.archivedPatients || 0}</div>
        </div>
      </div>

      {/* Recent Patient MRI Scans Table */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-header">
          <h3 className="card-title">Recent Patient MRI Scans</h3>
          <Link to="/patients" className="btn btn-sm btn-outline">
            View All Patients
          </Link>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Patient ID</th>
                <th>Last Scan</th>
                <th>Latest Prediction</th>
                <th>Confidence</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
                    No patients yet. <Link to="/patients/new" style={{ color: 'var(--primary)' }}>Add your first patient</Link>
                  </td>
                </tr>
              ) : (
                recentPatients.map((patient) => (
                  <tr key={patient._id}>
                    <td>
                      <Link
                        to={`/patients/${patient._id}`}
                        style={{ color: 'var(--primary)', fontWeight: 500 }}
                      >
                        {patient.name}
                      </Link>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{patient.patientId}</td>
                    <td>{formatDate(patient.createdAt)}</td>
                    <td>—</td>
                    <td>—</td>
                    <td>
                      <span className={`badge badge-${patient.status === 'active' ? 'active' : 'archived'}`}>
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent MRI Analyses Summaries */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent MRI Analyses Summaries</h3>
        </div>

        {recentAnalyses.length === 0 ? (
          <div className="empty-state">
            <h3>No analyses yet</h3>
            <p>Upload an MRI scan to get started with AI-assisted analysis.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
            {recentAnalyses.map((analysis) => (
              <div
                key={analysis._id}
                className="card"
                style={{ padding: 16, cursor: 'pointer' }}
                onClick={() => window.location.href = `/scans/${analysis._id}`}
              >
                <div style={{ display: 'flex', gap: 16 }}>
                  <img
                    src={`${NODE_BASE_URL}${analysis.originalImage || ''}`}
                    alt="MRI"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 'var(--radius)',
                      objectFit: 'cover',
                      background: 'var(--bg)'
                    }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {analysis.patientId?.name || 'Unknown Patient'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {formatDate(analysis.createdAt)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                        {analysis.prediction}
                      </span>
                      <span className="badge badge-success">
                        {formatConfidence(analysis.confidence)} Conf
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {analysis.aiSummary || 'AI analysis completed.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default Dashboard;
