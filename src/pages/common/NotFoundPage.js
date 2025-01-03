import React from 'react';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1 className="error-code">404</h1>
      <p className="error-message">Pàgina no trobada</p>
      <p className="error-description">
        Ho sentim, però la pàgina que estàs buscant no existeix.
      </p>
    </div>
  );
};

export default NotFoundPage;
