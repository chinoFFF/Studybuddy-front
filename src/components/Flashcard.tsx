import React, { useState } from 'react';
import '../styles/flashcard.css';

interface FlashcardProps {
  concept: string;
  definition: string;
}

export const Flashcard: React.FC<FlashcardProps> = ({ concept, definition }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="flashcard-container w-full h-64 cursor-pointer group" 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`flashcard-inner shadow-lg rounded-2xl ${isFlipped ? 'is-flipped' : ''}`}>
        
        {/* Lado Frontal: Concepto */}
        <div className="flashcard-front bg-white border-2 border-indigo-100 rounded-2xl flex flex-col items-center justify-center p-6 group-hover:shadow-xl transition-shadow">
          <span className="text-indigo-500 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </span>
          <h3 className="text-2xl font-bold text-gray-800 text-center">{concept}</h3>
          <p className="text-sm text-gray-400 mt-4 text-center">Haz clic para voltear</p>
        </div>

        {/* Lado Trasero: Definición */}
        <div className="flashcard-back bg-indigo-600 rounded-2xl flex items-center justify-center p-6 border-2 border-indigo-600">
          <p className="text-lg font-medium text-white text-center leading-relaxed">
            {definition}
          </p>
        </div>

      </div>
    </div>
  );
};