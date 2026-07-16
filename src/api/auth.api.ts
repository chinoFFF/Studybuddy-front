// src/api/auth.api.ts
import { apiClient } from './client';
import type { RegisterPayload, LoginPayload, AuthResponse, User } from '../types/auth';

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },

  google: async (credential: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/google', { token: credential });
    return data;
  },

  me: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};