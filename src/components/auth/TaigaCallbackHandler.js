import { useEffect } from 'react';

const TaigaCallbackHandler = ({ authType, username, password }) => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');
    const type = queryParams.get('type') || authType;

    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
      console.error('No se encontró el JWT.');
      return;
    }

    if (
      (type === 'normal' && username && password) ||
      (type === 'github' && code)
    ) {
      const body =
        type === 'normal'
          ? { type: 'normal', username, password }
          : { type: 'github', code };

      fetch('http://localhost:8080/api/taiga/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al conectar a Taiga.');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Taiga conectado:', data);
          const newUrl = window.location.href.split('?')[0];
          window.history.replaceState(null, '', newUrl);
          window.location.reload();
        })
        .catch((error) => console.error('Error:', error));
    }
  }, [authType, username, password]);

  return null;
};

export default TaigaCallbackHandler;
