import { useCallback, useEffect, useState } from 'react';
import {
  changeEstadoArticulo,
  getArticulosLideres,
} from '../services/articulosLideresRequest';
import { useSearchParams } from 'react-router-dom';

export interface Articulo {
  articulo_id: string;
  id: string;
  asignado: boolean;
  asignado_a: string | { email?: string; nombre?: string } | null;
  autor: { id: string; autor: string };
  medio: { id: string; url: string };
  borrado: boolean;
  categorizado: boolean;
  created_at: string;
  created_by: string | null;
  descripcion_borrado: string;
  fecha_categorizacion: string | null;
  modified_at: string;
  modified_by: string | null;
  publicado: string;
  resumen: string;
  titulo: string;
  url_articulo: string;
  tipo_publicacion: string | null;
  proyectos: Array<{
    proyecto: {
      id: string;
      nombre: string;
      descripcion: string;
      estado: boolean;
    };
    tranferido_clarity: boolean;
  }>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const useArticulosLideres = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('page_size') ?? '10');

  // construye filters desde la URL (quita page y page_size)
  const filters = Object.fromEntries(
    Array.from(searchParams.entries()).filter(
      ([k]) => !['page', 'page_size'].includes(k)
    )
  ) as Record<string, string>;

  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginacion, setPaginacion] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const fetchArticulos = useCallback(() => {
    setIsLoading(true);
    return getArticulosLideres(page, pageSize, filters)
      .then((resp) => {
        setArticulos(resp.results);
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
    fetchArticulos();
  }, [fetchArticulos]);

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
    const params = new URLSearchParams({
      page: '1',
      page_size: String(pageSize),
      ...newFilters,
    });
    setSearchParams(params);
  };

  const changeEstado = async (id: string, borrado: boolean, motivo: string) => {
    await changeEstadoArticulo(id, borrado, motivo);
    await fetchArticulos();
  };

  return {
    articulos,
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
