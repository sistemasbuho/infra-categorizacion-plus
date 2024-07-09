import {
  createContext,
  ReactNode,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { Selection } from '../interfaces/generals';
import { useArticleContext } from './ArticleContext';

const FragmentContext = createContext(null);

interface Props {
  children: ReactNode;
}

interface ContextProps {
  current: {
    currentFragment: Selection;
    setCurrentFragment: Dispatch<SetStateAction<Selection>>;
  };
  savedFragments: {
    fragments: Selection[];
    setFragments: Dispatch<SetStateAction<Selection[]>>;
  };
  localFragments: {
    newFragments: Selection[];
    setNewFragments: Dispatch<SetStateAction<Selection[]>>;
  };
  allFrags: {
    allFragments: Selection[];
    setAllFragments: Dispatch<SetStateAction<Selection[]>>;
  };
  methods: {
    create: (frag: Selection) => void;
    delete: (frag: Selection) => void;
    save: (frag: Selection) => void;
    clearCurrentFragment: () => void;
    newCurrentFragment: (frag: Selection) => void;
  };
}

function FragmentsProvider({ children }: Props): React.ReactElement {
  const [fragments, setFragments] = useState<Selection[]>([]);
  const [newFragments, setNewFragments] = useState<Selection[]>([]);

  const [allFragments, setAllFragments] = useState([]);
  const [currentFragment, setCurrentFragment] = useState<Selection | null>(
    null
  );

  const { fragments: articleFragments } =
    useArticleContext().articleState.article;

  function createNewFragment(newFragment: Selection) {
    setNewFragments((prev) => [...prev, newFragment]);
    setAllFragments((prev) => [...prev, newFragment]);
  }

  function saveFragment(newFrag: Selection) {
    deleteFragment(newFrag);

    const formatedFragment = newFrag;
    delete formatedFragment.selectionId;

    setFragments((prev) => [...prev, formatedFragment]);
    setAllFragments((prev) =>
      prev.map((savedFrag) => {
        if (savedFrag.id === formatedFragment.id) {
          return formatedFragment;
        }
        return savedFrag;
      })
    );
  }

  function clearCurrentFragment(): void {
    setCurrentFragment(null);
  }

  function newCurrentFragment(fragment: Selection): void {
    setCurrentFragment(fragment);
  }

  function deleteFragment(frag: Selection) {
    setCurrentFragment((prev) => (prev?.id === frag?.id ? null : prev));
    setFragments((prev) => prev.filter((fragment) => fragment.id !== frag?.id));
    setNewFragments((prev) =>
      prev.filter(
        (fragment) =>
          fragment?.selectionId !== frag?.selectionId ||
          fragment?.id !== frag?.id
      )
    );
    setAllFragments((prev) =>
      prev.filter((savedFrag) => savedFrag.id !== frag.id)
    );
  }

  useEffect(() => {
    if (articleFragments) {
      articleFragments.map((item) => {
        return {
          ...item,
          start_index: Number(item.start_index),
        };
      });
      setFragments([...articleFragments]);
      setAllFragments([...articleFragments]);
    }
    return () => {};
  }, [articleFragments]);

  return (
    <FragmentContext.Provider
      value={{
        current: {
          currentFragment,
          setCurrentFragment,
        },
        savedFragments: {
          fragments,
          setFragments,
        },
        localFragments: {
          newFragments,
          setNewFragments,
        },
        allFrags: {
          allFragments,
          setAllFragments,
        },
        methods: {
          create: createNewFragment,
          delete: deleteFragment,
          save: saveFragment,
          clearCurrentFragment,
          newCurrentFragment,
        },
      }}
    >
      {children}
    </FragmentContext.Provider>
  );
}

export default FragmentsProvider;

export function useFragmentContext(): ContextProps {
  const context = useContext(FragmentContext);

  if (!context) {
    throw new Error('useArticleContext must be used within an ArticleProvider');
  }

  return context;
}
