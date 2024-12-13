import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { getEquiposDeUsuario } from '../../services/Equipos_Api';
import './EquiposPage.css';

// Colores e íconos para las tarjetas
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
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener el ID y token del localStorage
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
        setEquipos(equiposData);
      } catch (error) {
        setError('No se pudieron cargar los equipos.');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, [id, token]);

  const handleCardClick = (id) => {
    navigate(`/equipos/${id}`); // Redirige a la página de detalles del equipo
  };

  const handleCreateEquipoClick = () => {
    navigate('/equipos/crear'); // Redirige a la página de creación de equipos
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
        <div className="cards-container">
          {equipos.map((equipo, index) => (
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
                <strong>Curso:</strong> {equipo.cursoId}
              </p>
              <p>
                <strong>Evaluador:</strong> {equipo.evaluadorId}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EquiposPage;
