// pages/AllRooms.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateRoomModal } from '../components/CreateRoomModal'; // Ajusta la ruta si es necesario
import { StudyRoomCard } from '../components/StudyRoomCard';
// import { organizationsApi } from '../api/organizations.api';
// import type { Organization } from '../types/organization';

export const AllRooms: React.FC = () => {
  // const [rooms, setRooms] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Hook de react-router-dom para la redirección
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchRooms = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await organizationsApi.getAll();
  //       setRooms(data);
  //     } catch (error) {
  //       console.error("Error al cargar las salas:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRooms();
  // }, []);

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

      {/* Estado de Carga 
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <StudyRoomCard
              key={room.id}
              name={room.name}
              description={
                room.description
                  ? `${room.description}${room.created_at ? ` · Creada el ${room.created_at}` : ''}`
                  : 'Sala de estudio con IA.'
              }
              memberCount={room.member_count ?? 0}
              documentCount={room.document_count ?? 0}
              onEnter={() => navigate('/AIChatRoom')} // Redirige a la sala específica
            />
          ))}
        </div>
      )}*/}
    </div>
  );
};