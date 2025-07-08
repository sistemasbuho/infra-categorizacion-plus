import { useState, useEffect } from 'react';
import { getVarSsn } from '../utils/funcs';

export default function useToken() {
  const readToken = (): string | null => {
    return getVarSsn()?.access ?? null;
  };

  const [token, setToken] = useState<string | null>(readToken());

  useEffect(() => {
    // En cada recarga sincroniza el estado con lo guardado en localStorage
    setToken(readToken());
  }, []);

  // setToken aquí no cambia storage porque eso lo hace setLogin() en el login
  return { token, setToken };
}
