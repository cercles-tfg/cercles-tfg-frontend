import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import './ProjectesPage.css';

const ProjectesPage = () => {
  const navigate = useNavigate();

  // Datos hardcodeados de ejemplo
  const projectes = [
    {
      id: 1,
      nombre: "Projecte Gestió d'Equips",
      curso: 'Enginyeria del Software',
      estado: 'En Progrés',
      miembros: 6,
    },
    {
      id: 2,
      nombre: 'Projecte Sistemes Distribuïts',
      curso: 'Sistemes Distribuïts',
      estado: 'Completat',
      miembros: 5,
    },
  ];

  const handleRowClick = (id) => {
    navigate(`/projectes/${id}`); // Redirige a la página de detalles del proyecto
  };

  return (
    <div className="projectes-page">
      <Sidebar />
      <div className="content">
        <h1>Projectes</h1>
        <table className="projectes-table">
          <thead>
            <tr>
              <th>Nom del Projecte</th>
              <th>Curs</th>
              <th>Estat</th>
              <th>Nombre de Membres</th>
            </tr>
          </thead>
          <tbody>
            {projectes.map((projecte) => (
              <tr
                key={projecte.id}
                onClick={() => handleRowClick(projecte.id)}
                className="clicable-row"
              >
                <td>{projecte.nombre}</td>
                <td>{projecte.curso}</td>
                <td>{projecte.estado}</td>
                <td>{projecte.miembros}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectesPage;
