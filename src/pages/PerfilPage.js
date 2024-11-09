import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './PerfilPage.css';

const PerfilPage = () => {
  return (
    <div className="perfil-page">
      <Sidebar />
      <div className="content">
        <h1>PERFIL</h1>
        <p>Aquesta és la pàgina principal del perfil de username</p>
      </div>
    </div>
  );
};

export default PerfilPage;
