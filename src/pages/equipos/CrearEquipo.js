import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import {
  getCursosDeEstudiante,
  getProfesoresCurso,
  crearEquipo,
  getEstudiantesCurso,
} from '../../services/Equipos_Api';
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

  const idEstudiante = parseInt(localStorage.getItem('id'));
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const cursosData = await getCursosDeEstudiante(idEstudiante, token);
        setCursos(cursosData || []);
      } catch (error) {
        setError('Error al cargar los cursos disponibles.');
      }
    };

    fetchCursos();
  }, [idEstudiante, token]);

  const handleCursoChange = async (cursoId) => {
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
      // Asegurarte de que el estudiante loggeado no esté duplicado
      const uniqueEstudiantes = [
        ...new Set([...estudiantesSeleccionados, parseInt(idEstudiante)]),
      ];

      const equipoData = {
        nombre: nombreEquipo,
        cursoId: parseInt(cursoSeleccionado),
        estudiantesIds: uniqueEstudiantes,
        evaluadorId: profesorSeleccionado,
      };

      console.log('Equipo Data:', equipoData); // Verifica los datos antes de enviar
      await crearEquipo(equipoData, token);
      navigate('/equipos');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear el equipo.');
      setShowConfirmPopup(false);
    }
  };

  const isCreateDisabled =
    !nombreEquipo ||
    !cursoSeleccionado ||
    estudiantesSeleccionados.length <= 1 ||
    !profesorSeleccionado;

  const estudiantesFiltrados = estudiantesSinGrupo.filter((estudiante) =>
    estudiante.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const handleBackClick = () => {
    navigate(-1); // Regresa a la página anterior
  };

  return (
    <div className="crear-equipo-page">
      <Sidebar />
      <div className="content">
        <button className="back-button" onClick={handleBackClick}>
          Torna enrere
        </button>
        <h1>CREA UN NOU EQUIP</h1>

        {error && <div className="error-message">{error}</div>}

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
          <select
            value={cursoSeleccionado || ''}
            onChange={(e) => handleCursoChange(e.target.value)}
          >
            <option value="">Selecciona curs</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombreAsignatura}
              </option>
            ))}
          </select>
        </div>

        {cursoSeleccionado && (
          <>
            <div className="form-group">
              <label>Cercar estudiants:</label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Escriu un nom"
              />
            </div>

            <div className="form-group">
              <label>Selecciona els membres del teu equip (mínim 1):</label>
              <div className="checkbox-list">
                {estudiantesFiltrados.map((estudiante) => (
                  <label key={estudiante.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      value={estudiante.id}
                      checked={estudiantesSeleccionados.includes(estudiante.id)}
                      onChange={() =>
                        toggleEstudianteSeleccionado(estudiante.id)
                      }
                    />
                    {estudiante.nombre}
                  </label>
                ))}
              </div>
            </div>

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
          </>
        )}

        <button
          className="create-button"
          disabled={isCreateDisabled}
          onClick={() => setShowConfirmPopup(true)}
        >
          Crear Equip
        </button>

        {showConfirmPopup && (
          <div className="confirm-popup">
            <div className="popup-content">
              <h3>Confirmar creació</h3>
              <p>
                <strong>Nom de l&apos;equip:</strong> {nombreEquipo}
              </p>
              <p>
                <strong>Curs:</strong> {nombreCursoSeleccionado}
              </p>
              <p>
                <strong>Membres:</strong>{' '}
                {estudiantesSeleccionados
                  .map((id) =>
                    id === idEstudiante
                      ? 'Tu mateix'
                      : estudiantesSinGrupo.find((est) => est.id === id)
                          ?.nombre,
                  )
                  .join(', ')}
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
        )}
      </div>
    </div>
  );
};

export default CrearEquipo;
