import { useArticleContext } from '../context/ArticleContext';
import { useState } from 'react';

import styles from '../assets/css/components/navbar.module.css';

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
      <h1
        onClick={() => setOpen((prev) => !prev)}
        className={` ${open ? styles.open : ''} `}
        onDoubleClick={goToOriginalLink}
      >
        {titulo}
      </h1>
      <p>{proyecto}</p>
    </div>
  );
}

export default Navbar;
