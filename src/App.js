import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import PerfilPage from './pages/PerfilPage';
import PrivateRoute from './utils/PrivateRoute';
import CursosPage from './pages/CursosPage';
import CursoPage from './pages/CursoPage';
import CrearCurso from './components/CrearCurso';
import VerificarCurso from './components/VerificarCurso';
import ProjectesPage from './pages/ProjectesPage';

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
          path="/projectes"
          element={
            <PrivateRoute requiredRole="ESTUDIANTE">
              <ProjectesPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
