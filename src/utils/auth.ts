const AUTH_KEY = 'isAuthenticated';

export const checkAuth = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const login = (): void => {
  localStorage.setItem(AUTH_KEY, 'true');
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};