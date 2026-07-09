export type QuestionType = 'multiple_choice' | 'true_false' | 'open';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  explanation: string;
  points: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: string[];
  correctOptionIndex: number;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  correctAnswer: boolean;
}

export interface OpenQuestion extends BaseQuestion {
  type: 'open';
  acceptedKeywords: string[];
  modelAnswer: string;
}

export type ExamQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | OpenQuestion;

export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: ExamQuestion[];
}

export type AnswerMap = Record<string, number | boolean | string>;

export interface Feedback {
  correct: boolean;
  detail: string;
}
