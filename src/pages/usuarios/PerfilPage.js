import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/common/Sidebar';
import GitHubCallbackHandler from '../../components/auth/GitHubCallbackHandler';
import TaigaCallbackHandler from '../../components/auth/TaigaCallbackHandler';
import './PerfilPage.css';

const PerfilPage = () => {
  const [gitUsername, setGitUsername] = useState(null);
  const [taigaUsername, setTaigaUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState(null);
  const [authType, setAuthType] = useState('normal'); // Tipo de autenticación: normal o GitHub
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const fetchUserData = useCallback(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
      console.error('No se encontró el JWT en el localStorage.');
      setLoading(false);
      return;
    }

    fetch('http://localhost:8080/api/usuarios/datos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setNombre(data.nombre);
        setGitUsername(data.gitUsername);
        setTaigaUsername(data.taigaUsername);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener los datos del usuario:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="perfil-page">
      <TaigaCallbackHandler
        authType={authType}
        username={username}
        password={password}
      />
      <Sidebar />
      <div className="content">
        <h1>PERFIL</h1>
        <p>
          Aquesta és la pàgina principal del perfil de <strong>{nombre}</strong>
        </p>

        <div className="connections-container">
          {/* Caja de conexión de GitHub */}
          <div className="github-connection-box">
            {gitUsername ? (
              <div className="github-info">
                <h2>Compte de GitHub associat</h2>
                <p className="github-message">
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
              <div className="github-prompt">
                <p className="github-message">
                  Encara no has configurat el teu compte de GitHub.
                </p>
                <button
                  className="github-connect-button"
                  onClick={() =>
                    (window.location.href =
                      'https://github.com/login/oauth/authorize?...')
                  }
                >
                  Connecta amb GitHub
                </button>
              </div>
            )}
          </div>

          {/* Caja de conexión de Taiga */}
          <div className="taiga-connection-box">
            {taigaUsername ? (
              <div className="taiga-info">
                <h2>Compte de Taiga associat</h2>
                <p className="taiga-message">
                  El compte de Taiga associat al teu perfil és:{' '}
                  <strong>{taigaUsername}</strong>
                </p>
              </div>
            ) : (
              <div className="taiga-prompt">
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
                </div>

                {authType === 'normal' && (
                  <div>
                    <input
                      type="text"
                      placeholder="Usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="taiga-connect-button"
                      onClick={() =>
                        (window.location.href =
                          window.location.href + '?type=normal')
                      }
                    >
                      Connecta amb Taiga
                    </button>
                  </div>
                )}

                {authType === 'github' && (
                  <button
                    className="taiga-connect-button"
                    onClick={() =>
                      (window.location.href =
                        'https://api.taiga.io/api/v1/auth')
                    }
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
