import { useEffect, useState } from 'react';
import {
  createTag,
  deleteATag,
  getTags,
  updateTag,
} from '../services/tagRequest';

export type TagResponse = {
  id: string;
  created_at: string;
  created_by: number;
  modified_at: string;
  modified_by: number;
  nombre: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type LocalTag = {
  nombre: string;
  proyecto_id?: string;
  descripcion?: string;
};

export type TagContextType = {
  selectedTag: TagResponse | null;
  tagList: TagResponse[];
  isLoading: boolean;
  totalCount: number;
  nextPage: string | null;
  previousPage: string | null;
  selectATag: (tag: TagResponse) => void;
  createATag: (tag: TagResponse) => void;
  updateATag: (tag: TagResponse) => void;
  deleteTag: (tag: TagResponse) => void;
  loadNextPage: () => void;
  loadPreviousPage: () => void;
};

export const useTags = (): TagContextType => {
  const [tagList, setTagList] = useState<TagResponse[]>([]);
  const [selectedTag, setSelectedTag] = useState<TagResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  function selectATag(tag: TagResponse) {
    setSelectedTag(tag);
  }

  async function GetAllTags() {
    setIsLoading(true);
    try {
      const response = await getTags();
      setTagList(response.results);
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
      const response = await getTags(nextPage);
      setTagList(response.results);
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
      const response = await getTags(previousPage);
      setTagList(response.results);
      setTotalCount(response.count);
      setNextPage(response.next);
      setPreviousPage(response.previous);
    } finally {
      setIsLoading(false);
    }
  }

  async function createATag(tag: TagResponse) {
    setIsLoading(true);
    try {
      await createTag(tag);
      // Refrescar la lista completa después de crear
      await GetAllTags();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }

  async function updateATag(tag: TagResponse) {
    setIsLoading(true);
    try {
      await updateTag(tag);
      await GetAllTags();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }

  async function deleteTag(tag: TagResponse) {
    setIsLoading(true);
    try {
      await deleteATag(tag.id);
      if (selectedTag?.id === tag.id) {
        setSelectedTag(null);
      }
      await GetAllTags();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }

  useEffect(() => {
    GetAllTags();
  }, []);

  return {
    tagList,
    selectedTag,
    isLoading,
    totalCount,
    nextPage,
    previousPage,
    selectATag,
    createATag,
    updateATag,
    deleteTag,
    loadNextPage,
    loadPreviousPage,
  };
};
