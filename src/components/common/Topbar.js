import React from 'react';
import './Topbar.css';
import logoUPC from '../assets/images/upc-logo.png'; // Asegúrate de usar la ruta correcta para el logo

const Topbar = () => {
  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <img src={logoUPC} alt="UPC Logo" className="upc-logo" />
        <div className="user-info">
          <span className="user-name">Nom dusuari</span>
          <div className="dropdown">
            <button className="dropbtn">⋮</button>
            <div className="dropdown-content">
              <a href="#">Logout</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
