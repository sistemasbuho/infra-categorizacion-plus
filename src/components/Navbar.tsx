import { useArticleContext } from '../context/ArticleContext';
import { useState } from 'react';

import styles from '../assets/css/components/navbar.module.css';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Navbar() {
  const [open, setOpen] = useState(false);
  const { titulo, url } = useArticleContext().articleState.article.articulo;
  const { proyecto } = useArticleContext().articleState.article;

  function goToOriginalLink() {
    if (url) {
      window.open(url, '_blank');
    }
  }

  return (
    <div className={styles.container}>
      <div
        className="d-flex align-items-center gap-3 "
        style={{ cursor: 'pointer' }}
      >
        <FontAwesomeIcon
          icon={faArrowUpRightFromSquare}
          onClick={goToOriginalLink}
        />

        <h1
          onClick={() => setOpen((prev) => !prev)}
          className={` ${open ? styles.open : ''} `}
          onDoubleClick={goToOriginalLink}
        >
          {titulo}
        </h1>
      </div>
      <p>{proyecto}</p>
    </div>
  );
}

export default Navbar;
