import api from './api';

export const getDoctorProfile = () =>
  api.get('/doctors/profile');

export const updateDoctorProfile = (data) =>
  api.put('/doctors/profile', data);
