// src/types/progress.ts

export interface ProgressSummary {
  total_quizzes_taken: number;
  average_quiz_score: number;
  total_flashcards_generated: number;
}

export interface UnseenFlashcardDeck {
  id: string;
  room_id: string;
  user_id: string;
  title: string;
  description: string;
}

export interface ActivityEntry {
  activity_date: string; // "YYYY-MM-DD"
  minutes_spent: number;
}