import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getEvaluacionesDetalle,
  getEvaluacionesPorEquipo,
  getIdsEvaluaciones,
} from '../../services/Evaluaciones_Api';
import { getEquipoDetalle } from '../../services/Equipos_Api';
import Sidebar from '../../components/common/Sidebar';
import './EvaluacionesGeneralesPage.css';

const EvaluacionesGeneralesPage = () => {
  const { equipoId } = useParams();
  const token = localStorage.getItem('jwtToken');
  const [numeroEvaluaciones, setNumeroEvaluaciones] = useState(3); // Default por si acaso
  const [evaluacionesIds, setEvaluacionesIds] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [medias, setMedias] = useState([]);
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const equipoData = await getEquipoDetalle(equipoId, token);
        setEquipo(equipoData);

        const evaluacionesIds = await getIdsEvaluaciones(
          equipoData.cursoId,
          token,
        );
        setNumeroEvaluaciones(evaluacionesIds.length);
        setEvaluacionesIds(evaluacionesIds);

        const detallesData = await getEvaluacionesDetalle(
          equipoId,
          token,
          evaluacionesIds,
        );

        const mediasData = await getEvaluacionesPorEquipo(equipoId, token);
        console.log('equipo ', detallesData);
        setDetalles(detallesData);
        setMedias(mediasData);
      } catch (error) {
        setError('Error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchDatos();
  }, [equipoId, token]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  if (!equipo) return <p>No se pudo cargar la información del equipo.</p>;

  // Ordenar estudiantes alfabéticamente por nombre
  const sortedEstudiantes = equipo.estudiantes
    .slice() // Crear una copia del array para no modificar el original
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  // Crear el mapeo de IDs a nombres
  const idToName = sortedEstudiantes.reduce((map, estudiante) => {
    map[estudiante.id] = estudiante.nombre;
    return map;
  }, {});

  // Obtener los IDs en el orden alfabético
  const estudiantes = sortedEstudiantes.map((est) => est.id);

  const handleBackClick = () => {
    navigate(`/equipos/${equipoId}`);
  };

  return (
    <div className="evaluaciones-page">
      <Sidebar />
      <div className="evaluacion-content">
        <button className="back-button" onClick={handleBackClick}>
          Torna enrere
        </button>
        <h1>Detalls de les dades d&apos;avaluacions</h1>

        {/* Tabla de medias */}
        <h2>Mitjanes generals</h2>
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
                {estudiantes.map((id) => {
                  const media = medias.find(
                    (media) => media.estudianteId === id,
                  );
                  const valor = media?.mediaGeneralDeCompañeros;
                  return (
                    <td
                      key={`media-general-companeros-${id}`}
                      className={
                        valor === undefined
                          ? 'na-value'
                          : valor > 11
                            ? 'high-value'
                            : valor < 9
                              ? 'low-value'
                              : ''
                      }
                    >
                      {valor?.toFixed(2) || 'N/A'}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td>Autoavaluació</td>
                {estudiantes.map((id) => {
                  const media = medias.find(
                    (media) => media.estudianteId === id,
                  );
                  const valor = media?.mediaGeneralPropia;
                  return (
                    <td
                      key={`media-general-propia-${id}`}
                      className={
                        valor === undefined
                          ? 'na-value'
                          : valor > 11
                            ? 'high-value'
                            : valor < 9
                              ? 'low-value'
                              : ''
                      }
                    >
                      {valor?.toFixed(2) || 'N/A'}
                    </td>
                  );
                })}
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

        <h2>Detalls per avaluació</h2>
        {evaluacionesIds.map((realEvalId, index) => {
          const evalDetalles = detalles.map((detalle) => {
            const evaluacion = detalle.evaluaciones.find(
              (evaluacion) => evaluacion.evaluacionId === realEvalId,
            );

            return {
              evaluadoId: detalle.evaluadoId,
              detalles: evaluacion ? evaluacion.detalles : [],
            };
          });

          console.log(
            `Detalles procesados para evaluacion realEvalId ${realEvalId}:`,
            evalDetalles,
          );

          return (
            <div key={`evaluacion-${realEvalId}`} className="evaluacion-tabla">
              <h3>Avaluació {index + 1}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Avaluador / Avaluat</th>
                    {estudiantes.map((id) => (
                      <th key={`evaluado-${realEvalId}-${id}`}>
                        {idToName[id]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((evaluadorId) => (
                    <tr key={`evaluador-${realEvalId}-${evaluadorId}`}>
                      <td>{idToName[evaluadorId]}</td>
                      {estudiantes.map((evaluadoId) => {
                        const evaluacion = evalDetalles.find(
                          (detalle) => detalle.evaluadoId === evaluadoId,
                        );
                        const puntuacion = evaluacion?.detalles.find(
                          (detalle) => detalle.evaluadorId === evaluadorId,
                        )?.puntuacion;

                        const isDiagonal = evaluadorId === evaluadoId;

                        return (
                          <td
                            key={`detalle-${realEvalId}-${evaluadorId}-${evaluadoId}`}
                            className={isDiagonal ? 'diagonal-highlight' : ''}
                          >
                            {puntuacion ? puntuacion.toFixed(2) : 'N/A'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  <tr>
                    <td>
                      <strong>Mitjana de l&apos;avaluació dels companys</strong>
                    </td>
                    {estudiantes.map((evaluadoId) => {
                      const mediaCompaneros = medias
                        .find(
                          (media) =>
                            media.estudianteId === evaluadoId &&
                            media.mediaPorEvaluacion.some(
                              (evalMedia) =>
                                evalMedia.evaluacionId === realEvalId,
                            ),
                        )
                        ?.mediaPorEvaluacion.find(
                          (evalMedia) => evalMedia.evaluacionId === realEvalId,
                        )?.mediaDeCompañeros;

                      const cellClass = [
                        mediaCompaneros > 11 ? 'high-value' : '',
                        mediaCompaneros < 9 ? 'low-value' : '',
                      ]
                        .filter(Boolean)
                        .join(' ');

                      return (
                        <td
                          key={`mitjana-${realEvalId}-${evaluadoId}`}
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
