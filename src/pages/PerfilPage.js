import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import GitHubCallbackHandler from '../components/GitHubCallbackHandler';
import './PerfilPage.css';

const PerfilPage = () => {
  const [gitUsername, setGitUsername] = useState(null);
  const [taigaUsername, setTaigaUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState(null);

  const fetchUserData = useCallback(() => {
    // Obtener el JWT del localStorage
    const jwtToken = localStorage.getItem('jwtToken');

    // Si no hay token, no seguimos
    if (!jwtToken) {
      console.error(
        'No se encontró el JWT en el localStorage o el formato es incorrecto',
      );
      setLoading(false);
      return;
    }

    // Llamada para obtener los datos del usuario
    fetch('http://localhost:8080/api/usuarios/datos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Enviamos el token para autenticación
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

  const handleGitHubConnect = () => {
    const clientId = 'Ov23liXUUdsk0qec5bBU';
    const redirectUri = 'http://localhost:3000/perfil';
    const scope = 'repo user';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = githubAuthUrl;
  };

  const handleTaigaConnect = () => {
    // Lógica para conectar con Taiga se implementará más adelante
    console.log('Conectar a Taiga (Por implementar)');
  };

  const onGitHubConnected = () => {
    window.location.reload();
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="perfil-page">
      <GitHubCallbackHandler onGitHubConnected={onGitHubConnected} />
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
                <p className="github-description">
                  Ara tens accés a les funcionalitats relacionades amb GitHub.
                  Pots veure els teus repositoris i altres activitats.
                </p>
              </div>
            ) : (
              <div className="github-prompt">
                <p className="github-message">
                  Encara no has configurat el teu compte de GitHub.
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

          {/* Caja de conexión de Taiga */}
          <div className="taiga-connection-box">
            {taigaUsername ? (
              <div className="taiga-info">
                <h2>Compte de Taiga associat</h2>
                <p className="taiga-message">
                  El compte de Taiga associat al teu perfil és:{' '}
                  <a
                    href={`https://taiga.io/${taigaUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="taiga-link"
                  >
                    {taigaUsername}
                  </a>
                </p>
                <p className="taiga-description">
                  Ara tens accés a les funcionalitats relacionades amb Taiga.
                </p>
              </div>
            ) : (
              <div className="taiga-prompt">
                <p className="taiga-message">
                  Encara no has configurat el teu compte de Taiga.
                </p>
                <button
                  className="taiga-connect-button"
                  onClick={handleTaigaConnect}
                >
                  Connecta amb Taiga
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
