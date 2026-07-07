// pages/StudentDashboard.tsx
import React from 'react';

// 1. DATOS FALSOS (MOCK DATA)
// Simulamos exactamente lo que el backend nos entregará en el futuro
const MOCK_PROGRESS = {
  currentStreak: 5,
  totalHoursStudied: 12.5,
  topicsMastered: 8,
  completionRate: 75,
};

const MOCK_ROOMS = [
  {
    id: '1',
    name: 'Introducción a Inteligencia Artificial',
    description: 'Sala dedicada al estudio de Redes Neuronales, Procesamiento de Lenguaje Natural y arquitectura de embeddings.',
    memberCount: 14,
    documentCount: 5,
  },
  {
    id: '2',
    name: 'Estructuras de Datos y Algoritmos',
    description: 'Análisis de complejidad asintótica (Big O), árboles binarios de búsqueda, grafos y optimización de memoria.',
    memberCount: 8,
    documentCount: 3,
  },
  {
    id: '3',
    name: 'Desarrollo Web Integral (FastAPI + React)',
    description: 'Coordinación del proyecto de fin de curso. Repaso de TypeScript, Tailwind CSS y validaciones con Pydantic.',
    memberCount: 22,
    documentCount: 12,
  },
];

// 2. COMPONENTE VISUAL
export const StudentDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      
      {/* ENCABEZADO */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">¡Hola de nuevo, Estudiante!</h1>
        <p className="text-gray-600">Monitorea tus métricas de estudio y accede a tus salas activas.</p>
      </header>

      {/* SECCIÓN 1: TARJETAS DE MÉTRICAS (GAMIFICACIÓN) */}
      <section className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Tarjeta: Racha */}
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg text-2xl">🔥</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Racha Activa</p>
            <h3 className="text-2xl font-bold text-gray-800">{MOCK_PROGRESS.currentStreak} días</h3>
          </div>
        </div>

        {/* Tarjeta: Horas */}
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg text-2xl">⏱</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tiempo de Estudio</p>
            <h3 className="text-2xl font-bold text-gray-800">{MOCK_PROGRESS.totalHoursStudied} hrs</h3>
          </div>
        </div>

        {/* Tarjeta: Temas */}
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg text-2xl">🎓</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Temas Dominados</p>
            <h3 className="text-2xl font-bold text-gray-800">{MOCK_PROGRESS.topicsMastered} conceptos</h3>
          </div>
        </div>

        {/* Tarjeta: Progreso */}
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg text-2xl">📈</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tasa de Completado</p>
            <h3 className="text-2xl font-bold text-gray-800">{MOCK_PROGRESS.completionRate}%</h3>
          </div>
        </div>

      </section>

      {/* SECCIÓN 2: LISTADO DE SALAS DE ESTUDIO */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Mis Salas de Estudio</h2>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm">
            + Crear Nueva Sala
          </button>
        </div>

        {/* Cuadrícula de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_ROOMS.map((room) => (
            <div 
              key={room.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{room.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {room.description}
                </p>
              </div>

              {/* Estadísticas de la sala en la parte inferior */}
              <div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
                  <span>👥 {room.memberCount} Miembros</span>
                  <span>📄 {room.documentCount} Documentos</span>
                </div>
                
                <button className="mt-4 w-full py-2 bg-gray-50 hover:bg-indigo-50 text-indigo-700 font-medium rounded-lg text-sm transition-colors text-center border border-gray-100">
                  Entrar a Estudiar
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
};