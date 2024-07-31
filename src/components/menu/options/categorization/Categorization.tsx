import { useState } from 'react';

import styles from '../../../../assets/css/components/menu/categorization.module.css';
import FragmentForm from './FragmentForm';
import GeneralForm from './GeneralForm';

function Categorization() {
  const [selectedMenu, setSelectedMenu] = useState(0);

  return (
    <div>
      <div className="mb-3">
        <h2>CATEGORIZACIÓN</h2>
      </div>

      <div className={`${styles.body} `}>
        <div className={styles.nav}>
          <button
            className={`${selectedMenu === 0 && styles.selected}`}
            onClick={() => setSelectedMenu(0)}
          >
            Por fragmentos
          </button>
          <button
            className={`${selectedMenu === 1 && styles.selected}`}
            onClick={() => setSelectedMenu(1)}
          >
            General
          </button>
        </div>
        <div className={`${styles.section_body}`}>
          {selectedMenu === 0 && <FragmentForm />}
          {selectedMenu === 1 && <GeneralForm />}
        </div>
      </div>
    </div>
  );
}

export default Categorization;
