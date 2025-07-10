import { useState, useEffect } from 'react';
import { getVarSsn } from '../shared/utils/funcs';

export default function useToken() {
  const readToken = (): string | null => {
    return getVarSsn()?.access ?? null;
  };

  const [token, setToken] = useState<string | null>(readToken());

  useEffect(() => {
    // Función para verificar cambios en localStorage
    const checkTokenChanges = () => {
      const currentToken = readToken();
      setToken(currentToken);
    };

    // Verificar inmediatamente
    checkTokenChanges();

    // Escuchar evento personalizado de cambio de token
    window.addEventListener('tokenChanged', checkTokenChanges);

    // Escuchar cambios en localStorage (para cambios externos)
    window.addEventListener('storage', checkTokenChanges);

    return () => {
      window.removeEventListener('tokenChanged', checkTokenChanges);
      window.removeEventListener('storage', checkTokenChanges);
    };
  }, []);

  // setToken aquí no cambia storage porque eso lo hace setLogin() en el login
  return { token, setToken };
}
