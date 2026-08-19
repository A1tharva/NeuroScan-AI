import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPatients, archivePatient, restorePatient } from '../api/patientApi';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, archived

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(res.data.patients || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id) => {
    if (!confirm('Archive this patient?')) return;
    try {
      await archivePatient(id);
      setPatients(patients.map(p =>
        p._id === id ? { ...p, status: 'archived' } : p
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to archive');
    }
  };

  const handleRestore = async (id) => {
    try {
      await restorePatient(id);
      setPatients(patients.map(p =>
        p._id === id ? { ...p, status: 'active' } : p
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to restore');
    }
  };

  const filtered = patients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.patientId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : '—';

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading patients...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Patients</h2>
          <p className="breadcrumb">
            <Link to="/dashboard">NeuroScan AI</Link> / Patients
          </p>
        </div>
        <Link to="/patients/new" className="btn btn-primary">
          + Add New Patient
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Search & Filter */}
      <div className="card" style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 250 }}>
            <span className="search-icon"><SearchIcon /></span>
            <input
              type="text"
              placeholder="Search patients by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="tabs" style={{ border: 'none', marginBottom: 0 }}>
            {['all', 'active', 'archived'].map(f => (
              <button
                key={f}
                className={`tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                style={{ textTransform: 'capitalize' }}
              >
                {f} {f === 'all' ? `(${patients.length})` :
                  `(${patients.filter(p => p.status === f).length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Patient ID</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Date Added</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    {search ? 'No patients match your search.' : 'No patients found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((patient) => (
                  <tr key={patient._id}>
                    <td>
                      <Link
                        to={`/patients/${patient._id}`}
                        style={{ color: 'var(--primary)', fontWeight: 600 }}
                      >
                        {patient.name}
                      </Link>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      {patient.patientId}
                    </td>
                    <td>{patient.age}</td>
                    <td style={{ textTransform: 'capitalize' }}>{patient.gender}</td>
                    <td>{formatDate(patient.createdAt)}</td>
                    <td>
                      <span className={`badge badge-${patient.status === 'active' ? 'active' : 'archived'}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link
                          to={`/patients/${patient._id}`}
                          className="btn btn-sm btn-secondary"
                        >
                          View
                        </Link>
                        {patient.status === 'active' ? (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleArchive(patient._id)}
                            style={{ color: 'var(--warning)' }}
                          >
                            Archive
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleRestore(patient._id)}
                            style={{ color: 'var(--success)' }}
                          >
                            Restore
                          </button>
                        )}
                      </div>
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
          <strong>Note:</strong> AI-assisted screening tool — not a replacement for professional
          medical diagnosis. Decisions must be verified with clinical judgement.
        </p>
      </div>
    </div>
  );
};

export default Patients;
