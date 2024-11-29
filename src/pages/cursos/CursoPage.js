import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import './CursoPage.css';
import {
  obtenerDetallesCurso,
  cambiarEstadoCurso,
  verificarCursoExistente,
  obtenerProfesoresDisponibles,
} from '../../services/Cursos_Api.js';

const CursoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState('');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showConflictPopup, setShowConflictPopup] = useState(false);
  const [showAddConfirmPopup, setShowAddConfirmPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProfessores, setIsEditingProfessores] = useState(false);
  const [newEstudiante, setNewEstudiante] = useState({
    nombre: '',
    correo: '',
  });
  const [profesoresDisponibles, setProfesoresDisponibles] = useState([]);
  const [nombresProfesores, setNombresProfesores] = useState([]);

  useEffect(() => {
    obtenerDetallesCurso(id)
      .then((data) => {
        setCurso(data);
        setNombresProfesores(data.nombresProfesores || []);
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
    if (curso.activo) {
      setShowConfirmPopup(true);
    } else {
      // Verificamos si existe otro curso activo con los mismos datos
      verificarCursoExistente(curso)
        .then((response) => {
          if (response.status === 409) {
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
    cambiarEstadoCurso({
      id: curso.id,
      nombreAsignatura: curso.nombreAsignatura,
      añoInicio: curso.añoInicio,
      cuatrimestre: curso.cuatrimestre,
    })
      .then(() => {
        // Actualizar el estado localmente
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
    cambiarEstadoCurso({
      nombreAsignatura: curso.nombreAsignatura,
      añoInicio: curso.añoInicio,
      cuatrimestre: curso.cuatrimestre,
    })
      .then(() => {
        setShowConflictPopup(false);
        // Intentar activar el curso actual después de desactivar el otro curso
        handleConfirmEstado();
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error al resolver el conflicto del curso:', error);
      });
  };

  const handleCancelConflict = () => {
    setShowConflictPopup(false);
  };

  const handleEditToggle = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const handleEditProfessoresToggle = () => {
    setIsEditingProfessores((prevEditing) => {
      if (!prevEditing) {
        obtenerProfesoresDisponibles()
          .then((data) => setProfesoresDisponibles(data))
          .catch((error) => {
            console.error('Error al obtener los profesores:', error);
          });
      }
      return !prevEditing;
    });
  };

  const handleAddStudent = () => {
    setShowAddConfirmPopup(true);
  };

  const handleConfirmAddStudent = () => {
    setCurso((prevCurso) => ({
      ...prevCurso,
      nombresEstudiantes: [
        ...prevCurso.nombresEstudiantes,
        newEstudiante.nombre,
      ],
      correosEstudiantes: [
        ...prevCurso.correosEstudiantes,
        newEstudiante.correo,
      ],
    }));
    setNewEstudiante({ nombre: '', correo: '' });
    setShowAddConfirmPopup(false);
  };

  const handleCancelAddStudent = () => {
    setShowAddConfirmPopup(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEstudiante((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfessorSelection = (profesor) => {
    if (nombresProfesores.includes(profesor.nombre)) {
      setNombresProfesores(
        nombresProfesores.filter((p) => p !== profesor.nombre),
      );
    } else {
      setNombresProfesores([...nombresProfesores, profesor.nombre]);
    }
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
                <div className="curso-section-header">
                  <h2>Estudiants</h2>
                  <button className="edit-button" onClick={handleEditToggle}>
                    {isEditing ? "Deixar d'editar" : '✏️ Editar'}
                  </button>
                </div>
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
                    {isEditing && (
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="nombre"
                            value={newEstudiante.nombre}
                            onChange={handleInputChange}
                            placeholder="Nom i Cognoms"
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            name="correo"
                            value={newEstudiante.correo}
                            onChange={handleInputChange}
                            placeholder="Adreça electrònica"
                          />
                        </td>
                        <td>
                          <button
                            className="add-button"
                            onClick={handleAddStudent}
                          >
                            Afegir
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="curso-section">
                <div className="curso-section-header">
                  <h2>Professors</h2>
                  <button
                    className="edit-button"
                    onClick={handleEditProfessoresToggle}
                  >
                    {isEditingProfessores ? "Deixar d'editar" : '✏️ Editar'}
                  </button>
                </div>
                {isEditingProfessores ? (
                  <div className="profesores-list">
                    {profesoresDisponibles.map((profesor, index) => (
                      <div key={index} className="professor-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={nombresProfesores.includes(
                              profesor.nombre,
                            )}
                            onChange={() => handleProfessorSelection(profesor)}
                          />
                          {profesor.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="curso-list">
                    {nombresProfesores && nombresProfesores.length > 0 ? (
                      nombresProfesores.map((nombre, index) => (
                        <li key={index} className="curso-list-item">
                          {nombre}
                        </li>
                      ))
                    ) : (
                      <p>No hi ha professors per mostrar.</p>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </>
        ) : (
          <p>Carregant les dades del curs...</p>
        )}
        {/* Popups */}
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
        {showAddConfirmPopup && (
          <div className="confirm-popup">
            <div className="popup-content">
              <p>
                Estàs segur/a de que vols afegir al Curs{' '}
                {curso.nombreAsignatura} a l&apos;estudiant{' '}
                {newEstudiante.nombre} amb Correu {newEstudiante.correo}?
              </p>
              <div className="popup-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancelAddStudent}
                >
                  No
                </button>
                <button
                  type="button"
                  className="confirm-button"
                  onClick={handleConfirmAddStudent}
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
