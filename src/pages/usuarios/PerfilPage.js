import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/common/Sidebar';
import TaigaCallbackHandler from '../../components/auth/TaigaCallbackHandler';
import GitHubCallbackHandler from '../../components/auth/GitHubCallbackHandler';
import {
  obtenerDatosGitHub,
  desconectarGitHub,
} from '../../services/Github_Api';
import { conectarTaiga } from '../../services/Taiga_Api';
import { obtenerDatosUsuario } from '../../services/Usuarios_Api';
import './PerfilPage.css';

const PerfilPage = () => {
  const [gitUsername, setGitUsername] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [taigaUsername, setTaigaUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState(null);
  const [authType, setAuthType] = useState('normal');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  const fetchUserData = useCallback(() => {
    setLoading(true);
    obtenerDatosUsuario()
      .then((data) => {
        setNombre(data.nombre);
        setGitUsername(data.gitUsername);
        setTaigaUsername(data.taigaUsername);
        setErrorMessage(null);
        if (data.gitUsername) {
          fetchGitHubData();
        }
      })
      .catch(() => setErrorMessage('Error en carregar les dades.'))
      .finally(() => setLoading(false));
  }, []);

  const fetchGitHubData = () => {
    obtenerDatosGitHub()
      .then((data) => setGithubData(data))
      .catch(() => setErrorMessage('Error en carregar les dades.'));
  };

  const handleGitHubConnect = () => {
    const clientId = 'Ov23liXUUdsk0qec5bBU';
    const redirectUri = 'http://localhost:3000/perfil';
    const scope = 'repo user';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&prompt=login`;

    window.location.href = githubAuthUrl;
  };

  // Guardar el code al conectar con GitHub para conectarse luego con Taiga
  const handleGitHubCallback = (code) => {
    if (code) {
      localStorage.setItem('githubCode', code);
    }
  };

  const handleGitHubDisconnect = () => {
    if (
      window.confirm('Estàs segur/a de voler desconnectar el compte de GitHub?')
    ) {
      desconectarGitHub()
        .then(() => {
          alert('Compte de GitHub desconnectada correctament.');
          setGitUsername(null);
          setGithubData(null);
        })
        .catch(() =>
          setErrorMessage('Error al desconnectar el compte de GitHub.'),
        );
    }
  };

  const handleTaigaConnect = () => {
    if (!username || !password) {
      alert('Els camps de usuari i contrasenya són obligatoris.');
      return;
    }

    conectarTaiga('normal', { username, password })
      .then(() => {
        alert('Compte de Taiga connectada correctament.');
        fetchUserData();
      })
      .catch((err) => alert(`Error al cocnectar amb Taiga: ${err.message}`));
  };

  const handleGitHubTaigaConnect = async () => {
    const code = localStorage.getItem('githubCode');

    if (!code) {
      alert('Error: No hi ha un compte de GitHub connectat.');
      return;
    }

    try {
      await conectarTaiga('github', { code });
      alert('Compte de Taiga connectada correctament.');
      fetchUserData();
      localStorage.setItem('githubCode', null);
    } catch (err) {
      alert(`Error al conectar amb Taiga: ${err.message}`);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="perfil-page">
      <GitHubCallbackHandler onGitHubConnected={fetchUserData} />
      <TaigaCallbackHandler
        authType={authType}
        username={username}
        password={password}
        onSuccess={(msg) => {
          setSuccessMessage(msg);
          fetchUserData();
        }}
        onError={(msg) => setErrorMessage(msg)}
      />
      <Sidebar />
      <div className="content">
        <h1>PERFIL</h1>
        <p>
          Aquesta és la pàgina principal del perfil de <strong>{nombre}</strong>
        </p>

        {/* Mensajes de éxito y error */}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="connections-container">
          {/* GitHub Connection */}
          <div className="github-connection-box">
            {gitUsername ? (
              <div className="github-info">
                <h2>Compte de GitHub associat</h2>
                <p>
                  El compte de GitHub associat al teu perfil és:{' '}
                  <a
                    href={`https://github.com/${gitUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link"
                  >
                    {gitUsername}
                  </a>
                </p>
                {githubData && (
                  <div className="github-details">
                    <p
                      className="expandable-item"
                      onClick={() => toggleSection('repositoriosPublicos')}
                    >
                      <strong>Repositoris públics:</strong>{' '}
                      {
                        githubData.repositorios.filter((repo) => !repo.private)
                          .length
                      }
                    </p>
                    {expandedSection === 'repositoriosPublicos' && (
                      <ul className="expanded-list">
                        {githubData.repositorios
                          .filter((repo) => !repo.private)
                          .map((repo) => (
                            <li key={repo.id}>{repo.name}</li>
                          ))}
                      </ul>
                    )}

                    <p
                      className="expandable-item"
                      onClick={() => toggleSection('repositoriosPrivados')}
                    >
                      <strong>Repositoris privats:</strong>{' '}
                      {
                        githubData.repositorios.filter((repo) => repo.private)
                          .length
                      }
                    </p>
                    {expandedSection === 'repositoriosPrivados' && (
                      <ul className="expanded-list">
                        {githubData.repositorios
                          .filter((repo) => repo.private)
                          .map((repo) => (
                            <li key={repo.id}>{repo.name}</li>
                          ))}
                      </ul>
                    )}

                    <p
                      className="expandable-item"
                      onClick={() => toggleSection('organizaciones')}
                    >
                      <strong>Organitzacions:</strong>{' '}
                      {githubData.organizaciones.length}
                    </p>
                    {expandedSection === 'organizaciones' && (
                      <ul className="expanded-list">
                        {githubData.organizaciones.map((org) => (
                          <li key={org.id}>{org.login}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                <button
                  className="disconnect-button"
                  onClick={handleGitHubDisconnect}
                >
                  Desconnecta el compte de GitHub
                </button>
              </div>
            ) : (
              <div>
                <p>
                  Per connectar el teu compte de <strong>GitHub</strong> amb{' '}
                  <strong>CERCLES</strong>, fes clic al botó següent. Aquesta
                  connexió permetrà associar el teu compte de GitHub amb el teu
                  perfil dins l&apos;aplicació, proporcionant accés a les dades
                  dels teus repositoris i organitzacions.{' '}
                  <strong>
                    Tingues en compte que, si ja tens una sessió activa a
                    GitHub, CERCLES s&apos;associarà automàticament a aquesta.
                  </strong>{' '}
                  Si vols associar CERCLES amb un compte diferent,
                  assegura&apos;t de tancar la sessió a GitHub abans de
                  continuar.
                </p>

                <button
                  className="github-connect-button"
                  onClick={handleGitHubConnect}
                >
                  Connecta amb GitHub
                </button>
              </div>
            )}
          </div>

          {/* Taiga Connection */}
          <div className="taiga-connection-box">
            {taigaUsername ? (
              <div>
                <h2>Compte de Taiga associat</h2>
                <p>
                  El compte de Taiga associat al teu perfil és: {taigaUsername}
                </p>
              </div>
            ) : (
              <div>
                <p>
                  Per connectar el teu compte de <strong>Taiga</strong> amb{' '}
                  <strong>CERCLES</strong>, selecciona una de les opcions
                  següents:
                </p>
                <ul>
                  <li>
                    <strong>Autenticació normal:</strong> Proporciona el teu
                    usuari i contrasenya de Taiga directament.
                  </li>
                  <li>
                    <strong>Autenticació amb GitHub:</strong> Utilitza el teu
                    compte de GitHub associat per connectar-te a Taiga, sempre
                    que els comptes estiguin vinculats.
                  </li>
                </ul>
                <div className="auth-options">
                  <div className="auth-option">
                    <input
                      type="radio"
                      id="normal"
                      value="normal"
                      checked={authType === 'normal'}
                      onChange={() => setAuthType('normal')}
                    />
                    <label htmlFor="normal">Autenticació normal</label>
                    {authType === 'normal' && (
                      <div className="normal-auth-form">
                        <input
                          type="usuari"
                          placeholder="Usuari"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                          type="password"
                          placeholder="Contrasenya"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          onClick={handleTaigaConnect}
                          className="taiga-connect-button"
                        >
                          Connecta amb Taiga
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="auth-option">
                    <input
                      type="radio"
                      id="github"
                      value="github"
                      checked={authType === 'github'}
                      onChange={() => setAuthType('github')}
                    />
                    <label htmlFor="github">Autenticació amb GitHub</label>
                    {authType === 'github' && (
                      <div className="github-auth-form">
                        <button
                          onClick={handleGitHubTaigaConnect}
                          className="taiga-connect-button"
                        >
                          Connecta amb GitHub
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
