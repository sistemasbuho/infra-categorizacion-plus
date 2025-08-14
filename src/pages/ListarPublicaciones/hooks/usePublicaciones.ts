import { useCallback, useEffect, useState } from 'react';
import { changeEstadoPublicacion } from '../services/publicacionesRequest';
import { useSearchParams } from 'react-router-dom';
import { AxiosRequestConfig } from 'axios';
import { categorizationPlusRequest } from '../../../shared/services/axiosRequest';

export interface Publicacion {
  id: string;
  publicacion_id: string | null;
  proyecto_id: string;
  proyecto_nombre: string;
  asignado_email: string;
  created_at: string;
  modified_at: string;
  fecha: string;
  autor: string;
  titulo: string | null;
  url: string;
  keyword: string | null;
  contenido: string;
  red_social: string;
  ubicacion: string;
  medio: string | null;
  me_gusta: number;
  me_encanta: number | null;
  me_importa: number | null;
  me_divierte: number | null;
  me_asombra: number | null;
  me_entristece: number | null;
  me_enoja: number | null;
  comentario: number;
  respuesta_comentarios: number | null;
  compartido: number;
  interaccion: number;
  reproduccion: number;
  seguidores: number;
  alcance: number;
  asignado: boolean;
  borrado: boolean;
  descripcion_borrado: string;
  categorizado: boolean;
  pasivo: boolean | null;
  created_by: string | null;
  modified_by: string | null;
  categorizacion_proyecto: string;
  asignado_a: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const usePublicaciones = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('page_size') ?? '10');

  const filters = Object.fromEntries(
    Array.from(searchParams.entries()).filter(
      ([k]) => !['page', 'page_size'].includes(k)
    )
  ) as Record<string, string>;

  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginacion, setPaginacion] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  async function getPublicaciones(
    page: number,
    pageSize: number,
    filters: Record<string, string> = {}
  ): Promise<PaginatedResponse<Publicacion>> {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: 'redes/usuario-publicaciones',
      params: {
        page,
        page_size: pageSize,
        ...filters,
      },
    };
    return categorizationPlusRequest<PaginatedResponse<Publicacion>>(config);
  }

  const fetchPublicaciones = useCallback(() => {
    setIsLoading(true);
    return getPublicaciones(page, pageSize, filters)
      .then((resp) => {
        setPublicaciones(resp.results);
        setPaginacion({
          count: resp.count,
          next: resp.next,
          previous: resp.previous,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, pageSize, JSON.stringify(filters)]);

  useEffect(() => {
    fetchPublicaciones();
  }, [fetchPublicaciones]);

  const setPage = (p: number) => {
    searchParams.set('page', String(p));
    setSearchParams(searchParams);
  };

  const setPageSize = (s: number) => {
    searchParams.set('page_size', String(s));
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const setFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('page_size', String(pageSize));

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value.toString().trim() !== '') {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  };

  const changeEstado = async (id: string, borrado: boolean, motivo: string) => {
    await changeEstadoPublicacion(id, borrado, motivo);
    await fetchPublicaciones();
  };

  return {
    publicaciones,
    isLoading,
    paginacion,
    page,
    setPage,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    changeEstado,
  };
};
