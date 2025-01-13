import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import './CursosPage.css';
import { obtenerCursos } from '../../services/Cursos_Api.js';
import { crearProfesor } from '../../services/Usuarios_Api.js';

const CursosPage = () => {
  const navigate = useNavigate();
  const [cursosActivos, setCursosActivos] = useState([]);
  const [cursosInactivos, setCursosInactivos] = useState([]);
  const [showInactiveCourses, setShowInactiveCourses] = useState(false);
  const [showProfessorPopup, setShowProfessorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [professorData, setProfessorData] = useState({
    nombre: '',
    correo: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Obtener la lista de cursos del backend
    obtenerCursos()
      .then((data) => {
        // Dividir los cursos en activos e inactivos y ordenarlos
        const activos = data
          .filter((curso) => curso.activo)
          .sort((a, b) => compareCursos(a, b));
        const inactivos = data
          .filter((curso) => !curso.activo)
          .sort((a, b) => compareCursos(a, b));
        setCursosActivos(activos);
        setCursosInactivos(inactivos);
      })
      .catch((error) => {
        console.error('Error al obtener los cursos:', error);
      });
    console.log('datos: ', cursosActivos);
  }, []);

  const compareCursos = (a, b) => {
    if (a.añoInicio === b.añoInicio) {
      return a.cuatrimestre - b.cuatrimestre;
    }
    return b.añoInicio - a.añoInicio;
  };

  const handleRowClick = (id) => {
    navigate(`/cursos/${id}`);
  };

  const handleCreateNewCourse = () => {
    navigate('/cursos/crear');
  };

  const handleAddProfessor = async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
      alert('Token no encontrado. Inicia sesión de nuevo.');
      return;
    }

    try {
      await crearProfesor(professorData, jwtToken);
      setShowProfessorPopup(false);
      setSuccessMessage(
        `El professor "${professorData.nombre}" amb correu "${professorData.correo}" s'ha afegit correctament a la BD.`,
      );
      setProfessorData({
        nombre: '',
        correo: '',
      });
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error al afegir el professor:', error);
      alert(`Error al afegir el professor: ${error.message}`);
    }
  };

  return (
    <div className="cursos-page">
      <Sidebar />
      <div className="content">
        <h1>Els meus cursos</h1>
        <div className="buttons-container">
          <button
            className="create-course-button"
            onClick={handleCreateNewCourse}
          >
            Crear un nou curs
          </button>
          <button
            className="add-professor-button"
            onClick={() => setShowProfessorPopup(true)}
          >
            Afegir professor
          </button>
        </div>
        <h2>Els meus cursos actius</h2>
        <table className="cursos-table">
          <thead>
            <tr>
              <th>Nom de l&apos;assignatura</th>
              <th>Any d&apos;inici</th>
              <th>Quadrimestre</th>
              <th>Nombre d&apos;estudiants</th>
              <th>Nombre d&apos;equips</th>
              <th>Nombre d&apos;estudiants sense equip</th>
            </tr>
          </thead>
          <tbody>
            {cursosActivos.map((curso) => (
              <tr
                key={curso.id}
                onClick={() => handleRowClick(curso.id)}
                className="clicable-row"
              >
                <td>{curso.nombreAsignatura}</td>
                <td>{curso.añoInicio}</td>
                <td>{curso.cuatrimestre === 1 ? 'Tardor' : 'Primavera'}</td>
                <td>{curso.numeroEstudiantes}</td>
                <td>{curso.numeroEquipos}</td>
                <td>{curso.numeroEstudiantesSinEquipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className="toggle-inactive-courses"
          onClick={() => setShowInactiveCourses(!showInactiveCourses)}
        >
          Veure els meus cursos inactius {showInactiveCourses ? '⬇' : '➡'}
        </div>
        {showInactiveCourses && (
          <table className="cursos-table">
            <thead>
              <tr>
                <th>Nom de l&apos;assignatura</th>
                <th>Any d&apos;inici</th>
                <th>Quadrimestre</th>
                <th>Nombre d&apos;estudiants</th>
                <th>Nombre d&apos;equips</th>
                <th>Nombre d&apos;estudiants sense equip</th>
              </tr>
            </thead>
            <tbody>
              {cursosInactivos.map((curso) => (
                <tr
                  key={curso.id}
                  onClick={() => handleRowClick(curso.id)}
                  className="clicable-row"
                >
                  <td>{curso.nombreAsignatura}</td>
                  <td>{curso.añoInicio}</td>
                  <td>{curso.cuatrimestre === 1 ? 'Tardor' : 'Primavera'}</td>
                  <td>{curso.numeroEstudiantes}</td>
                  <td>{curso.numeroEquipos}</td>
                  <td>{curso.numeroEstudiantesSinEquipo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {showProfessorPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>Afegir professor a la BD</h2>
              <div className="form-group">
                <label>Nom i cognoms:</label>
                <input
                  type="text"
                  value={professorData.nombre}
                  onChange={(e) =>
                    setProfessorData({
                      ...professorData,
                      nombre: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Correu electrònic:</label>
                <input
                  type="email"
                  value={professorData.correo}
                  onChange={(e) =>
                    setProfessorData({
                      ...professorData,
                      correo: e.target.value,
                    })
                  }
                />
              </div>
              <div className="buttons-container">
                <button className="popup-button" onClick={handleAddProfessor}>
                  Afegir
                </button>
                <button
                  className="popup-button cancel"
                  onClick={() => setShowProfessorPopup(false)}
                >
                  Cancel·lar
                </button>
              </div>
            </div>
          </div>
        )}
        {showSuccessPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>Professor afegit correctament</h2>
              <p>{successMessage}</p>
              <button
                className="popup-button"
                onClick={() => setShowSuccessPopup(false)}
              >
                Tanca
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CursosPage;
