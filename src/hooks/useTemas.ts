import { useEffect, useState } from 'react';
import {
  createTema,
  deleteTema,
  getTemas,
  updateTema,
} from '../services/temaRequest';
import { LocalTema } from '../components/forms/TemaForm';

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
  nextPage: string | null;
  previousPage: string | null;
  selectATema: (tema: TemaResponse) => void;
  createATema: (tema: LocalTema) => void;
  updateATema: (tema: TemaResponse) => void;
  deleteATema: (tema: TemaResponse) => void;
  loadNextPage: () => void;
  loadPreviousPage: () => void;
};

export const useTemas = (): TemaContextType => {
  const [temasList, setTemasList] = useState<TemaResponse[]>([]);
  const [selectedTema, setSelectedTema] = useState<TemaResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  function selectATema(tema: TemaResponse) {
    setSelectedTema(tema);
  }

  async function GetAllTemas() {
    setIsLoading(true);
    try {
      const response = await getTemas();
      setTemasList(response.results);
      setTotalCount(response.count);
      setNextPage(response.next);
      setPreviousPage(response.previous);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadNextPage() {
    if (!nextPage) return;
    setIsLoading(true);
    try {
      const response = await getTemas(nextPage);
      setTemasList(response.results);
      setTotalCount(response.count);
      setNextPage(response.next);
      setPreviousPage(response.previous);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadPreviousPage() {
    if (!previousPage) return;
    setIsLoading(true);
    try {
      const response = await getTemas(previousPage);
      setTemasList(response.results);
      setTotalCount(response.count);
      setNextPage(response.next);
      setPreviousPage(response.previous);
    } finally {
      setIsLoading(false);
    }
  }

  async function createATema(tema: LocalTema) {
    setIsLoading(true);
    try {
      await createTema(tema);
      await GetAllTemas();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }

  async function updateATema(tema: TemaResponse) {
    setIsLoading(true);
    try {
      await updateTema(tema);
      await GetAllTemas();
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
      await GetAllTemas();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }

  useEffect(() => {
    GetAllTemas();
  }, []);

  return {
    temasList,
    selectedTema,
    selectATema,
    isLoading,
    totalCount,
    nextPage,
    previousPage,
    createATema,
    updateATema,
    deleteATema,
    loadNextPage,
    loadPreviousPage,
  };
};
