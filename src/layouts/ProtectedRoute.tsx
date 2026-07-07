import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const isAuthenticated = false; // Cambiar esto a 'true' para ir al dashiboar

  if (!isAuthenticated) {
    // Si no esta logueado lo mandamos a login alv
    return <Navigate to="/login" replace />;
  }

  // <Outlet /> renderiza los componentes hijos (en este caso, el Dashboard)
  return <Outlet />;
};