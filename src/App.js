import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/usuarios/LoginPage';
import HomePage from './pages/home/HomePage';
import PerfilPage from './pages/usuarios/PerfilPage';
import PrivateRoute from './utils/PrivateRoute';
import CursosPage from './pages/cursos/CursosPage';
import CursoPage from './pages/cursos/CursoPage';
import CrearCurso from './pages/cursos/CrearCurso';
import VerificarCurso from './pages/cursos/VerificarCurso';
import EquiposPage from './pages/equipos/EquiposPage';
import EquipoPage from './pages/equipos/EquipoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <PerfilPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cursos"
          element={
            <PrivateRoute requiredRole="PROFESOR">
              <CursosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cursos/:id"
          element={
            <PrivateRoute requiredRole="PROFESOR">
              <CursoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cursos/crear"
          element={
            <PrivateRoute requiredRole="PROFESOR">
              <CrearCurso />
            </PrivateRoute>
          }
        />
        <Route
          path="/cursos/crear/verificar"
          element={
            <PrivateRoute requiredRole="PROFESOR">
              <VerificarCurso />
            </PrivateRoute>
          }
        />
        <Route
          path="/equipos"
          element={
            <PrivateRoute requiredRole="ESTUDIANTE">
              <EquiposPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/equipos/:id"
          element={
            <PrivateRoute>
              <EquipoPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
