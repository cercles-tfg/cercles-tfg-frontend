const API_BASE_URL = 'http://localhost:8080/api/taiga';

export const conectarTaiga = async (authType, credentials) => {
  const jwtToken = localStorage.getItem('jwtToken');
  if (!jwtToken) throw new Error('No se encontró el token de autenticación.');

  const body =
    authType === 'normal'
      ? {
          type: 'normal',
          username: credentials.username,
          password: credentials.password,
        }
      : { type: 'github', code: credentials.code };

  const response = await fetch(`${API_BASE_URL}/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Error al conectar a Taiga: ${errorData}`);
  }

  return await response.json();
};
