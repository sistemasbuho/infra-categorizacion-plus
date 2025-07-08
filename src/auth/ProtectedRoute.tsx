import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface ProtectedRouteProps {
  requiredRole: number;
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, hasRole } = useAuth();

  if (!user || !hasRole(requiredRole)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
