import { apiClient } from './client';
import type {
  GenerateQuizRequest,
  QuizResponse,
  StartAttemptResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  FinishAttemptResponse,
  AttemptSummary,
  QuizWithAnswersResponse
} from '../types/quiz';

export const quizzesApi = {
  health: async (): Promise<void> => {
    await apiClient.get('/quizzes/health');
  },

  generate: async (request: GenerateQuizRequest): Promise<QuizResponse> => {
    const { data } = await apiClient.post('/quizzes/generate', request);
    return data;
  },

  getMyAttempts: async (): Promise<AttemptSummary[]> => {
    const { data } = await apiClient.get('/quizzes/my-attempts');
    return data;
  },

  getQuiz: async (quizId: string): Promise<QuizResponse | QuizWithAnswersResponse> => {
    const { data } = await apiClient.get(`/quizzes/${quizId}`);
    return data;
  },

  startAttempt: async (quizId: string): Promise<StartAttemptResponse> => {
    const { data } = await apiClient.post(`/quizzes/${quizId}/attempts`);
    return data;
  },

  submitAnswer: async (
    attemptId: string,
    request: SubmitAnswerRequest
  ): Promise<SubmitAnswerResponse> => {
    const { data } = await apiClient.post(
      `/quizzes/attempts/${attemptId}/answers`,
      request
    );
    return data;
  },

  finishAttempt: async (attemptId: string): Promise<FinishAttemptResponse> => {
    const { data } = await apiClient.post(`/quizzes/attempts/${attemptId}/finish`);
    return data;
  }
};
