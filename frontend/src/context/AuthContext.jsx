import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentDoctor } from '../api/authApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('neuroscan_token'));
  const [loading, setLoading] = useState(true);

  // On mount, validate existing token
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getCurrentDoctor();
        setDoctor(res.data.doctor);
      } catch {
        // Token invalid — clear it
        localStorage.removeItem('neuroscan_token');
        localStorage.removeItem('neuroscan_doctor');
        setToken(null);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const login = (tokenValue, doctorData) => {
    localStorage.setItem('neuroscan_token', tokenValue);
    localStorage.setItem('neuroscan_doctor', JSON.stringify(doctorData));
    setToken(tokenValue);
    setDoctor(doctorData);
  };

  const logout = () => {
    localStorage.removeItem('neuroscan_token');
    localStorage.removeItem('neuroscan_doctor');
    setToken(null);
    setDoctor(null);
  };

  const updateDoctor = (doctorData) => {
    setDoctor(doctorData);
    localStorage.setItem('neuroscan_doctor', JSON.stringify(doctorData));
  };

  const value = {
    doctor,
    token,
    loading,
    isAuthenticated: !!token && !!doctor,
    login,
    logout,
    updateDoctor
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
