import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Diagnosis API
export const diagnosisAPI = {
  create: (formData) =>
    api.post('/diagnosis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: (page = 1, limit = 10) =>
    api.get(`/diagnosis?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/diagnosis/${id}`),
  delete: (id) => api.delete(`/diagnosis/${id}`),
  getStats: () => api.get('/diagnosis/stats'),
};

export default api;