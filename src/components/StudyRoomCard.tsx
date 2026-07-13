// components/StudyRoomCard.tsx
import React from 'react';

interface StudyRoomCardProps {
  name: string;
  description: string;
  memberCount: number;
  documentCount: number;
  onEnter: () => void;
}

export const StudyRoomCard: React.FC<StudyRoomCardProps> = ({
  name,
  description,
  memberCount,
  documentCount,
  onEnter,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
      </div>
      <div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
          <span>👥 {memberCount} Miembros</span>
          <span>📄 {documentCount} Documentos</span>
        </div>
        {/* Redirección al Chat con react-router-dom, la maneja quien use el componente */}
        <button
          onClick={onEnter}
          className="mt-4 w-full py-2 bg-gray-50 hover:bg-indigo-50 text-indigo-700 font-medium rounded-lg text-sm transition-colors text-center border border-gray-100"
        >
          Entrar a Estudiar
        </button>
      </div>
    </div>
  );
};