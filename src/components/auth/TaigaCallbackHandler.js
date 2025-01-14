import { useEffect } from 'react';
import { conectarTaiga } from '../../services/Taiga_Api';

const TaigaCallbackHandler = ({
  authType,
  username,
  password,
  onSuccess,
  onError,
}) => {
  useEffect(() => {
    const handleTaigaAuth = async () => {
      try {
        const credentials =
          authType === 'normal'
            ? { username, password }
            : { code: localStorage.getItem('githubCode') };

        if (
          (authType === 'normal' && (!username || !password)) ||
          (authType === 'github' && !credentials.code)
        ) {
          return;
        }

        await conectarTaiga(authType, credentials);
        onSuccess('Compte de Taiga connectada correctament.');

        if (authType === 'github') {
          localStorage.removeItem('githubCode');
        }
      } catch (error) {
        console.error('Error al conectar a Taiga:', error);
        onError(error.message || 'Error al conectar a Taiga.');
      }
    };

    handleTaigaAuth();
  }, [authType, username, password, onSuccess, onError]);

  return null;
};

export default TaigaCallbackHandler;
