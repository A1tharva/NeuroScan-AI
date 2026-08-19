import api from './api';

export const analyzeMRI = (formData) =>
  api.post('/predictions/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000 // 2 min for AI analysis
  });

export const updatePredictionNotes = (id, data) =>
  api.put(`/predictions/${id}/notes`, data);

export const getPatientPredictions = (patientId) =>
  api.get(`/predictions/patient/${patientId}`);

export const getPredictionById = (id) =>
  api.get(`/predictions/${id}`);

export const compareScans = (scan1, scan2) =>
  api.get(`/predictions/compare?scan1=${scan1}&scan2=${scan2}`);
