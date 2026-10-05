import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../common/Loader';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('USER' | 'ADMIN')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen text="Verifying authentication..." />;
  }

  if (!user) {
    const isAccessingAdmin = location.pathname.startsWith('/admin');
    return (
      <Navigate
        to={isAccessingAdmin ? '/admin/login' : '/login'}
        state={{ from: location }}
        replace
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user tries to access admin-only page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
