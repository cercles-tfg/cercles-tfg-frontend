import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { getEquipoDetalle } from '../../services/Equipos_Api';
import {
  crearEvaluacionDetalle,
  getEvaluacionActivaId,
} from '../../services/Evaluaciones_Api';
import './EvaluacionPage.css';

const EvaluacionPage = () => {
  const { equipoId } = useParams();
  const navigate = useNavigate();
  const [equipo, setEquipo] = useState(null);
  const [puntuaciones, setPuntuaciones] = useState({});
  const [error, setError] = useState('');
  const [evaluacionId, setEvaluacionId] = useState(null);
  const token = localStorage.getItem('jwtToken');
  const estudianteId = parseInt(localStorage.getItem('id'), 10);

  useEffect(() => {
    const fetchEvaluacionActiva = async () => {
      try {
        const evaluacionId = await getEvaluacionActivaId(equipoId, token);
        setEvaluacionId(evaluacionId);
      } catch (error) {
        console.error('Error al obtener la evaluación activa:', error);
      }
    };

    fetchEvaluacionActiva();
  }, [equipoId, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipoData = await getEquipoDetalle(equipoId, token);
        setEquipo(equipoData);
        console.log('eq data ', equipoData);

        // Inicializar puntuaciones en 0 para cada estudiante
        const inicialPuntuaciones = equipoData.estudiantes.reduce(
          (acc, estudiante) => {
            acc[estudiante.id] = 0;
            return acc;
          },
          {},
        );
        setPuntuaciones(inicialPuntuaciones);
      } catch (error) {
        console.error('Error al cargar datos del equipo:', error);
      }
    };

    fetchData();
  }, [equipoId, token]);

  const handlePuntuacionChange = (id, value) => {
    setPuntuaciones((prev) => ({
      ...prev,
      [id]: parseInt(value, 10),
    }));
  };

  const handleEnviarEvaluacion = async () => {
    const sumaTotal = Object.values(puntuaciones).reduce((a, b) => a + b, 0);
    const numMiembros = equipo.estudiantes.length;
    const maxPuntos = numMiembros * 10;
    console.log('Evaluacion id ', evaluacionId);

    // Validar que cada estudiante tenga una puntuación
    if (Object.values(puntuaciones).some((p) => p === 0)) {
      setError('Tots els estudiants han de tenir una puntuació assignada.');
      return;
    }

    // Validar que la suma total sea igual al máximo permitido
    if (sumaTotal !== maxPuntos) {
      setError(
        `La suma de les puntuacions ha de ser igual a ${maxPuntos}. Actual: ${sumaTotal}.`,
      );
      return;
    }

    const confirmar = window.confirm(
      'Estàs segur/a de les teves avaluacions? No es podràn modificar un cop enviades.',
    );

    if (!confirmar) return;

    try {
      const detalles = Object.entries(puntuaciones).map(
        ([evaluadoId, puntos]) => ({
          evaluadorId: estudianteId,
          evaluadoId: parseInt(evaluadoId, 10),
          equipoId: equipoId,
          puntos,
        }),
      );
      console.log('detalles', detalles);
      await crearEvaluacionDetalle(evaluacionId, estudianteId, detalles, token);
      alert('Avaluació enviada correctament.');
      setTimeout(() => {
        navigate(`/equipos/${equipoId}`);
      }, 0);
    } catch (error) {
      console.error('Error al enviar la evaluación:', error);
      setError("Error al enviar l'avaluació.");
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (!equipo) return <p>Cargando...</p>;

  return (
    <div className="evaluacion-page">
      <Sidebar />
      <div className="evaluacion-content">
        <button className="back-button" onClick={handleBackClick}>
          Torna enrere
        </button>
        <h1>
          Avaluació per {equipo.nombreAsignatura} (Equip: {equipo.nombre})
        </h1>
        <h2>
          Recorda que la suma total de les xifres ha de ser equivalent al nombre
          de membres de l&apos;equip * 10
        </h2>

        {error && <div className="error-message">{error}</div>}

        <ul>
          {equipo.estudiantes.map((estudiante) => (
            <li key={estudiante.id}>
              {estudiante.nombre} {estudiante.apellido}
              <input
                type="number"
                min="1"
                max={equipo.estudiantes.length * 10}
                value={puntuaciones[estudiante.id] || ''}
                onChange={(e) =>
                  handlePuntuacionChange(estudiante.id, e.target.value)
                }
                className="puntuacion-input"
              />
            </li>
          ))}
        </ul>

        <button
          onClick={handleEnviarEvaluacion}
          className="enviar-evaluacion-button"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default EvaluacionPage;
