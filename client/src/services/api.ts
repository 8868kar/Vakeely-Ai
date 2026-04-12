import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_BASE = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Add JWT token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
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
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Lawyer APIs
export const lawyerAPI = {
  search: (params: any) => api.get('/lawyers', { params }),
  getById: (id: string) => api.get(`/lawyers/${id}`),
  update: (id: string, data: any) => api.put(`/lawyers/${id}`, data),
  getAppointments: (id: string) => api.get(`/lawyers/${id}/appointments`),
};

// Legal Database APIs
export const legalAPI = {
  getActs: (params?: any) => api.get('/legal/acts', { params }),
  getActById: (id: string) => api.get(`/legal/acts/${id}`),
  search: (query: string) => api.post('/legal/search', { query }),
  getCategories: () => api.get('/legal/categories'),
};

// Chat APIs
export const chatAPI = {
  sendMessage: (data: { message: string; chatId?: string }) => api.post('/chat', data),
  getHistory: () => api.get('/chat/history'),
  getChat: (id: string) => api.get(`/chat/${id}`),
  deleteChat: (id: string) => api.delete(`/chat/${id}`),
};

// Appointment APIs
export const appointmentAPI = {
  create: (data: any) => api.post('/appointments', data),
  getAll: (params?: any) => api.get('/appointments', { params }),
  update: (id: string, data: any) => api.put(`/appointments/${id}`, data),
};

// Admin APIs
export const adminAPI = {
  getLawyers: (params?: any) => api.get('/admin/lawyers', { params }),
  verifyLawyer: (id: string, status: 'approved' | 'rejected') => api.put(`/admin/lawyers/${id}/verify`, { status }),
  getAnalytics: () => api.get('/admin/analytics'),
  addLegalAct: (data: any) => api.post('/admin/legal', data),
  updateLegalAct: (id: string, data: any) => api.put(`/admin/legal/${id}`, data),
  deleteLegalAct: (id: string) => api.delete(`/admin/legal/${id}`),
  getUsers: () => api.get('/admin/users'),
};

// Upload APIs
export const uploadAPI = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadMultiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('documents', file));
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default api;
