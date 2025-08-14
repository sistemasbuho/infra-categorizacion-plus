import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getArticulos } from '../services/articulosRequests';
import { changeEstadoArticulo } from '../../MisArticulosLideres/services/articulosLideresRequest';

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
  tipo_publicacion: { id: string; nombre: string } | null;
  programa: { id: string; nombre: string } | null;
  tag_general: string[];
  tema_general: string[];
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

export const useArticulos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('page_size') ?? '10');

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
    return getArticulos(page, pageSize, filters)
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
