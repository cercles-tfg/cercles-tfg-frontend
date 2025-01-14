const BASE_URL = 'http://localhost:8080/api/github';

export const conectarGitHub = (code) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return fetch(`${BASE_URL}/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ code }),
  }).then((response) => response.json());
};

export const obtenerDatosGitHub = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  return fetch(`${BASE_URL}/user-data`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Error al obtener datos de GitHub');
    }
    return response.json();
  });
};

export const desconectarGitHub = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  return fetch(`${BASE_URL}/disconnect`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Error al desconectar GitHub');
    }
    return response.json();
  });
};
