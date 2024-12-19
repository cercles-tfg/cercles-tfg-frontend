import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/common/Sidebar';
import TaigaCallbackHandler from '../../components/auth/TaigaCallbackHandler';
import GitHubCallbackHandler from '../../components/auth/GitHubCallbackHandler';
import { conectarTaiga } from '../../services/Taiga_Api';
import { obtenerDatosUsuario } from '../../services/Usuarios_Api';
import './PerfilPage.css';

const PerfilPage = () => {
  const [gitUsername, setGitUsername] = useState(null);
  const [taigaUsername, setTaigaUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState(null);
  const [authType, setAuthType] = useState('normal');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchUserData = useCallback(() => {
    setLoading(true);
    obtenerDatosUsuario()
      .then((data) => {
        setNombre(data.nombre);
        setGitUsername(data.gitUsername);
        setTaigaUsername(data.taigaUsername);
        setErrorMessage(null);
      })
      .catch(() => setErrorMessage('Error al cargar los datos del usuario.'))
      .finally(() => setLoading(false));
  }, []);

  const handleGitHubConnect = () => {
    const clientId = 'Ov23liXUUdsk0qec5bBU';
    const redirectUri = 'http://localhost:3000/perfil';
    const scope = 'repo user';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    // Abrir en una nueva pestaña y verificar si se cierra
    const newWindow = window.open(githubAuthUrl, '_blank');
    const timer = setInterval(() => {
      if (newWindow.closed) {
        clearInterval(timer);
        window.location.reload();
      }
    }, 1000);
  };

  const handleTaigaGitHubError = () => {
    setErrorMessage(
      'Per connectar el teu compte de Taiga mitjançant Github, cal que et connectis a Github primer.',
    );
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
      .catch((err) => alert(`Error al conectar con Taiga: ${err.message}`));
  };

  const handleGitHubTaigaConnect = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');

    if (!code) {
      alert('Error: No se recibió el código de GitHub.');
      return;
    }

    conectarTaiga('github', { code })
      .then(() => {
        alert('Compte de Taiga connectada correctament.');
        fetchUserData();
      })
      .catch((err) => alert(`Error al conectar con Taiga: ${err.message}`));
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
              </div>
            ) : (
              <button
                className="github-connect-button"
                onClick={handleGitHubConnect}
              >
                Connecta amb GitHub
              </button>
            )}
          </div>

          {/* Taiga Connection */}
          <div className="taiga-connection-box">
            {taigaUsername ? (
              <p>El compte de Taiga associat és: {taigaUsername}</p>
            ) : (
              <div>
                <label>
                  <input
                    type="radio"
                    value="normal"
                    checked={authType === 'normal'}
                    onChange={() => setAuthType('normal')}
                  />
                  Autenticació normal
                </label>
                <label>
                  <input
                    type="radio"
                    value="github"
                    checked={authType === 'github'}
                    onChange={() => setAuthType('github')}
                  />
                  Autenticació amb GitHub
                </label>

                {authType === 'normal' && (
                  <>
                    <input
                      type="text"
                      placeholder="Usuario"
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
                  </>
                )}

                {authType === 'github' && (
                  <button
                    onClick={handleGitHubTaigaConnect}
                    className="taiga-connect-button"
                  >
                    Connecta amb GitHub
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
