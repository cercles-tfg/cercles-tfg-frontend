import { useEffect } from 'react';

const GitHubCallbackHandler = () => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');

    if (code) {
      fetch('/github/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            console.log('Access Token:', data.access_token);
            // Aquí puedes almacenar el token o usarlo según sea necesario
          } else {
            console.error('Error al obtener el token:', data.error);
          }
        })
        .catch((error) => console.error('Error:', error));
    }
  }, []);

  return null;
};

export default GitHubCallbackHandler;
