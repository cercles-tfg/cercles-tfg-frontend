import React, { useState } from 'react';
import './CrearCurso.css';

const CrearCurso = ({ onCancel }) => {
  const currentYear = new Date().getFullYear();
  const [nombreAsignatura, setNombreAsignatura] = useState('');
  const [añoInicio, setAñoInicio] = useState(currentYear);
  const [cuatrimestre, setCuatrimestre] = useState('1');
  const [actiu, setActiu] = useState('true');
  const [selectedProfesores, setSelectedProfesores] = useState([]);
  const [estudiantesFile, setEstudiantesFile] = useState(null);

  // Lista de profesores hardcodeada (esto luego se obtendrá del backend)
  const profesoresDisponibles = [
    { id: 1, nombre: 'Professor 1' },
    { id: 2, nombre: 'Professor 2' },
    { id: 3, nombre: 'Professor 3' },
  ];

  const handleProfesorClick = (id) => {
    setSelectedProfesores((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((profId) => profId !== id)
        : [...prevSelected, id],
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Crear un objeto con los datos del curso
    const cursoData = {
      nombreAsignatura,
      añoInicio,
      cuatrimestre,
      actiu: actiu === 'true',
      profesores: selectedProfesores,
      estudiantesFile, // Este archivo será procesado luego
    };

    // Enviar los datos del curso (aún falta implementar la lógica para conectarse al backend)
    console.log('Datos del curso:', cursoData);
    alert('Curso creado exitosamente! (Lógica de backend pendiente)');
  };

  return (
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
            {Array.from({ length: 25 }, (_, i) => currentYear + i).map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ),
            )}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cuatrimestre">Cuatrimestre</label>
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
          <label htmlFor="actiu">Actiu</label>
          <select
            id="actiu"
            value={actiu}
            onChange={(e) => setActiu(e.target.value)}
            required
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
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
            Subir document d&apos;estudiants
          </label>
          <input
            type="file"
            id="estudiantesFile"
            accept=".csv, .xlsx, .xls"
            onChange={(e) => setEstudiantesFile(e.target.files[0])}
          />
        </div>
        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel·lar
          </button>
          <button type="submit" className="create-button">
            Crear curs
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearCurso;
