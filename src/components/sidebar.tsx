// components/Sidebar.tsx
import React, { useState } from 'react';

export const Sidebar: React.FC = () => {
  // Estado para saber si el sidebar está expandido (true) o colapsado (false)
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Lista de opciones del menú basadas en los módulos de tu proyecto
  const menuItems = [
    { name: 'Dashboard', icon: '📊', active: true },
    { name: 'Mis Salas', icon: '👥', active: false },
    { name: 'Flashcards', icon: '🃏', active: false },
    { name: 'Exámenes', icon: '📝', active: false },
    { name: 'Configuración', icon: '⚙/', active: false },
  ];

  return (
    <div 
      className={`min-h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* LOGO Y BOTÓN DE COLAPSAR */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {isOpen && (
          <span className="text-xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            EduRAG IA 🎓
          </span>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-800 rounded-lg text-xl focus:outline-none transition-colors ml-auto"
          title={isOpen ? "Colapsar menú" : "Expandir menú"}
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* PERFIL SIMULADO DEL ESTUDIANTE */}
      <div className="p-4 border-b border-gray-800 flex items-center space-x-3 overflow-hidden">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold shrink-0 text-white shadow-inner">
          E
        </div>
        {isOpen && (
          <div className="truncate">
            <h4 className="text-sm font-semibold truncate">Estudiante Activo</h4>
            <span className="text-xs text-gray-400">Plan Premium</span>
          </div>
        )}
      </div>

      {/* ENLACES DE NAVEGACIÓN */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl font-medium transition-all ${
              item.active 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-xl shrink-0">{item.icon}</span>
            {isOpen && <span className="text-sm tracking-wide">{item.name}</span>}
          </button>
        ))}
      </nav>

      {/* PIE DE PÁGINA DEL SIDEBAR */}
      <div className="p-4 border-t border-gray-800 text-xs text-center text-gray-500 overflow-hidden whitespace-nowrap">
        {isOpen ? '© 2026 EduRAG Platform' : 'v1.0'}
      </div>
    </div>
  );
};