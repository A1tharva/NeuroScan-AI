import api from './api';

export const createReport = (data) =>
  api.post('/reports', data);

export const getReports = () =>
  api.get('/reports');

export const getReportById = (id) =>
  api.get(`/reports/${id}`);

export const finalizeReport = (id) =>
  api.patch(`/reports/${id}/finalize`);

export const downloadReport = (id) =>
  api.get(`/reports/${id}/download`, {
    responseType: 'blob'
  });
