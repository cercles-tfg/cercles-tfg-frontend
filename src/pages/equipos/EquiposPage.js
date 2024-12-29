import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { getEquiposDeUsuario } from '../../services/Equipos_Api';
import './EquiposPage.css';

const COLORS = [
  '#6C9975',
  '#BB6365',
  '#785B75',
  '#5E807F',
  '#BA5A31',
  '#355c7d',
];
const ICONS = ['fa-users', 'fa-laptop', 'fa-tasks', 'fa-code', 'fa-book'];

const EquiposPage = () => {
  const navigate = useNavigate();
  const [equiposActivos, setEquiposActivos] = useState([]);
  const [equiposInactivos, setEquiposInactivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInactiveTeams, setShowInactiveTeams] = useState(false);

  const id = localStorage.getItem('id');
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchEquipos = async () => {
      if (!id) {
        setError('Usuario no autenticado.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const equiposData = await getEquiposDeUsuario(id, token);

        // Separar equipos por el estado del curso
        const activos = equiposData.filter((equipo) => equipo.cursoActivo);
        const inactivos = equiposData.filter((equipo) => !equipo.cursoActivo);

        setEquiposActivos(activos);
        setEquiposInactivos(inactivos);
      } catch (error) {
        setError('No se pudieron cargar los equipos.');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, [id, token]);

  const handleCardClick = (id) => {
    navigate(`/equipos/${id}`);
  };

  const handleCreateEquipoClick = () => {
    navigate('/equipos/crear');
  };

  if (loading) {
    return <div>Cargando equipos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="equipos-page">
      <Sidebar />
      <div className="content">
        <div className="header-container">
          <h1>Els meus equips</h1>
          <button className="create-button" onClick={handleCreateEquipoClick}>
            + Crear un nou equip
          </button>
        </div>
        <h2>Veure els meus equips de cursos encara actius</h2>
        <div className="cards-container">
          {equiposActivos.map((equipo, index) => (
            <div
              key={equipo.id}
              className="card"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
              onClick={() => handleCardClick(equipo.id)}
            >
              <div className="icon-container">
                <i className={`fas ${ICONS[index % ICONS.length]}`} />
              </div>
              <h2>{equipo.nombre}</h2>
              <p>
                <strong>Curso:</strong> {equipo.cursoNombre}
              </p>
            </div>
          ))}
        </div>
        <div
          className="toggle-inactive-teams"
          onClick={() => setShowInactiveTeams(!showInactiveTeams)}
        >
          Veure els meus equips passats de cursos inactius{' '}
          {showInactiveTeams ? '⬇' : '➡'}
        </div>
        {showInactiveTeams && (
          <div className="cards-container">
            {equiposInactivos.map((equipo, index) => (
              <div
                key={equipo.id}
                className="card"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                onClick={() => handleCardClick(equipo.id)}
              >
                <div className="icon-container">
                  <i className={`fas ${ICONS[index % ICONS.length]}`} />
                </div>
                <h2>{equipo.nombre}</h2>
                <p>
                  <strong>Curso:</strong> {equipo.cursoNombre}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquiposPage;
