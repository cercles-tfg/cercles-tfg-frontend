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
          <h1>Benvingut a FIB Puntua</h1>
          <p>Inicia sessió per continuar</p>

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
