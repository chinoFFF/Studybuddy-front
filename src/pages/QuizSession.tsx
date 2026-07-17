import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizzesApi } from '../api/quizzes.api';
import type { QuizResponse, QuestionResponse, StartAttemptResponse, SubmitAnswerResponse, FinishAttemptResponse } from '../types/quiz';

export const QuizSession: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [attempt, setAttempt] = useState<StartAttemptResponse | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, SubmitAnswerResponse>>({});
  const [result, setResult] = useState<FinishAttemptResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string>('');

  const loadQuiz = useCallback(async () => {
    if (!quizId) return;
    try {
      const data = await quizzesApi.getQuiz(quizId);
      setQuiz(data as QuizResponse);
    } catch (err) {
      console.error('Error loading quiz:', err);
      setError('No se pudo cargar el quiz');
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  const startAttempt = useCallback(async () => {
    if (!quizId) return;
    try {
      const data = await quizzesApi.startAttempt(quizId);
      setAttempt(data);
    } catch (err) {
      console.error('Error starting attempt:', err);
      setError('No se pudo iniciar el intento del quiz');
    }
  }, [quizId]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  useEffect(() => {
    if (quiz && !attempt) {
      startAttempt();
    }
  }, [quiz, attempt, startAttempt]);

  const submitAnswer = async (question: QuestionResponse, selectedOption: string) => {
    if (!attempt) return;
    setSubmitting((prev) => ({ ...prev, [question.id]: true }));

    try {
      const response = await quizzesApi.submitAnswer(attempt.attempt_id, {
        question_id: question.id,
        selected_option: selectedOption,
      });
      setAnswers((prev) => ({ ...prev, [question.id]: selectedOption }));
      setFeedback((prev) => ({ ...prev, [question.id]: response }));
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('No se pudo enviar la respuesta');
    } finally {
      setSubmitting((prev) => ({ ...prev, [question.id]: false }));
    }
  };

  const finishQuiz = async () => {
    if (!attempt) return;
    try {
      const data = await quizzesApi.finishAttempt(attempt.attempt_id);
      setResult(data);
    } catch (err) {
      console.error('Error finishing quiz:', err);
      setError('No se pudo finalizar el quiz');
    }
  };

  const allQuestionsAnswered = quiz && Object.keys(answers).length === quiz.questions.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Volver al dashboard
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            🎉
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Quiz completado!</h2>
          <p className="text-4xl font-extrabold text-indigo-600 mb-2">{Math.round(result.score)}%</p>
          <p className="text-gray-600 mb-6">
            {result.correct_answers} de {result.total_questions} preguntas correctas
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Volver al dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-800 mb-4 flex items-center gap-2"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{quiz.title}</h1>
          <p className="text-gray-600 mt-1">{quiz.topic}</p>
        </header>

        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {index + 1}. {question.prompt}
                </h3>
                {feedback[question.id] && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ml-3 ${
                    feedback[question.id].is_correct
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {feedback[question.id].is_correct ? '✓ Correcto' : '✗ Incorrecto'}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {question.options.map((option) => {
                  const isSelected = answers[question.id] === option;
                  const isSubmitting = submitting[question.id];
                  const showResult = feedback[question.id];
                  const isCorrect = showResult && feedback[question.id].correct_answer === option;
                  const isWrong = showResult && isSelected && !feedback[question.id].is_correct;

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={isSubmitting || isSelected}
                      onClick={() => submitAnswer(question, option)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                        isSubmitting
                          ? 'border-gray-300 bg-gray-100 cursor-wait'
                          : isSelected
                            ? isCorrect
                              ? 'border-green-400 bg-green-50'
                              : 'border-red-400 bg-red-50'
                            : 'border-gray-200 bg-white hover:border-indigo-300'
                      } ${isSelected ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className="text-sm text-gray-700">{option}</span>
                      {isSubmitting && <span className="ml-2 text-gray-500">...</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {allQuestionsAnswered && !result && (
          <div className="mt-8 text-center">
            <button
              onClick={finishQuiz}
              className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition shadow-sm"
            >
              Finalizar Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};