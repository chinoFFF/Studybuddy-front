import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { organizationService } from '../services/organizationService';
import { getToken } from '../utils/auth';

export const AcceptInvitation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const accept = async () => {
      if (!token) {
        setMessage('Token de invitación faltante o inválido.');
        setStatus('error');
        return;
      }

      const localToken = getToken();
      if (!localToken) {
        // Guardar token y pedir login
        localStorage.setItem('invite_token', token);
        navigate('/login');
        return;
      }

      setStatus('loading');
      try {
        const { data: me } = await apiClient.get('/auth/me');
        await organizationService.acceptInvitation({ token, user_id: me.id });
        setMessage('¡Invitación aceptada exitosamente! La sala ha sido agregada a tu lista.');
        setStatus('success');
        
        // Redirigir después de 2 segundos
        setTimeout(() => navigate('/mis-salas'), 2000);
      } catch (err: any) {
        const errorMsg = err?.response?.data?.detail 
          || err?.response?.data?.message 
          || 'No fue posible aceptar la invitación. Verifica que el token sea válido y no haya expirado.';
        setMessage(errorMsg);
        setStatus('error');
      }
    };

    void accept();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        
        {/* LOADING STATE */}
        {status === 'loading' && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Procesando invitación...</h2>
            <p className="text-gray-600 text-sm">Por favor espera mientras validamos tu invitación.</p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === 'success' && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-green-700">¡Éxito!</h2>
            <p className="text-gray-700 text-sm">{message}</p>
            <p className="text-gray-500 text-xs mt-2">Redirigiendo a tus salas en unos momentos...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'error' && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-red-700">No se pudo aceptar la invitación</h2>
            <p className="text-gray-700 text-sm">{message}</p>
            <div className="space-y-2 mt-6">
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
              >
                Volver atrás
              </button>
              <button
                onClick={() => navigate('/mis-salas')}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
              >
                Ir a mis salas
              </button>
            </div>
          </div>
        )}

        {/* IDLE STATE (initial) */}
        {status === 'idle' && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="animate-pulse h-12 w-12 bg-indigo-200 rounded-full"></div>
            </div>
            <p className="text-gray-600 text-sm">Cargando...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitation;
