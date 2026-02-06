import axios from 'axios';
import { Document, ChatSession, ChatMessage, Visitor, WidgetSettings } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests (no longer needed with cookies)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Documents
export const documentAPI = {
  list: () => api.get<Document[]>('/documents'),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<Document>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: string) => api.delete(`/documents/${id}`),
};

// Chat Sessions
export const sessionAPI = {
  list: () => api.get<ChatSession[]>('/sessions'),
  get: (id: string) => api.get<ChatSession>(`/sessions/${id}`),
  messages: (sessionId: string) => api.get<ChatMessage[]>(`/sessions/${sessionId}/messages`),
};

// Visitors
export const visitorAPI = {
  list: () => api.get<Visitor[]>('/visitors'),
  get: (id: string) => api.get<Visitor>(`/visitors/${id}`),
};

// Widget Settings
export const widgetAPI = {
  get: () => api.get<WidgetSettings>('/widget/settings'),
  update: (settings: { primary_color: string; text_color: string; font_family: string; position: string; welcome_message: string }) => {
    const formData = new URLSearchParams();
    formData.append('primary_color', settings.primary_color);
    formData.append('text_color', settings.text_color);
    formData.append('font_family', settings.font_family);
    formData.append('position', settings.position);
    formData.append('welcome_message', settings.welcome_message);
    return api.post('/widget/customize', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  regenerateToken: () => api.post<{ botToken: string }>('/widget/regenerate-token'),
};

// Analytics
export const analyticsAPI = {
  dashboard: (days: number = 7) => api.get(`/analytics/dashboard?days=${days}`),
};

// Auth
export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  signup: (
    full_name: string,
    email: string,
    company_name: string,
    password: string
  ) => api.post('/auth/signup', { full_name, email, company_name, password }),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data: { name?: string; email?: string; password?: string }) =>
    api.put('/auth/profile', data),
};

// Audio
export const audioAPI = {
  list: () => api.get('/audio'),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: number) => api.delete(`/audio/${id}`),
};

// Website
export const websiteAPI = {
  list: () => api.get('/website'),
  load: (url: string) => api.post('/website', { url }),
  delete: (id: number) => api.delete(`/website/${id}`),
};

// Tickets
export const ticketAPI = {
  list: () => api.get('/tickets/list'),
};
