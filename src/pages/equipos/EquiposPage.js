import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { getEquiposDeUsuario } from '../../services/Equipos_Api';
import './EquiposPage.css';

const EquiposPage = () => {
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener el correo y token del localStorage
  const usuarioCorreo = localStorage.getItem('userEmail');
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchEquipos = async () => {
      if (!usuarioCorreo) {
        setError('Usuario no autenticado.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const equiposData = await getEquiposDeUsuario(usuarioCorreo, token);
        setEquipos(equiposData);
      } catch (error) {
        setError('No se pudieron cargar los equipos.');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, [usuarioCorreo, token]);

  const handleRowClick = (id) => {
    navigate(`/equipos/${id}`); // Redirige a la página de detalles del equipo
  };

  if (loading) {
    return <div>Cargando equipos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="equipos-page">
      <Sidebar />
      <div className="content">
        <h1>Mis Equipos</h1>
        <table className="equipos-table">
          <thead>
            <tr>
              <th>Nombre del Equipo</th>
              <th>Curso</th>
              <th>Evaluador</th>
            </tr>
          </thead>
          <tbody>
            {equipos.map((equipo) => (
              <tr
                key={equipo.id}
                onClick={() => handleRowClick(equipo.id)}
                className="clicable-row"
              >
                <td>{equipo.nombre}</td>
                <td>{equipo.cursoId}</td>
                <td>{equipo.evaluadorId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquiposPage;
