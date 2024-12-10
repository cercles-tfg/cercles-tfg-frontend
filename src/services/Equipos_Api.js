const API_BASE_URL = 'http://localhost:8080/api'; // Cambia esta URL si es necesario

// Obtener todos los equipos del usuario autenticado
export const getEquiposDeUsuario = async (usuarioCorreo, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/usuarios/${usuarioCorreo}/equipos`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los equipos del usuario:', error);
    throw error;
  }
};
