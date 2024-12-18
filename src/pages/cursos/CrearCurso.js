import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import './CrearCurso.css';
import {
  obtenerProfesoresDisponibles,
  subirArchivoEstudiantes,
} from '../../services/Cursos_Api.js';

const CrearCurso = () => {
  const currentYear = new Date().getFullYear();
  const [nombreAsignatura, setNombreAsignatura] = useState('');
  const [añoInicio, setAñoInicio] = useState(currentYear);
  const [cuatrimestre, setCuatrimestre] = useState('1');
  const [selectedProfesores, setSelectedProfesores] = useState([]);
  const [profesoresDisponibles, setProfesoresDisponibles] = useState([]);
  const [estudiantesFile, setEstudiantesFile] = useState(null);
  const [estudiantesData, setEstudiantesData] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    obtenerProfesoresDisponibles()
      .then(setProfesoresDisponibles)
      .catch((error) => {
        console.error('Error al obtener los profesores:', error);
      });

    if (location.state) {
      const { nombreAsignatura, añoInicio, cuatrimestre, selectedProfesores } =
        location.state;
      setNombreAsignatura(nombreAsignatura);
      setAñoInicio(añoInicio);
      setCuatrimestre(cuatrimestre);
      setSelectedProfesores(selectedProfesores);
    }
  }, [location.state]);

  const handleProfesorClick = (id) => {
    setSelectedProfesores((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((profId) => profId !== id)
        : [...prevSelected, id],
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedProfesores.length === 0 || !estudiantesFile) {
      return;
    }

    try {
      const data = await subirArchivoEstudiantes(estudiantesFile);
      setEstudiantesData(data);
      navigate('/cursos/crear/verificar', {
        state: {
          nombreAsignatura,
          añoInicio,
          cuatrimestre,
          profesores: selectedProfesores.map((id) => {
            const prof = profesoresDisponibles.find((prof) => prof.id === id);
            return { id: prof.id, nombre: prof.nombre, correo: prof.correo };
          }),
          estudiantes: data,
        },
      });
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
    }
  };

  return (
    <div className="cursos-page">
      <Sidebar />
      <div className="create-course-form">
        <h1>Crear un nou curs</h1>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="nombreAsignatura">Nom de l&apos;assignatura</label>
            <input
              type="text"
              id="nombreAsignatura"
              value={nombreAsignatura}
              onChange={(e) => setNombreAsignatura(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="añoInicio">Any d&apos;inici</label>
            <select
              id="añoInicio"
              value={añoInicio}
              onChange={(e) => setAñoInicio(parseInt(e.target.value))}
              required
            >
              {Array.from({ length: 5 }, (_, i) => currentYear + i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ),
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="cuatrimestre">Quatrimestre</label>
            <select
              id="cuatrimestre"
              value={cuatrimestre}
              onChange={(e) => setCuatrimestre(e.target.value)}
              required
            >
              <option value="1">Tardor</option>
              <option value="2">Primavera</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              Selecciona els professors (pots seleccionar-ne més d&apos;un)
            </label>
            <div className="profesor-selection-group">
              {profesoresDisponibles.map((profesor) => (
                <div
                  key={profesor.id}
                  className={`profesor-card ${
                    selectedProfesores.includes(profesor.id) ? 'selected' : ''
                  }`}
                  onClick={() => handleProfesorClick(profesor.id)}
                >
                  {profesor.nombre}
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="estudiantesFile">
              Pujar document excel amb els estudiants
            </label>
            <input
              type="file"
              id="estudiantesFile"
              accept=".xlsx"
              onChange={(e) => setEstudiantesFile(e.target.files[0])}
              required
            />
          </div>
          <div className="form-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/cursos')}
            >
              Cancel·lar
            </button>
            <button type="submit" className="create-button">
              Crear curs
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearCurso;
