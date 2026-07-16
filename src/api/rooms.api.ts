// src/api/rooms.api.ts
import { apiClient } from './client';
import type { StudyRoom } from '../types/room';

export const roomsApi = {
  getById: async (roomId: string): Promise<StudyRoom> => {
    const { data } = await apiClient.get(`/rooms/${roomId}`);
    return data;
  },
};