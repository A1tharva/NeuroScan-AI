import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';

// App Pages
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import AddPatient from './pages/AddPatient';
import PatientOverview from './pages/PatientOverview';
import NewScan from './pages/NewScan';
import AnalysisResult from './pages/AnalysisResult';
import ScanHistory from './pages/ScanHistory';
import ScanDetail from './pages/ScanDetail';
import CompareScans from './pages/CompareScans';
import Reports from './pages/Reports';
import ReportPreview from './pages/ReportPreview';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Profile Setup (protected but no sidebar) */}
          <Route
            path="/profile/setup"
            element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes with Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/new" element={<AddPatient />} />
            <Route path="/patients/:id" element={<PatientOverview />} />
            <Route path="/patients/:id/scan" element={<NewScan />} />
            <Route path="/patients/:id/scans" element={<ScanHistory />} />
            <Route path="/scans/:id" element={<ScanDetail />} />
            <Route path="/scans/:id/result" element={<AnalysisResult />} />
            <Route path="/scan-analysis" element={<CompareScans />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/:id" element={<ReportPreview />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Profile />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
