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
  }

  function saveFragment(newFrag: Selection) {
    const formatedFragment = newFrag;
    delete formatedFragment.selectionId;

    setNewFragments((prev) =>
      prev.filter((fragment) => fragment.id !== formatedFragment.id)
    );

    setFragments((prev) => [...prev, formatedFragment]);
  }

  function deleteFragment(frag: Selection) {
    setCurrentFragment((prev) => (prev?.id === frag?.id ? null : prev));
    setFragments((prev) => prev.filter((fragment) => fragment.id !== frag?.id));
    setNewFragments((prev) =>
      prev.filter(
        (fragment) =>
          fragment?.selectionId !== frag?.selectionId || frag?.id !== frag?.id
      )
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
    }
    return () => {};
  }, [articleFragments]);

  useEffect(() => {
    const orderedFrags = [...fragments, ...newFragments];

    setAllFragments(orderedFrags);
    return () => {};
  }, [fragments, newFragments]);

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
