// src/types/chat.ts

export interface Citation {
  document_id: string;
  title: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[] | null;
  created_at?: string;
}

// POST /chat/sessions/{id}/messages regresa AMBOS mensajes, no solo el del asistente
export interface SendMessageResponse {
  user_message: ChatMessage;
  assistant_message: ChatMessage;
}

export interface ChatSession {
  id: string;
  user_id: string;
  room_id: string;
  name: string;
  documents: {
    id: string;
    title: string;
    status?: string;
  }[];
  started_at?: string;
}

export interface CreateChatSessionPayload {
  room_id: string;
  name: string;
  document_ids: string[];
}

export interface UpdateChatSessionPayload {
  name: string;
  document_ids: string[];
}

export interface SendMessagePayload {
  content: string;
}