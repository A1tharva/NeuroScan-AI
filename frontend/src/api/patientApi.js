import api from './api';

export const createPatient = (data) =>
  api.post('/patients', data);

export const getPatients = () =>
  api.get('/patients');

export const getPatientById = (id) =>
  api.get(`/patients/${id}`);

export const updatePatient = (id, data) =>
  api.put(`/patients/${id}`, data);

export const archivePatient = (id) =>
  api.patch(`/patients/${id}/archive`);

export const restorePatient = (id) =>
  api.patch(`/patients/${id}/restore`);
