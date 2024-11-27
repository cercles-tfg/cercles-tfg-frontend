import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './CursoPage.css';

const CursoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Obtener los detalles del curso desde el backend
    const token = localStorage.getItem('jwtToken');
    fetch(`http://localhost:8080/api/cursos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los detalles del curso.');
        }
        return response.json();
      })
      .then((data) => {
        setCurso(data);
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error al obtener los detalles del curso:', error);
      });
  }, [id]);

  const handleBackClick = () => {
    navigate('/cursos');
  };

  return (
    <div className="curso-page">
      <Sidebar />
      <div className="content">
        <button className="back-button" onClick={handleBackClick}>
          Tornar als cursos
        </button>
        {error && <div className="error-message">{error}</div>}
        {curso ? (
          <>
            <h1>{curso.nombreAsignatura}</h1>
            <p>
              <strong>Any d&apos;inici:</strong> {curso.añoInicio}
            </p>
            <p>
              <strong>Cuatrimestre:</strong>{' '}
              {curso.cuatrimestre === 1 ? 'Tardor' : 'Primavera'}
            </p>
            <p>
              <strong>Actiu:</strong> {curso.activo ? 'Sí' : 'No'}
            </p>
            <p>
              <strong>Número d&apos;estudiants:</strong> {curso.numEstudiantes}
            </p>
            <h2>Estudiants</h2>
            <ul>
              {curso.estudiantes && curso.estudiantes.length > 0 ? (
                curso.estudiantes.map((estudiante, index) => (
                  <li key={index}>
                    {estudiante.nombre} ({estudiante.correo})
                  </li>
                ))
              ) : (
                <p>No hi ha estudiants per mostrar.</p>
              )}
            </ul>
          </>
        ) : (
          <p>Carregant les dades del curs...</p>
        )}
      </div>
    </div>
  );
};

export default CursoPage;
