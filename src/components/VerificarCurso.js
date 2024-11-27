import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './VerificarCurso.css';

const VerificarCurso = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { nombreAsignatura, añoInicio, cuatrimestre, profesores, estudiantes } =
    state;

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirmCurso = () => {
    const cursoData = {
      nombreAsignatura,
      añoInicio,
      cuatrimestre,
      activo: true,
      profesores: profesores.map((prof) => prof.id),
      estudiantes,
    };

    const token = localStorage.getItem('jwtToken');
    fetch('http://localhost:8080/api/cursos/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cursoData),
    })
      .then((response) => {
        if (response.status === 409) {
          setShowConfirmPopup(true);
        } else if (!response.ok) {
          throw new Error('Error al crear el curso');
        } else {
          return response.json().catch(() => ({}));
        }
      })
      .then(() => {
        navigate('/cursos', { state: { cursoCreado: true } });
      })
      .catch((error) => {
        setErrorMessage(error.message);
        console.error('Error al crear el curso:', error);
      });
  };

  const handleDesactivarCurso = () => {
    const cursoData = {
      nombreAsignatura,
      añoInicio,
      cuatrimestre,
    };

    const token = localStorage.getItem('jwtToken');
    fetch('http://localhost:8080/api/cursos/desactivar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cursoData),
    })
      .then(() => {
        setShowConfirmPopup(false);
        handleConfirmCurso();
      })
      .catch((error) => {
        setErrorMessage(error.message);
        console.error('Error al desactivar el curso:', error);
      });
  };

  return (
    <div className="cursos-page">
      <Sidebar />
      <div className="verificar-curso-container">
        <h1>Verificació del curs</h1>
        <div className="curso-details">
          <p>
            <strong>Nom de l&apos;assignatura:</strong> {nombreAsignatura}
          </p>
          <p>
            <strong>Any d&apos;inici:</strong> {añoInicio}
          </p>
          <p>
            <strong>Quatrimestre:</strong>{' '}
            {cuatrimestre === '1' ? 'Tardor' : 'Primavera'}
          </p>
          <p>
            <strong>Actiu:</strong> Sí
          </p>
          <p>
            <strong>Professors:</strong>{' '}
            {profesores.map((prof) => prof.nombre).join(', ')}
          </p>
        </div>
        <h2>Estudiants</h2>
        <div className="students-table">
          <table>
            <thead>
              <tr>
                <th>Nom i Cognoms</th>
                <th>Adreça electrònica</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.length > 0 ? (
                estudiantes.map((estudiante, index) => (
                  <tr key={index}>
                    <td>{`${estudiante.nombre}`}</td>
                    <td>{estudiante.correo}</td>
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
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="form-buttons">
          <button
            type="button"
            className="cancel-button"
            onClick={() =>
              navigate('/cursos/crear', {
                state: {
                  nombreAsignatura,
                  añoInicio,
                  cuatrimestre,
                  selectedProfesores: profesores.map((prof) => prof.id),
                },
              })
            }
          >
            Tornar per modificar
          </button>
          <button
            type="button"
            className="confirm-button"
            onClick={handleConfirmCurso}
          >
            Confirmar curs
          </button>
        </div>

        {showConfirmPopup && (
          <div className="confirm-popup">
            <div className="popup-content">
              <p>
                Ja existeix un curs actiu amb el mateix nom, any i quatrimestre.
                Vols desactivar-lo?
              </p>
              <div className="popup-buttons">
                <button
                  type="button"
                  className="cancel-verfication-button"
                  onClick={() => setShowConfirmPopup(false)}
                >
                  No
                </button>
                <button
                  type="button"
                  className="confirm-verficiation-button"
                  onClick={handleDesactivarCurso}
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

export default VerificarCurso;
