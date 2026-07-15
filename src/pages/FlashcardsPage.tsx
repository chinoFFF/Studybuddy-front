import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flashcard } from '../components/Flashcard';
import { flashcardsApi } from '../api/flashcards.api';
import type { FlashcardDeck, FlashcardDeckWithCards } from '../types/flashcards';

export const FlashcardsPage: React.FC = () => {
  const { deckId: deckIdFromRoute } = useParams<{ deckId?: string }>();
  const navigate = useNavigate();

  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(deckIdFromRoute ?? null);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeckWithCards | null>(null);
  const [deckLoading, setDeckLoading] = useState(false);

  // Lista de mazos (galería)
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await flashcardsApi.listDecks();
        setDecks(data);
      } catch (err) {
        console.error('Error al cargar las flashcards:', err);
        setError('No se pudieron cargar tus flashcards.');
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, []);

  // Detalle del mazo seleccionado (trae las tarjetas)
  useEffect(() => {
    if (!selectedDeckId) {
      setSelectedDeck(null);
      return;
    }
    const fetchDeck = async () => {
      try {
        setDeckLoading(true);
        const data = await flashcardsApi.getDeck(selectedDeckId);
        setSelectedDeck(data);
      } catch (err) {
        console.error('Error al cargar el mazo:', err);
      } finally {
        setDeckLoading(false);
      }
    };
    fetchDeck();
  }, [selectedDeckId]);

  const handleSelectDeck = (deckId: string) => {
    setSelectedDeckId(deckId);
    navigate(`/flashcards/${deckId}`);
  };

  const handleBack = () => {
    setSelectedDeckId(null);
    navigate('/flashcards');
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">

      {/* Cabecera Dinámica */}
      <div className="mb-8 flex flex-col items-start">
        {selectedDeckId && (
          <div className="w-full flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Volver a los temas
            </button>

            {selectedDeck && (
              <button
                onClick={() => navigate(`/AIChatRoom/${selectedDeck.room_id}`)}
                className="text-sm font-semibold text-indigo-700 border border-gray-200 bg-white hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
              >
                Ir al chat de esta sala →
              </button>
            )}
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900">
          {selectedDeck ? selectedDeck.title : 'Mis Flashcards Generadas'}
        </h1>
        <p className="text-gray-500 mt-1">
          {selectedDeck
            ? 'Haz clic en las tarjetas para voltearlas y repasar las definiciones.'
            : 'Selecciona un tema para repasar sus conceptos clave.'}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Cargando tus flashcards...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-12">{error}</div>
      ) : !selectedDeckId ? (

        // VISTA 1: GALERÍA DE TEMAS (Álbumes)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div
              key={deck.id}
              onClick={() => handleSelectDeck(deck.id)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-indigo-300 transition group"
            >
              <div className="flex items-center mb-4">
                <span className="bg-indigo-50 text-indigo-500 p-3 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{deck.title}</h2>
              {deck.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{deck.description}</p>
              )}
              <div className="flex items-center justify-end mt-4">
                <span className="text-indigo-600 font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transition">
                  Estudiar
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}

          {decks.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              Aún no hay flashcards generadas para tus materias.
            </div>
          )}
        </div>

      ) : deckLoading || !selectedDeck ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Cargando tarjetas...</p>
        </div>
      ) : (

        // VISTA 2: TARJETAS DEL TEMA SELECCIONADO
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {selectedDeck.flashcards.map((card) => (
            <Flashcard
              key={card.id}
              concept={card.front}
              definition={card.back}
            />
          ))}

          {selectedDeck.flashcards.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              Este tema aún no tiene tarjetas.
            </div>
          )}
        </div>

      )}
    </div>
  );
};