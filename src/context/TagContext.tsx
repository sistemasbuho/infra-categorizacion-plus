import { BasicProperties } from '../interfaces/generals';
import {
  createTag,
  deleteATag,
  getTags,
  updateTag,
} from '../request/tagRequest';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export type TagResponse = BasicProperties & {
  nombre: string;
  proyecto_id: string;
  descripcion: string;
};

export type LocalTag = {
  nombre: string;
  proyecto_id?: string;
  descripcion?: string;
};

export type TagContextType = {
  selectedTag: TagResponse;
  tagList: TagResponse[];
  selectATag: (tag: TagResponse) => void;
  createATag: (tag: TagResponse) => void;
  updateATag: (tag: TagResponse) => void;
  deleteTag: (tag: TagResponse) => void;
  GetAllTags: () => void;
};

type ContextProps = {
  children: ReactNode;
};

export const TagContext = createContext<TagContextType>(null);

export function TagProvider({ children }: ContextProps) {
  const [tagList, setTagList] = useState<TagResponse[]>([]);
  const [selectedTag, setSelectedTag] = useState<TagResponse | null>(null);

  function selectATag(tag: TagResponse) {
    setSelectedTag(tag);
  }

  async function GetAllTags() {
    getTags().then((tags) => {
      setTagList(tags);
    });
  }

  async function createATag(tag: TagResponse) {
    createTag(tag).then((createdTag) => {
      if (createdTag.id === undefined || createdTag.id === null) return;
      setTagList((prev) => [...prev, createdTag]);
    });
  }

  async function updateATag(tag: TagResponse) {
    updateTag(tag).then((updatedTag) => {
      if (updatedTag.id === undefined || updatedTag.id === null) return;
      setTagList((prev) =>
        prev.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag))
      );
    });
  }

  async function deleteTag(tag: TagResponse) {
    deleteATag(tag.id).then(() => {
      setTagList((prev) => prev.filter((t) => t.id !== tag.id));
      if (selectedTag?.id === tag.id) {
        setSelectedTag(null);
      }
    });
  }

  useEffect(() => {
    GetAllTags();
  }, []);

  // propiedades y métodos que se exportan del contexto
  const contextValue = {
    selectedTag,
    tagList,
    selectATag,
    GetAllTags,
    createATag,
    updateATag,
    deleteTag,
  };

  return (
    <TagContext.Provider value={contextValue}>{children}</TagContext.Provider>
  );
}

export function useTag() {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error('useTag must be used within a TagProvider');
  }
  return context;
}
