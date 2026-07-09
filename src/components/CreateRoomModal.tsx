// components/CreateRoomModal.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CreateRoomModalProps {
  // Texto y estilos del botón que abre el modal, para poder reutilizarlo
  // en distintos lugares (header, estado vacío, etc.) sin duplicar lógica.
  buttonLabel?: string;
  buttonClassName?: string;
  // Ruta a la que se navega cuando el usuario da clic en "Ir al chat".
  chatRoute?: string;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  buttonLabel = '+ Crear Nueva Sala',
  buttonClassName = 'px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm',
  chatRoute = '/AIChatRoom',
}) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleOpen = () => setIsOpen(true);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    const randomId = Math.random().toString(36).substring(2, 9);
    const mockLink = `${window.location.origin}/join/room-${randomId}`;

    setGeneratedLink(mockLink);
    setCopied(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseAndReset = () => {
    setRoomName('');
    setGeneratedLink('');
    setIsOpen(false);
  };

  const handleActionClick = () => {
    handleCloseAndReset(); // Cierra y resetea el modal
    navigate(chatRoute);   // Redirige a la sala de chat con react-router-dom
  };

  return (
    <>
      {/* Botón disparador: ahora vive dentro del propio componente */}
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
              {!generatedLink ? (
                <form onSubmit={handleCreate} className="space-y-4">
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
                  <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm">
                    Generar Sala y Enlace
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">¡Sala "{roomName}" Lista!</h4>
                    <p className="text-sm text-gray-500 mt-1">Comparte este link con tus compañeros para que se unan.</p>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-600 truncate font-mono select-all">{generatedLink}</span>
                    <button
                      onClick={handleCopyLink}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${copied ? 'bg-green-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                    >
                      {copied ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>

                  <button
                    onClick={handleActionClick}
                    className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    Ir al chat →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};