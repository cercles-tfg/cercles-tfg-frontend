const API_BASE_URL = 'http://localhost:8080/api';

// Obtener todos los equipos del usuario autenticado
export const getEquiposDeUsuario = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}/equipos`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los equipos del usuario:', error);
    throw error;
  }
};

export const getEquipoDetalle = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipos/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los detalles del equipo.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los detalles del equipo:', error);
    throw error;
  }
};
