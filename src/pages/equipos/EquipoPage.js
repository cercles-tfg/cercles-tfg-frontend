import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import {
  getEquipoDetalle,
  borrarEquipo,
  salirEquipo,
} from '../../services/Equipos_Api';
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
  const [showPopup, setShowPopup] = useState(false);
  const [popupAction, setPopupAction] = useState(''); // 'borrar' o 'salir'

  const token = localStorage.getItem('jwtToken');
  const idEstudiante = parseInt(localStorage.getItem('id'));

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

  const handlePopupConfirm = async () => {
    try {
      if (popupAction === 'borrar') {
        await borrarEquipo(id, token);
      } else if (popupAction === 'salir') {
        await salirEquipo(id, idEstudiante, token);
      }
      navigate('/equipos');
    } catch (error) {
      setError('Error al realizar la acción.');
    } finally {
      setShowPopup(false);
    }
  };

  const handlePopupCancel = () => {
    setShowPopup(false);
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

        <div className="action-buttons">
          <button
            className="delete-button"
            onClick={() => {
              setPopupAction('borrar');
              setShowPopup(true);
            }}
          >
            Borrar equip
          </button>
          <button
            className="leave-button"
            onClick={() => {
              setPopupAction('salir');
              setShowPopup(true);
            }}
          >
            Sortir d&apos;aquest equip
          </button>
        </div>

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

        {showPopup && (
          <div className="confirm-popup">
            <div className="popup-content">
              <h3>
                Estas segur/a que vols{' '}
                {popupAction === 'borrar'
                  ? 'borrar aquest equip'
                  : "sortir d'aquest equip"}
                ?
              </h3>
              <p className="popup-subtext">
                {popupAction === 'borrar'
                  ? "Es perdrà tota la informació d'aquest equip."
                  : "Perdràs totes les dades d'aquest equip."}
              </p>
              <button className="confirm-button" onClick={handlePopupConfirm}>
                Confirmar
              </button>
              <button className="cancel-button" onClick={handlePopupCancel}>
                Cancel·lar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipoPage;
