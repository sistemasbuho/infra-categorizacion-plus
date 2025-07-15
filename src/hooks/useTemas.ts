import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  createTema,
  deleteTema,
  getTemas,
  updateTema,
} from '../services/temaRequest';
import { LocalTema } from '../pages/Temas/components/TemaForm';

export type TemaResponse = {
  id: string;
  created_at: string;
  created_by: number;
  modified_at: string;
  modified_by: number;
  nombre: string;
  descripcion: string;
  proyecto_id: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type TemaContextType = {
  selectedTema: TemaResponse | null;
  temasList: TemaResponse[];
  isLoading: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
  searchTermNombre: string;
  searchTermProyecto: string;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearchTermNombre: (search: string) => void;
  setSearchTermProyecto: (search: string) => void;
  selectATema: (tema: TemaResponse) => void;
  createATema: (tema: LocalTema) => void;
  updateATema: (tema: TemaResponse) => void;
  deleteATema: (tema: TemaResponse) => void;
  clearFilters: () => void;
};

export const useTemas = (): TemaContextType => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('page_size') ?? '50');
  const searchTermNombre = searchParams.get('nombre') ?? '';
  const searchTermProyecto = searchParams.get('proyecto_id') ?? '';

  const [temasList, setTemasList] = useState<TemaResponse[]>([]);
  const [selectedTema, setSelectedTema] = useState<TemaResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchTemas = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getTemas(
        page,
        pageSize,
        searchTermNombre,
        searchTermProyecto
      );
      setTemasList(response.results);
      setTotalCount(response.count);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchTermNombre, searchTermProyecto]);

  useEffect(() => {
    fetchTemas();
  }, [fetchTemas]);

  const setPage = (newPage: number) => {
    searchParams.set('page', String(newPage));
    setSearchParams(searchParams);
  };

  const setPageSize = (newPageSize: number) => {
    searchParams.set('page_size', String(newPageSize));
    searchParams.set('page', '1'); // Reset to first page when changing page size
    setSearchParams(searchParams);
  };

  const setSearchTermNombre = (search: string) => {
    if (search && search.trim() !== '') {
      searchParams.set('nombre', search);
    } else {
      searchParams.delete('nombre');
    }
    searchParams.set('page', '1'); // Reset to first page when searching
    setSearchParams(searchParams);
  };

  const setSearchTermProyecto = (search: string) => {
    if (search && search.trim() !== '') {
      searchParams.set('proyecto_id', search);
    } else {
      searchParams.delete('proyecto_id');
    }
    searchParams.set('page', '1'); // Reset to first page when searching
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('page_size', String(pageSize));
    setSearchParams(params);
  };

  function selectATema(tema: TemaResponse) {
    setSelectedTema(tema);
  }

  async function createATema(tema: LocalTema) {
    setIsLoading(true);
    try {
      await createTema(tema);
      await fetchTemas();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }

  async function updateATema(tema: TemaResponse) {
    setIsLoading(true);
    try {
      await updateTema(tema);
      await fetchTemas();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }

  async function deleteATema(tema: TemaResponse) {
    setIsLoading(true);
    try {
      await deleteTema(tema.id);
      if (selectedTema?.id === tema.id) {
        setSelectedTema(null);
      }
      await fetchTemas();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }

  return {
    temasList,
    selectedTema,
    isLoading,
    totalCount,
    page,
    pageSize,
    searchTermNombre,
    searchTermProyecto,
    setPage,
    setPageSize,
    setSearchTermNombre,
    setSearchTermProyecto,
    selectATema,
    createATema,
    updateATema,
    deleteATema,
    clearFilters,
  };
};
