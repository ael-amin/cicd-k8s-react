import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ requireAdmin = false, requireUser = false }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin access for admin-only routes
  if (requireAdmin && user.role !== 'admin') {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/dashboard\" replace />;
  }

  // Check user access for user-only routes
  if (requireUser && user.role !== 'user') {
    toast.error('This feature is only available for regular users');
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;