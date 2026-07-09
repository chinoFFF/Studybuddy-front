import { Navigate, Outlet } from 'react-router-dom';
import { checkAuth } from '../utils/auth';

export const ProtectedRoute = () => {

  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    // Si no esta logueado lo mandamos a login alv
    return <Navigate to="/login" replace />;
  }

  // <Outlet /> renderiza los componentes hijos (en este caso, el Dashboard)
  return <Outlet />;
};