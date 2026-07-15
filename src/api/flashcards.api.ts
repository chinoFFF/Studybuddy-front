// src/api/flashcards.api.ts
import { apiClient } from './client';
import type {
  FlashcardDeck,
  FlashcardDeckWithCards,
  Flashcard,
  CreateDeckPayload,
  GenerateDeckPayload,
  UpdateDeckPayload,
  CreateCardPayload,
  AiEditCardPayload,
} from '../types/flashcards';

export const flashcardsApi = {
  listDecks: async (): Promise<FlashcardDeck[]> => {
    const { data } = await apiClient.get('/flashcards/decks');
    return data;
  },

  createDeck: async (payload: CreateDeckPayload): Promise<FlashcardDeck> => {
    const { data } = await apiClient.post('/flashcards/decks', payload);
    return data;
  },

  // El botón "Generar Flashcards" en AIChatRoom usa este endpoint
  generateDeck: async (payload: GenerateDeckPayload): Promise<FlashcardDeckWithCards> => {
    const { data } = await apiClient.post('/flashcards/decks/generate', payload);
    return data;
  },

  getDeck: async (deckId: string): Promise<FlashcardDeckWithCards> => {
    const { data } = await apiClient.get(`/flashcards/decks/${deckId}`);
    return data;
  },

  updateDeck: async (deckId: string, payload: UpdateDeckPayload): Promise<FlashcardDeck> => {
    const { data } = await apiClient.put(`/flashcards/decks/${deckId}`, payload);
    return data;
  },

  deleteDeck: async (deckId: string): Promise<void> => {
    await apiClient.delete(`/flashcards/decks/${deckId}`);
  },

  addCard: async (deckId: string, payload: CreateCardPayload): Promise<Flashcard> => {
    const { data } = await apiClient.post(`/flashcards/decks/${deckId}/cards`, payload);
    return data;
  },

  // Edita una tarjeta usando IA según instrucciones en lenguaje natural
  aiEditCard: async (cardId: string, payload: AiEditCardPayload): Promise<Flashcard> => {
    const { data } = await apiClient.put(`/flashcards/cards/${cardId}/llm-edit`, payload);
    return data;
  },

  deleteCard: async (cardId: string): Promise<void> => {
    await apiClient.delete(`/flashcards/cards/${cardId}`);
  },
};