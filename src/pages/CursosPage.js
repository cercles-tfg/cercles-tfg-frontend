import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CrearCurso from '../components/CrearCurso';
import './CursosPage.css';

const CursosPage = () => {
  const navigate = useNavigate();
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  // Datos hardcodeados de ejemplo
  const cursos = [
    {
      id: 1,
      nombreAsignatura: 'Enginyeria del Software',
      anyInicio: 2024,
      cuatrimestre: 1,
      actiu: true,
      numEstudiantes: 25,
    },
    {
      id: 2,
      nombreAsignatura: 'Sistemes Distribuïts',
      anyInicio: 2023,
      cuatrimestre: 2,
      actiu: false,
      numEstudiantes: 20,
    },
  ];

  const handleRowClick = (id) => {
    navigate(`/cursos/${id}`); // Redirige a la página de detalles del curso
  };

  const handleCreateNewCourse = () => {
    setIsCreatingCourse(true);
  };

  const handleCancelCreateCourse = () => {
    setIsCreatingCourse(false);
  };

  return (
    <div className="cursos-page">
      <Sidebar />
      <div className="content">
        {!isCreatingCourse ? (
          <>
            <h1>Cursos</h1>
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
                    <td>{curso.anyInicio}</td>
                    <td>{curso.cuatrimestre}</td>
                    <td>{curso.actiu ? 'Sí' : 'No'}</td>
                    <td>{curso.numEstudiantes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <CrearCurso onCancel={handleCancelCreateCourse} />
        )}
      </div>
    </div>
  );
};

export default CursosPage;
