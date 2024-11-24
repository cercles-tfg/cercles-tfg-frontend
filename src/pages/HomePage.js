import React from 'react';
import Sidebar from '../components/Sidebar';
import './HomePage.css';
import homeImage from '../assets/images/homeImage.jpg'; // Asegúrate de tener esta imagen en la carpeta correspondiente

const HomePage = () => {
  const handleNavigateToProfile = () => {
    window.location.href = '/perfil';
  };

  const handleNavigateToProjects = () => {
    window.location.href = '/projectes';
  };

  return (
    <div className="home-page">
      <Sidebar />
      <div className="content">
        <div className="welcome-section">
          <div className="welcome-content">
            <img src={homeImage} alt="Home Welcome" className="home-image" />
            <div className="welcome-text">
              <h1>Benvingut/da</h1>
              <p>
                Aquesta és la pàgina principal després d&apos;iniciar sessió.
              </p>
              <div className="button-container">
                <button
                  className="navigate-button"
                  onClick={handleNavigateToProfile}
                >
                  Accedir al Perfil
                </button>
                <button
                  className="navigate-button"
                  onClick={handleNavigateToProjects}
                >
                  Veure Projectes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
