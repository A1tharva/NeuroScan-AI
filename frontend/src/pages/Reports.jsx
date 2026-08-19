import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReports } from '../api/reportApi';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, draft, final

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports();
        setReports(res.data.reports || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : '—';

  const formatConfidence = (val) => {
    if (!val && val !== 0) return '—';
    const pct = val <= 1 ? val * 100 : val;
    return `${pct.toFixed(1)}%`;
  };

  const filtered = reports.filter(r => {
    const matchesSearch =
      (r.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.patientId?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' || r.reportStatus === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading reports...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Reports</h2>
        <p className="breadcrumb">
          <Link to="/dashboard">NeuroScan AI</Link> / Reports
        </p>
      </div>

      <div className="card" style={{ marginBottom: 4, padding: '16px 24px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 4 }}>
          Clinical Decision Support Reports
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Filter, audit, and download AI-based brain MRI analysis reports.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, marginTop: 16, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 250 }}>
          <span className="search-icon"><SearchIcon /></span>
          <input
            type="text"
            placeholder="Search reports by title or patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="tabs" style={{ border: 'none', marginBottom: 0 }}>
          {['all', 'draft', 'final'].map(f => (
            <button
              key={f}
              className={`tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
              style={{ textTransform: 'capitalize' }}
            >
              {f === 'all' ? 'All Reports' : f}
              {' '}({f === 'all' ? reports.length : reports.filter(r => r.reportStatus === f).length})
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Title</th>
                <th>Scan Date</th>
                <th>Prediction</th>
                <th>Confidence</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    {search ? 'No reports match your search.' : 'No reports found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((report) => (
                  <tr key={report._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      RPT-{report._id.slice(-6).toUpperCase()}
                    </td>
                    <td>
                      <Link to={`/reports/${report._id}`} style={{ color: 'var(--primary)', fontWeight: 500 }}>
                        {report.title || 'MRI Report'}
                      </Link>
                    </td>
                    <td>{formatDate(report.predictionId?.createdAt || report.createdAt)}</td>
                    <td style={{ textTransform: 'capitalize' }}>
                      {report.predictionId?.prediction || '—'}
                    </td>
                    <td>{formatConfidence(report.predictionId?.confidence)}</td>
                    <td>
                      <span className={`badge badge-${report.reportStatus}`}>
                        {report.reportStatus}
                      </span>
                    </td>
                    <td>
                      <Link to={`/reports/${report._id}`} className="btn btn-sm btn-outline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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

export default Reports;
