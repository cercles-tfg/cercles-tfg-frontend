import React from 'react';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Inicia sessió</h2>
        <form>
          <label htmlFor="usuari">Usuari:</label>
          <input
            type="text"
            id="usuari"
            name="usuari"
            placeholder="Insereix el teu usuari"
          />

          <label htmlFor="contrasenya">Contrasenya:</label>
          <input
            type="password"
            id="contrasenya"
            name="contrasenya"
            placeholder="Insereix la teva contrasenya"
          />

          <button type="submit" className="login-button">
            Inicia sessió
          </button>
        </form>

        <div className="google-login">
          <button className="google-button">Inicia sessió amb Google</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
