import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import GitHubCallbackHandler from '../components/GitHubCallbackHandler';
import './PerfilPage.css';

const PerfilPage = () => {
  const [gitUsername, setGitUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState(null);

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    const userEmail = localStorage.getItem('userEmail');

    if (jwtToken && userEmail) {
      // Llamada para obtener los datos del usuario, incluido el GitHub username
      fetch(
        `http://localhost:8080/api/usuarios/email/datos?email=${userEmail}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`, // Enviamos el token para autenticación
          },
        },
      )
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
    }
  }, []);

  const handleGitHubConnect = () => {
    const clientId = 'Ov23liXUUdsk0qec5bBU';
    const redirectUri = 'http://localhost:3000/perfil';
    const scope = 'repo user';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = githubAuthUrl;
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="perfil-page">
      <GitHubCallbackHandler />{' '}
      {/* Maneja la redirección después de conectar GitHub */}
      <Sidebar />
      <div className="content">
        <h1>PERFIL</h1>
        <p>Aquesta és la pàgina principal del perfil de {nombre}</p>

        <div className="github-connection-box">
          {gitUsername ? (
            <>
              <p className="github-message">
                El teu compte de GitHub és: {gitUsername}
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
