// src/services/cursos_api.js

const API_BASE_URL = 'http://localhost:8080/api';
const obtenerToken = () => localStorage.getItem('jwtToken');

// Obtener la lista de cursos
export const obtenerCursos = async () => {
  const token = obtenerToken();
  try {
    const response = await fetch(`${API_BASE_URL}/cursos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los cursos.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los cursos:', error);
    throw error;
  }
};

// Crear un nuevo curso
export const crearCurso = async (cursoData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cursos/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cursoData),
    });

    if (!response.ok) {
      throw new Error('Error al crear el curso.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear el curso:', error);
    throw error;
  }
};

// Obtener los detalles de un curso
export const obtenerDetallesCurso = async (id) => {
  const token = obtenerToken();
  try {
    const response = await fetch(`${API_BASE_URL}/cursos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los detalles del curso.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los detalles del curso:', error);
    throw error;
  }
};

// Cambiar el estado de un curso (activar/desactivar)
export const cambiarEstadoCurso = async (curso) => {
  const token = obtenerToken();
  try {
    const response = await fetch(`${API_BASE_URL}/cursos/cambiarEstado`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: curso.id,
        nombreAsignatura: curso.nombreAsignatura,
        añoInicio: curso.añoInicio,
        cuatrimestre: curso.cuatrimestre,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al cambiar el estado del curso.');
    }

    return response.text();
  } catch (error) {
    console.error('Error al cambiar el estado del curso:', error);
    throw error;
  }
};

// Verificar si ya existe un curso similar activo
export const verificarCursoExistente = async (curso) => {
  const token = obtenerToken();
  try {
    const response = await fetch(
      `${API_BASE_URL}/cursos/verificarCursoExistente`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombreAsignatura: curso.nombreAsignatura,
          añoInicio: curso.añoInicio,
          cuatrimestre: curso.cuatrimestre,
        }),
      },
    );
    if (response.status === 409) {
      return response;
    }

    if (!response.ok) {
      throw new Error('Error al verificar el curso existente.');
    }

    return response;
  } catch (error) {
    console.error('Error al verificar el curso existente:', error);
    throw error;
  }
};

// Obtener la lista de profesores disponibles
export const obtenerProfesoresDisponibles = async () => {
  const token = obtenerToken();
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/profesores`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los profesores disponibles.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los profesores disponibles:', error);
    throw error;
  }
};
