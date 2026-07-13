// src/hooks/useGoogleAuth.ts
import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { login } from '../utils/auth';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const isInitialized = useRef(false);

  const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
    try {
      const { access_token } = await authApi.google(response.credential);
      login(access_token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      alert('No se pudo iniciar sesión con Google. Intenta de nuevo.');
    }
  }, [navigate]);

  // Espera a que el script de Google (cargado en index.html) esté listo,
  // ya que se carga con async/defer y puede no estar disponible de inmediato.
  useEffect(() => {
    if (isInitialized.current) return;

    if (!GOOGLE_CLIENT_ID) {
      console.error('Falta VITE_GOOGLE_CLIENT_ID en tu archivo .env');
      return;
    }

    const tryInit = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        isInitialized.current = true;
        return true;
      }
      return false;
    };

    if (tryInit()) return;

    const intervalId = setInterval(() => {
      if (tryInit()) clearInterval(intervalId);
    }, 200);

    return () => clearInterval(intervalId);
  }, [handleCredentialResponse]);

  const triggerGoogleSignIn = () => {
    if (!window.google?.accounts?.id) {
      alert('Google todavía no está listo. Espera un segundo e intenta de nuevo.');
      return;
    }
    window.google.accounts.id.prompt();
  };

  return { triggerGoogleSignIn };
};