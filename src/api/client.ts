// src/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Ajusta esta URL a donde corra tu backend
  headers: { 'Content-Type': 'application/json' },
});

// Adjunta el token guardado (si existe) en cada request saliente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});