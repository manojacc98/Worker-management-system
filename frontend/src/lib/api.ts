import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
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
      Cookies.remove('token');
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Types
export interface Worker {
  _id: string;
  name: string;
  photo: string;
  hourlyRate: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Update {
  _id: string;
  workerId: Worker;
  comment: string;
  images: string[];
  hasPendingWork: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Salary {
  _id: string;
  workerId: Worker;
  cycleType: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  totalHours: number;
  hourlyRate: number;
  grossSalary: number;
  advances: number;
  netSalary: number;
  status: 'pending' | 'paid';
  paidAt?: string;
  notes?: string;
}

export interface Advance {
  _id: string;
  workerId: Worker;
  amount: number;
  date: string;
  notes?: string;
}

// API functions
export const workerApi = {
  getAll: (params?: { search?: string; sortBy?: string; sortOrder?: string }) =>
    api.get<Worker[]>('/workers', { params }),
  getById: (id: string) => api.get<Worker>(`/workers/${id}`),
  create: (data: FormData) => api.post<Worker>('/workers', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) =>
    api.put<Worker>(`/workers/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/workers/${id}`),
};

export const updateApi = {
  getAll: (params?: { workerId?: string; date?: string; limit?: number }) =>
    api.get<Update[]>('/updates', { params }),
  getById: (id: string) => api.get<Update>(`/updates/${id}`),
  getByWorkerId: (workerId: string, limit?: number) =>
    api.get<Update[]>(`/updates/worker/${workerId}`, { params: { limit } }),
  create: (data: FormData) =>
    api.post<Update>('/updates', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const salaryApi = {
  getAll: (params?: { workerId?: string; status?: string; cycleType?: string }) =>
    api.get<Salary[]>('/salary', { params }),
  getById: (id: string) => api.get<Salary>(`/salary/${id}`),
  getByWorkerId: (workerId: string) => api.get<Salary[]>(`/salary/worker/${workerId}`),
  create: (data: {
    workerId: string;
    cycleType: 'weekly' | 'monthly';
    endDate: string;
    notes?: string;
  }) => api.post<Salary>('/salary', data),
  markPaid: (id: string) => api.patch(`/salary/${id}/paid`),
  getAdvances: (workerId: string, params?: { startDate?: string; endDate?: string }) =>
    api.get<Advance[]>(`/salary/advances/${workerId}`, { params }),
  createAdvance: (data: { workerId: string; amount: number; date?: string; notes?: string }) =>
    api.post<Advance>('/salary/advances', data),
};

export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ token: string; user: { id: string; username: string; role: string } }>('/auth/login', {
      username,
      password,
    }),
  verify: () => api.get<{ user: { id: string; username: string; role: string } }>('/auth/verify'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  exportReport: (type: 'payroll' | 'attendance' | 'pending-work', params?: Record<string, string>) =>
    api.get(`/admin/export/${type}`, { params, responseType: 'blob' }),
};

