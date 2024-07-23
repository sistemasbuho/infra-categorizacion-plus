import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faGear, faListUl } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import optionStyles from '../../assets/css/components/menu/options.module.css';
import styles from '../../assets/css/app.module.css';
import Categorization from './options/categorization/Categorization';
import Header from './options/Header';
import Config from './options/Config';

function Menu() {
  const [currentOption, setCurrentOption] = useState<number>(1);

  return (
    <>
      <section className={styles.cont_options_bar}>
        <header>
          <button
            className={`${currentOption == 0 && styles.selected}`}
            onClick={() => setCurrentOption(0)}
          >
            <FontAwesomeIcon icon={faBook} />
          </button>

          <button
            className={`${currentOption == 1 && styles.selected}`}
            onClick={() => setCurrentOption(1)}
          >
            <FontAwesomeIcon icon={faListUl} />
          </button>

          <button
            className={`${currentOption == 2 && styles.selected}`}
            onClick={() => setCurrentOption(2)}
          >
            <FontAwesomeIcon icon={faGear} />
          </button>
        </header>
        <div className={optionStyles.option_cont}>
          <div style={{ left: `${-337 * currentOption}px` }}>
            <Header />
            <Categorization />
            <Config />
          </div>
        </div>
      </section>
    </>
  );
}

export default Menu;
