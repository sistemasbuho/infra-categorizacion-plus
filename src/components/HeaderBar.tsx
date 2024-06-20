import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../assets/css/components/headerBar.module.css';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import ConfirmDeleteArticle from './menu/options/ConfirmDeleteArticle';
import { article } from '../interfaces/generals';

interface Props {
  article: article;
}

function HeaderBar({ article }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  function exit() {
    navigate(-1);
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
            Eliminar articulo
          </button>
          <button className={`${styles.btn} ${styles.btn_finish}`}>
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
