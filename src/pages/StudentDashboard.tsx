// pages/StudentDashboard.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateRoomModal } from '../components/CreateRoomModal';
import { OrganizationCard } from '../components/OrganizationCard';
import { organizationService } from '../services/organizationService';
import { getRoomIdFromOrganization } from '../utils/room';
import { progressApi } from '../api/progress.api';
import { calculateStreak, sumStudyHours } from '../utils/progress';
import { flashcardsApi } from '../api/flashcards.api';
import type { OrganizationResponse } from '../types/organization';
import type { ProgressSummary, UnseenFlashcardDeck } from '../types/progress';
import type { FlashcardDeck } from '../types/flashcards';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<OrganizationResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [progressSummary, setProgressSummary] = useState<ProgressSummary | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [studyHours, setStudyHours] = useState<number>(0);
  const [progressLoading, setProgressLoading] = useState<boolean>(true);

  const [unseenFlashcards, setUnseenFlashcards] = useState<UnseenFlashcardDeck[]>([]);
  const [flashcardsLoading, setFlashcardsLoading] = useState<boolean>(true);

  const [recentDecks, setRecentDecks] = useState<FlashcardDeck[]>([]);
  const [recentDecksLoading, setRecentDecksLoading] = useState<boolean>(true);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await organizationService.listOrganizations();
      setRooms(data);
    } catch (err) {
      console.error('Error al cargar las salas:', err);
      setError('No se pudieron cargar las salas desde el backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProgress = useCallback(async () => {
    try {
      setProgressLoading(true);
      const [summary, activity] = await Promise.all([
        progressApi.getSummary(),
        progressApi.getActivity(),
      ]);
      setProgressSummary(summary);
      setStreak(calculateStreak(activity));
      setStudyHours(sumStudyHours(activity));
    } catch (err) {
      console.error('Error al cargar el progreso:', err);
    } finally {
      setProgressLoading(false);
    }
  }, []);

  const fetchUnseenFlashcards = useCallback(async () => {
    try {
      setFlashcardsLoading(true);
      const decks = await progressApi.getUnseenFlashcards();
      setUnseenFlashcards(decks);
    } catch (err) {
      console.error('Error al cargar flashcards pendientes:', err);
    } finally {
      setFlashcardsLoading(false);
    }
  }, []);

  const fetchRecentDecks = useCallback(async () => {
    try {
      setRecentDecksLoading(true);
      const decks = await flashcardsApi.listDecks();
      // El backend no regresa fecha de creación en este endpoint; asumimos que
      // vienen en orden de creación (más nuevos al final) y tomamos los últimos 3.
      setRecentDecks(decks.slice(-3).reverse());
    } catch (err) {
      console.error('Error al cargar flashcards recientes:', err);
    } finally {
      setRecentDecksLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRooms();
    void fetchProgress();
    void fetchUnseenFlashcards();
    void fetchRecentDecks();

    // Registra actividad de hoy al entrar al dashboard.
    // Silencioso: si falla, no afecta el resto de la pantalla.
    progressApi.ping().catch((err) => console.error('Error al registrar actividad:', err));
  }, [fetchRooms, fetchProgress, fetchUnseenFlashcards, fetchRecentDecks]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">

      {/* ENCABEZADO */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">¡Hola de nuevo, Estudiante!</h1>
        <p className="text-gray-600">Monitorea tus métricas de estudio y accede a tus salas activas.</p>
      </header>

      {/* SECCIÓN 1: TARJETAS DE MÉTRICAS */}
      <section className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg text-2xl">🔥</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Racha Activa</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {progressLoading ? '—' : `${streak} ${streak === 1 ? 'día' : 'días'}`}
            </h3>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg text-2xl">⏱</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tiempo de Estudio</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {progressLoading ? '—' : `${studyHours} hrs`}
            </h3>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg text-2xl">🎓</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Exámenes Realizados</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {progressLoading ? '—' : progressSummary?.total_quizzes_taken ?? 0}
            </h3>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg text-2xl">📈</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Promedio de Exámenes</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {progressLoading ? '—' : `${Math.round(progressSummary?.average_quiz_score ?? 0)}%`}
            </h3>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: FLASHCARDS PENDIENTES POR REPASAR */}
      {!flashcardsLoading && unseenFlashcards.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">📝 Flashcards pendientes por repasar</h2>
            {progressSummary && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {unseenFlashcards.length} de {progressSummary.total_flashcards_generated} mazos generados
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unseenFlashcards.map((deck) => (
              <div
                key={deck.id}
                onClick={() => navigate(`/flashcards/${deck.id}`)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-orange-300 transition group"
              >
                <div className="flex items-center mb-4">
                  <span className="bg-orange-50 text-orange-500 p-3 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{deck.title}</h3>
                {deck.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{deck.description}</p>
                )}
                <div className="flex items-center justify-end">
                  <span className="text-orange-600 font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transition">
                    Repasar
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECCIÓN 3: LISTADO DE SALAS */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Mis Salas de Estudio</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/mis-salas')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
            >
              Ver todas →
            </button>
            <CreateRoomModal onCreated={fetchRooms} />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Consultando salas con el servidor...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => void fetchRooms()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition"
            >
              Reintentar
            </button>
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No tienes ninguna sala de estudio creada todavía.</p>
            <CreateRoomModal
              buttonLabel="Crear tu primera sala"
              buttonClassName="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition"
              onCreated={fetchRooms}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {rooms.slice(0, 3).map((room) => (
              <div key={room.id} className="space-y-3">
                <OrganizationCard organization={room} onUpdated={fetchRooms} />
                <button
                  onClick={() => navigate(`/AIChatRoom/${getRoomIdFromOrganization(room.tenant_id)}`, { state: { roomName: room.name } })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  Entrar a Estudiar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECCIÓN 4: ÚLTIMAS FLASHCARDS CREADAS */}
      {!recentDecksLoading && recentDecks.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Últimas Flashcards Creadas</h2>
            <button
              onClick={() => navigate('/flashcards')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
            >
              Ver todas →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDecks.map((deck) => (
              <div
                key={deck.id}
                onClick={() => navigate(`/flashcards/${deck.id}`)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-indigo-300 transition group"
              >
                <div className="flex items-center mb-4">
                  <span className="bg-indigo-50 text-indigo-500 p-3 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{deck.title}</h3>
                {deck.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{deck.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};