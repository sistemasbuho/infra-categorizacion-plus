import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faGear, faListUl } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import {
  ArticleCategorization,
  headerArticle,
  Programas,
  Selection,
  Tags,
  Temas,
  Tipos,
} from '../../interfaces/generals';

import optionStyles from '../../assets/css/components/menu/options.module.css';
import styles from '../../assets/css/app.module.css';
import Categorization from './options/Categorization';
import Header from './options/Header';
import Config from './options/Config';

interface CategorizationProps {
  ArticleCategorization: ArticleCategorization;
  tipos: Tipos[];
  programas: Programas[];
  tags: Tags[];
  temas: Temas[];
  articulo: headerArticle;
  fragments: Selection[];
  deleteFragment: (frag: Selection) => void;
}

function Menu({
  ArticleCategorization,
  tipos,
  programas,
  tags,
  temas,
  articulo,
  fragments,
  deleteFragment,
}: CategorizationProps) {
  const [currentOption, setCurrentOption] = useState(1);

  return (
    <>
      <section className={styles.cont_options_bar}>
        <header>
          <button
            className={`${currentOption == 1 && styles.selected}`}
            onClick={() => setCurrentOption(1)}
          >
            <FontAwesomeIcon icon={faBook} />
          </button>

          <button
            className={`${currentOption == 2 && styles.selected}`}
            onClick={() => setCurrentOption(2)}
          >
            <FontAwesomeIcon icon={faListUl} />
          </button>

          <button
            className={`${currentOption == 3 && styles.selected}`}
            onClick={() => setCurrentOption(3)}
          >
            <FontAwesomeIcon icon={faGear} />
          </button>
        </header>
        <div className={optionStyles.option_cont}>
          {currentOption === 1 && (
            <Header articulo={articulo} tipos={tipos} programas={programas} />
          )}
          {currentOption === 2 && (
            <Categorization
              ArticleCategorization={ArticleCategorization}
              tags={tags}
              temas={temas}
              articulo={articulo}
              fragments={fragments}
              deleteFragment={deleteFragment}
            />
          )}

          {currentOption === 3 && <Config />}
        </div>
      </section>
    </>
  );
}

export default Menu;
