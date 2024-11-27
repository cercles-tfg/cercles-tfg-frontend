import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './CursoPage.css';

const CursoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState('');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showConflictPopup, setShowConflictPopup] = useState(false);

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

  const handleToggleEstado = () => {
    // Si el curso está activo, mostramos el popup de confirmación directamente
    if (curso.activo) {
      setShowConfirmPopup(true);
    } else {
      // Si el curso está inactivo, primero verificamos si existe otro curso activo con los mismos datos
      const token = localStorage.getItem('jwtToken');
      fetch('http://localhost:8080/api/cursos/verificarCursoExistente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombreAsignatura: curso.nombreAsignatura,
          añoInicio: curso.añoInicio,
          cuatrimestre: curso.cuatrimestre,
        }),
      })
        .then((response) => {
          if (response.status === 409) {
            // Si hay conflicto, mostramos el popup para resolverlo
            setShowConflictPopup(true);
          } else if (!response.ok) {
            throw new Error('Error al verificar el curso existente.');
          } else {
            // Si no hay conflicto, procedemos directamente a cambiar el estado
            handleConfirmEstado();
          }
        })
        .catch((error) => {
          setError(error.message);
          console.error('Error al verificar el curso existente:', error);
        });
    }
  };

  const handleConfirmEstado = () => {
    const token = localStorage.getItem('jwtToken');
    fetch(`http://localhost:8080/api/cursos/cambiarEstado`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: curso.id,
        nombreAsignatura: curso.nombreAsignatura,
        añoInicio: curso.añoInicio,
        cuatrimestre: curso.cuatrimestre,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cambiar el estado del curso.');
        }
        return response.text();
      })
      .then(() => {
        // Actualizar el estado localmente en lugar de recargar la página
        setCurso((prevCurso) => ({
          ...prevCurso,
          activo: !prevCurso.activo,
        }));
        setShowConfirmPopup(false);
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error al cambiar el estado del curso:', error);
      });
  };

  const handleCancelConfirm = () => {
    setShowConfirmPopup(false);
  };

  const handleResolveConflict = () => {
    // Llamar al backend para desactivar el curso existente
    const token = localStorage.getItem('jwtToken');
    fetch('http://localhost:8080/api/cursos/cambiarEstado', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombreAsignatura: curso.nombreAsignatura,
        añoInicio: curso.añoInicio,
        cuatrimestre: curso.cuatrimestre,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al desactivar el curso existente.');
        }
        return response.text();
      })
      .then(() => {
        setShowConflictPopup(false);
        // Intentar activar el curso actual después de desactivar el otro curso
        handleConfirmEstado();
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error al desactivar el curso existente:', error);
      });
  };

  const handleCancelConflict = () => {
    setShowConflictPopup(false);
  };

  return (
    <div className="curso-page">
      <Sidebar />
      <div className="curso-content">
        <button className="back-button" onClick={handleBackClick}>
          Tornar als cursos
        </button>
        {error && <div className="error-message">{error}</div>}
        {curso ? (
          <>
            <div className="curso-details">
              <h1 className="curso-title">{curso.nombreAsignatura}</h1>
              <div className="curso-info">
                <div className="curso-info-content">
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
                    <strong>Número d&apos;estudiants:</strong>{' '}
                    {curso.nombresEstudiantes
                      ? curso.nombresEstudiantes.length
                      : 0}
                  </p>
                </div>
                <div className="toggle-container">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={curso.activo}
                      onChange={handleToggleEstado}
                    />
                    <span
                      className={`slider ${curso.activo ? 'activo' : 'inactivo'}`}
                    >
                      {curso.activo ? 'ACTIU' : 'INACTIU'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="curso-lists">
              <div className="curso-section">
                <h2>Estudiants</h2>
                <table className="curso-table">
                  <thead>
                    <tr>
                      <th>Nom i Cognoms</th>
                      <th>Adreça electrònica</th>
                    </tr>
                  </thead>
                  <tbody>
                    {curso.nombresEstudiantes &&
                    curso.nombresEstudiantes.length > 0 ? (
                      curso.nombresEstudiantes.map((nombre, index) => (
                        <tr key={index}>
                          <td>{nombre}</td>
                          <td>{curso.correosEstudiantes[index]}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">No hi ha estudiants per mostrar.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="curso-section">
                <h2>Professors</h2>
                <ul className="curso-list">
                  {curso.nombresProfesores &&
                  curso.nombresProfesores.length > 0 ? (
                    curso.nombresProfesores.map((nombre, index) => (
                      <li key={index} className="curso-list-item">
                        {nombre}
                      </li>
                    ))
                  ) : (
                    <p>No hi ha professors per mostrar.</p>
                  )}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <p>Carregant les dades del curs...</p>
        )}

        {showConfirmPopup && (
          <div className="confirm-popup">
            <div className="popup-content">
              <p>
                Estàs segur/a de que vols{' '}
                {curso.activo ? 'desactivar' : 'activar'} el curs?
              </p>
              <div className="popup-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancelConfirm}
                >
                  No
                </button>
                <button
                  type="button"
                  className="confirm-button"
                  onClick={handleConfirmEstado}
                >
                  Sí
                </button>
              </div>
            </div>
          </div>
        )}

        {showConflictPopup && (
          <div className="confirm-popup">
            <div className="popup-content">
              <p>
                Ja existeix un curs actiu amb el mateix nom, any i quatrimestre.
                Vols desactivar-lo per poder activar aquest?
              </p>
              <div className="popup-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancelConflict}
                >
                  No
                </button>
                <button
                  type="button"
                  className="confirm-button"
                  onClick={handleResolveConflict}
                >
                  Sí
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CursoPage;
