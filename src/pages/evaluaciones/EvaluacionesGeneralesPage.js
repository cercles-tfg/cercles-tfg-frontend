import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getEvaluacionesDetalle,
  getEvaluacionesPorEquipo,
} from '../../services/Evaluaciones_Api';
import { getEquipoDetalle } from '../../services/Equipos_Api';
import Sidebar from '../../components/common/Sidebar';
import './EvaluacionesGeneralesPage.css';

const EvaluacionesGeneralesPage = () => {
  const { equipoId } = useParams();
  const token = localStorage.getItem('jwtToken');
  const [detalles, setDetalles] = useState([]);
  const [medias, setMedias] = useState([]);
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipoDetalle = async () => {
      try {
        const equipoData = await getEquipoDetalle(equipoId, token);
        setEquipo(equipoData);
      } catch (error) {
        setError('No se pudo cargar la información del equipo.');
      }
    };

    const fetchEvaluaciones = async () => {
      try {
        const detallesData = await getEvaluacionesDetalle(
          equipoId,
          token,
          [1, 2, 3],
        );
        const mediasData = await getEvaluacionesPorEquipo(equipoId, token);
        setDetalles(detallesData);
        setMedias(mediasData);
      } catch (error) {
        setError('Error al cargar las evaluaciones.');
      }
    };

    setLoading(true);
    Promise.all([fetchEquipoDetalle(), fetchEvaluaciones()])
      .catch((error) => setError('Error al cargar los datos.'))
      .finally(() => setLoading(false));
  }, [equipoId, token]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  if (!equipo) return <p>No se pudo cargar la información del equipo.</p>;

  // Crear un mapeo de IDs a nombres de estudiantes
  const idToName = equipo.estudiantes.reduce((map, estudiante) => {
    map[estudiante.id] = estudiante.nombre;
    return map;
  }, {});

  const estudiantes = medias.map((media) => media.estudianteId);

  return (
    <div className="evaluaciones-page">
      <Sidebar />
      <div className="content">
        <h1>Dades d&apos;avaluacions</h1>

        {/* Tabla con medias generales */}
        <h2>Mitjanes Generals</h2>
        {medias.length > 0 ? (
          <table className="tabla-medias-generales">
            <thead>
              <tr>
                <th>Companys</th>
                {estudiantes.map((id) => (
                  <th key={`media-general-${id}`}>{idToName[id]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mitjana entre companys</td>
                {medias.map((media) => (
                  <td
                    key={`media-general-companeros-${media.estudianteId}`}
                    className={
                      media.mediaGeneralDeCompañeros > 11
                        ? 'high-value'
                        : media.mediaGeneralDeCompañeros < 9
                          ? 'low-value'
                          : ''
                    }
                  >
                    {media.mediaGeneralDeCompañeros?.toFixed(2) || 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Autoavaluació</td>
                {medias.map((media) => (
                  <td key={`media-general-propia-${media.estudianteId}`}>
                    {media.mediaGeneralPropia?.toFixed(2) || 'N/A'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No hi ha dades disponibles per a les mitjanes generals.</p>
        )}

        {/* Índice de colores */}
        <div className="indice-colores">
          <div className="indice-item">
            <div className="indice-cuadro high-value"></div>
            <span>Molt per sobre (&gt; 11)</span>
          </div>
          <div className="indice-item">
            <div className="indice-cuadro low-value"></div>
            <span>Molt per sota (&lt; 9)</span>
          </div>
        </div>

        {/* Tablas por evaluación */}
        <h2>Detalls per avaluació</h2>
        {[1, 2, 3].map((evalId) => {
          const evalDetalles = detalles
            .map((detalle) => ({
              evaluadoId: detalle.evaluadoId,
              detalles:
                detalle.evaluaciones.find(
                  (evaluacion) => evaluacion.evaluacionId === evalId,
                )?.detalles || [],
            }))
            .filter((detalle) => detalle.detalles.length > 0);

          return (
            <div key={`evaluacion-${evalId}`} className="evaluacion-tabla">
              <h3>Avaluació {evalId}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Estudiant Evaluador / Evaluat</th>
                    {estudiantes.map((id) => (
                      <th key={`evaluado-${evalId}-${id}`}>{idToName[id]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((evaluadorId) => (
                    <tr key={`evaluador-${evalId}-${evaluadorId}`}>
                      <td>{idToName[evaluadorId]}</td>
                      {estudiantes.map((evaluadoId) => {
                        const evaluacion = evalDetalles.find(
                          (detalle) => detalle.evaluadoId === evaluadoId,
                        );
                        const puntuacion = evaluacion?.detalles.find(
                          (detalle) => detalle.evaluadorId === evaluadorId,
                        )?.puntuacion;

                        // Resaltar diagonal
                        const isDiagonal = evaluadorId === evaluadoId;

                        return (
                          <td
                            key={`detalle-${evalId}-${evaluadorId}-${evaluadoId}`}
                            className={isDiagonal ? 'diagonal-highlight' : ''}
                          >
                            {puntuacion ? puntuacion.toFixed(2) : 'N/A'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Fila Mitjana */}
                  <tr>
                    <td>Mitjana de l&apos;avaluació dels companys</td>
                    {estudiantes.map((evaluadoId) => {
                      const mediaCompaneros = medias
                        .find(
                          (media) =>
                            media.estudianteId === evaluadoId &&
                            media.mediaPorEvaluacion.some(
                              (evalMedia) => evalMedia.evaluacionId === evalId,
                            ),
                        )
                        ?.mediaPorEvaluacion.find(
                          (evalMedia) => evalMedia.evaluacionId === evalId,
                        )?.mediaDeCompañeros;

                      const cellClass = [
                        mediaCompaneros > 11 ? 'high-value' : '',
                        mediaCompaneros < 9 ? 'low-value' : '',
                      ]
                        .filter(Boolean)
                        .join(' ');

                      return (
                        <td
                          key={`mitjana-${evalId}-${evaluadoId}`}
                          className={cellClass}
                        >
                          {mediaCompaneros ? mediaCompaneros.toFixed(2) : 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvaluacionesGeneralesPage;
