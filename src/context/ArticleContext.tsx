import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { article, GeneralOption, Selection } from '../interfaces/generals';
import { getArticleData } from '../utils/asyncFunc';
import { useParams } from 'react-router';

const initialArticleState = {
  articulo: {},
  fragments: [],
  forms_data: {
    programa: [],
    tags: [],
    temas: [],
    tipo: [],
    general: {
      tag: [],
      tema: [],
    },
  },
};

interface Props {
  children: ReactNode;
}

interface ContextProps {
  loadingState: {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
  };

  articleState: {
    article: {
      articulo: article;
      fragments: Selection[];
      forms_data: {
        programa: GeneralOption[];
        tags: GeneralOption[];
        temas: GeneralOption[];
        tipo: GeneralOption[];
        general: {
          tag: GeneralOption[];
          tema: GeneralOption[];
        };
      };
    };
    setArticle: Dispatch<SetStateAction<article>>;
  };
}

const ArticleContext = createContext(null);

export const ArticleProvider: FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState(initialArticleState);

  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      await getArticleData(id).then((data) => {
        const tagGeneral = data?.general?.[0]?.tag_data;
        const temaGeneral = data?.general?.[0]?.tema_data;

        setArticle({
          articulo: { ...data?.articulo },
          fragments: data?.fragmentos,
          forms_data: {
            programa: data?.programa,
            tags: data?.tags[0]?.tags,
            temas: data?.temas,
            tipo: data?.tipo,
            general: {
              tag: tagGeneral,
              tema: temaGeneral,
            },
          },
        });

        setIsLoading(false);
      });
    }
    fetchData();
  }, [id]);

  return (
    <ArticleContext.Provider
      value={{
        loadingState: { isLoading, setIsLoading },
        articleState: { article, setArticle },
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticleContext = (): ContextProps => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticleContext must be used within an ArticleProvider');
  }
  return context;
};
