import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getEquipoDetalle, getMetrics } from '../../services/Equipos_Api';
import { getEvaluacionesPorEquipo } from '../../services/Evaluaciones_Api';
import Sidebar from '../../components/common/Sidebar';
import './DatosGeneralesEquipoPage.css';
import loadingGif from '../../assets/images/15-28-43-29_512.webp';

const DatosGeneralesEquipoPage = () => {
  const { equipoId } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const organizacion = queryParams.get('org'); // Organización de GitHub
  const estudiantesIds = queryParams.get('estudiantesIds')?.split(',') || [];
  const token = localStorage.getItem('jwtToken');
  const [medias, setMedias] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [equipo, setEquipo] = useState(null);
  const [loadingEquipo, setLoadingEquipo] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipoDetalle = async () => {
      try {
        setLoadingEquipo(true);
        const equipoData = await getEquipoDetalle(equipoId, token);
        setEquipo(equipoData);
      } catch (error) {
        console.error('Error en fetchEquipoDetalle:', error.message);
        setError("No es pot carregar la informació de l'equip.");
      } finally {
        setLoadingEquipo(false);
      }
    };

    fetchEquipoDetalle();
  }, [equipoId, token]);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!organizacion || estudiantesIds.length === 0) return;

      try {
        setLoadingMetrics(true);
        const metricsData = await getMetrics(
          organizacion,
          estudiantesIds,
          token,
        );
        setMetrics(metricsData.userMetrics);
      } catch (error) {
        console.error('Error en fetchMetrics:', error.message);
        if (
          error.response?.status === 403 &&
          error.response?.data?.message?.includes('API rate limit exceeded')
        ) {
          setError(
            "Has arribat al límit de sol·licituds de l'API de GitHub. Si us plau, torna a intentar-ho més tard!",
          );
        } else {
          setError('Error al carregar les mètriques.');
        }
      } finally {
        setLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, [organizacion, estudiantesIds, token]);

  if (loadingEquipo || loadingMetrics) {
    return (
      <div className="loading-container">
        <img src={loadingGif} alt="Cargando..." className="loading-gif" />
        <p className="loading-text">
          Carregant les dades... Si us plau, espereu! ⏳
        </p>
      </div>
    );
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

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
    navigate(-1);
  };

  return (
    <div className="datos-generales-page">
      <Sidebar />
      <div className="general-content">
        <button className="back-button" onClick={handleBackClick}>
          Torna enrere
        </button>
        <h1>📊 Dades generals de l&apos;equip</h1>

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

        {/* Primera Tabla de métricas */}
        <h3>Mètriques de les contribucions dels usuaris</h3>
        {metrics.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Dades</th>
                {metrics.map((m) => (
                  <th key={m.username}>{m.nombre}</th>
                ))}
                <th className="mitjana-column">Mitjana</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#Commits</td>
                {metrics.map((m) => (
                  <td key={`commits-${m.username}`}>{m.totalCommits}</td>
                ))}
                <td className="mitjana-column">
                  {(
                    metrics.reduce((sum, m) => sum + m.totalCommits, 0) /
                    metrics.length
                  ).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>#Línies ++</td>
                {metrics.map((m) => (
                  <td key={`linesAdded-${m.username}`}>{m.linesAdded}</td>
                ))}
                <td className="mitjana-column">
                  {(
                    metrics.reduce((sum, m) => sum + m.linesAdded, 0) /
                    metrics.length
                  ).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>#Línies --</td>
                {metrics.map((m) => (
                  <td key={`linesRemoved-${m.username}`}>{m.linesRemoved}</td>
                ))}
                <td className="mitjana-column">
                  {(
                    metrics.reduce((sum, m) => sum + m.linesRemoved, 0) /
                    metrics.length
                  ).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>#PRs</td>
                {metrics.map((m) => (
                  <td key={`prs-${m.username}`}>{m.pullRequestsCreated}</td>
                ))}
                <td className="mitjana-column">
                  {(
                    metrics.reduce((sum, m) => sum + m.pullRequestsCreated, 0) /
                    metrics.length
                  ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No hi ha dades disponibles de contribucions.</p>
        )}

        {/* Segunda Tabla de métricas */}
        <h3>Mètriques d&apos;històries d&apos;usuari i tasques</h3>
        {metrics.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Dades</th>
                {metrics.map((m) => (
                  <th key={m.username}>{m.nombre}</th>
                ))}
                <th className="mitjana-column">Mitjana</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Històries d&apos;usuari</td>
                {metrics.map((m) => (
                  <td key={`userStories-${m.username}`}>{m.userStories}</td>
                ))}
                <td className="mitjana-column">
                  {(
                    metrics.reduce((sum, m) => sum + m.userStories, 0) /
                    metrics.length
                  ).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>Històries d&apos;usuari tancades</td>
                {metrics.map((m) => (
                  <td key={`userStoriesClosed-${m.username}`}>
                    {m.userStoriesClosed}
                  </td>
                ))}
                <td className="mitjana-column">
                  {(
                    metrics.reduce((sum, m) => sum + m.userStoriesClosed, 0) /
                    metrics.length
                  ).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>Tasques</td>
                {metrics.map((m) => (
                  <td key={`tasks-${m.username}`}>{m.tasks}</td>
                ))}
                <td className="mitjana-column">
                  {(
                    metrics.reduce((sum, m) => sum + m.tasks, 0) /
                    metrics.length
                  ).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>Tasques tancades</td>
                {metrics.map((m) => (
                  <td key={`tasksClosed-${m.username}`}>{m.tasksClosed}</td>
                ))}
                <td className="mitjana-column">
                  {(
                    metrics.reduce((sum, m) => sum + m.tasksClosed, 0) /
                    metrics.length
                  ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>
            No hi ha dades disponibles de històries d&apos;usuari i tasques.
          </p>
        )}
      </div>
    </div>
  );
};

export default DatosGeneralesEquipoPage;
