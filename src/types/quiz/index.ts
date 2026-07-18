// Tipos para el módulo de Quizzes

export interface QuestionResponse {
  id: string;
  type: 'multiple_choice';
  prompt: string;
  options: string[];
}

export interface QuestionWithAnswerResponse extends QuestionResponse {
  correct_answer: string;
  selected_option?: string | null;
}

export interface QuizResponse {
  id: string;
  room_id: string;
  title: string;
  topic: string;
  questions: QuestionResponse[];
}

export interface QuizWithAnswersResponse {
  id: string;
  room_id: string;
  title: string;
  topic: string;
  questions: QuestionWithAnswerResponse[];
}

export interface StartAttemptResponse {
  attempt_id: string;
  started_at: string;
  message: string;
}

export interface SubmitAnswerRequest {
  question_id: string;
  selected_option: string;
}

export interface SubmitAnswerResponse {
  is_correct: boolean;
  correct_answer: string;
  message: string;
}

export interface FinishAttemptResponse {
  attempt_id: string;
  score: number;
  completed_at: string;
  total_questions: number;
  correct_answers: number;
}

export interface AttemptSummary {
  attempt_id: string;
  quiz_id: string;
  quiz_title: string;
  attempt_number: number;
  score: number;
  started_at: string;
  completed_at: string;
  is_finished: boolean;
}

export interface GenerateQuizRequest {
  document_id: string;
  num_questions?: number;
}
