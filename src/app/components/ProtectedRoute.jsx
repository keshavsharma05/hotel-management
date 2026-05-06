import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, admin, isAdminAuthenticated } = useAuth();
  const { hotelId: paramHotelId } = useParams();
  const location = useLocation();

  const hotelId = paramHotelId || 'theluxuryinn';

  if (requireAdmin) {
    if (!isAdminAuthenticated()) {
      return <Navigate to={`/admin/login`} state={{ from: location }} replace />;
    }
    return children;
  }

  if (!user) {
    return <Navigate to={`/login`} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
