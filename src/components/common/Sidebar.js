import React, { useState } from 'react';
import {
  FaBars,
  FaHome,
  FaUser,
  FaProjectDiagram,
  FaBook,
} from 'react-icons/fa';
import './Sidebar.css';
import Logout from '../../components/auth/Logout';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const rol = localStorage.getItem('rol'); // Obtenemos el rol del usuario

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="toggle-button" onClick={toggleSidebar}>
        <FaBars />
      </div>
      <div className="menu-items">
        <a href="/home">
          <FaHome />
          <span className="link-text">Inici</span>
        </a>
        <a href="/perfil">
          <FaUser />
          <span className="link-text">Perfil</span>
        </a>
        {rol === 'Estudiante' && (
          <a href="/equipos">
            <FaProjectDiagram />
            <span className="link-text">Equips</span>
          </a>
        )}
        {rol === 'Profesor' && (
          <a href="/cursos">
            <FaBook />
            <span className="link-text">Cursos</span>
          </a>
        )}
        <div className={`logout-container ${isOpen ? '' : 'closed'}`}>
          <Logout isSidebarOpen={isOpen} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
