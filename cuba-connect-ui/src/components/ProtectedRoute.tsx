import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'cliente' | 'empresa' | 'admin';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && user.rol !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    if (user.rol === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.rol === 'empresa') {
      return <Navigate to="/empresa" replace />;
    } else {
      return <Navigate to="/cliente" replace />;
    }
  }

  return <>{children}</>;
};


