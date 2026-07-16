// src/api/progress.api.ts
import { apiClient } from './client';
import type { ProgressSummary, UnseenFlashcardDeck, ActivityEntry } from '../types/progress';

export const progressApi = {
  getSummary: async (): Promise<ProgressSummary> => {
    const { data } = await apiClient.get('/progress/me');
    return data;
  },

  getUnseenFlashcards: async (): Promise<UnseenFlashcardDeck[]> => {
    const { data } = await apiClient.get('/progress/unseen-flashcards');
    return data;
  },

  // Registra 1 minuto de actividad para hoy. Sin body.
  ping: async (): Promise<string> => {
    const { data } = await apiClient.post('/progress/ping');
    return data;
  },

  getActivity: async (): Promise<ActivityEntry[]> => {
    const { data } = await apiClient.get('/progress/activity');
    return data;
  },
};