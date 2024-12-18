import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMetrics } from '../../services/Equipos_Api';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import Sidebar from '../../components/common/Sidebar';
import './EquipoMetricsPage.css';
import loadingGif from '../../assets/images/15-28-43-29_512.webp';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

const EquipoMetricsPage = () => {
  const [searchParams] = useSearchParams();
  const org = searchParams.get('org');
  const estudiantesIds = searchParams
    .get('estudiantes')
    ?.split(',')
    .map(Number);
  const token = localStorage.getItem('jwtToken');

  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval;

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setProgress(0);

        // Ciclo de la barra de progreso
        interval = setInterval(() => {
          setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
        }, 50);

        // Validación de parámetros
        if (!org || !estudiantesIds || estudiantesIds.length === 0) {
          throw new Error('Faltan parámetros o estudiantes.');
        }

        // Llamada al backend
        const data = await getMetrics(org, estudiantesIds, token);
        setMetrics(data);

        // Finalizar carga
        clearInterval(interval);
        setProgress(100);
      } catch (error) {
        console.error(error.message);
        setError('Error al obtener las métricas.');
      } finally {
        clearInterval(interval);
        setLoading(false);
      }
    };

    fetchMetrics();

    return () => clearInterval(interval);
  }, [org, estudiantesIds, token]);

  if (loading) {
    return (
      <div className="loading-container">
        <h3>Carregant mètriques...</h3>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <img src={loadingGif} alt="Cargando..." className="loading-gif" />
        <p className="loading-text">
          Obtenint les dades... Si us plau, espereu! ⏳
        </p>
      </div>
    );
  }

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="metrics-page">
      <Sidebar />
      <div className="metrics-content">
        <h1>Mètriques de GitHub</h1>

        {/* Tabla de métricas */}
        <table>
          <thead>
            <tr>
              <th>Dades</th>
              {metrics.map((m) => (
                <th key={m.username}>{m.nombre}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#Commits</td>
              {metrics.map((m) => (
                <td key={`commits-${m.username}`}>{m.totalCommits}</td>
              ))}
            </tr>
            <tr>
              <td>#Línies ++</td>
              {metrics.map((m) => (
                <td key={`linesAdded-${m.username}`}>{m.linesAdded}</td>
              ))}
            </tr>
            <tr>
              <td>#Línies --</td>
              {metrics.map((m) => (
                <td key={`linesRemoved-${m.username}`}>{m.linesRemoved}</td>
              ))}
            </tr>
            <tr>
              <td>#PRs</td>
              {metrics.map((m) => (
                <td key={`prs-${m.username}`}>{m.pullRequestsCreated}</td>
              ))}
            </tr>
          </tbody>
        </table>

        {/* Gráfico Circular: Commits */}
        <h2>Distribució de commits</h2>
        <div className="chart-container">
          <Pie
            data={{
              labels: metrics.map((m) => m.nombre),
              datasets: [
                {
                  data: metrics.map((m) => m.totalCommits),
                  backgroundColor: [
                    '#6C9975',
                    '#BB6365',
                    '#785B75',
                    '#5E807F',
                    '#BA5A31',
                    '#355C7D',
                    '#F4A261',
                    '#E76F51',
                    '#2A9D8F',
                    '#264653',
                    '#A8DADC',
                    '#457B9D',
                    '#E9C46A',
                    '#F4A3B3',
                    '#D4A5A5',
                    '#B5838D',
                  ],
                },
              ],
            }}
            options={{ maintainAspectRatio: false }}
            width={300}
            height={300}
          />
        </div>

        {/* Gráfico de Barras */}
        <h2>Línies de codi afegides i eliminades</h2>
        <div className="chart-container">
          <Bar
            data={{
              labels: metrics.map((m) => m.nombre),
              datasets: [
                {
                  label: 'Línies afegides',
                  data: metrics.map((m) => m.linesAdded),
                  backgroundColor: '#6C9975',
                },
                {
                  label: 'Línies eliminades',
                  data: metrics.map((m) => m.linesRemoved),
                  backgroundColor: '#BB6365',
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
            width={300}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default EquipoMetricsPage;
