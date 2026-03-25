import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Add JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('accountType');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Lawyer APIs
export const lawyerAPI = {
  search: (params) => api.get('/lawyers', { params }),
  getById: (id) => api.get(`/lawyers/${id}`),
  update: (id, data) => api.put(`/lawyers/${id}`, data),
  getAppointments: (id) => api.get(`/lawyers/${id}/appointments`),
};

// Legal Database APIs
export const legalAPI = {
  getActs: (params) => api.get('/legal/acts', { params }),
  getActById: (id) => api.get(`/legal/acts/${id}`),
  search: (query) => api.post('/legal/search', { query }),
  getCategories: () => api.get('/legal/categories'),
};

// Chat APIs
export const chatAPI = {
  sendMessage: (data) => api.post('/chat', data),
  getHistory: () => api.get('/chat/history'),
  getChat: (id) => api.get(`/chat/${id}`),
  deleteChat: (id) => api.delete(`/chat/${id}`),
};

// Appointment APIs
export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getAll: (params) => api.get('/appointments', { params }),
  update: (id, data) => api.put(`/appointments/${id}`, data),
};

// Admin APIs
export const adminAPI = {
  getLawyers: (params) => api.get('/admin/lawyers', { params }),
  verifyLawyer: (id, status) => api.put(`/admin/lawyers/${id}/verify`, { status }),
  getAnalytics: () => api.get('/admin/analytics'),
  addLegalAct: (data) => api.post('/admin/legal', data),
  updateLegalAct: (id, data) => api.put(`/admin/legal/${id}`, data),
  deleteLegalAct: (id) => api.delete(`/admin/legal/${id}`),
  getUsers: () => api.get('/admin/users'),
};

// Upload APIs
export const uploadAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('document', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('documents', file));
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default api;
