import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import styles from '../assets/css/components/search.module.css';

function Search() {
  const [input, setInput] = useState<string | null>('');

  return (
    <div className={styles.container_search}>
      <input
        type="text"
        id="search"
        placeholder="Buscar"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </div>
  );
}

export default Search;
