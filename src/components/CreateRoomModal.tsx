import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { organizationService } from '../services/organizationService';

interface CreateRoomModalProps {
  buttonLabel?: string;
  buttonClassName?: string;
  chatRoute?: string;
  onCreated?: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  buttonLabel = '+ Crear Nueva Sala',
  buttonClassName = 'px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm',
  chatRoute = '/AIChatRoom',
  onCreated,
}) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(false);

  const resetState = () => {
    setRoomName('');
    setDescription('');
    setError('');
    setCreated(false);
    setLoading(false);
  };

  const handleOpen = () => {
    resetState();
    setIsOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    setLoading(true);
    setError('');

    try {
      await organizationService.createOrganization({
        name: roomName.trim(),
        description: description.trim() || undefined,
      });

      setCreated(true);
      onCreated?.();
    } catch (err) {
      console.error(err);
      setError('No se pudo crear la sala. Revisa tu sesión o que el backend esté disponible.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    resetState();
    setIsOpen(false);
  };

  const handleActionClick = () => {
    handleCloseAndReset();
    navigate(chatRoute);
  };

  return (
    <>
      <button onClick={handleOpen} className={buttonClassName}>
        {buttonLabel}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">Crear Nueva Sala</h3>
              <button onClick={handleCloseAndReset} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
            </div>

            <div className="p-6">
              {created ? (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">¡Sala creada correctamente!</h4>
                    <p className="text-sm text-gray-500 mt-1">La organización ya quedó registrada en el backend.</p>
                  </div>

                  <button
                    onClick={handleActionClick}
                    className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    Ir al chat →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreate} className="space-y-4">
                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la Sala</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Estudio de Inteligencia Artificial"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                    <textarea
                      rows={3}
                      placeholder="Describe el propósito de esta sala"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    {loading ? 'Creando...' : 'Crear sala'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
