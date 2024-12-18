const API_BASE_URL = 'http://localhost:8080/api/usuarios';

export const obtenerDatosUsuario = async () => {
  const jwtToken = localStorage.getItem('jwtToken');
  if (!jwtToken) throw new Error('No se encontró el JWT en el localStorage.');

  const response = await fetch(`${API_BASE_URL}/datos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) throw new Error('Error al obtener los datos del usuario.');
  return await response.json();
};
