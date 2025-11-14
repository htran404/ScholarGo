import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';

interface ModderProtectedRouteProps {
  children: React.ReactElement;
}

const ModderProtectedRoute: React.FC<ModderProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  // Only allow MODDER role to access this route
  if (user.role !== Role.MODDER) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ModderProtectedRoute;
