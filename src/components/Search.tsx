import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../assets/css/components/search.module.css';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  state: string | null;
  setState: Dispatch<SetStateAction<string>>;
}

function Search({ state, setState }: Props) {
  return (
    <div className={styles.container_search}>
      <input
        type="text"
        id="search"
        placeholder="Buscar"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />

      <button>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </div>
  );
}

export default Search;
