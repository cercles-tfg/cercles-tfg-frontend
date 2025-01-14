import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole, redirectToHome = false }) => {
  const token = localStorage.getItem('jwtToken');
  const rol = localStorage.getItem('rol');

  // Si no hay token o rol, redirigir al login
  if (!token || !rol) {
    return <Navigate to="/" />;
  }

  // Si el usuario intenta acceder a '/', redirigir a '/home' si está loggeado
  if (redirectToHome) {
    return <Navigate to="/home" />;
  }

  // Si el rol del usuario no coincide con el requerido, redirigir a Acceso Prohibido (403)
  if (requiredRole && rol !== requiredRole) {
    return <Navigate to="/forbidden" />;
  }

  // Si todo está correcto, permitir el acceso a la ruta
  return children;
};

export default PrivateRoute;
