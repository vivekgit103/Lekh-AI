import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to inject bearer token
apiClient.interceptors.request.use((config) => {
  const isDemo = localStorage.getItem('docusaathi_demo_mode') === 'true';
  const token = isDemo ? 'demo-token' : localStorage.getItem('sb-token') || 'demo-token';

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Health
  checkHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  // Dashboard
  getStats: async () => {
    const res = await apiClient.get('/dashboard/stats');
    return res.data.stats;
  },

  // Documents
  uploadDocument: async (formData) => {
    const res = await apiClient.post('/documents/upload', formData);
    return res.data;
  },

  uploadDemoSample: async (sampleKey) => {
    const res = await apiClient.post('/documents/upload', { sampleKey });
    return res.data;
  },

  getDemoSample: async () => {
    const res = await apiClient.get('/documents/demo-sample');
    return res.data.document;
  },

  getDocuments: async () => {
    const res = await apiClient.get('/documents');
    return res.data.documents;
  },

  getDocument: async (id) => {
    const res = await apiClient.get(`/documents/${id}`);
    return res.data.document;
  },

  deleteDocument: async (id) => {
    const res = await apiClient.delete(`/documents/${id}`);
    return res.data;
  },

  // Chat
  sendMessage: async (documentId, message) => {
    const res = await apiClient.post(`/documents/${documentId}/chat`, { message });
    return res.data;
  },

  getChatHistory: async (documentId) => {
    const res = await apiClient.get(`/documents/${documentId}/chat`);
    return res.data.history;
  },
};
