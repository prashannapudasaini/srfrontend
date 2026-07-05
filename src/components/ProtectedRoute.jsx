import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the admin token exists in local storage
  const adminToken = localStorage.getItem('adminToken');

  // If there is no token, redirect to the admin login page
  if (!adminToken) {
    return <Navigate to="/login" replace />;
  }

  // If they have the token, allow them to view the admin page
  return children;
};

export default ProtectedRoute;