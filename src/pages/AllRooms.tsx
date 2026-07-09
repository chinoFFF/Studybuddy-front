// pages/AllRooms.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateRoomModal } from '../components/CreateRoomModal'; // Ajusta la ruta si es necesario

// Interfaces de TypeScript alineadas con los esquemas de tu backend (FastAPI/Pydantic)
interface StudyRoom {
  id: string;
  name: string;
  subject: string;
  active_students: number;
  total_documentos: number;
  created_at: string;
}

export const AllRooms: React.FC = () => {
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Hook de react-router-dom para la redirección
  const navigate = useNavigate();

  // Simulación del consumo del servicio de la API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        // Aquí conectarías con tu servicio modular de FastAPI: e.g., api.getRooms()
        const mockRooms: StudyRoom[] = [
          {
            id: 'room-1',
            name: 'Preparación Examen de Redes',
            subject: 'Telecomunicaciones',
            active_students: 5,
            total_documentos: 24,
            created_at: '2026-07-01'
          },
          {
            id: 'room-2',
            name: 'Grupo de Estudio: Git Avanzado',
            subject: 'Ingeniería de Software',
            active_students: 8,
            total_documentos: 30,
            created_at: '2026-07-05'
          },
          {
            id: 'room-3',
            name: 'Estructuras de Datos RAG y Vectoriales',
            subject: 'Inteligencia Artificial',
            active_students: 3,
            total_documentos: 15,
            created_at: '2026-07-07'
          }
        ];

        // Simular retraso de red de la API
        setTimeout(() => {
          setRooms(mockRooms);
          setLoading(false);
        }, 600);
      } catch (error) {
        console.error("Error al cargar las salas:", error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Encabezado y Navegación */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel Global de Salas de Estudio</h1>
          <p className="text-gray-600 mt-1">Administra e ingresa a tus salas de estudio con IA creadas y compartidas.</p>
        </div>

        {/* Botón de Crear Nueva Sala: el modal se encarga de su propia lógica */}
        <div className="w-full md:w-auto flex justify-end">
          <CreateRoomModal />
        </div>
      </div>

      {/* Estado de Carga */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Consultando salas con el servidor...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No tienes ninguna sala de estudio creada todavía.</p>
          <CreateRoomModal
            buttonLabel="Crear tu primera sala"
            buttonClassName="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition"
          />
        </div>
      ) : (
        /* Grid de Tarjetas de las Salas (Igual al Dashboard) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{room.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  Sala enfocada en {room.subject}. Creada el {room.created_at}.
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
                  <span>👥 {room.active_students} Miembros</span>
                  <span>📄 {room.total_documentos} documentos</span>
                </div>
                {/* Redirección al Chat con react-router-dom */}
                <button
                  onClick={() => navigate('/AIChatRoom')} // Redirige a la sala específica
                  className="mt-4 w-full py-2 bg-gray-50 hover:bg-indigo-50 text-indigo-700 font-medium rounded-lg text-sm transition-colors text-center border border-gray-100"
                >
                  Entrar a Estudiar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};