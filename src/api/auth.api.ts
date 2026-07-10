// src/api/auth.api.ts
import { apiClient } from './Client';
import type { RegisterPayload, LoginPayload, AuthResponse } from '../types/auth';

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },
};