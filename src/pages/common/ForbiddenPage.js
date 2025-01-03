import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ForbiddenPage.css';

const ForbiddenPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/home');
  };

  return (
    <div className="forbidden-page">
      <h1 className="error-code">403</h1>
      <p className="error-message">Accés Prohibit</p>
      <p className="error-description">
        Ho sentim, però no tens permís per accedir a aquesta pàgina.
      </p>
      <button className="back-to-main-button" onClick={handleGoBack}>
        Tornar a la pàgina principal
      </button>
    </div>
  );
};

export default ForbiddenPage;
