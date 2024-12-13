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

// Obtener los cursos de un estudiante
export const getCursosDeEstudiante = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}/cursos`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Error al obtener los cursos del estudiante.',
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los cursos del estudiante:', error.message);
    throw error;
  }
};

// Obtener los estudiantes de un curso
export const getEstudiantesCurso = async (cursoId, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cursos/${cursoId}/estudiantes`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Error al obtener los estudiantes del curso.',
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los estudiantes del curso:', error.message);
    throw error;
  }
};

// Obtener los profesores de un curso
export const getProfesoresCurso = async (cursoId, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cursos/${cursoId}/profesores`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Error al obtener los profesores del curso.',
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los profesores del curso:', error.message);
    throw error;
  }
};

// Crear un nuevo equipo
export const crearEquipo = async (equipoData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipos/crear`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(equipoData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Error al crear el equipo.');
    }

    const successMessage = await response.text();
    console.log('Response:', successMessage);

    return successMessage;
  } catch (error) {
    console.error('Error al crear el equipo:', error.message);
    throw error;
  }
};

// Borrar un equipo
export const borrarEquipo = async (equipoId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipos/${equipoId}/borrar`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al borrar el equipo.');
    }
  } catch (error) {
    console.error('Error al borrar el equipo:', error.message);
    throw error;
  }
};

// Salir de un equipo
export const salirEquipo = async (equipoId, estudianteId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipos/${equipoId}/salir`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estudianteId }),
    });

    if (!response.ok) {
      throw new Error('Error al salir del equipo.');
    }
  } catch (error) {
    console.error('Error al salir del equipo:', error.message);
    throw error;
  }
};
