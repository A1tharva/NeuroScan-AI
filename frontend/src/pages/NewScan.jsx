import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPatientById } from '../api/patientApi';
import { analyzeMRI } from '../api/predictionApi';

const UploadCloudIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const FileDocIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const NewScan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await getPatientById(id);
        setPatient(res.data.patient);
      } catch (err) {
        setError('Failed to load patient');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const handleFileSelect = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/dicom'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(jpg|jpeg|png|dcm)$/i)) {
      setError('Please select a valid MRI image (JPEG, PNG)');
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be under 10 MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select an MRI image first');
      return;
    }

    setError('');
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('patientId', id);

      const res = await analyzeMRI(formData);

      // Navigate to analysis result with data
      navigate(`/scans/${res.data.predictionId}/result`, {
        state: { analysisData: res.data, patient }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'AI analysis failed. Please try again.');
      setAnalyzing(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>New MRI Analysis</h2>
        <p className="breadcrumb">
          <Link to="/dashboard">NeuroScan AI</Link> /{' '}
          <Link to="/patients">Patients</Link> /{' '}
          <Link to={`/patients/${id}`}>{patient?.name}</Link> / New Scan
        </p>
      </div>

      <div className="card" style={{ maxWidth: 700, margin: '0 auto' }}>
        <h3 className="card-title" style={{ marginBottom: 4 }}>New MRI Analysis Request</h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
          Patient Context: <strong>{patient?.name}</strong> — {patient?.patientId}
        </p>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Upload Zone */}
        <div
          className={`upload-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{ marginBottom: 20 }}
        >
          <div className="upload-icon" style={{ display: 'flex', justifyContent: 'center' }}>
            <UploadCloudIcon />
          </div>
          <p className="upload-text">
            <strong>Upload Brain MRI Scan</strong>
          </p>
          <p className="upload-hint">
            Drag and drop MRI image file here, or
          </p>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ marginTop: 12 }}
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            Choose MRI Image
          </button>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 12 }}>
            Supported formats: JPEG, PNG, DICOM · Max size: 10 MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,.dcm"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
        </div>

        {/* Selected File */}
        {file && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: 'var(--bg)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              marginBottom: 20
            }}
          >
            <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
              <FileDocIcon />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{file.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatSize(file.size)}</div>
            </div>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => setFile(null)}
              disabled={analyzing}
            >
              Remove
            </button>
          </div>
        )}

        {/* Analyze Button */}
        <button
          className="btn btn-primary btn-block btn-lg"
          onClick={handleAnalyze}
          disabled={!file || analyzing}
          style={{ background: '#0a1628' }}
        >
          {analyzing ? (
            <>
              <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
              Analyzing MRI...
            </>
          ) : (
            'Analyze MRI'
          )}
        </button>

        {analyzing && (
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 12 }}>
            Processing the MRI and generating an explainability map. Please wait — this may take a moment.
          </p>
        )}
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

export default NewScan;
