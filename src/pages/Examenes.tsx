import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizzesApi } from '../api/quizzes.api';
import type { AttemptSummary } from '../types/quiz';

type QuizAttemptGroup = {
  quiz_id: string;
  quiz_title: string;
  attempts: AttemptSummary[];
};

export const Examenes: React.FC = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadAttempts = async () => {
      try {
        const data = await quizzesApi.getMyAttempts();
        setAttempts(data);
      } catch (err) {
        console.error('Error loading attempts:', err);
        setError('No se pudieron cargar los intentos de quizzes');
      } finally {
        setLoading(false);
      }
    };
    loadAttempts();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const groupedAttempts = attempts.reduce<QuizAttemptGroup[]>((groups, attempt) => {
    const existingGroup = groups.find((group) => group.quiz_id === attempt.quiz_id);

    if (existingGroup) {
      existingGroup.attempts.push(attempt);
      return groups;
    }

    groups.push({
      quiz_id: attempt.quiz_id,
      quiz_title: attempt.quiz_title,
      attempts: [attempt],
    });

    return groups;
  }, []).map((group) => ({
    ...group,
    attempts: [...group.attempts].sort(
      (left, right) => Number(new Date(right.started_at)) - Number(new Date(left.started_at))
    ),
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
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
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Historial de Quizzes</h1>
          <p className="text-gray-600 mt-1">Revisa tus intentos de quizzes anteriores</p>
        </header>

        {attempts.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay quizzes aún</h3>
            <p className="text-gray-600 mb-6">
              Ve a una sala de estudio y genera un quiz para empezar!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Ir al Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedAttempts.map((group) => {
              const totalAttempts = group.attempts.length;

              return (
                <section key={group.quiz_id} className="space-y-3">
                  <div className="flex items-end justify-between gap-4 px-1">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{group.quiz_title}</h2>
                      <p className="text-sm text-gray-500">{totalAttempts} intento{totalAttempts === 1 ? '' : 's'} en total</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {group.attempts.map((attempt) => (
                      <div
                        key={attempt.attempt_id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-indigo-300 transition"
                        onClick={() => navigate(`/quizzes/${attempt.quiz_id}`)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                              Intento {attempt.attempt_number} de {totalAttempts}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                              {attempt.is_finished ? 'Completado' : 'En progreso'} · {formatDate(attempt.started_at)}
                            </p>
                          </div>
                          {attempt.is_finished && (
                            <div className="text-right">
                              <div className={`text-3xl font-bold ${attempt.score >= 70 ? 'text-green-600' : attempt.score >= 50 ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                {Math.round(attempt.score)}%
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};