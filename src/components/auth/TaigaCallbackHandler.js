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
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');

    const handleTaigaAuth = async () => {
      try {
        const credentials =
          authType === 'normal' ? { username, password } : { code };
        await conectarTaiga(authType, credentials);

        onSuccess('Cuenta de Taiga conectada correctamente.');
        const newUrl = window.location.href.split('?')[0];
        window.history.replaceState(null, '', newUrl);
        window.location.reload();
      } catch (error) {
        console.error('Error al conectar a Taiga:', error);
        onError(error.message);
      }
    };

    if (
      (authType === 'normal' && username && password) ||
      (authType === 'github' && code)
    ) {
      handleTaigaAuth();
    }
  }, [authType, username, password, onSuccess, onError]);

  return null;
};

export default TaigaCallbackHandler;
