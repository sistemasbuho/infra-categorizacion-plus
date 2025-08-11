import { useState, useEffect } from 'react';
import {
  getCategorizacionRedes,
  CategorizacionRedesResponse,
} from '../services/categorizacionRedesRequest';

export const useCategorizacionRedes = (
  publicacion_id: string,
  proyecto_id: string
) => {
  const [data, setData] = useState<CategorizacionRedesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!publicacion_id || !proyecto_id) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getCategorizacionRedes(publicacion_id, proyecto_id);
      setData(result);
    } catch (error) {
      console.error('Error al obtener datos de categorización:', error);
      setError('Error al cargar los datos de categorización');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [publicacion_id, proyecto_id]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};
