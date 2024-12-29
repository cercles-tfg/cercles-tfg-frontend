import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import './VerificarCurso.css';
import {
  cambiarEstadoCurso,
  crearCurso,
  verificarCursoExistente,
} from '../../services/Cursos_Api';

const VerificarCurso = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { nombreAsignatura, añoInicio, cuatrimestre, profesores, estudiantes } =
    state;

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirmCurso = () => {
    // Primero, verificar si ya existe un curso similar activo
    const cursoData = {
      nombreAsignatura,
      añoInicio,
      cuatrimestre,
    };

    verificarCursoExistente(cursoData)
      .then((response) => {
        if (response.status === 409) {
          // Si ya existe un curso activo, mostramos el popup de confirmación
          setShowConfirmPopup(true);
          return null;
        } else if (!response.ok) {
          throw new Error('Error al verificar el curso existente.');
        } else {
          // Si no hay conflicto, proceder a crear el curso
          return createCurso();
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
        console.error('Error al verificar el curso existente:', error);
      });
  };

  const createCurso = () => {
    const newCursoData = {
      nombreAsignatura,
      añoInicio,
      cuatrimestre,
      activo: true,
      profesores: profesores.map((prof) => ({
        nombre: prof.nombre,
        correo: prof.correo,
      })),
      estudiantes: estudiantes.map((estudiante) => ({
        nombre: estudiante.nombre,
        correo: estudiante.correo,
      })),
      periodosEvaluacion: state.periodosEvaluacion,
    };

    crearCurso(newCursoData)
      .then(() => {
        navigate('/cursos', { state: { cursoCreado: true } });
      })
      .catch((error) => {
        setErrorMessage(error.message);
        console.error('Error al crear el curso:', error);
      });
  };

  const handleCambiarEstadoCurso = () => {
    const cursoData = {
      nombreAsignatura,
      añoInicio,
      cuatrimestre,
    };

    // Llamar al backend para cambiar el estado del curso existente
    cambiarEstadoCurso(cursoData)
      .then(() => {
        setShowConfirmPopup(false);
        // Después de desactivar el curso existente, confirmar la creación del nuevo curso
        createCurso();
      })
      .catch((error) => {
        setErrorMessage(error.message);
        console.error('Error al cambiar el estado del curso existente:', error);
      });
  };

  const handleCancelConfirm = () => {
    setShowConfirmPopup(false);
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
        <h2>Períodes d&apos;avaluació</h2>
        <div className="evaluation-periods">
          {state.periodosEvaluacion.length > 0 ? (
            state.periodosEvaluacion.map((periodo, index) => (
              <p key={index}>
                <strong>Avaluació {index + 1}:</strong> Del{' '}
                {periodo.fechaInicio} al {periodo.fechaFin}
              </p>
            ))
          ) : (
            <p>No hi ha períodes d&apos;avaluació establerts.</p>
          )}
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
                  className="cancel-verification-button"
                  onClick={handleCancelConfirm}
                >
                  No
                </button>
                <button
                  type="button"
                  className="confirm-verification-button"
                  onClick={handleCambiarEstadoCurso}
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
