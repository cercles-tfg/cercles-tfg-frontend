import React, { useState } from 'react';
import { FaBars, FaHome, FaUser, FaProjectDiagram } from 'react-icons/fa';
import './Sidebar.css';
import Logout from '../components/Logout';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

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
        <a href="/projectes">
          <FaProjectDiagram />
          <span className="link-text">Projectes</span>
        </a>
        <a href="/">
          <Logout />
          <span className="link-text">Sortir</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
