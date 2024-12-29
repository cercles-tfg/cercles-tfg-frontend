import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, Route, Routes } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import {
  getEquipoDetalle,
  borrarEquipo,
  salirEquipo,
  borrarMiembros,
  añadirMiembros,
  getEstudiantesCurso,
  obtenerUrlInstalacion,
  validarOrganizacion,
  confirmarOrganizacion,
} from '../../services/Equipos_Api';
import {
  isEvaluacionActiva,
  isEvaluacionRealizada,
} from '../../services/Evaluaciones_Api';

import './EquipoPage.css';
import EquipoMetricsPage from './EquipoMetricsPage';

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
  const [gitOrgUrl, setGitOrgUrl] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const [githubAppInstalada, setGithubAppInstalada] = useState(false);
  const [comprobandoValidacion, setComprobandoValidacion] = useState(false);
  const [gitOrganizacion, setGitOrganizacion] = useState(null);
  const [estIds, setEstIds] = useState(null);

  const token = localStorage.getItem('jwtToken');
  const idEstudiante = parseInt(localStorage.getItem('id'));
  const isProfesor = localStorage.getItem('rol') === 'Profesor';
  const [evaluacionActiva, setEvaluacionActiva] = useState(false);
  const [evaluacionRealizada, setEvaluacionRealizada] = useState(false);

  useEffect(() => {
    const fetchEquipoDetalle = async () => {
      try {
        setLoading(true);
        const equipoData = await getEquipoDetalle(id, token);
        console.log('data ', equipoData);

        setEquipo(equipoData);
        const estudiantesIds = equipoData.estudiantes.map(
          (estudiante) => estudiante.id,
        );
        setEstIds(estudiantesIds);
        setGithubAppInstalada(equipoData.githubAppInstalada);
        setGitOrganizacion(equipoData.gitOrganizacion);
      } catch (error) {
        setError("No se pudo carregar la informació de l'equip.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipoDetalle();
  }, [id, token]);

  useEffect(() => {
    if (!equipo) return;
    const fetchEvaluacionStatus = async () => {
      try {
        const activa = await isEvaluacionActiva(equipo.id, token);
        const realizada = await isEvaluacionRealizada(
          equipo.id,
          idEstudiante,
          token,
        );
        console.log('realizada ', realizada);

        setEvaluacionActiva(activa);
        setEvaluacionRealizada(realizada);
      } catch (error) {
        console.error('Error al comprobar el estado de la evaluación:', error);
      }
    };

    fetchEvaluacionStatus();
  }, [equipo]);

  /*/ Redirigir a la instalación de GitHub App
  const handleInstallGitHubApp = async () => {
    try {
      const instalacionUrl = await obtenerUrlInstalacion(equipo.id, token);
      window.location.href = instalacionUrl;
    } catch (error) {
      setError('Error al obtener la URL de instalación.');
    }
  };*/

  // Validar la organización
  const handleValidateGitOrg = async () => {
    try {
      setComprobandoValidacion(true); // Activar la validación
      const resultados = await validarOrganizacion(
        equipo.evaluadorId,
        equipo.estudiantes.map((miembro) => miembro.id),
        gitOrgUrl,
        token,
      );
      setValidationResults(resultados);
    } catch (error) {
      setError('Error al validar la organización.');
    }
  };

  // Confirmar la organización si todos los checks son correctos
  const handleConfirmGitOrg = async () => {
    try {
      await confirmarOrganizacion(equipo.id, gitOrgUrl, token);
      alert('Organización confirmada con éxito.');
      const updatedEquipo = await getEquipoDetalle(id, token);
      setEquipo(updatedEquipo);
      setGitOrganizacion(updatedEquipo.gitOrganizacion);
    } catch (error) {
      setError('Error al confirmar la organización.');
    }
  };

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

  if (!equipo.activo) {
    return (
      <div className="inactive-overlay">
        <Sidebar />
        <div className="inactive-popup">
          <h2>Els curs al que pertany aquest equip ja no està disponible.</h2>
          <button className="back-button" onClick={handleBackClick}>
            Torna enrere
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="equipo-page">
      <Sidebar />
      <div className="equipo-content">
        <button className="back-button" onClick={handleBackClick}>
          Torna enrere
        </button>
        <h1 className="equipo-title">{equipo.nombre}</h1>
        {!isProfesor ? (
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
        ) : null}
        <div className="equipo-info">
          <div className="equipo-info-content">
            <p>
              <strong>Curs:</strong> {equipo.nombreAsignatura} (
              {equipo.añoInicio})
            </p>
            <p>
              <strong>Quadrimestre:</strong> {equipo.cuatrimestre}
            </p>
          </div>
        </div>
        <div className="equipo-section">
          <h2>Altres funcionalitats</h2>
          {isProfesor ? (
            <>
              <div className="metrics-links-container">
                {/* Link a métricas de GitHub */}
                {equipo.gitOrganizacion ? (
                  <Link
                    to={`/equipo/${id}/metrics?org=${equipo.gitOrganizacion}&estudiantesIds=${estIds.join(',')}`}
                    className="metrics-link"
                  >
                    📊 Veure mètriques de GitHub
                  </Link>
                ) : (
                  <div className="metrics-link-disabled">
                    📊 Veure mètriques de GitHub
                    <span className="disabled-message">
                      Aquest equip encara no ha configurat la seva organització
                      de Github, per tant no hi ha dades a veure.
                    </span>
                  </div>
                )}

                {/* Link a Taiga */}
                {equipo.taigaProyecto ? (
                  <Link
                    to={`/equipo/${id}/taiga-metrics?project=${equipo.taigaProyecto}`}
                    className="metrics-link"
                  >
                    📊 Veure mètriques de Taiga
                  </Link>
                ) : (
                  <div className="metrics-link-disabled">
                    📊 Veure mètriques de Taiga
                    <span className="disabled-message">
                      Aquest equip encara no ha configurat el seu projecte de
                      Taiga, per tant no hi ha dades a veure.
                    </span>
                  </div>
                )}

                {/* Link a dades d'avaluacions */}
                <Link
                  to={`/equipo/${id}/evaluaciones_generales`}
                  className="metrics-link"
                >
                  📊 Veure dades d&apos;avaluacions
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Link de evaluación para estudiantes */}
              {evaluacionActiva && !evaluacionRealizada ? (
                <Link
                  to={`/equipo/${equipo.id}/evaluacion`}
                  className="evaluacion-link"
                >
                  Avalua als teus companys
                </Link>
              ) : (
                <span className="evaluacion-link-disabled">
                  No hi ha evaluacions actives
                </span>
              )}
            </>
          )}
        </div>

        {/* Organización GitHub */}
        <div className="equipo-section">
          <h2>Organització de GitHub</h2>

          {isProfesor ? (
            equipo.gitOrganizacion ? (
              <>
                <p>
                  ✅ L&apos;organització de GitHub està configurada:
                  <a
                    href={`https://github.com/${equipo.gitOrganizacion}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-org-link"
                  >
                    {equipo.gitOrganizacion}
                  </a>
                </p>
              </>
            ) : (
              <p>
                Els estudiants encara no han definit la seva organització de
                GitHub.
              </p>
            )
          ) : (
            // Vista para estudiantes
            <>
              {/* Si la GitHub App no está instalada */}
              {
                /*!githubAppInstalada ? (
                <>
                  <p>
                    Per validar la organització, instal·leu primer la GitHub
                    App:
                  </p>
                  <button
                    onClick={handleInstallGitHubApp}
                    className="validate-git-org-button"
                  >
                    Instal·lar GitHub App
                  </button>
                </>
              ) : */ equipo.gitOrganizacion ? (
                  // organización ya está configurada
                  <>
                    <p>
                      ✅ L&apos;organització de GitHub està configurada:
                      <a
                        href={`https://github.com/${equipo.gitOrganizacion}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-org-link"
                      >
                        {equipo.gitOrganizacion}
                      </a>
                    </p>
                  </>
                ) : (
                  // Si la organización aún no está configurada
                  <>
                    {!comprobandoValidacion ? (
                      <>
                        <p>
                          Introdueix la URL de l&apos;organització de GitHub del
                          teu equip. Assegura&apos;t de que el perfil de
                          <strong> professorat-amep</strong> n&apos;és membre i
                          que té permisos d&apos;<strong>Owner</strong>.
                        </p>
                        <input
                          type="text"
                          placeholder="https://github.com/organització"
                          value={gitOrgUrl}
                          onChange={(e) => setGitOrgUrl(e.target.value)}
                          className="git-org-input-field"
                        />
                        <button
                          onClick={handleValidateGitOrg}
                          className="validate-git-org-button"
                        >
                          Validar
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Checklist de validación */}
                        <div className="validation-results">
                          <p>
                            {validationResults?.professoratEsMiembro
                              ? '✅ L&apos;usuari professorat-amep és membre de l&apos;organització.'
                              : '❌ L&apos;usuari professorat-amep no és membre de l&apos;organització.'}
                          </p>
                          <p>
                            {validationResults?.professoratEsAdmin
                              ? '✅ L&apos;usuari professorat-amep té permissos d&apos;owner en l&apos;organització.'
                              : '❌ L&apos;usuari professorat-amep no té permissos d&apos;owner en l&apos;organització.'}
                          </p>
                          <p>
                            {validationResults?.todosUsuariosGitConfigurados
                              ? '✅ Tots els membres tenen un compte de GitHub associat.'
                              : '❌ No tots els membres tenen un compte de GitHub associat.'}
                          </p>
                          <p>
                            {validationResults?.todosMiembrosEnOrganizacion
                              ? '✅ Tots els membres pertanyen a la organització.'
                              : '❌ No tots els membres pertanyen a la organització.'}
                          </p>
                          <p>
                            {validationResults?.profesorEnOrganizacion
                              ? '✅ El professor pertany a la organització.'
                              : '❌ El professor no pertany a la organització.'}
                          </p>
                          {/* Botón para confirmar organización si todo es correcto */}
                          {validationResults?.professoratEsMiembro &&
                          validationResults?.professoratEsAdmin &&
                          validationResults?.todosUsuariosGitConfigurados &&
                          validationResults?.todosMiembrosEnOrganizacion &&
                          validationResults?.profesorEnOrganizacion ? (
                            <button
                              onClick={async () => {
                                try {
                                  await handleConfirmGitOrg();
                                  alert(
                                    "L'organització s'ha confirmat correctament! Actualitzant vista...",
                                  );
                                } catch (error) {
                                  setError(
                                    "Hi ha hagut un error al confirmar l'organització.",
                                  );
                                }
                              }}
                              className="confirm-git-org-button"
                            >
                              Confirmar organització
                            </button>
                          ) : (
                            <p className="error-message">
                              Solucioneu els problemes abans de confirmar.
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )
              }
            </>
          )}
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
              {/* Botón de edición solo visible para estudiantes */}
              {!isProfesor && (
                <button className="edit-button" onClick={handleEditToggle}>
                  ✏️ Editar
                </button>
              )}
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
