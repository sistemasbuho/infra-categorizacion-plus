import { useArticleContext } from '../context/ArticleContext';
import { useState } from 'react';

import styles from '../assets/css/components/navbar.module.css';

function Navbar() {
  const [open, setOpen] = useState(false);
  const { titulo } = useArticleContext().articleState.article.articulo;
  const { proyecto } = useArticleContext().articleState.article;
  return (
    <div className={styles.container}>
      <h1
        onClick={() => setOpen((prev) => !prev)}
        className={` ${open ? styles.open : ''} `}
      >
        {titulo}
      </h1>
      <p>{proyecto}</p>
    </div>
  );
}

export default Navbar;
