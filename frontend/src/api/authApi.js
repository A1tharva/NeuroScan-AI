import api from './api';

export const loginDoctor = (credentials) =>
  api.post('/auth/login', credentials);

export const registerDoctor = (data) =>
  api.post('/auth/register', data);

export const getCurrentDoctor = () =>
  api.get('/auth/me');

export const logoutDoctor = () =>
  api.post('/auth/logout');
