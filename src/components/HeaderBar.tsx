import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { putArticle } from '../utils/asyncFunc';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useArticleContext } from '../context/ArticleContext';

import styles from '../assets/css/components/headerBar.module.css';
import ConfirmDeleteArticle from './menu/options/ConfirmDeleteArticle';

function HeaderBar() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { article } = useArticleContext();

  const navigate = useNavigate();

  function exit() {
    navigate(-1);
  }

  async function finishArticle() {
    const update = { finished: true };
    return await putArticle(article.id, update);
  }

  return (
    <>
      <nav className={styles.container}>
        <div onClick={exit}>
          <FontAwesomeIcon icon={faCaretLeft} />
          <p>Atrás</p>
        </div>

        <div className="d-flex gap-3">
          <button
            className={`${styles.btn} ${styles.btn_delete}`}
            onClick={() => setShowDeleteModal(true)}
          >
            {article?.state ? 'Activar articulo' : 'Eliminar articulo'}
          </button>
          <button
            className={`${styles.btn} ${styles.btn_finish}`}
            onClick={finishArticle}
          >
            Finalizar
          </button>
        </div>
      </nav>

      {showDeleteModal && (
        <ConfirmDeleteArticle article={article} setShow={setShowDeleteModal} />
      )}
    </>
  );
}

export default HeaderBar;
