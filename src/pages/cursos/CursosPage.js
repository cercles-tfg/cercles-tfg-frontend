// Nuevo archivo CursosPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import './CursosPage.css';
import { obtenerCursos } from '../../services/Cursos_Api.js';

const CursosPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cursos, setCursos] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (location.state?.cursoCreado) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    // Obtener la lista de cursos del backend
    obtenerCursos()
      .then((data) => {
        setCursos(data);
      })
      .catch((error) => {
        console.error('Error al obtener los cursos:', error);
      });
  }, []);

  const handleRowClick = (id) => {
    navigate(`/cursos/${id}`);
  };

  const handleCreateNewCourse = () => {
    navigate('/cursos/crear');
  };

  return (
    <div className="cursos-page">
      <Sidebar />
      <div className="content">
        <h1>Cursos</h1>
        {showSuccessMessage && (
          <div className="success-message">Curs creat correctament!</div>
        )}
        <button
          className="create-course-button"
          onClick={handleCreateNewCourse}
        >
          Crear un nou curs
        </button>
        <table className="cursos-table">
          <thead>
            <tr>
              <th>Nom de l&apos;assignatura</th>
              <th>Any d&apos;inici</th>
              <th>Cuatrimestre</th>
              <th>Actiu</th>
              <th>Número d&apos;estudiants</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso) => (
              <tr
                key={curso.id}
                onClick={() => handleRowClick(curso.id)}
                className="clicable-row"
              >
                <td>{curso.nombreAsignatura}</td>
                <td>{curso.añoInicio}</td>
                <td>{curso.cuatrimestre}</td>
                <td>{curso.activo ? 'Sí' : 'No'}</td>
                <td>{curso.numeroEstudiantes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CursosPage;
