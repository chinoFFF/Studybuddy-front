// src/api/chat.api.ts
import { apiClient } from './client';
import type {
  ChatSession,
  ChatMessage,
  CreateChatSessionPayload,
  UpdateChatSessionPayload,
  SendMessagePayload,
  SendMessageResponse,
} from '../types/chat';

export const chatApi = {
  listSessions: async (): Promise<ChatSession[]> => {
    const { data } = await apiClient.get('/chat/sessions');
    return data;
  },

  createSession: async (payload: CreateChatSessionPayload): Promise<ChatSession> => {
    const { data } = await apiClient.post('/chat/sessions', payload);
    return data;
  },

  getSession: async (sessionId: string): Promise<ChatSession> => {
    const { data } = await apiClient.get(`/chat/sessions/${sessionId}`);
    return data;
  },

  updateSession: async (sessionId: string, payload: UpdateChatSessionPayload): Promise<ChatSession> => {
    const { data } = await apiClient.put(`/chat/sessions/${sessionId}`, payload);
    return data;
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/chat/sessions/${sessionId}`);
  },

  listMessages: async (sessionId: string): Promise<ChatMessage[]> => {
    const { data } = await apiClient.get(`/chat/sessions/${sessionId}/messages`);
    return data;
  },

  // Devuelve AMBOS mensajes: el que mandó el usuario y la respuesta del asistente
  sendMessage: async (sessionId: string, payload: SendMessagePayload): Promise<SendMessageResponse> => {
    const { data } = await apiClient.post(`/chat/sessions/${sessionId}/messages`, payload);
    return data;
  },

  deleteMessage: async (sessionId: string, messageId: string): Promise<void> => {
    await apiClient.delete(`/chat/sessions/${sessionId}/messages/${messageId}`);
  },

  // NOTA: no verificado aún si regresa el mensaje directo o también { assistant_message: ... }.
  // Si al probar "regenerar" el texto no aparece, es el mismo problema que acabamos de arreglar aquí.
  regenerateMessage: async (sessionId: string, messageId: string): Promise<ChatMessage> => {
    const { data } = await apiClient.post(`/chat/sessions/${sessionId}/messages/${messageId}/regenerate`);
    return data;
  },
};