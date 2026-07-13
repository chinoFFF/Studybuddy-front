import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateRoomModal } from '../components/CreateRoomModal';
import { OrganizationCard } from '../components/OrganizationCard';
import { organizationService } from '../services/organizationService';
import type { OrganizationResponse } from '../types/organization';

export const AllRooms: React.FC = () => {
  const [rooms, setRooms] = useState<OrganizationResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

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

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel Global de Salas de Estudio</h1>
          <p className="text-gray-600 mt-1">Administra e ingresa a tus salas de estudio desde el backend.</p>
        </div>

        <div className="w-full md:w-auto flex justify-end">
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
          {rooms.map((room) => (
            <div key={room.id} className="space-y-3">
              <OrganizationCard organization={room} onUpdated={fetchRooms} />
              <button
                onClick={() => navigate('/AIChatRoom')}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
              >
                Entrar a Estudiar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
