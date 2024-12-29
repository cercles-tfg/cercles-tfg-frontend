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

//obtener detalle de un equipo
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

//añadir miembros a un equipo
export const añadirMiembros = async (equipoId, data, token) => {
  const response = await fetch(
    `${API_BASE_URL}/equipos/${equipoId}/añadir_miembro`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error('Error al añadir miembros al equipo.');
  }
};

//borrar miembros de un equipo
export const borrarMiembros = async (equipoId, data, token) => {
  const response = await fetch(
    `${API_BASE_URL}/equipos/${equipoId}/borrar_miembros`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error('Error al borrar miembros del equipo.');
  }
};

/*/obtener url de instalacion del github app en organizacion
export const obtenerUrlInstalacion = async (equipoId, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/github/instalacion?equipoId=${equipoId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Asegúrate de pasar el token correctamente
        },
      },
    );
    const data = await response.json();
    return data.url; // Devuelve la URL de instalación
  } catch (error) {
    console.error(
      'Error al obtener la URL de instalación de GitHub App:',
      error,
    );
    throw new Error('Error desconocido al obtener la URL de instalación.');
  }
};*/

//validar org
export const validarOrganizacion = async (
  profesorId,
  miembrosIds,
  organizacionUrl,
  token,
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/github/validar-organizacion`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profesorId,
          miembrosIds,
          organizacionUrl,
        }),
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al validar la organización.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al validar la organización:', error);
    throw new Error(
      error.message || 'Error desconocido al validar la organización.',
    );
  }
};

//confirmar en bd org
export const confirmarOrganizacion = async (
  equipoId,
  organizacionUrl,
  token,
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/github/confirmar-organizacion`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          equipoId,
          organizacionUrl,
        }),
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al confirmar la organización.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al confirmar la organización:', error);
    throw new Error(
      error.message || 'Error desconocido al confirmar la organización.',
    );
  }
};

// Obtener métricas del equipo
export const getMetrics = async (org, estudiantesIds, token) => {
  if (!org || !estudiantesIds?.length) {
    throw new Error('Faltan parámetros necesarios.');
  }

  const queryParams = `estudiantesIds=${estudiantesIds.join(',')}`;
  const url = `${API_BASE_URL}/github/metrics/${org}?${queryParams}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Corregido
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener las métricas: ${response.statusText}`);
  }

  return await response.json();
};
