import { useEffect } from 'react';

const GitHubCallbackHandler = ({ onGitHubConnected }) => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');
    const jwtToken = localStorage.getItem('jwtToken');

    if (code && jwtToken) {
      fetch('http://localhost:8080/api/github/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data === 'Cuenta de GitHub asociada exitosamente') {
            console.log('GitHub connected:', data);
            onGitHubConnected(); // Notificamos al perfil para recargar los datos
            // Eliminar el parámetro "code" de la URL después de la conexión
            const newUrl = window.location.href.split('?')[0];
            window.history.replaceState(null, '', newUrl);
          } else {
            console.error('Error connecting GitHub:', data);
          }
        })
        .catch((error) => console.error('Error:', error));
    }
  }, [onGitHubConnected]);

  return null;
};

export default GitHubCallbackHandler;
