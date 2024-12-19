import { useEffect } from 'react';
import { conectarTaiga } from '../../services/Taiga_Api';

const TaigaCallbackHandler = ({
  authType,
  username,
  password,
  onSuccess,
  onError,
}) => {
  const handleTaigaAuth = async () => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get('code');

      const credentials =
        authType === 'normal' ? { username, password } : { code: code || '' };

      // Evitar llamadas si no hay credenciales válidas
      if (
        (authType === 'normal' && (!username || !password)) ||
        (authType === 'github' && !code)
      ) {
        return;
      }

      await conectarTaiga(authType, credentials);
      onSuccess('Cuenta de Taiga conectada correctamente.');

      // Limpiar parámetros de la URL
      const newUrl = window.location.href.split('?')[0];
      window.history.replaceState(null, '', newUrl);
    } catch (error) {
      console.error('Error al conectar a Taiga:', error);
      onError(error.message || 'Error al conectar a Taiga.');
    }
  };

  useEffect(() => {
    // Ya no se ejecuta automáticamente al cargar la página
  }, []);

  return null;
};

export default TaigaCallbackHandler;
