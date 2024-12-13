import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { getEquipoDetalle } from '../../services/Equipos_Api';
import './EquipoPage.css';

const COLORS = [
  '#6C9975',
  '#BB6365',
  '#785B75',
  '#5E807F',
  '#BA5A31',
  '#355c7d',
];

const EquipoPage = () => {
  const { id } = useParams(); // Obtener el ID del equipo desde la URL
  const navigate = useNavigate();
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchEquipoDetalle = async () => {
      try {
        setLoading(true);
        const equipoData = await getEquipoDetalle(id, token);
        setEquipo(equipoData);
      } catch (error) {
        setError("No se pudo carregar la informació de l'equip.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipoDetalle();
  }, [id, token]);

  const handleBackClick = () => {
    navigate(-1); // Regresa a la página anterior
  };

  if (loading) {
    return <div>Carregant detalls de l&apos;equip...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!equipo) {
    return <div>No s&apos;ha trobat la informació de l&apos;equip.</div>;
  }

  return (
    <div className="equipo-page">
      <Sidebar />
      <div className="equipo-content">
        <button className="back-button" onClick={handleBackClick}>
          Torna enrere
        </button>
        <h1 className="equipo-title">{equipo.nombre}</h1>
        <div className="equipo-info">
          <div className="equipo-info-content">
            <p>
              <strong>Curs:</strong> {equipo.nombreAsignatura} (
              {equipo.añoInicio})
            </p>
            <p>
              <strong>Quatrimestre:</strong> {equipo.cuatrimestre}
            </p>
            <p>
              <strong>Actiu:</strong> {equipo.activo ? 'Sí' : 'No'}
            </p>
          </div>
        </div>

        <div className="equipo-section">
          <h2>Professor avaluador</h2>
          <p>
            <strong>Nom:</strong> {equipo.evaluadorNombre}
          </p>
          <p>
            <strong>Correu:</strong> {equipo.evaluadorCorreo}
          </p>
        </div>

        <div className="equipo-section">
          <h2>Membres de l&apos;equip</h2>
          <div className="equipo-members">
            {equipo.estudiantes.map((estudiante, index) => (
              <div
                key={estudiante.id}
                className="member-circle"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              >
                <i className="fas fa-user member-icon"></i>
                <div className="member-details">
                  <p className="member-name">{estudiante.nombre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipoPage;
