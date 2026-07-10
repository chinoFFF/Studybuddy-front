// src/utils/auth.ts

const TOKEN_KEY = 'access_token';

// Ahora guarda el token real que devuelve el backend al hacer login/register.
export const login = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Mismo contrato de siempre: boolean sincrono.
// CatchAllRoute, ProtectedRoute y PublicRoute NO necesitan cambios.
export const checkAuth = (): boolean => {
  return !!localStorage.getItem(TOKEN_KEY);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};