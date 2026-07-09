import React, { useState } from 'react';
import { Flashcard } from '../components/Flashcard';

// Simulación de la estructura que enviará el backend (agrupadas por Deck/Tema)
const mockDecks = [
  {
    id: 'deck-1',
    title: 'Desarrollo Frontend (React)',
    cards: [
      { id: '1', concept: 'GitFlow', definition: 'Modelo de ramificación que utiliza ramas específicas para features, releases y hotfixes.' },
      { id: '2', concept: 'TypeScript', definition: 'Un superconjunto de JavaScript que añade tipado estático opcional.' },
    ]
  },
  {
    id: 'deck-2',
    title: 'Infraestructura y DevOps',
    cards: [
      { id: '3', concept: 'Docker', definition: 'Plataforma para desarrollar, enviar y ejecutar aplicaciones dentro de contenedores.' },
      { id: '4', concept: 'Burst Capacity', definition: 'Capacidad de un sistema o contenedor para exceder temporalmente sus límites de recursos base.' },
    ]
  },
  {
    id: 'deck-3',
    title: 'Ciberseguridad Básica',
    cards: [
      { id: '5', concept: 'Bypass Logic', definition: 'Vulnerabilidad donde un atacante logra evadir las validaciones o flujos de seguridad esperados de la aplicación.' }
    ]
  }
];

export const FlashcardsPage: React.FC = () => {
  const [decks] = useState(mockDecks);
  // Nuevo estado para controlar qué "álbum" está abierto. Si es null, mostramos la galería.
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  // Buscamos los datos del mazo seleccionado
  const selectedDeck = decks.find(deck => deck.id === selectedDeckId);

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      
      {/* Cabecera Dinámica */}
      <div className="mb-8 flex flex-col items-start">
        {selectedDeckId && (
          <button 
            onClick={() => setSelectedDeckId(null)}
            className="mb-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a los temas
          </button>
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

      {/* Renderizado Condicional: Galería vs Interior del Tema */}
      {!selectedDeck ? (
        
        // VISTA 1: GALERÍA DE TEMAS (Álbumes)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div 
              key={deck.id} 
              onClick={() => setSelectedDeckId(deck.id)}
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
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-gray-500 bg-gray-100 py-1 px-3 rounded-full">
                  {deck.cards.length} tarjetas
                </span>
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

      ) : (

        // VISTA 2: TARJETAS DEL TEMA SELECCIONADO
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {selectedDeck.cards.map(card => (
            <Flashcard 
              key={card.id} 
              concept={card.concept} 
              definition={card.definition} 
            />
          ))}
          
          {selectedDeck.cards.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              Este tema aún no tiene tarjetas.
            </div>
          )}
        </div>

      )}
    </div>
  );
};

