import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  page: number;
  pageSize: number;
  searchTerm: string;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearchTerm: (search: string) => void;
  selectATag: (tag: TagResponse) => void;
  createATag: (tag: TagResponse) => void;
  updateATag: (tag: TagResponse) => void;
  deleteTag: (tag: TagResponse) => void;
  clearFilters: () => void;
};

export const useTags = (): TagContextType => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('page_size') ?? '50');
  const searchTerm = searchParams.get('nombre') ?? '';

  const [tagList, setTagList] = useState<TagResponse[]>([]);
  const [selectedTag, setSelectedTag] = useState<TagResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getTags(page, pageSize, searchTerm);
      setTagList(response.results);
      setTotalCount(response.count);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchTerm]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const setPage = (newPage: number) => {
    searchParams.set('page', String(newPage));
    setSearchParams(searchParams);
  };

  const setPageSize = (newPageSize: number) => {
    searchParams.set('page_size', String(newPageSize));
    searchParams.set('page', '1'); // Reset to first page when changing page size
    setSearchParams(searchParams);
  };

  const setSearchTerm = (search: string) => {
    if (search && search.trim() !== '') {
      searchParams.set('nombre', search);
    } else {
      searchParams.delete('nombre');
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

  function selectATag(tag: TagResponse) {
    setSelectedTag(tag);
  }

  async function createATag(tag: TagResponse) {
    setIsLoading(true);
    try {
      await createTag(tag);
      await fetchTags();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }

  async function updateATag(tag: TagResponse) {
    setIsLoading(true);
    try {
      await updateTag(tag);
      await fetchTags();
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
      await fetchTags();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }

  return {
    tagList,
    selectedTag,
    isLoading,
    totalCount,
    page,
    pageSize,
    searchTerm,
    setPage,
    setPageSize,
    setSearchTerm,
    selectATag,
    createATag,
    updateATag,
    deleteTag,
    clearFilters,
  };
};
