// src/api/documents.api.ts
import { apiClient } from './client';
import type { DocumentItem, DocumentSummary, DownloadUrlResponse } from '../types/document';

export const documentsApi = {
  // Nuevo contrato del backend: file + room_id + title (antes era file + subject_id)
  upload: async (file: File, roomId: string, title?: string): Promise<DocumentItem> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('room_id', roomId);
    formData.append('title', title ?? file.name);

    const { data } = await apiClient.post('/documents/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getDownloadUrl: async (documentId: string): Promise<DownloadUrlResponse> => {
    const { data } = await apiClient.get(`/documents/${documentId}/download`);
    return data;
  },

  delete: async (documentId: string): Promise<void> => {
    await apiClient.delete(`/documents/${documentId}`);
  },

  getSummary: async (documentId: string): Promise<DocumentSummary> => {
    const { data } = await apiClient.get(`/documents/${documentId}/summary`);
    return data;
  },
};