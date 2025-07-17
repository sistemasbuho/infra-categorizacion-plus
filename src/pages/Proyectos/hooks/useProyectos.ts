import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  getProyectos,
  createProyecto,
  updateProyecto,
  deleteProyecto,
  Proyecto,
  searchColaboradores,
  Colaborador,
  getTags,
  Tag,
  TagsPaginatedResponse,
  searchProyectosELT,
  ProyectoELT,
} from '../services/proyectosRequest';

export interface UseProyectosReturn {
  proyectos: Proyecto[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  page: number;
  pageSize: number;
  searchTerm: string;
  searchTermFechaDesde: string;
  searchTermFechaHasta: string;
  searchTermActivo: string;
  fetchProyectos: () => Promise<void>;
  createProyecto: (proyectoData: {
    proyecto_id: string;
    nombre: string;
    keyword?: import('../services/proyectosRequest').Keyword;
    colaboradores?: number[];
    tags?: string[];
  }) => Promise<void>;
  updateProyecto: (
    id: string,
    proyectoData: Partial<{
      proyecto_id: string;
      nombre: string;
      keyword?: import('../services/proyectosRequest').Keyword;
      colaboradores?: number[];
      tags?: string[];
    }>
  ) => Promise<void>;
  deleteProyecto: (id: string) => Promise<void>;
  searchColaboradores: (nombre: string) => Promise<Colaborador[]>;
  searchProyectosELT: (nombre: string) => Promise<ProyectoELT[]>;
  getTags: (
    page?: number,
    pageSize?: number,
    search?: string
  ) => Promise<Tag[]>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearchTerm: (search: string) => void;
  setSearchTermFechaDesde: (fecha: string) => void;
  setSearchTermFechaHasta: (fecha: string) => void;
  setSearchTermActivo: (activo: string) => void;
  clearFilters: () => void;
}

export const useProyectos = (): UseProyectosReturn => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('page_size') ?? '10');
  const searchTerm = searchParams.get('nombre') ?? '';
  const searchTermFechaDesde = searchParams.get('created_at__gte') ?? '';
  const searchTermFechaHasta = searchParams.get('created_at__lte') ?? '';
  const searchTermActivo = searchParams.get('activo') ?? '';

  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);

  const fetchProyectos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: Record<string, string> = {};
      if (searchTerm) filters.nombre = searchTerm;
      if (searchTermFechaDesde)
        filters['created_at__gte'] = searchTermFechaDesde;
      if (searchTermFechaHasta)
        filters['created_at__lte'] = searchTermFechaHasta;
      if (searchTermActivo) filters.activo = searchTermActivo;

      const response: Proyecto[] = await getProyectos(filters);

      setProyectos(response || []);
      setTotalCount(response?.length || 0);

      setHasNext(false);
      setHasPrevious(false);
    } catch (err: any) {
      setError(err.message || 'Error al cargar proyectos');
      toast.error('Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  }, [
    searchTerm,
    searchTermFechaDesde,
    searchTermFechaHasta,
    searchTermActivo,
  ]);

  useEffect(() => {
    fetchProyectos();
  }, [fetchProyectos]);

  const setPage = (newPage: number) => {
    searchParams.set('page', String(newPage));
    setSearchParams(searchParams);
  };

  const setPageSize = (newPageSize: number) => {
    searchParams.set('page_size', String(newPageSize));
    setSearchParams(searchParams);
  };

  const setSearchTerm = (search: string) => {
    if (search && search.trim() !== '') {
      searchParams.set('nombre', search);
    } else {
      searchParams.delete('nombre');
    }
    setSearchParams(searchParams);
  };

  const setSearchTermFechaDesde = (fecha: string) => {
    if (fecha && fecha.trim() !== '') {
      searchParams.set('created_at__gte', fecha);
    } else {
      searchParams.delete('created_at__gte');
    }
    setSearchParams(searchParams);
  };

  const setSearchTermFechaHasta = (fecha: string) => {
    if (fecha && fecha.trim() !== '') {
      searchParams.set('created_at__lte', fecha);
    } else {
      searchParams.delete('created_at__lte');
    }
    setSearchParams(searchParams);
  };

  const setSearchTermActivo = (activo: string) => {
    if (activo && activo.trim() !== '') {
      searchParams.set('activo', activo);
    } else {
      searchParams.delete('activo');
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    setSearchParams(params);
  };

  const handleCreateProyecto = async (proyectoData: {
    proyecto_id: string;
    nombre: string;
    keyword?: import('../services/proyectosRequest').Keyword;
    colaboradores?: number[];
    tags?: string[];
  }) => {
    try {
      setLoading(true);
      await createProyecto(proyectoData);
      toast.success('Proyecto creado exitosamente');
      await fetchProyectos();
    } catch (err: any) {
      setError(err.message || 'Error al crear proyecto');
      toast.error('Error al crear proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProyecto = async (
    id: string,
    proyectoData: Partial<{
      proyecto_id: string;
      nombre: string;
      keyword?: import('../services/proyectosRequest').Keyword;
      colaboradores?: number[];
      tags?: string[];
    }>
  ) => {
    try {
      setLoading(true);
      await updateProyecto(id, proyectoData);
      toast.success('Proyecto actualizado exitosamente');
      await fetchProyectos();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar proyecto');
      toast.error('Error al actualizar proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProyecto = async (id: string) => {
    try {
      setLoading(true);
      await deleteProyecto(id);
      toast.success('Proyecto eliminado exitosamente');
      await fetchProyectos();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar proyecto');
      toast.error('Error al eliminar proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchColaboradores = async (
    nombre: string
  ): Promise<Colaborador[]> => {
    try {
      return await searchColaboradores(nombre);
    } catch (err: any) {
      console.error('Error al buscar colaboradores:', err);
      return [];
    }
  };

  const handleSearchProyectosELT = async (
    nombre: string
  ): Promise<ProyectoELT[]> => {
    try {
      return await searchProyectosELT(nombre);
    } catch (err: any) {
      console.error('Error al buscar proyectos ELT:', err);
      return [];
    }
  };

  const handleGetTags = async (
    page: number = 1,
    pageSize: number = 50,
    search?: string
  ): Promise<Tag[]> => {
    try {
      const response: TagsPaginatedResponse = await getTags(
        page,
        pageSize,
        search
      );
      return response.results || [];
    } catch (err: any) {
      console.error('Error al obtener tags:', err);
      return [];
    }
  };

  return {
    proyectos,
    loading,
    error,
    totalCount,
    hasNext,
    hasPrevious,
    page,
    pageSize,
    searchTerm,
    searchTermFechaDesde,
    searchTermFechaHasta,
    searchTermActivo,
    fetchProyectos,
    createProyecto: handleCreateProyecto,
    updateProyecto: handleUpdateProyecto,
    deleteProyecto: handleDeleteProyecto,
    searchColaboradores: handleSearchColaboradores,
    searchProyectosELT: handleSearchProyectosELT,
    getTags: handleGetTags,
    setPage,
    setPageSize,
    setSearchTerm,
    setSearchTermFechaDesde,
    setSearchTermFechaHasta,
    setSearchTermActivo,
    clearFilters,
  };
};
