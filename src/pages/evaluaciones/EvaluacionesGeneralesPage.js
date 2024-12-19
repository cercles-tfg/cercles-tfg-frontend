import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getEvaluacionesDetalle,
  getEvaluacionesPorEquipo,
} from '../../services/Evaluaciones_Api';
import Sidebar from '../../components/common/Sidebar';
import './EvaluacionesGeneralesPage.css';

const EvaluacionesGeneralesPage = () => {
  const { equipoId } = useParams();
  const token = localStorage.getItem('jwtToken');
  const [detalles, setDetalles] = useState([]);
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        setLoading(true);

        const detallesData = await getEvaluacionesDetalle(
          equipoId,
          token,
          [1, 2, 3],
        );
        setDetalles(detallesData);

        const mediasData = await getEvaluacionesPorEquipo(equipoId, token);
        setMedias(mediasData);
      } catch (error) {
        console.error('Error al cargar las evaluaciones:', error);
        setError('Error al carregar les dades.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluaciones();
  }, [equipoId, token]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const estudiantes = medias.map((media) => media.estudianteId);

  return (
    <div className="evaluaciones-page">
      <Sidebar />
      <div className="content">
        <h1>Dades d&apos;avaluacions</h1>

        {/* Tabla con medias generales */}
        <h2>Detalls per avaluació</h2>
        {medias.length > 0 ? (
          <table className="tabla-medias-generales">
            <thead>
              <tr>
                <th>Companys</th>
                {estudiantes.map((id) => (
                  <th key={`media-general-${id}`}>E{id}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mitjana entre companys</td>
                {medias.map((media) => (
                  <td key={`media-general-companeros-${media.estudianteId}`}>
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
                    <th>Estudiant / Evaluat</th>
                    {estudiantes.map((id) => (
                      <th key={`evaluado-${evalId}-${id}`}>E{id}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((evaluadorId) => (
                    <tr key={`evaluador-${evalId}-${evaluadorId}`}>
                      <td>E{evaluadorId}</td>
                      {estudiantes.map((evaluadoId) => {
                        const evaluacion = evalDetalles.find(
                          (detalle) => detalle.evaluadoId === evaluadoId,
                        );
                        const puntuacion = evaluacion?.detalles.find(
                          (detalle) => detalle.evaluadorId === evaluadorId,
                        )?.puntuacion;

                        return (
                          <td
                            key={`detalle-${evalId}-${evaluadorId}-${evaluadoId}`}
                          >
                            {puntuacion ? puntuacion.toFixed(2) : 'N/A'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <td>Mitjana</td>
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

                      return (
                        <td key={`mitjana-${evalId}-${evaluadoId}`}>
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
