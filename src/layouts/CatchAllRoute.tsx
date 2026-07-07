import { Navigate } from 'react-router-dom';
import { checkAuth } from '../utils/auth';

//este layout sirve pa cachar todas las posibles rutas erroneas y redirigir a un lugar seguro
export const CatchAllRoute = () => {
  const isAuthenticated = checkAuth(); 

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};