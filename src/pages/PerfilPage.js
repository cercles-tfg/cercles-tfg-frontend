// src/pages/PerfilPage.js

import React from 'react';
import Sidebar from '../components/Sidebar';
import GitHubCallbackHandler from '../components/GitHubCallbackHandler';
import './PerfilPage.css';

const PerfilPage = () => {
  const handleGitHubConnect = () => {
    const clientId = 'Ov23liXUUdsk0qec5bBU';
    const redirectUri = 'http://localhost:3000/perfil';
    const scope = 'repo user';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = githubAuthUrl;
  };

  return (
    <div className="perfil-page">
      <GitHubCallbackHandler /> {}
      <Sidebar />
      <div className="content">
        <h1>PERFIL</h1>
        <p>Aquesta és la pàgina principal del perfil de username</p>

        <div className="github-connection-box">
          <p className="github-message">
            Encara no has configurat el teu compte de GitHub.
          </p>
          <button
            className="github-connect-button"
            onClick={handleGitHubConnect}
          >
            Connecta amb GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
