import { Navigate, Outlet } from 'react-router-dom';
import { checkAuth } from '../utils/auth';

export const PublicRoute = () => {
  const isAuthenticated = checkAuth();

  if (isAuthenticated) {
    // Si ya está autenticado, no tiene sentido ver el login, mándalo al dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};