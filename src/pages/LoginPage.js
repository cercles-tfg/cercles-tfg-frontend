import React from 'react';
import './LoginPage.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    console.log('Login success', credentialResponse);
    navigate('/home');
  };

  const handleLoginFailure = (error) => {
    console.error('Login failed', error);
  };

  return (
    <GoogleOAuthProvider clientId="556635874733-kcqieabaqpplmsbp1lnm15qjg9c78bp0.apps.googleusercontent.com">
      <div className="login-page">
        <div className="login-box">
          <h2>Inici de sessió</h2>
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
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
              text="Inicia sessió amb Google"
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
