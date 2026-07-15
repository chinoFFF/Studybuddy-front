// src/types/flashcards.ts

export interface FlashcardDeck {
  id: string;
  room_id: string;
  user_id: string;
  title: string;
  description: string;
}

export interface Flashcard {
  id: string;
  deck_id: string;
  front: string;
  back: string;
}

export interface FlashcardDeckWithCards extends FlashcardDeck {
  flashcards: Flashcard[];
}

export interface CreateDeckPayload {
  room_id: string;
  title: string;
  description: string;
}

export interface GenerateDeckPayload {
  document_id: string;
  num_cards: number;
  description: string;
}

export interface UpdateDeckPayload {
  title: string;
  description: string;
}

export interface CreateCardPayload {
  front: string;
  back: string;
}

export interface AiEditCardPayload {
  instructions: string;
}