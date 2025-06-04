import { BasicProperties } from '../interfaces/generals';
import {
  createTema,
  deleteTema,
  getTemas,
  updateTema,
} from '../request/temaRequest';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export type TemaResponse = BasicProperties & {
  nombre: string;
  proyecto_id: string;
  descripcion: string;
};

export type LocalTema = {
  nombre: string;
  proyecto_id?: string;
  descripcion?: string;
};

export type TemaContextType = {
  selectedTema: TemaResponse;
  temaList: TemaResponse[];
  selectATema: (tema: TemaResponse) => void;
  createATema: (tema: TemaResponse) => void;
  updateATema: (tema: TemaResponse) => void;
  deleteATema: (tema: TemaResponse) => void;
  GetAllTemas: () => void;
};

type ContextProps = {
  children: ReactNode;
};

export const TemaContext = createContext<TemaContextType>(null);

export function TemaProvider({ children }: ContextProps) {
  const [temaList, setTemaList] = useState<TemaResponse[]>([]);
  const [selectedTema, setSelectedTema] = useState<TemaResponse | null>(null);

  function selectATema(tema: TemaResponse) {
    setSelectedTema(tema);
  }

  async function GetAllTemas() {
    getTemas().then((tema) => {
      setTemaList(tema);
    });
  }

  async function createATema(tema: TemaResponse) {
    createTema(tema).then((createdTema) => {
      setTemaList((prev) => [...prev, createdTema]);
    });
  }

  async function updateATema(tema: TemaResponse) {
    updateTema(tema).then((updatedTema) => {
      setTemaList((prev) =>
        prev.map((tema) => (tema.id === updatedTema.id ? updatedTema : tema))
      );
    });
  }

  async function deleteATema(tema: TemaResponse) {
    deleteTema(tema.id).then(() => {
      setTemaList((prev) => prev.filter((t) => t.id !== tema.id));
      if (selectedTema?.id === tema.id) {
        setSelectedTema(null);
      }
    });
  }

  useEffect(() => {
    GetAllTemas();
  }, []);

  // propiedades y métodos que se exportan del contexto
  const contextValue = {
    selectedTema,
    temaList,
    selectATema,
    GetAllTemas,
    createATema,
    updateATema,
    deleteATema,
  };

  return (
    <TemaContext.Provider value={contextValue}>{children}</TemaContext.Provider>
  );
}

export function useTema() {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error('useTema must be used within a TemaProvider');
  }
  return context;
}
