import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import './CursoPage.css';
import {
  obtenerDetallesCurso,
  cambiarEstadoCurso,
  verificarCursoExistente,
  obtenerProfesoresDisponibles,
  modificarCurso,
  borrarCurso,
} from '../../services/Cursos_Api.js';

const CursoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState('');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showConflictPopup, setShowConflictPopup] = useState(false);
  const [showAddConfirmPopup, setShowAddConfirmPopup] = useState(false);
  const [showSaveConfirmPopup, setShowSaveConfirmPopup] = useState(false);
  const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false);
  const [showDeleteStudentPopup, setShowDeleteStudentPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCurso, setEditedCurso] = useState(null);
  const [newEstudiante, setNewEstudiante] = useState({
    nombre: '',
    correo: '',
  });
  const [profesoresDisponibles, setProfesoresDisponibles] = useState([]);
  const [nombresProfesores, setNombresProfesores] = useState([]);
  const [profesoresBorrar, setProfesoresBorrar] = useState([]);
  const [estudianteAEliminar, setEstudianteAEliminar] = useState(null);
  const [mostrarMisEquipos, setMostrarMisEquipos] = useState(false);
  const [expandedEquipos, setExpandedEquipos] = useState({});
  const COLORS = [
    '#6C9975',
    '#BB6365',
    '#785B75',
    '#5E807F',
    '#BA5A31',
    '#355c7d',
  ];

  useEffect(() => {
    obtenerDetallesCurso(id)
      .then((data) => {
        setCurso(data);
        setEditedCurso(data);
        setNombresProfesores(data.nombresProfesores || []);
        console.log('Data curso ', data);
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
      verificarCursoExistente(curso)
        .then((response) => {
          if (response.status === 409) {
            setShowConflictPopup(true);
          } else if (!response.ok) {
            throw new Error('Error al verificar el curso existente.');
          } else {
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
    cambiarEstadoCurso({
      nombreAsignatura: curso.nombreAsignatura,
      añoInicio: curso.añoInicio,
      cuatrimestre: curso.cuatrimestre,
    })
      .then(() => {
        setShowConflictPopup(false);
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
    if (isEditing) {
      setEditedCurso(curso);
    } else {
      obtenerProfesoresDisponibles()
        .then((data) => setProfesoresDisponibles(data))
        .catch((error) => {
          console.error('Error al obtener los profesores:', error);
        });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    setShowSaveConfirmPopup(true);
  };

  const handleConfirmSaveChanges = () => {
    const cursoData = {
      nombreAsignatura: editedCurso.nombreAsignatura,
      añoInicio: editedCurso.añoInicio,
      cuatrimestre: editedCurso.cuatrimestre,
      estudiantesAñadir: newEstudiante.nombre
        ? [{ nombre: newEstudiante.nombre, correo: newEstudiante.correo }]
        : [],
      estudiantesBorrar: estudianteAEliminar ? [estudianteAEliminar] : [],
      profesoresAñadir: nombresProfesores.map((nombre) => {
        const profesor = profesoresDisponibles.find(
          (prof) => prof.nombre === nombre,
        );
        return { nombre: profesor.nombre, correo: profesor.correo };
      }),
      profesoresBorrar,
    };
    console.log('data: ', cursoData);

    modificarCurso(id, cursoData)
      .then(() => {
        setCurso(editedCurso);
        setIsEditing(false);
        setNewEstudiante({ nombre: '', correo: '' });
        setShowSaveConfirmPopup(false);
        setEstudianteAEliminar(null);
        console.log('Curso modificado con éxito');
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error al modificar el curso:', error);
      });
  };

  const handleCancelSaveChanges = () => {
    setShowSaveConfirmPopup(false);
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
      setProfesoresBorrar((prev) => [...prev, profesor]);
    } else {
      setNombresProfesores([...nombresProfesores, profesor.nombre]);
      setProfesoresBorrar((prev) =>
        prev.filter((p) => p.nombre !== profesor.nombre),
      );
    }
  };

  const handleDeleteStudent = (estudiante) => {
    setEstudianteAEliminar(estudiante);
    setShowDeleteStudentPopup(true);
  };

  const handleConfirmDeleteStudent = () => {
    handleSaveChanges();
    setShowDeleteConfirmPopup(false);
  };

  const handleCancelDeleteStudent = () => {
    setShowDeleteConfirmPopup(false);
  };

  const toggleEquipoExpand = (index) => {
    setExpandedEquipos((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleConfirmDeleteCourse = () => {
    borrarCurso(id, localStorage.getItem('jwtToken'))
      .then(() => {
        navigate('/cursos');
      })
      .catch((error) => {
        setError('Error al intentar borrar el curs.');
        console.error('Error al borrar el curso:', error);
      })
      .finally(() => {
        setShowDeleteConfirmPopup(false);
      });
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
            <div className="edit-controls">
              {isEditing ? (
                <>
                  <button className="save-button" onClick={handleSaveChanges}>
                    Guardar canvis
                  </button>
                  <button className="cancel-button" onClick={handleEditToggle}>
                    Cancel·lar
                  </button>
                </>
              ) : (
                <>
                  <button className="edit-button" onClick={handleEditToggle}>
                    ✏️ Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => setShowDeleteConfirmPopup(true)}
                  >
                    🗑️ Borrar curso
                  </button>
                </>
              )}
            </div>

            <div className="curso-details">
              <h1 className="curso-title">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedCurso.nombreAsignatura}
                    onChange={(e) =>
                      setEditedCurso({
                        ...editedCurso,
                        nombreAsignatura: e.target.value,
                      })
                    }
                  />
                ) : (
                  curso.nombreAsignatura
                )}
              </h1>
              <div className="curso-info">
                <div className="curso-info-content">
                  <p>
                    <strong>Any d&apos;inici:</strong>{' '}
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedCurso.añoInicio}
                        onChange={(e) =>
                          setEditedCurso({
                            ...editedCurso,
                            añoInicio: parseInt(e.target.value, 10),
                          })
                        }
                      />
                    ) : (
                      curso.añoInicio
                    )}
                  </p>
                  <p>
                    <strong>Cuatrimestre:</strong>{' '}
                    {isEditing ? (
                      <select
                        value={editedCurso.cuatrimestre}
                        onChange={(e) =>
                          setEditedCurso({
                            ...editedCurso,
                            cuatrimestre: parseInt(e.target.value, 10),
                          })
                        }
                      >
                        <option value={1}>Tardor</option>
                        <option value={2}>Primavera</option>
                      </select>
                    ) : curso.cuatrimestre === 1 ? (
                      'Tardor'
                    ) : (
                      'Primavera'
                    )}
                  </p>
                  <p>
                    <strong>Actiu:</strong> {curso.activo ? 'Sí' : 'No'}
                  </p>
                  <p>
                    <strong>Número total d&apos;estudiants:</strong>{' '}
                    {(curso.nombresEstudiantesSinGrupo?.length || 0) +
                      (curso.equipos?.reduce(
                        (total, equipo) =>
                          total + (equipo.miembros?.length || 0),
                        0,
                      ) || 0)}
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
                <h2>Estudiants sense equip</h2>
                <table className="curso-table">
                  <thead>
                    <tr>
                      <th>Nom i Cognoms</th>
                      <th>Adreça electrònica</th>
                      {isEditing && <th>Accions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {curso.nombresEstudiantesSinGrupo &&
                    curso.nombresEstudiantesSinGrupo.length > 0 ? (
                      curso.nombresEstudiantesSinGrupo.map((nombre, index) => (
                        <tr key={index}>
                          <td>{nombre}</td>
                          <td>{curso.correosEstudiantesSinGrupo[index]}</td>
                          {isEditing && (
                            <td>
                              <button
                                className="delete-button"
                                onClick={() =>
                                  handleDeleteStudent({
                                    nombre,
                                    correo: curso.correosEstudiantes[index],
                                  })
                                }
                              >
                                🗑️ Eliminar
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={isEditing ? '3' : '2'}>
                          No hi ha cap estudiant sense equip.
                        </td>
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
                            onClick={() => setShowAddConfirmPopup(true)}
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
                <h2>Equips</h2>
                <div className="filter-buttons">
                  <button
                    className={!mostrarMisEquipos ? 'active-filter' : ''}
                    onClick={() => setMostrarMisEquipos(false)}
                  >
                    Tots els equips
                  </button>
                  <button
                    className={mostrarMisEquipos ? 'active-filter' : ''}
                    onClick={() => setMostrarMisEquipos(true)}
                  >
                    Els meus equips
                  </button>
                </div>
                <div className="equipos-container">
                  {curso.equipos && curso.equipos.length > 0 ? (
                    curso.equipos
                      .filter((equipo) =>
                        mostrarMisEquipos
                          ? equipo.idProfe ===
                            parseInt(localStorage.getItem('id'))
                          : true,
                      )
                      .map((equipo, index) => (
                        <div
                          key={index}
                          className="equipo-card"
                          style={{ borderColor: COLORS[index % COLORS.length] }}
                          onClick={() =>
                            navigate(`/equipos/${equipo.id_equipo}`)
                          }
                        >
                          <div
                            className="equipo-card-header"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span>{equipo.nombreEquipo}</span>
                            <button
                              className="toggle-button"
                              onClick={(e) => {
                                e.stopPropagation(); // Evita que el clic en el botón dispare la redirección
                                toggleEquipoExpand(index);
                              }}
                            >
                              {expandedEquipos[index] ? '▲' : '▼'}
                            </button>
                          </div>
                          {expandedEquipos[index] && (
                            <div className="equipo-card-body">
                              {equipo.miembros && equipo.miembros.length > 0 ? (
                                equipo.miembros.map((miembro, miembroIndex) => (
                                  <div
                                    key={miembroIndex}
                                    className="equipo-member"
                                  >
                                    <p>{miembro || 'Desconegut'}</p>
                                  </div>
                                ))
                              ) : (
                                <p>No hi ha membres en aquest equip.</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                  ) : (
                    <p>Encara no hi ha cap equip format.</p>
                  )}
                </div>
              </div>

              <div className="curso-section">
                <h2>Professors</h2>
                {isEditing ? (
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
        {showDeleteConfirmPopup && (
          <div className="confirm-popup">
            <div className="popup-content">
              <p>
                Estàs segur/a de que vols eliminar el curs{' '}
                {curso.nombreAsignatura}?
              </p>
              <p>
                <strong>Aquesta acció no es pot desfer.</strong>
              </p>
              <div className="popup-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowDeleteConfirmPopup(false)}
                >
                  No
                </button>
                <button
                  type="button"
                  className="confirm-button"
                  onClick={handleConfirmDeleteCourse}
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
                Ja existeix un curs actiu amb el mateix nom, any i quadrimestre.
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
                  onClick={() => setShowAddConfirmPopup(false)}
                >
                  No
                </button>
                <button
                  type="button"
                  className="confirm-button"
                  onClick={() => {
                    handleSaveChanges();
                    setShowAddConfirmPopup(false);
                  }}
                >
                  Sí
                </button>
              </div>
            </div>
          </div>
        )}
        {showSaveConfirmPopup && (
          <div className="confirm-popup">
            <div className="popup-content">
              <p>Estàs segur de que vols realitzar aquests canvis?</p>
              <div className="popup-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancelSaveChanges}
                >
                  No
                </button>
                <button
                  type="button"
                  className="confirm-button"
                  onClick={handleConfirmSaveChanges}
                >
                  Sí
                </button>
              </div>
            </div>
          </div>
        )}
        {showDeleteStudentPopup && (
          <div className="confirm-popup">
            <div className="popup-content">
              <p>
                Estàs segur/a de que vols eliminar del curs{' '}
                {curso.nombreAsignatura} l&apos;estudiant{' '}
                {estudianteAEliminar?.nombre}?
              </p>
              <div className="popup-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowDeleteStudentPopup(false)}
                >
                  No
                </button>
                <button
                  type="button"
                  className="confirm-button"
                  onClick={handleConfirmDeleteStudent}
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
