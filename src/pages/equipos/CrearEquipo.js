import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import {
  getCursosDeEstudiante,
  getProfesoresCurso,
  crearEquipo,
  getEstudiantesCurso,
} from '../../services/Equipos_Api';
import { obtenerCursos } from '../../services/Cursos_Api';
import './CrearEquipo.css';

const CrearEquipo = () => {
  const navigate = useNavigate();
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [nombreCursoSeleccionado, setNombreCursoSeleccionado] = useState('');
  const [estudiantesSinGrupo, setEstudiantesSinGrupo] = useState([]);
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState(null);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const idEstudiante = parseInt(localStorage.getItem('id'));
  const token = localStorage.getItem('jwtToken');
  const rol = localStorage.getItem('rol');

  const location = useLocation();
  const cursoIdFromParams = new URLSearchParams(location.search).get('cursoId');

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        let cursosData = [];
        if (rol === 'Profesor') {
          cursosData = await obtenerCursos();
        } else {
          cursosData = await getCursosDeEstudiante(idEstudiante, token);
        }

        const cursosActivos = cursosData.filter((curso) => curso.activo);
        setCursos(cursosActivos || []);

        if (cursoIdFromParams) {
          const curso = cursosActivos.find(
            (c) => c.id === parseInt(cursoIdFromParams),
          );
          setNombreCursoSeleccionado(
            curso?.nombreAsignatura || 'Nom no disponible',
          );
        }
      } catch (error) {
        setError('Error al carregar els cursos disponibles.');
        setShowErrorPopup(true);
      }
    };

    setCursoSeleccionado(parseInt(cursoIdFromParams));
    handleCursoChange(cursoIdFromParams);
    fetchCursos();
  }, [idEstudiante, token, cursoIdFromParams]);

  const handleCursoChange = async (cursoId) => {
    if (!cursoId) {
      setCursoSeleccionado(null);
      setNombreCursoSeleccionado('');
      setEstudiantesSinGrupo([]);
      setProfesores([]);
      setEstudiantesSeleccionados([]);
      setProfesorSeleccionado(null);
      return;
    }

    setCursoSeleccionado(cursoId);
    setNombreCursoSeleccionado(
      cursos.find((curso) => curso.id === parseInt(cursoId))
        ?.nombreAsignatura || '',
    );
    setEstudiantesSeleccionados([idEstudiante]);
    setProfesorSeleccionado(null);

    try {
      const estudiantesData = await getEstudiantesCurso(cursoId, token);
      const profesoresData = await getProfesoresCurso(cursoId, token);

      const estudiantesFiltrados = estudiantesData.sinEquipo.filter(
        (estudiante) => estudiante.id !== idEstudiante,
      );

      setEstudiantesSinGrupo(estudiantesFiltrados);
      setProfesores(profesoresData || []);
    } catch (error) {
      setError('Error al cargar los estudiantes o profesores del curso.');
      setShowErrorPopup(true);
    }
  };

  const toggleEstudianteSeleccionado = (id) => {
    if (estudiantesSeleccionados.includes(id)) {
      setEstudiantesSeleccionados(
        estudiantesSeleccionados.filter((e) => e !== id),
      );
    } else {
      setEstudiantesSeleccionados([...estudiantesSeleccionados, id]);
    }
  };

  const handleCreateClick = async () => {
    try {
      const uniqueEstudiantes =
        rol === 'Estudiante'
          ? [...new Set([...estudiantesSeleccionados, parseInt(idEstudiante)])]
          : [
              ...new Set(
                estudiantesSeleccionados.filter(
                  (id) => id !== parseInt(idEstudiante),
                ),
              ),
            ];

      const equipoData = {
        nombre: nombreEquipo,
        cursoId: parseInt(cursoSeleccionado),
        estudiantesIds: uniqueEstudiantes,
        evaluadorId: profesorSeleccionado,
      };

      await crearEquipo(equipoData, token);

      // Redirigir después de la creación exitosa
      if (rol === 'Estudiante') {
        navigate('/equipos');
      } else {
        window.location.href = `/cursos/${cursoSeleccionado}`;
      }
    } catch (error) {
      console.log('hola?');
      setError(error.message || 'Error desconocido al crear el equipo.');
      setShowErrorPopup(true);
    }
  };

  useEffect(() => {
    if (showErrorPopup) {
      const timer = setTimeout(() => {
        setShowErrorPopup(false);
        setShowConfirmPopup(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showErrorPopup]);

  const isCreateDisabled =
    !nombreEquipo ||
    !cursoSeleccionado ||
    estudiantesSeleccionados.length <= 1 ||
    !profesorSeleccionado;

  const estudiantesFiltrados = estudiantesSinGrupo.filter((estudiante) =>
    estudiante.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div
      className={`crear-equipo-page ${showConfirmPopup ? 'popup-active' : ''}`}
    >
      <Sidebar />
      <div className="crear-equipo-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          Torna enrere
        </button>
        <h1>CREA UN NOU EQUIP</h1>

        <div className="form-group">
          <label>Nom de l&apos;equip:</label>
          <input
            type="text"
            value={nombreEquipo}
            onChange={(e) => setNombreEquipo(e.target.value)}
            placeholder="Escriu un nom"
          />
        </div>

        <div className="form-group">
          <label>Selecciona un curs on crear l&apos;equip:</label>
          {cursoIdFromParams ? (
            <div className="curso-seleccionado">{nombreCursoSeleccionado}</div>
          ) : (
            <select
              value={cursoSeleccionado || ''}
              onChange={(e) => handleCursoChange(e.target.value)}
              disabled={!!cursoIdFromParams}
            >
              <option value="">Selecciona curs</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nombreAsignatura}
                </option>
              ))}
            </select>
          )}
        </div>

        {cursoSeleccionado && (
          <>
            <div className="form-group">
              <label>Selecciona al professor avaluador:</label>
              <select
                value={profesorSeleccionado || ''}
                onChange={(e) =>
                  setProfesorSeleccionado(parseInt(e.target.value))
                }
              >
                <option value="">Selecciona un professor</option>
                {profesores.map((profesor) => (
                  <option key={profesor.id} value={profesor.id}>
                    {profesor.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Selecciona els membres del teu equip (mínim 1):</label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Cerca estudiants"
              />
            </div>

            <div className="form-group">
              <div className="checkbox-list-container">
                <div className="checkbox-list">
                  {estudiantesFiltrados.map((estudiante) => (
                    <label
                      key={estudiante.id}
                      className={`equipo-checkbox-item ${
                        estudiantesSeleccionados.includes(estudiante.id)
                          ? 'selected'
                          : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={estudiante.id}
                        checked={estudiantesSeleccionados.includes(
                          estudiante.id,
                        )}
                        onChange={() =>
                          toggleEstudianteSeleccionado(estudiante.id)
                        }
                      />
                      {estudiante.nombre}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <button
          className="crear-equipo-button"
          disabled={isCreateDisabled}
          onClick={() => setShowConfirmPopup(true)}
        >
          Crear Equip
        </button>

        {showConfirmPopup && (
          <div className="overlay">
            <div className="crear-equipo-confirm-popup">
              <div className="crear-equipo-popup-content">
                <h4>Confirmar creació</h4>
                <p>
                  <strong>Nom de l&apos;equip:</strong> {nombreEquipo}
                </p>
                <p>
                  <strong>Curs:</strong> {nombreCursoSeleccionado}
                </p>
                <p>
                  <strong>Membres:</strong>{' '}
                  {[
                    ...(rol === 'Estudiante' ? ['Jo'] : []),
                    ...estudiantesSeleccionados
                      .map(
                        (id) =>
                          estudiantesSinGrupo.find((est) => est.id === id)
                            ?.nombre,
                      )
                      .filter(Boolean),
                  ].join(', ')}
                </p>

                <p>
                  <strong>Professor avaluador:</strong>{' '}
                  {
                    profesores.find((prof) => prof.id === profesorSeleccionado)
                      ?.nombre
                  }
                </p>
                <button className="confirm-button" onClick={handleCreateClick}>
                  Confirmar
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setShowConfirmPopup(false)}
                >
                  Cancel·lar
                </button>
              </div>
            </div>
          </div>
        )}
        {showErrorPopup && (
          <div className="error-popup">
            <div className="error-popup-content">
              <p className="error-message">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearEquipo;
