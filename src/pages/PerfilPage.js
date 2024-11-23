import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import GitHubCallbackHandler from '../components/GitHubCallbackHandler';
import './PerfilPage.css';

const PerfilPage = () => {
  const [gitUsername, setGitUsername] = useState(null);
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
        <p>Aquesta és la pàgina principal del perfil de {nombre}</p>

        <div className="github-connection-box">
          {gitUsername ? (
            <>
              <p className="github-message">
                La cuenta de GitHub asociada a tu perfil es: {gitUsername}
              </p>
            </>
          ) : (
            <>
              <p className="github-message">
                Encara no has configurat el teu compte de GitHub.
              </p>
              <button
                className="github-connect-button"
                onClick={handleGitHubConnect}
              >
                Connecta amb GitHub
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
