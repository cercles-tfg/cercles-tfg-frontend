import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('jwtToken');
  const rol = localStorage.getItem('rol');

  // Si no hay token o rol, redirigir al login
  if (!token || !rol) {
    return <Navigate to="/" />;
  }

  // Si hay token y el usuario intenta acceder a "/", redirigir a "/home"
  if (window.location.pathname === '/') {
    return <Navigate to="/home" />;
  }

  // Si todo está correcto, permitir el acceso a la ruta
  return children;
};

export default PrivateRoute;
