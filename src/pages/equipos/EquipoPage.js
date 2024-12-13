import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import {
  getEquipoDetalle,
  borrarEquipo,
  salirEquipo,
  borrarMiembros,
  añadirMiembros,
  getEstudiantesCurso,
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
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupAction, setPopupAction] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [estudiantesSinEquipo, setEstudiantesSinEquipo] = useState([]);
  const [miembrosAEliminar, setMiembrosAEliminar] = useState([]);
  const [miembrosAAgregar, setMiembrosAAgregar] = useState([]);
  const [showConfirmChangesPopup, setShowConfirmChangesPopup] = useState(false);

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
    navigate(-1);
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

  const handleEditToggle = async () => {
    if (!isEditing) {
      try {
        const estudiantesData = await getEstudiantesCurso(
          equipo.cursoId,
          token,
        );
        setEstudiantesSinEquipo(estudiantesData.sinEquipo || []);
      } catch (error) {
        console.error('Error al cargar estudiantes sin equipo:', error);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleRemoveMember = (estudianteId) => {
    if (!miembrosAEliminar.includes(estudianteId)) {
      setMiembrosAEliminar((prev) => [...prev, estudianteId]);
    }
  };

  const handleAddMember = (estudianteId) => {
    if (!miembrosAAgregar.includes(estudianteId)) {
      setMiembrosAAgregar((prev) => [...prev, estudianteId]);
    }
  };

  const handleSaveChanges = () => {
    setShowConfirmChangesPopup(true);
  };

  const handleConfirmChanges = async () => {
    try {
      if (miembrosAEliminar.length > 0) {
        await borrarMiembros(
          equipo.id,
          { estudiantesIds: miembrosAEliminar },
          token,
        );
      }
      if (miembrosAAgregar.length > 0) {
        await añadirMiembros(
          equipo.id,
          { estudiantesIds: miembrosAAgregar },
          token,
        );
      }
      setMiembrosAEliminar([]);
      setMiembrosAAgregar([]);
      setIsEditing(false);
      const equipoData = await getEquipoDetalle(id, token);
      setEquipo(equipoData);
    } catch (error) {
      setError('Error al guardar los cambios.');
      console.error(error);
    } finally {
      setShowConfirmChangesPopup(false);
    }
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
          {isEditing ? (
            <>
              <div className="edit-members">
                <h3>Estudiants sense equip</h3>
                <div className="students-list">
                  {estudiantesSinEquipo.map((estudiante) => (
                    <div key={estudiante.id} className="student-item">
                      <span>{estudiante.nombre}</span>
                      <button
                        className="add-member-button"
                        onClick={() => handleAddMember(estudiante.id)}
                      >
                        Afegir
                      </button>
                    </div>
                  ))}
                </div>
                <h3>Eliminar membres</h3>
                <div className="students-list">
                  {equipo.estudiantes.map((miembro) => (
                    <div key={miembro.id} className="student-item">
                      <span>{miembro.nombre}</span>
                      <button
                        className="remove-member-button"
                        onClick={() => handleRemoveMember(miembro.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
                <div className="edit-actions">
                  <button
                    className="confirm-button"
                    onClick={handleSaveChanges}
                  >
                    Fer canvis
                  </button>
                  <button className="cancel-button" onClick={handleEditToggle}>
                    Cancel·lar
                  </button>
                </div>
              </div>
            </>
          ) : (
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
              <button className="edit-button" onClick={handleEditToggle}>
                ✏️ Editar
              </button>
            </div>
          )}
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
        {showConfirmChangesPopup && (
          <div className="confirm-popup">
            <div className="popup-content">
              <h3>Estàs segur/a de que vols fer aquests canvis?</h3>
              <p>Aquests canvis no es poden desfer.</p>
              <button className="confirm-button" onClick={handleConfirmChanges}>
                Confirmar
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowConfirmChangesPopup(false)}
              >
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
