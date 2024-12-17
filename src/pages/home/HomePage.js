import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import './HomePage.css';
import homeImage from '../../assets/images/homeImage.jpg';

const HomePage = () => {
  const [rol, setRol] = useState(null);

  useEffect(() => {
    // Obtenemos el rol del usuario del localStorage
    const userRol = localStorage.getItem('rol');
    setRol(userRol);
  }, []);

  const handleNavigateToProfile = () => {
    window.location.href = '/perfil';
  };

  const handleNavigateToCourses = () => {
    window.location.href = '/cursos';
  };

  const handleNavigateToProjects = () => {
    window.location.href = '/equipos';
  };

  if (!rol) {
    return <p>Càrregant...</p>; // Mientras se obtiene el rol, mostramos un mensaje de carga
  }

  return (
    <div className="home-page">
      <Sidebar />
      <div className="content">
        <div className="welcome-section">
          <div className="welcome-content">
            <img src={homeImage} alt="Home Welcome" className="home-image" />
            <div className="welcome-text">
              <h1>Benvingut/da</h1>
              {rol === 'Estudiante' && (
                <p>
                  Aquesta és la pàgina principal després d&apos;iniciar sessió.
                  Pots accedir al teu perfil per veure la teva informació o
                  explorar els teus projectes.
                </p>
              )}
              {rol === 'Profesor' && (
                <p>
                  Aquesta és la pàgina principal després d&apos;iniciar sessió.
                  Pots gestionar els cursos i els equips dels estudiants
                  assignats, o accedir al teu perfil per revisar la teva
                  informació.
                </p>
              )}
              <div className="button-container">
                <button
                  className="navigate-button"
                  onClick={handleNavigateToProfile}
                >
                  Accedir al Perfil
                </button>
                {rol === 'Estudiante' ? (
                  <button
                    className="navigate-button"
                    onClick={handleNavigateToProjects}
                  >
                    Veure Projectes
                  </button>
                ) : (
                  <button
                    className="navigate-button"
                    onClick={handleNavigateToCourses}
                  >
                    Veure Cursos
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
